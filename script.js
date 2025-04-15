// Wait for the HTML document to fully load before running scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded!");

    // --- Selectors ---
    const cardsContainer = document.querySelector('.cards-container');
    const watchlistContainer = document.querySelector('.sidebar-watchlist');
    const sp500DetailsContainer = document.querySelector('.sp500-details .details-card-body');
    const marketCapValueElement = document.querySelector('.market-cap-summary .market-cap-value');
    const chartCanvas = document.getElementById('portfolioChart');
    const chartStockPerfElement = document.querySelector('.chart-title-info .chart-stock-perf');
    const chartStockChangeElement = document.querySelector('.chart-title-info .chart-stock-change');
    const timeRangeButtons = document.querySelectorAll('.chart-time-ranges .time-range-btn');
    const scrollLeftBtn = document.getElementById('scroll-left-btn');
    const scrollRightBtn = document.getElementById('scroll-right-btn');


    // --- Functions ---
    function createStockCardHTML(stock) { /* ... */ const perfClass = stock.dayChangePercent >= 0 ? 'positive' : 'negative'; const sign = stock.dayChangePercent >= 0 ? '+' : ''; const logoHTML = `<div class="stock-logo"></div>`; return ` <div class="stock-card"> <div class="card-top"> <div class="stock-info"> ${logoHTML} <span class="stock-name">${stock.name}</span> </div> <div class="stock-ticker-perf"> <span class="stock-ticker">${stock.ticker}</span> <span class="stock-perf ${perfClass}">${sign}${stock.dayChangePercent.toFixed(2)}%</span> </div> </div> <div class="card-bottom"> <div class="portfolio-value"> <span class="portfolio-label">Portfolio</span> <span class="portfolio-amount">${stock.portfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span> </div> <div class="mini-chart" id="mini-chart-${stock.id}"></div> </div> </div>`; }
    function createWatchlistItemHTML(item) { /* ... */ const perfClass = item.changePercent >= 0 ? 'positive' : 'negative'; const sign = item.changePercent >= 0 ? '+' : ''; return ` <a href="#" class="watchlist-item"> <span class="watchlist-ticker">${item.ticker}</span> <div class="watchlist-details"> <span class="watchlist-value">${item.value}</span> <span class="watchlist-change ${perfClass}">${sign}${item.changePercent.toFixed(2)}%</span> </div> </a>`; }
    function updateDetailsPanel(data) { /* ... */ if (!data || !data.sp500) { console.error("Details data is missing or incomplete."); return; } if (sp500DetailsContainer) { const detailItems = sp500DetailsContainer.querySelectorAll('.detail-item'); detailItems.forEach(item => { const keyElement = item.querySelector('.detail-key'); const valueElement = item.querySelector('.detail-value'); if (keyElement && valueElement) { const keyText = keyElement.textContent.trim(); let dataKey = ''; if (keyText === 'Previous Close') dataKey = 'previousClose'; else if (keyText === 'Day Range') dataKey = 'dayRange'; else if (keyText === 'Year Range') dataKey = 'yearRange'; else if (keyText === 'Market Cap') dataKey = 'marketCap'; else if (keyText === 'Volume') dataKey = 'volume'; else if (keyText === 'Dividend Yield') dataKey = 'dividendYield'; else if (keyText === 'P/E Ratio') dataKey = 'peRatio'; if (dataKey && data.sp500[dataKey] !== undefined) { valueElement.textContent = data.sp500[dataKey]; } else { valueElement.textContent = '-'; } } }); } else { console.error("Could not find S&P 500 details container element."); } if (marketCapValueElement && data.marketCapSummary !== undefined) { marketCapValueElement.textContent = data.marketCapSummary; } else if (marketCapValueElement) { marketCapValueElement.textContent = '-'; } else { console.error("Could not find Market Cap summary value element."); } }
    function getChartDataForRange(range) { /* ... */ console.log(`getChartDataForRange called with range: ${range}`); let dataObjectToReturn = null; if (range === "1d") { dataObjectToReturn = chartData_1d; } else if (range === "5d") { dataObjectToReturn = chartData_5d; } else if (range === "1m") { dataObjectToReturn = chartData_1m; } else if (range === "6m") { dataObjectToReturn = chartData_6m; } else if (range === "1y") { dataObjectToReturn = chartData_1y; } else if (range === "5y") { dataObjectToReturn = chartData_5y; } else if (range === "Max") { dataObjectToReturn = chartData_Max; } else { console.warn(`Unknown range: ${range}. Defaulting to Max.`); dataObjectToReturn = chartData_Max; } if (dataObjectToReturn && typeof dataObjectToReturn === 'object') { if(range === "1y") { console.log("Inspecting object reference before copy (1y case):", dataObjectToReturn); } try { const deepCopy = JSON.parse(JSON.stringify(dataObjectToReturn)); console.log(`Returning deep copy for range ${range}:`, deepCopy); if (range === "1y" && deepCopy.labels) { console.log(`Deep copy for 1y has ${deepCopy.labels.length} labels.`); } return deepCopy; } catch (e) { console.error("Error creating deep copy for chart data:", e); return null; } } else { console.error("No valid data object found for range:", range); return null; } }
    function updateChartHeaderPerformance(range) { /* ... */ if (typeof sp500Performance === 'undefined' || !sp500Performance[range] || !chartStockPerfElement || !chartStockChangeElement) { console.error("Missing performance data or header elements for range:", range); if(chartStockPerfElement) chartStockPerfElement.textContent = '-'; if(chartStockChangeElement) chartStockChangeElement.textContent = '-'; return; } const perfData = sp500Performance[range]; const perfClass = perfData.percent >= 0 ? 'positive' : 'negative'; const sign = perfData.percent >= 0 ? '+' : ''; chartStockPerfElement.textContent = `${sign}${perfData.percent.toFixed(2)}%`; chartStockPerfElement.className = `chart-stock-perf ${perfClass}`; chartStockChangeElement.textContent = `(${sign}${perfData.absolute.toFixed(2)} ${perfData.labelSuffix})`; chartStockChangeElement.className = `chart-stock-change ${perfClass}`; }
    function renderMiniChartSVG(containerId, data, isPositive) { /* ... */ const container = document.getElementById(containerId); if (!container || !data || data.length < 2) { if(container) container.innerHTML = ''; return; } const svgWidth = 60; const svgHeight = 30; const padding = 2; const dataMin = Math.min(...data); const dataMax = Math.max(...data); const dataRange = dataMax - dataMin; const effectiveRange = dataRange === 0 ? 1 : dataRange; const points = data.map((d, index) => { const x = padding + index * (svgWidth - 2 * padding) / (data.length - 1); const y = (svgHeight - padding) - (d - dataMin) / effectiveRange * (svgHeight - 2 * padding); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(' '); const strokeColor = isPositive ? '#28a745' : '#dc3545'; const svgMarkup = ` <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"> <polyline points="${points}" fill="none" stroke="${strokeColor}" stroke-width="1.5"/> </svg> `; container.innerHTML = svgMarkup; }

    // === NEW: Debounce Function ===
    /**
     * Creates a debounced function that delays invoking func until after wait milliseconds
     * have elapsed since the last time the debounced function was invoked.
     * @param {Function} func The function to debounce.
     * @param {number} wait The number of milliseconds to delay.
     * @returns {Function} The new debounced function.
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    // === END NEW Debounce Function ===


    // --- Initial Page Load Population ---
    // ... (code remains the same) ...
    if (typeof portfolioStocks !== 'undefined' && cardsContainer) { cardsContainer.innerHTML = ''; portfolioStocks.forEach(stock => { cardsContainer.innerHTML += createStockCardHTML(stock); setTimeout(() => { renderMiniChartSVG(`mini-chart-${stock.id}`, stock.miniChartData, stock.dayChangePercent >= 0); }, 0); }); } else { console.error("Could not find portfolio stocks data or cards container element."); } if (typeof sidebarWatchlist !== 'undefined' && watchlistContainer) { watchlistContainer.innerHTML = ''; sidebarWatchlist.forEach(item => { watchlistContainer.innerHTML += createWatchlistItemHTML(item); }); } else { console.error("Could not find sidebar watchlist data or container element."); } if (typeof detailsData !== 'undefined') { updateDetailsPanel(detailsData); } else { console.error("Could not find details panel data."); }


    // --- Initialize Main Chart ---
    let portfolioLineChart = null;
    const initialChartRange = "1d";
    const initialChartData = getChartDataForRange(initialChartRange);
    if (chartCanvas && initialChartData && initialChartData.datasets && initialChartData.datasets[0].data && initialChartData.datasets[0].data.length > 0) {
       try { /* ... calculate initial min/max ... */ const initialDataPoints = initialChartData.datasets[0].data; const initialDataMin = Math.min(...initialDataPoints); const initialDataMax = Math.max(...initialDataPoints); const initialPadding = (initialDataMax - initialDataMin) === 0 ? 5 : (initialDataMax - initialDataMin) * 0.1; const initialAxisMin = Math.floor(Math.max(0, initialDataMin - initialPadding)); const initialAxisMax = Math.ceil(initialDataMax + initialPadding); portfolioLineChart = new Chart(chartCanvas, { type: 'line', data: initialChartData, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, min: initialAxisMin, max: initialAxisMax } } } }); updateChartHeaderPerformance(initialChartRange); } catch (error) { console.error("Error initializing main chart:", error); }
    } else { console.error("Could not find chart canvas element or valid initial chart data."); }


    // --- Add Event Listeners for Time Range Buttons ---
    // ... (code remains the same) ...
    if (timeRangeButtons.length > 0) { timeRangeButtons.forEach(button => { button.dataset.range = button.textContent.trim(); }); const initialActiveButtonFound = document.querySelector(`.chart-time-ranges .time-range-btn[data-range="${initialChartRange}"]`); if(initialActiveButtonFound) { initialActiveButtonFound.classList.add('active'); } else if(timeRangeButtons[0]) { timeRangeButtons[0].classList.add('active'); console.warn(`Initial range button "${initialChartRange}" not found. Activated first button instead.`); } timeRangeButtons.forEach(button => { button.addEventListener('click', function(event) { event.preventDefault(); const selectedRange = this.dataset.range; console.log(`Button Clicked. Type: ${typeof selectedRange}, Value: "${selectedRange}"`); timeRangeButtons.forEach(btn => { btn.classList.remove('active'); }); this.classList.add('active'); console.log(`--- Clicked: ${selectedRange} ---`); if (portfolioLineChart) { const newDataObject = getChartDataForRange(selectedRange); console.log("Data object retrieved for range:", selectedRange, newDataObject); if(newDataObject && newDataObject.datasets && newDataObject.datasets.length > 0 && newDataObject.datasets[0].data && newDataObject.datasets[0].data.length > 0) { const newLabels = [...newDataObject.labels]; const newDataset = {...newDataObject.datasets[0]}; const newDataPoints = [...newDataset.data]; const dataMin = Math.min(...newDataPoints); const dataMax = Math.max(...newDataPoints); const padding = (dataMax - dataMin) === 0 ? 10 : (dataMax - dataMin) * 0.1; const axisMin = Math.floor(Math.max(0, dataMin - padding)); const axisMax = Math.ceil(dataMax + padding); console.log("Updating chart data with:", { labels: newLabels, data: newDataPoints }); console.log("Updating chart options with:", { min: axisMin, max: axisMax }); portfolioLineChart.data.labels = newLabels; portfolioLineChart.data.datasets[0].label = newDataset.label; portfolioLineChart.data.datasets[0].data = newDataPoints; portfolioLineChart.options.scales.y.min = axisMin; portfolioLineChart.options.scales.y.max = axisMax; portfolioLineChart.update(); console.log("Chart update called successfully."); updateChartHeaderPerformance(selectedRange); } else { console.error("No data found or data is empty after copying for selected range:", selectedRange); } } else { console.error("Chart instance not found, cannot update."); } }); }); } else { console.error("Could not find time range buttons."); }


    // --- Portfolio Row Scrolling Logic ---
    // ... (code remains the same) ...
    if (cardsContainer && scrollLeftBtn && scrollRightBtn && typeof portfolioStocks !== 'undefined') { const cardWidth = 220; const gap = 20; const scrollAmount = cardWidth + gap; function updateScrollButtons() { const tolerance = 1; const maxScrollLeft = cardsContainer.scrollWidth - cardsContainer.clientWidth; scrollLeftBtn.disabled = cardsContainer.scrollLeft <= tolerance; scrollRightBtn.disabled = cardsContainer.scrollLeft >= maxScrollLeft - tolerance; console.log(`ScrollLeft: ${cardsContainer.scrollLeft.toFixed(1)}, MaxScroll: ${maxScrollLeft.toFixed(1)}, Right Disabled: ${scrollRightBtn.disabled}`); } setTimeout(updateScrollButtons, 150); scrollRightBtn.addEventListener('click', () => { cardsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' }); setTimeout(updateScrollButtons, 400); }); scrollLeftBtn.addEventListener('click', () => { cardsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); setTimeout(updateScrollButtons, 400); }); let resizeTimeout; window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(updateScrollButtons, 250); }); } else { if (!cardsContainer) console.error("Scrolling Error: cardsContainer not found."); if (!scrollLeftBtn) console.error("Scrolling Error: scrollLeftBtn not found."); if (!scrollRightBtn) console.error("Scrolling Error: scrollRightBtn not found."); if (typeof portfolioStocks === 'undefined') console.error("Scrolling Error: portfolioStocks data not found."); }


    // === NEW: Debounced Resize Handler for Main Chart ===
    const handleResize = debounce(() => {
        if (portfolioLineChart) {
            console.log("Window resized, calling chart.resize()");
            portfolioLineChart.resize(); // Tell chart to resize to its container
        }
        // Also update scroll buttons on resize, as container width changes
        if (typeof updateScrollButtons === 'function') { // Check if function exists
             updateScrollButtons();
        }
    }, 250); // Debounce timeout in milliseconds (adjust as needed)

    window.addEventListener('resize', handleResize);
    // === END NEW Resize Handler ===


}); // End of DOMContentLoaded listener
