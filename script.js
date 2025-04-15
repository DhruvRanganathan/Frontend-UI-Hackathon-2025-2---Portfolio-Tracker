// Wait for the HTML document to fully load before running scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded!");

    // --- Populate "Your Stock Portfolio" Row ---
    const cardsContainer = document.querySelector('.cards-container');
    function createStockCardHTML(stock) {
        const perfClass = stock.dayChangePercent >= 0 ? 'positive' : 'negative';
        const sign = stock.dayChangePercent >= 0 ? '+' : '';
        const logoHTML = `<div class="stock-logo"></div>`; // Placeholder div for logo

        return `
            <div class="stock-card"> <div class="card-top"> <div class="stock-info"> ${logoHTML} <span class="stock-name">${stock.name}</span> </div> <div class="stock-ticker-perf"> <span class="stock-ticker">${stock.ticker}</span> <span class="stock-perf ${perfClass}">${sign}${stock.dayChangePercent.toFixed(2)}%</span> </div> </div> <div class="card-bottom"> <div class="portfolio-value"> <span class="portfolio-label">Portfolio</span> <span class="portfolio-amount">${stock.portfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span> </div> <div class="mini-chart" id="mini-chart-${stock.id}"></div> </div>
            </div>`;
    }
    if (typeof portfolioStocks !== 'undefined' && cardsContainer) {
        cardsContainer.innerHTML = '';
        portfolioStocks.forEach(stock => {
            const cardHTML = createStockCardHTML(stock);
            cardsContainer.innerHTML += cardHTML;
        });
    } else { console.error("Could not find portfolio stocks data or cards container element."); }

    // --- Initialize Main Chart ---
    let portfolioLineChart = null;
    const ctx = document.getElementById('portfolioChart');
    if (ctx && typeof mainChartData !== 'undefined') {
       try {
           portfolioLineChart = new Chart(ctx, {
                type: 'line', data: mainChartData, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false } } }
            });
        } catch (error) { console.error("Error initializing main chart:", error); }
    } else { console.error("Could not find chart canvas element or main chart data."); }

    // --- Populate Sidebar Watchlist ---
    const watchlistContainer = document.querySelector('.sidebar-watchlist');
    function createWatchlistItemHTML(item) {
        const perfClass = item.changePercent >= 0 ? 'positive' : 'negative';
        const sign = item.changePercent >= 0 ? '+' : '';
        return `
            <a href="#" class="watchlist-item"> <span class="watchlist-ticker">${item.ticker}</span> <div class="watchlist-details"> <span class="watchlist-value">${item.value}</span> <span class="watchlist-change ${perfClass}">${sign}${item.changePercent.toFixed(2)}%</span> </div> </a>`;
    }
    if (typeof sidebarWatchlist !== 'undefined' && watchlistContainer) {
        watchlistContainer.innerHTML = '';
        sidebarWatchlist.forEach(item => { watchlistContainer.innerHTML += createWatchlistItemHTML(item); });
    } else { console.error("Could not find sidebar watchlist data or container element."); }

    // --- Populate Details Panel ---
    const sp500DetailsContainer = document.querySelector('.sp500-details .details-card-body');
    const marketCapValueElement = document.querySelector('.market-cap-summary .market-cap-value');
    function updateDetailsPanel(data) {
        if (!data || !data.sp500) return;
        if (sp500DetailsContainer) {
            // ... (code to update details panel) ...
             const detailItems = sp500DetailsContainer.querySelectorAll('.detail-item'); detailItems.forEach(item => { const keyElement = item.querySelector('.detail-key'); const valueElement = item.querySelector('.detail-value'); if (keyElement && valueElement) { const keyText = keyElement.textContent.trim(); let dataKey = ''; if (keyText === 'Previous Close') dataKey = 'previousClose'; else if (keyText === 'Day Range') dataKey = 'dayRange'; else if (keyText === 'Year Range') dataKey = 'yearRange'; else if (keyText === 'Market Cap') dataKey = 'marketCap'; else if (keyText === 'Volume') dataKey = 'volume'; else if (keyText === 'Dividend Yield') dataKey = 'dividendYield'; else if (keyText === 'P/E Ratio') dataKey = 'peRatio'; if (dataKey && data.sp500[dataKey] !== undefined) { valueElement.textContent = data.sp500[dataKey]; } else { valueElement.textContent = '-'; } } });
        }
        if (marketCapValueElement && data.marketCapSummary !== undefined) { marketCapValueElement.textContent = data.marketCapSummary; } else if (marketCapValueElement) { marketCapValueElement.textContent = '-'; }
    }
    if (typeof detailsData !== 'undefined') { updateDetailsPanel(detailsData); } else { console.error("Could not find details panel data."); }

    // --- Add Event Listeners for Time Range Buttons ---

// Function to generate simple placeholder data based on range
    function getPlaceholderChartData(range) {
        // --- START: Correction ---
        // Always get a fresh copy of the original data *inside* the function
        const originalLabels = [...mainChartData.labels];
        const originalDataPoints = [...mainChartData.datasets[0].data];
        let newLabels = originalLabels; // Default to original
        let newDataPoints = originalDataPoints; // Default to original
        // --- END: Correction ---

        console.log(`Generating data for range: ${range}. Original length: ${originalDataPoints.length}`); // Debug log

        if (range === "1d") {
            newLabels = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm"];
            // Use original data points for calculation, then slice
            newDataPoints = originalDataPoints.map(p => p + (Math.random() * 10 - 5)).slice(0, 8);
        } else if (range === "5d") {
            newLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
            // Use original data points for calculation, then slice
            newDataPoints = originalDataPoints.map(p => p + (Math.random() * 20 - 10)).slice(0, 5);
        } else if (range === "1m") {
            newLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
             // Use original data points for calculation, then slice
            newDataPoints = originalDataPoints.map(p => p + (Math.random() * 50 - 25)).slice(0, 4);
        }
        // Add more specific ranges if needed (6m, YTD, 1y, 5y, Max)
        // Example for Max - just use original
        else if (range === "Max") {
             newLabels = originalLabels;
             newDataPoints = originalDataPoints;
        }
         // Example for 1y (if original data has enough points)
         else if (range === "1y" && originalDataPoints.length >= 12) {
             newLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
             newDataPoints = originalDataPoints.slice(-12); // Take last 12 points
         }
        // Default/Fallback - just return the original data as is
        // Removed the random slicing 'else' block which caused issues
        else {
             newLabels = originalLabels;
             newDataPoints = originalDataPoints;
        }

         // Ensure labels and data arrays have same length for Chart.js
        const finalLength = Math.min(newLabels.length, newDataPoints.length);
        newLabels = newLabels.slice(0, finalLength);
        newDataPoints = newDataPoints.slice(0, finalLength);

        console.log(`Generated ${newDataPoints.length} data points.`); // Debug log

        return {
            labels: newLabels,
            datasets: [{
                ...mainChartData.datasets[0], // Keep original styling etc.
                label: `S&P 500 Value (${range})`, // Update label
                data: newDataPoints // Use new data points
            }]
        };
    }

    const timeRangeButtons = document.querySelectorAll('.chart-time-ranges .time-range-btn');
    if (timeRangeButtons.length > 0) {
        timeRangeButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                console.log("Button clicked!", this);
                event.preventDefault();
                const selectedRange = this.textContent.trim();

                timeRangeButtons.forEach(btn => { btn.classList.remove('active'); });
                this.classList.add('active');
                console.log("Selected time range:", selectedRange);

                // --- Update Chart Data ---
                if (portfolioLineChart) { // Check if chart instance exists
                    const newData = getPlaceholderChartData(selectedRange); // Get placeholder data
                    portfolioLineChart.data.labels = newData.labels;
                    // Ensure we update the correct dataset if there are multiple
                    portfolioLineChart.data.datasets[0].data = newData.datasets[0].data;
                    portfolioLineChart.data.datasets[0].label = newData.datasets[0].label; // Update label too
                    portfolioLineChart.update(); // Redraw the chart
                    console.log("Chart updated for range:", selectedRange);
                } else {
                    console.error("Chart instance not found, cannot update.");
                }
            });
        });
    } else { console.error("Could not find time range buttons."); }

}); // End of DOMContentLoaded listener
