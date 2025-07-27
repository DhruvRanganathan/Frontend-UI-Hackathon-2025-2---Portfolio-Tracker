// Wait for the HTML document to fully load once before running scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded!");

    // --- State Variables ---
    let currentDisplayIndex = "SP500"; // Default index for the dashboard view
    let currentChartRange = "1d";     // Default time range for the dashboard view
    let currentPage = "dashboard";    // Default page view ('dashboard' or 'portfolio')
    let portfolioLineChart = null;    // Variable to hold the chart instance

    // --- Selectors ---
    const dashboardWrapper = document.getElementById('dashboard-content-wrapper');
    const portfolioWrapper = document.getElementById('portfolio-content-wrapper');
    const portfolioTableContainer = document.getElementById('portfolio-table-container');
    const cardsContainer = document.querySelector('.cards-container');
    const watchlistContainer = document.querySelector('.sidebar-watchlist');
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
    const sidebarMenu = document.querySelector('.sidebar-menu ul'); // Parent for menu item delegation


    // --- Functions ---

    function createStockCardHTML(stock) { /* ... */ const perfClass = stock.dayChangePercent >= 0 ? 'positive' : 'negative'; const sign = stock.dayChangePercent >= 0 ? '+' : ''; const logoHTML = `<div class="stock-logo"></div>`; return ` <div class="stock-card"> <div class="card-top"> <div class="stock-info"> ${logoHTML} <span class="stock-name">${stock.name}</span> </div> <div class="stock-ticker-perf"> <span class="stock-ticker">${stock.ticker}</span> <span class="stock-perf ${perfClass}">${sign}${stock.dayChangePercent.toFixed(2)}%</span> </div> </div> <div class="card-bottom"> <div class="portfolio-value"> <span class="portfolio-label">Portfolio</span> <span class="portfolio-amount">${stock.portfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span> </div> <div class="mini-chart" id="mini-chart-${stock.id}"></div> </div> </div>`; }
    function createWatchlistItemHTML(item) { /* ... */ const perfClass = item.changePercent >= 0 ? 'positive' : 'negative'; const sign = item.changePercent >= 0 ? '+' : ''; return ` <a href="#" class="watchlist-item" data-index="${item.indexId}"> <span class="watchlist-ticker">${item.ticker}</span> <div class="watchlist-details"> <span class="watchlist-value">${item.value}</span> <span class="watchlist-change ${perfClass}">${sign}${item.changePercent.toFixed(2)}%</span> </div> </a>`; }
    function updateDetailsPanel(indexId) { /* ... */ console.log("Updating details panel for:", indexId); if (typeof detailsData !== 'undefined' && detailsData.sp500) { if (sp500DetailsContainer) { const detailItems = sp500DetailsContainer.querySelectorAll('.detail-item'); detailItems.forEach(item => { const keyElement = item.querySelector('.detail-key'); const valueElement = item.querySelector('.detail-value'); if (keyElement && valueElement) { const keyText = keyElement.textContent.trim(); let dataKey = ''; if (keyText === 'Previous Close') dataKey = 'previousClose'; else if (keyText === 'Day Range') dataKey = 'dayRange'; else if (keyText === 'Year Range') dataKey = 'yearRange'; else if (keyText === 'Market Cap') dataKey = 'marketCap'; else if (keyText === 'Volume') dataKey = 'volume'; else if (keyText === 'Dividend Yield') dataKey = 'dividendYield'; else if (keyText === 'P/E Ratio') dataKey = 'peRatio'; if (dataKey && detailsData.sp500[dataKey] !== undefined) { valueElement.textContent = detailsData.sp500[dataKey]; } else { valueElement.textContent = '-'; } } }); } else { console.error("Could not find S&P 500 details container element."); } if (marketCapValueElement && detailsData.marketCapSummary !== undefined) { marketCapValueElement.textContent = detailsData.marketCapSummary; } else if (marketCapValueElement) { marketCapValueElement.textContent = '-'; } else { console.error("Could not find Market Cap summary value element."); } } else { console.error("Could not find details panel data."); } }
    function renderMiniChartSVG(containerId, data, isPositive) { /* ... */ const container = document.getElementById(containerId); if (!container || !data || data.length < 2) { if(container) container.innerHTML = ''; return; } const svgWidth = 60; const svgHeight = 30; const padding = 2; const dataMin = Math.min(...data); const dataMax = Math.max(...data); const dataRange = dataMax - dataMin; const effectiveRange = dataRange === 0 ? 1 : dataRange; const points = data.map((d, index) => { const x = padding + index * (svgWidth - 2 * padding) / (data.length - 1); const y = (svgHeight - padding) - (d - dataMin) / effectiveRange * (svgHeight - 2 * padding); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(' '); const strokeColor = isPositive ? '#28a745' : '#dc3545'; const svgMarkup = ` <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"> <polyline points="${points}" fill="none" stroke="${strokeColor}" stroke-width="1.5"/> </svg> `; container.innerHTML = svgMarkup; }

    // === Chart Data / Update Functions ===
    const chartDataMap = { SP500: { '1d': chartData_SP500_1d, '5d': chartData_SP500_5d, '1m': chartData_SP500_1m, '6m': chartData_SP500_6m, '1y': chartData_SP500_1y, '5y': chartData_SP500_5y, 'Max': chartData_SP500_Max }, NYSE:  { '1d': chartData_NYSE_1d, '5d': chartData_NYSE_5d, '1m': chartData_NYSE_1m, '6m': chartData_NYSE_6m, '1y': chartData_NYSE_1y, '5y': chartData_NYSE_5y, 'Max': chartData_NYSE_Max } };
    function getChartDataForRange(indexId, range) { /* ... */ console.log(`getChartDataForRange called with index: ${indexId}, range: ${range}`); let dataObjectToReturn = null; if (chartDataMap[indexId] && chartDataMap[indexId][range]) { dataObjectToReturn = chartDataMap[indexId][range]; } else { console.warn(`Data object not found for ${indexId}/${range}. Defaulting.`); const defaultObjectName = `chartData_${indexId}_Max`; dataObjectToReturn = chartDataMap[indexId]?.['Max'] || chartDataMap['SP500']?.['Max'] || null; } if (dataObjectToReturn) { try { const deepCopy = JSON.parse(JSON.stringify(dataObjectToReturn)); console.log(`Returning deep copy for ${indexId}/${range}:`, deepCopy); return deepCopy; } catch (e) { console.error("Error creating deep copy for chart data:", e); return null; } } else { console.error("No valid data object found for index/range:", indexId, range); return null; } }
    function updateChartHeaderPerformance(indexId, range) { /* ... */ const performanceDataObj = (indexId === 'SP500') ? sp500Performance : nysePerformance; const indexName = (indexId === 'SP500') ? "S&P 500" : "NYSE"; const indexValueData = (indexId === 'SP500') ? sidebarWatchlist.find(i=>i.indexId==='SP500') : sidebarWatchlist.find(i=>i.indexId==='NYSE'); const indexValue = indexValueData ? indexValueData.value : 'N/A'; if(chartIndexNameElement) chartIndexNameElement.textContent = indexName; if(chartIndexValueElement) chartIndexValueElement.textContent = indexValue; if (typeof performanceDataObj === 'undefined' || !performanceDataObj[range] || !chartStockPerfElement || !chartStockChangeElement) { console.error("Missing performance data or header elements for index/range:", indexId, range); if(chartStockPerfElement) chartStockPerfElement.textContent = '-'; if(chartStockChangeElement) chartStockChangeElement.textContent = '-'; return; } const perfData = performanceDataObj[range]; const perfClass = perfData.percent >= 0 ? 'positive' : 'negative'; const sign = perfData.percent >= 0 ? '+' : ''; chartStockPerfElement.textContent = `${sign}${perfData.percent.toFixed(2)}%`; chartStockPerfElement.className = `chart-stock-perf ${perfClass}`; chartStockChangeElement.textContent = `(${sign}${perfData.absolute.toFixed(2)} ${perfData.labelSuffix})`; chartStockChangeElement.className = `chart-stock-change ${perfClass}`; }
    function updateMainChart(indexId, range) { /* ... */ if (!portfolioLineChart) { console.error("Chart instance not found, cannot update."); return; } const newDataObject = getChartDataForRange(indexId, range); console.log(`Updating chart for index: ${indexId}, range: ${range}`, newDataObject); if(newDataObject && newDataObject.datasets && newDataObject.datasets.length > 0 && newDataObject.datasets[0].data && newDataObject.datasets[0].data.length > 0) { const newLabels = [...newDataObject.labels]; const newDataset = {...newDataObject.datasets[0]}; const newDataPoints = [...newDataset.data]; const dataMin = Math.min(...newDataPoints); const dataMax = Math.max(...newDataPoints); const padding = (dataMax - dataMin) === 0 ? 10 : (dataMax - dataMin) * 0.1; const axisMin = Math.floor(Math.max(0, dataMin - padding)); const axisMax = Math.ceil(dataMax + padding); portfolioLineChart.data.labels = newLabels; portfolioLineChart.data.datasets[0].label = newDataset.label; portfolioLineChart.data.datasets[0].data = newDataPoints; portfolioLineChart.data.datasets[0].borderColor = newDataset.borderColor; portfolioLineChart.options.scales.y.min = axisMin; portfolioLineChart.options.scales.y.max = axisMax; portfolioLineChart.update(); console.log(`Chart updated for index: ${indexId}, range: ${range}. Y-axis: ${axisMin}-${axisMax}`); updateChartHeaderPerformance(indexId, range); } else { console.error(`No data found or data is empty for index ${indexId}, range: ${range}`); } }

    // === Function to Render Portfolio Page Content ===
    function renderPortfolioPage() {
        if (!portfolioWrapper || !portfolioTableContainer || typeof portfolioStocks === 'undefined') {
            console.error("Cannot render portfolio page, wrapper or data missing.");
            // Ensure the wrapper is hidden if it exists but data is missing
            if(portfolioWrapper) portfolioWrapper.style.display = 'none';
            return;
        }
        console.log("Rendering Portfolio Page Content");

        // Create table structure
        let tableHTML = `
            <table class="portfolio-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Ticker</th>
                        <th>Quantity</th>
                        <th>Value</th>
                        <th>Day Change %</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Loop through portfolio stocks and add rows
        portfolioStocks.forEach(stock => {
            const perfClass = stock.dayChangePercent >= 0 ? 'positive' : 'negative';
            const sign = stock.dayChangePercent >= 0 ? '+' : '';
            // Format quantity if it exists, otherwise show '-'
            const quantityDisplay = stock.quantity !== undefined ? stock.quantity : '-';
            tableHTML += `
                <tr>
                    <td>${stock.name}</td>
                    <td>${stock.ticker}</td>
                    <td>${quantityDisplay}</td>
                    <td>${stock.portfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td class="${perfClass}">${sign}${stock.dayChangePercent.toFixed(2)}%</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        // Set the HTML of the table container
        portfolioTableContainer.innerHTML = tableHTML;
    }

    // === Function to Display Correct Page Content ===
    function displayPageContent(pageId) {
        console.log(`Switching page view to: ${pageId}`);
        // Ensure wrappers exist before trying to style them
        if (!dashboardWrapper || !portfolioWrapper) {
            console.error("Cannot switch pages, content wrappers not found.");
            return;
        }
        if (pageId === 'dashboard') {
            dashboardWrapper.style.display = 'grid'; // Show dashboard (use original display type)
            portfolioWrapper.style.display = 'none'; // Hide portfolio
        } else if (pageId === 'portfolio') {
            dashboardWrapper.style.display = 'none'; // Hide dashboard
            portfolioWrapper.style.display = 'block'; // Show portfolio
            // Optionally re-render portfolio content each time it's shown
            // renderPortfolioPage();
        } else {
            console.error(`Unknown pageId: ${pageId}`);
            // Default to showing dashboard
            dashboardWrapper.style.display = 'grid';
            portfolioWrapper.style.display = 'none';
        }
        currentPage = pageId; // Update state *after* successfully changing display
    }


    // --- Initial Page Load ---

    // Populate static sections first
    if (typeof sidebarWatchlist !== 'undefined' && watchlistContainer) { watchlistContainer.innerHTML = ''; sidebarWatchlist.forEach(item => { watchlistContainer.innerHTML += createWatchlistItemHTML(item); }); } else { console.error("Could not find sidebar watchlist data or container element."); }
    updateDetailsPanel(currentDisplayIndex); // Update details for initial index

    // Populate Dashboard View Content (Portfolio Row Cards)
    if (typeof portfolioStocks !== 'undefined' && cardsContainer) { cardsContainer.innerHTML = ''; portfolioStocks.forEach(stock => { cardsContainer.innerHTML += createStockCardHTML(stock); setTimeout(() => { renderMiniChartSVG(`mini-chart-${stock.id}`, stock.miniChartData, stock.dayChangePercent >= 0); }, 0); }); } else { console.error("Could not find portfolio stocks data or cards container element."); }

    // Initialize Main Chart for default index and range (part of dashboard view)
    currentChartRange = "1d"; // Set default range
    console.log(`Initializing chart with index: ${currentDisplayIndex}, range: ${currentChartRange}`);
    const initialChartData = getChartDataForRange(currentDisplayIndex, currentChartRange);
    if (chartCanvas && initialChartData && initialChartData.datasets && initialChartData.datasets[0].data && initialChartData.datasets[0].data.length > 0) {
       try { /* ... calculate initial min/max ... */ const initialDataPoints = initialChartData.datasets[0].data; const initialDataMin = Math.min(...initialDataPoints); const initialDataMax = Math.max(...initialDataPoints); const initialPadding = (initialDataMax - initialDataMin) === 0 ? 5 : (initialDataMax - initialDataMin) * 0.1; const initialAxisMin = Math.floor(Math.max(0, initialDataMin - initialPadding)); const initialAxisMax = Math.ceil(initialDataMax + initialPadding); portfolioLineChart = new Chart(chartCanvas, { type: 'line', data: initialChartData, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, min: initialAxisMin, max: initialAxisMax } } } }); updateChartHeaderPerformance(currentDisplayIndex, initialChartRange); console.log("Chart initialized successfully."); } catch (error) { console.error("Error initializing main chart:", error); }
    } else { console.error("Could not find chart canvas element or valid initial chart data. Chart will not be displayed."); }

    // Render the hidden portfolio page content initially
    renderPortfolioPage();

    // Display the initial page (dashboard)
    displayPageContent(currentPage);


    // --- Event Listeners ---

    // Time Range Buttons (Only affect dashboard view)
    if (timeRangeButtons.length > 0) {
        timeRangeButtons.forEach(button => { button.dataset.range = button.textContent.trim(); });
        const initialActiveButtonFound = document.querySelector(`.chart-time-ranges .time-range-btn[data-range="${currentChartRange}"]`);
        if(initialActiveButtonFound) { initialActiveButtonFound.classList.add('active'); } else if(timeRangeButtons[0]) { timeRangeButtons[0].classList.add('active'); console.warn(`Initial range button "${currentChartRange}" not found. Activated first button instead.`); }

        timeRangeButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                currentChartRange = this.dataset.range; // Update current range state
                console.log(`Time range button clicked: ${currentChartRange}`);
                timeRangeButtons.forEach(btn => { btn.classList.remove('active'); });
                this.classList.add('active');
                // Only update chart if dashboard is visible
                if (currentPage === 'dashboard') {
                    updateMainChart(currentDisplayIndex, currentChartRange);
                }
            });
        });
    } else { console.error("Could not find time range buttons."); }

    // Sidebar Watchlist Item Click Listener (Index Switch)
    if (watchlistContainer) {
         const initialActiveWatchlistItem = watchlistContainer.querySelector(`.watchlist-item[data-index="${currentDisplayIndex}"]`);
         if(initialActiveWatchlistItem) initialActiveWatchlistItem.classList.add('active');

        watchlistContainer.addEventListener('click', function(event) {
            const clickedItem = event.target.closest('.watchlist-item');
            if (clickedItem) {
                event.preventDefault();
                const selectedIndex = clickedItem.dataset.index;
                console.log(`Watchlist item clicked: ${selectedIndex}`);
                if (selectedIndex && selectedIndex !== currentDisplayIndex) {
                    currentDisplayIndex = selectedIndex; // Update current index state
                    // Update active class on sidebar items
                    this.querySelectorAll('.watchlist-item').forEach(i => i.classList.remove('active'));
                    clickedItem.classList.add('active');
                    // Update the main chart and header *only if dashboard is visible*
                    if (currentPage === 'dashboard') {
                        updateMainChart(currentDisplayIndex, currentChartRange);
                    }
                    updateDetailsPanel(currentDisplayIndex); // Update details panel regardless
                }
            }
        });
    } else { console.error("Could not find sidebar watchlist container to add listener to."); }

    // Sidebar Menu Click Listener (Page Switch)
    if (sidebarMenu) {
         // Set initial active menu item
         document.querySelector(`.sidebar-menu .menu-item[data-page="${currentPage}"]`)?.classList.add('active');

        sidebarMenu.addEventListener('click', function(event) {
            const clickedMenuItem = event.target.closest('.menu-item');
            if (clickedMenuItem) {
                event.preventDefault();
                const selectedPage = clickedMenuItem.dataset.page;
                console.log(`Menu item clicked: ${selectedPage}`);

                if (selectedPage && selectedPage !== currentPage) {
                    // Update active class on menu items BEFORE changing page state
                    this.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                    clickedMenuItem.classList.add('active');
                    // Show/Hide the correct content wrapper
                    displayPageContent(selectedPage); // This function now updates currentPage state
                }
            }
        });
    } else { console.error("Could not find sidebar menu container to add listener to."); }


    // Portfolio Row Scrolling Logic
    if (cardsContainer && scrollLeftBtn && scrollRightBtn && typeof portfolioStocks !== 'undefined') { /* ... */ const cardWidth = 220; const gap = 20; const scrollAmount = cardWidth + gap; function updateScrollButtons() { const tolerance = 1; const maxScrollLeft = cardsContainer.scrollWidth - cardsContainer.clientWidth; scrollLeftBtn.disabled = cardsContainer.scrollLeft <= tolerance; scrollRightBtn.disabled = cardsContainer.scrollLeft >= maxScrollLeft - tolerance; } setTimeout(updateScrollButtons, 150); scrollRightBtn.addEventListener('click', () => { cardsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' }); setTimeout(updateScrollButtons, 400); }); scrollLeftBtn.addEventListener('click', () => { cardsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); setTimeout(updateScrollButtons, 400); }); let resizeTimeout; window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(updateScrollButtons, 250); }); } else { /* console.error(...) */ }


    // Debounced Resize Handler
    const handleResize = debounce(() => { /* ... */ if (portfolioLineChart) { console.log("Window resized, calling chart.resize()"); portfolioLineChart.resize(); } if (typeof updateScrollButtons === 'function') { updateScrollButtons(); } }, 250);
    window.addEventListener('resize', handleResize);


}); // End of DOMContentLoaded listener
