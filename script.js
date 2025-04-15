// Wait for the HTML document to fully load before running scripts
console.log("STARTING script.js file!");

document.addEventListener('DOMContentLoaded', function() {

   /* // --- Populate "Your Stock Portfolio" Row ---

    const cardsContainer = document.querySelector('.cards-container');

    // Function to create the HTML for a single stock card
    function createStockCardHTML(stock) {
        const perfClass = stock.dayChangePercent >= 0 ? 'positive' : 'negative';
        const sign = stock.dayChangePercent >= 0 ? '+' : '';
        // Temporarily commented out image for debugging if needed
        // const logoHTML = `<img src="${stock.logoUrl}" alt="${stock.name} Logo" class="stock-logo">`;
        const logoHTML = `<div class="stock-logo"></div>`; // Use placeholder div if image commented out

        return `
            <div class="stock-card">
                <div class="card-top">
                    <div class="stock-info">
                        ${logoHTML}
                        <span class="stock-name">${stock.name}</span>
                    </div>
                    <div class="stock-ticker-perf">
                        <span class="stock-ticker">${stock.ticker}</span>
                        <span class="stock-perf ${perfClass}">${sign}${stock.dayChangePercent.toFixed(2)}%</span>
                    </div>
                </div>
                <div class="card-bottom">
                    <div class="portfolio-value">
                        <span class="portfolio-label">Portfolio</span>
                        <span class="portfolio-amount">${stock.portfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                    </div>
                    <div class="mini-chart" id="mini-chart-${stock.id}">
                        </div>
                </div>
            </div>
        `;
    }

    // Check if the portfolioStocks data exists and the container element is found
    if (typeof portfolioStocks !== 'undefined' && cardsContainer) {
        cardsContainer.innerHTML = '';
        portfolioStocks.forEach(stock => {
            const cardHTML = createStockCardHTML(stock);
            cardsContainer.innerHTML += cardHTML;
        });
    } else {
        console.error("Could not find portfolio stocks data or cards container element.");
    }*/

    /*// --- Initialize Main Chart ---
    let portfolioLineChart = null; // Variable to hold the chart instance
    const ctx = document.getElementById('portfolioChart');

    if (ctx && typeof mainChartData !== 'undefined') { // Check if canvas element and data exist
       try {
           portfolioLineChart = new Chart(ctx, { // Assign to variable
                type: 'line', // Type of chart
                data: mainChartData, // Use the data structure from data.js
                options: {
                    responsive: true, // Make chart responsive
                    maintainAspectRatio: false, // Allow chart to fill container height
                    plugins: {
                        legend: {
                            display: false // Hide the legend if not needed (like in design)
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false // Don't necessarily start Y-axis at zero
                        }
                    }
                    // Add other Chart.js options for customization later
                }
            });
        } catch (error) {
            console.error("Error initializing main chart:", error);
        }
    } else {
         console.error("Could not find chart canvas element or main chart data.");
    }*/

    /*// --- Populate Sidebar Watchlist ---

    const watchlistContainer = document.querySelector('.sidebar-watchlist');

    function createWatchlistItemHTML(item) {
        const perfClass = item.changePercent >= 0 ? 'positive' : 'negative';
        const sign = item.changePercent >= 0 ? '+' : '';
        return `
            <a href="#" class="watchlist-item">
                <span class="watchlist-ticker">${item.ticker}</span>
                <div class="watchlist-details">
                    <span class="watchlist-value">${item.value}</span>
                    <span class="watchlist-change ${perfClass}">${sign}${item.changePercent.toFixed(2)}%</span>
                </div>
            </a>
        `;
    }

    if (typeof sidebarWatchlist !== 'undefined' && watchlistContainer) {
        watchlistContainer.innerHTML = '';
        sidebarWatchlist.forEach(item => {
            watchlistContainer.innerHTML += createWatchlistItemHTML(item);
        });
    } else {
        console.error("Could not find sidebar watchlist data or container element.");
    }*/


    /*// --- Populate Details Panel ---

    const sp500DetailsContainer = document.querySelector('.sp500-details .details-card-body');
    const marketCapValueElement = document.querySelector('.market-cap-summary .market-cap-value');

    function updateDetailsPanel(data) {
        if (!data || !data.sp500) return; // Ensure data exists

        if (sp500DetailsContainer) {
            const detailItems = sp500DetailsContainer.querySelectorAll('.detail-item');
            detailItems.forEach(item => {
                const keyElement = item.querySelector('.detail-key');
                const valueElement = item.querySelector('.detail-value');
                if (keyElement && valueElement) {
                    const keyText = keyElement.textContent.trim();
                    let dataKey = '';
                    // Basic mapping (improve if needed)
                    if (keyText === 'Previous Close') dataKey = 'previousClose';
                    else if (keyText === 'Day Range') dataKey = 'dayRange';
                    else if (keyText === 'Year Range') dataKey = 'yearRange';
                    else if (keyText === 'Market Cap') dataKey = 'marketCap';
                    else if (keyText === 'Volume') dataKey = 'volume';
                    else if (keyText === 'Dividend Yield') dataKey = 'dividendYield';
                    else if (keyText === 'P/E Ratio') dataKey = 'peRatio';

                    if (dataKey && data.sp500[dataKey] !== undefined) { // Check if key exists in data
                        valueElement.textContent = data.sp500[dataKey];
                    } else {
                        valueElement.textContent = '-'; // Show dash if data missing
                    }
                }
            });
        }

        if (marketCapValueElement && data.marketCapSummary !== undefined) {
            marketCapValueElement.textContent = data.marketCapSummary;
        } else if (marketCapValueElement) {
            marketCapValueElement.textContent = '-';
        }
    }

    if (typeof detailsData !== 'undefined') {
        updateDetailsPanel(detailsData);
    } else {
         console.error("Could not find details panel data.");
    }*/

    // --- Add Event Listeners for Time Range Buttons ---

    const timeRangeButtons = document.querySelectorAll('.chart-time-ranges .time-range-btn');

    // Check if buttons were actually found
    if (timeRangeButtons.length > 0) {
        timeRangeButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                console.log("Button clicked!", this); // Added for debugging

                event.preventDefault();

                const selectedRange = this.textContent.trim();

                timeRangeButtons.forEach(btn => {
                    btn.classList.remove('active');
                });

                this.classList.add('active');

                console.log("Selected time range:", selectedRange);

                // --- TODO: Update Chart Data ---
                // Example placeholder for chart update logic
                // const newData = getNewChartDataForRange(selectedRange);
                // if (portfolioLineChart && newData) {
                //    portfolioLineChart.data.labels = newData.labels;
                //    portfolioLineChart.data.datasets[0].data = newData.datasets[0].data;
                //    portfolioLineChart.update();
                // }
            });
        });
    } else {
        console.error("Could not find time range buttons.");
    }


}); // End of the single, top-level DOMContentLoaded listener
