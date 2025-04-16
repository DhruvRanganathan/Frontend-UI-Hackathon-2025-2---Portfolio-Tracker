// Wait for the HTML document to fully load before running scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded!");

    // --- State Variables ---
    let currentDisplayIndex = "SP500"; // Default index to show
    let currentChartRange = "1d"; // Default time range
    let portfolioLineChart = null; // Variable to hold the chart instance

    // --- Selectors ---
    const cardsContainer = document.querySelector('.cards-container');
    const watchlistContainer = document.querySelector('.sidebar-watchlist'); // Parent for delegation
    const sp500DetailsContainer = document.querySelector('.sp500-details .details-card-body');
    const marketCapValueElement = document.querySelector('.market-cap-summary .market-cap-value');
    const chartCanvas = document.getElementById('portfolioChart');
    const chartIndexNameElement = document.getElementById('chart-index-name');
    const chartIndexValueElement = document.getElementById('chart-index-value');
    const chartStockPerfElement = document.querySelector('.chart-title-info .chart-stock-perf');
    const chartStockChangeElement = document.querySelector('.chart-title-info .chart-stock-change');
    const timeRangeButtons = document.querySelectorAll('.chart-time-ranges .time-range-btn');
    const scrollLeftBtn = document.getElementById('scroll-left-btn');
    const scrollRightBtn = document.getElementById('scroll-right-btn');
    // Removed: const sidebarWatchlistItems = ... (we use delegation now)


    // --- Functions ---

    function createStockCardHTML(stock) { /* ... */ const perfClass = stock.dayChangePercent >= 0 ? 'positive' : 'negative'; const sign = stock.dayChangePercent >= 0 ? '+' : ''; const logoHTML = `<div class="stock-logo"></div>`; return ` <div class="stock-card"> <div class="card-top"> <div class="stock-info"> ${logoHTML} <span class="stock-name">${stock.name}</span> </div> <div class="stock-ticker-perf"> <span class="stock-ticker">${stock.ticker}</span> <span class="stock-perf ${perfClass}">${sign}${stock.dayChangePercent.toFixed(2)}%</span> </div> </div> <div class="card-bottom"> <div class="portfolio-value"> <span class="portfolio-label">Portfolio</span> <span class="portfolio-amount">${stock.portfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span> </div> <div class="mini-chart" id="mini-chart-${stock.id}"></div> </div> </div>`; }
    function createWatchlistItemHTML(item) { /* ... */ const perfClass = item.changePercent >= 0 ? 'positive' : 'negative'; const sign = item.changePercent >= 0 ? '+' : ''; return ` <a href="#" class="watchlist-item" data-index="${item.indexId}"> <span class="watchlist-ticker">${item.ticker}</span> <div class="watchlist-details"> <span class="watchlist-value">${item.value}</span> <span class="watchlist-change ${perfClass}">${sign}${item.changePercent.toFixed(2)}%</span> </div> </a>`; }
    function updateDetailsPanel(indexId) { /* ... */ console.log("Updating details panel for:", indexId); if (typeof detailsData !== 'undefined' && detailsData.sp500) { if (sp500DetailsContainer) { const detailItems = sp500DetailsContainer.querySelectorAll('.detail-item'); detailItems.forEach(item => { const keyElement = item.querySelector('.detail-key'); const valueElement = item.querySelector('.detail-value'); if (keyElement && valueElement) { const keyText = keyElement.textContent.trim(); let dataKey = ''; if (keyText === 'Previous Close') dataKey = 'previousClose'; else if (keyText === 'Day Range') dataKey = 'dayRange'; else if (keyText === 'Year Range') dataKey = 'yearRange'; else if (keyText === 'Market Cap') dataKey = 'marketCap'; else if (keyText === 'Volume') dataKey = 'volume'; else if (keyText === 'Dividend Yield') dataKey = 'dividendYield'; else if (keyText === 'P/E Ratio') dataKey = 'peRatio'; if (dataKey && detailsData.sp500[dataKey] !== undefined) { valueElement.textContent = detailsData.sp500[dataKey]; } else { valueElement.textContent = '-'; } } }); } else { console.error("Could not find S&P 500 details container element."); } if (marketCapValueElement && detailsData.marketCapSummary !== undefined) { marketCapValueElement.textContent = detailsData.marketCapSummary; } else if (marketCapValueElement) { marketCapValueElement.textContent = '-'; } else { console.error("Could not find Market Cap summary value element."); } } else { console.error("Could not find details panel data."); } }

    // === START: Refactored getChartDataForRange ===
    /**
     * Creates a map of all available chart data objects.
     * Assumes chartData_... variables are defined globally (by data.js).
     */
    const chartDataMap = {
        SP500: { '1d': chartData_SP500_1d, '5d': chartData_SP500_5d, '1m': chartData_SP500_1m, '6m': chartData_SP500_6m, '1y': chartData_SP500_1y, '5y': chartData_SP500_5y, 'Max': chartData_SP500_Max },
        NYSE:  { '1d': chartData_NYSE_1d, '5d': chartData_NYSE_5d, '1m': chartData_NYSE_1m, '6m': chartData_NYSE_6m, '1y': chartData_NYSE_1y, '5y': chartData_NYSE_5y, 'Max': chartData_NYSE_Max }
    };

    /**
     * Retrieves a deep copy of the chart data object for a specific index and time range using a map.
     * @param {string} indexId - The index identifier ("SP500" or "NYSE").
     * @param {string} range - The time range key (e.g., "1d", "5d").
     * @returns {object | null} A deep copy of the chart data object or null if not found/error.
     */
    function getChartDataForRange(indexId, range) {
        console.log(`getChartDataForRange called with index: ${indexId}, range: ${range}`);
        let dataObjectToReturn = null;

        // Look up in the map
        if (chartDataMap[indexId] && chartDataMap[indexId][range]) {
            dataObjectToReturn = chartDataMap[indexId][range];
        } else {
            console.warn(`Data object not found for ${indexId}/${range}. Defaulting.`);
            // Default logic (e.g., return Max data for the current index)
            dataObjectToReturn = chartDataMap[indexId]?.['Max'] || chartDataMap['SP500']?.['Max'] || null; // Fallback chain
        }

        // Return a deep copy
        if (dataObjectToReturn) {
            try {
                const deepCopy = JSON.parse(JSON.stringify(dataObjectToReturn));
                console.log(`Returning deep copy for ${indexId}/${range}:`, deepCopy);
                return deepCopy;
            } catch (e) { console.error("Error creating deep copy for chart data:", e); return null; }
        } else { console.error("No valid data object found for index/range:", indexId, range); return null; }
    }
    // === END: Refactored getChartDataForRange ===


    function updateChartHeaderPerformance(indexId, range) { /* ... */ const performanceDataObj = (indexId === 'SP500') ? sp500Performance : nysePerformance; const indexName = (indexId === 'SP500') ? "S&P 500" : "NYSE"; const indexValueData = (indexId === 'SP500') ? sidebarWatchlist.find(i=>i.indexId==='SP500') : sidebarWatchlist.find(i=>i.indexId==='NYSE'); const indexValue = indexValueData ? indexValueData.value : 'N/A'; if(chartIndexNameElement) chartIndexNameElement.textContent = indexName; if(chartIndexValueElement) chartIndexValueElement.textContent = indexValue; if (typeof performanceDataObj === 'undefined' || !performanceDataObj[range] || !chartStockPerfElement || !chartStockChangeElement) { console.error("Missing performance data or header elements for index/range:", indexId, range); if(chartStockPerfElement) chartStockPerfElement.textContent = '-'; if(chartStockChangeElement) chartStockChangeElement.textContent = '-'; return; } const perfData = performanceDataObj[range]; const perfClass = perfData.percent >= 0 ? 'positive' : 'negative'; const sign = perfData.percent >= 0 ? '+' : ''; chartStockPerfElement.textContent = `${sign}${perfData.percent.toFixed(2)}%`; chartStockPerfElement.className = `chart-stock-perf ${perfClass}`; chartStockChangeElement.textContent = `(${sign}${perfData.absolute.toFixed(2)} ${perfData.labelSuffix})`; chartStockChangeElement.className = `chart-stock-change ${perfClass}`; }
    function renderMiniChartSVG(containerId, data, isPositive) { /* ... */ const container = document.getElementById(containerId); if (!container || !data || data.length < 2) { if(container) container.innerHTML = ''; return; } const svgWidth = 60; const svgHeight = 30; const padding = 2; const dataMin = Math.min(...data); const dataMax = Math.max(...data); const dataRange = dataMax - dataMin; const effectiveRange = dataRange === 0 ? 1 : dataRange; const points = data.map((d, index) => { const x = padding + index * (svgWidth - 2 * padding) / (data.length - 1); const y = (svgHeight - padding) - (d - dataMin) / effectiveRange * (svgHeight - 2 * padding); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(' '); const strokeColor = isPositive ? '#28a745' : '#dc3545'; const svgMarkup = ` <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"> <polyline points="${points}" fill="none" stroke="${strokeColor}" stroke-width="1.5"/> </svg> `; container.innerHTML = svgMarkup; }

    function updateMainChart(indexId, range) { /* ... */ if (!portfolioLineChart) { console.error("Chart instance not found, cannot update."); return; } const newDataObject = getChartDataForRange(indexId, range); console.log(`Updating chart for index: ${indexId}, range: ${range}`, newDataObject); if(newDataObject && newDataObject.datasets && newDataObject.datasets.length > 0 && newDataObject.datasets[0].data && newDataObject.datasets[0].data.length > 0) { const newLabels = [...newDataObject.labels]; const newDataset = {...newDataObject.datasets[0]}; const newDataPoints = [...newDataset.data]; const dataMin = Math.min(...newDataPoints); const dataMax = Math.max(...newDataPoints); const padding = (dataMax - dataMin) === 0 ? 10 : (dataMax - dataMin) * 0.1; const axisMin = Math.floor(Math.max(0, dataMin - padding)); const axisMax = Math.ceil(dataMax + padding); portfolioLineChart.data.labels = newLabels; portfolioLineChart.data.datasets[0].label = newDataset.label; portfolioLineChart.data.datasets[0].data = newDataPoints; portfolioLineChart.data.datasets[0].borderColor = newDataset.borderColor; portfolioLineChart.options.scales.y.min = axisMin; portfolioLineChart.options.scales.y.max = axisMax; portfolioLineChart.update(); console.log(`Chart updated for index: ${indexId}, range: ${range}. Y-axis: ${axisMin}-${axisMax}`); updateChartHeaderPerformance(indexId, range); } else { console.error(`No data found or data is empty for index ${indexId}, range: ${range}`); } }


    // --- Initial Page Load ---

    // Populate static sections first
    if (typeof portfolioStocks !== 'undefined' && cardsContainer) { cardsContainer.innerHTML = ''; portfolioStocks.forEach(stock => { cardsContainer.innerHTML += createStockCardHTML(stock); setTimeout(() => { renderMiniChartSVG(`mini-chart-${stock.id}`, stock.miniChartData, stock.dayChangePercent >= 0); }, 0); }); } else { console.error("Could not find portfolio stocks data or cards container element."); }
    if (typeof sidebarWatchlist !== 'undefined' && watchlistContainer) { watchlistContainer.innerHTML = ''; sidebarWatchlist.forEach(item => { watchlistContainer.innerHTML += createWatchlistItemHTML(item); }); } else { console.error("Could not find sidebar watchlist data or container element."); }
    updateDetailsPanel(currentDisplayIndex); // Update details for initial index


    // Initialize Main Chart for default index and range
    currentChartRange = "1d"; // Default range
    console.log(`Initializing chart with index: ${currentDisplayIndex}, range: ${currentChartRange}`); // Log initial state
    const initialChartData = getChartDataForRange(currentDisplayIndex, currentChartRange);

    if (chartCanvas && initialChartData && initialChartData.datasets && initialChartData.datasets[0].data && initialChartData.datasets[0].data.length > 0) {
       try {
           const initialDataPoints = initialChartData.datasets[0].data;
           const initialDataMin = Math.min(...initialDataPoints);
           const initialDataMax = Math.max(...initialDataPoints);
           const initialPadding = (initialDataMax - initialDataMin) === 0 ? 5 : (initialDataMax - initialDataMin) * 0.1;
           const initialAxisMin = Math.floor(Math.max(0, initialDataMin - initialPadding));
           const initialAxisMax = Math.ceil(initialDataMax + initialPadding);
           portfolioLineChart = new Chart(chartCanvas, { type: 'line', data: initialChartData, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, min: initialAxisMin, max: initialAxisMax } } } });
           updateChartHeaderPerformance(currentDisplayIndex, initialChartRange);
           console.log("Chart initialized successfully."); // Log success
        } catch (error) { console.error("Error initializing main chart:", error); }
    } else { console.error("Could not find chart canvas element or valid initial chart data. Chart will not be displayed."); } // More specific error


    // --- Event Listeners ---

    // Time Range Buttons
    if (timeRangeButtons.length > 0) {
        timeRangeButtons.forEach(button => { button.dataset.range = button.textContent.trim(); });
        const initialActiveButtonFound = document.querySelector(`.chart-time-ranges .time-range-btn[data-range="${currentChartRange}"]`);
        if(initialActiveButtonFound) { initialActiveButtonFound.classList.add('active'); } else if(timeRangeButtons[0]) { timeRangeButtons[0].classList.add('active'); console.warn(`Initial range button "${currentChartRange}" not found. Activated first button instead.`); }

        timeRangeButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                currentChartRange = this.dataset.range;
                console.log(`Time range button clicked: ${currentChartRange}`);
                timeRangeButtons.forEach(btn => { btn.classList.remove('active'); });
                this.classList.add('active');
                updateMainChart(currentDisplayIndex, currentChartRange);
            });
        });
    } else { console.error("Could not find time range buttons."); }

    // === START: Sidebar Watchlist Click Listener (Event Delegation) ===
    if (watchlistContainer) { // Check if parent container exists
        // Set initial active state for sidebar item
         const initialActiveWatchlistItem = watchlistContainer.querySelector(`.watchlist-item[data-index="${currentDisplayIndex}"]`);
         if(initialActiveWatchlistItem) initialActiveWatchlistItem.classList.add('active');

        watchlistContainer.addEventListener('click', function(event) {
            // Find the clicked watchlist item by traversing up from the event target
            const clickedItem = event.target.closest('.watchlist-item');

            if (clickedItem) { // Check if a watchlist item was actually clicked
                event.preventDefault();
                const selectedIndex = clickedItem.dataset.index;
                console.log(`Watchlist item clicked: ${selectedIndex}`);

                if (selectedIndex && selectedIndex !== currentDisplayIndex) {
                    currentDisplayIndex = selectedIndex; // Update current index state

                    // Update active class on sidebar items
                    // Need to re-select items *within* the container in case they change
                    this.querySelectorAll('.watchlist-item').forEach(i => i.classList.remove('active'));
                    clickedItem.classList.add('active');

                    // Update the main chart and header for the new index and current time range
                    updateMainChart(currentDisplayIndex, currentChartRange);
                    // Optionally update details panel
                    updateDetailsPanel(currentDisplayIndex);
                }
            }
        });
    } else {
        console.error("Could not find sidebar watchlist container to add listener to.");
    }
    // === END: Sidebar Watchlist Click Listener (Event Delegation) ===


    // Portfolio Row Scrolling Logic
    // ... (code remains the same) ...
    if (cardsContainer && scrollLeftBtn && scrollRightBtn && typeof portfolioStocks !== 'undefined') { const cardWidth = 220; const gap = 20; const scrollAmount = cardWidth + gap; function updateScrollButtons() { const tolerance = 1; const maxScrollLeft = cardsContainer.scrollWidth - cardsContainer.clientWidth; scrollLeftBtn.disabled = cardsContainer.scrollLeft <= tolerance; scrollRightBtn.disabled = cardsContainer.scrollLeft >= maxScrollLeft - tolerance; /* console.log(...) */ } setTimeout(updateScrollButtons, 150); scrollRightBtn.addEventListener('click', () => { cardsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' }); setTimeout(updateScrollButtons, 400); }); scrollLeftBtn.addEventListener('click', () => { cardsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); setTimeout(updateScrollButtons, 400); }); let resizeTimeout; window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(updateScrollButtons, 250); }); } else { /* console.error(...) */ }


    // Debounced Resize Handler for Main Chart & Scroll Buttons
    const handleResize = debounce(() => {
        if (portfolioLineChart) { console.log("Window resized, calling chart.resize()"); portfolioLineChart.resize(); }
        if (typeof updateScrollButtons === 'function') { updateScrollButtons(); }
    }, 250);
    window.addEventListener('resize', handleResize);


}); // End of DOMContentLoaded listener
