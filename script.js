// Wait for the HTML document to fully load before running scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded!");

    // --- Populate "Your Stock Portfolio" Row ---
    const cardsContainer = document.querySelector('.cards-container');
    function createStockCardHTML(stock) {
        // Function to generate HTML for one stock card
        const perfClass = stock.dayChangePercent >= 0 ? 'positive' : 'negative';
        const sign = stock.dayChangePercent >= 0 ? '+' : '';
        const logoHTML = `<div class="stock-logo"></div>`; // Placeholder div for logo

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
    // Check for data and container, then populate
    if (typeof portfolioStocks !== 'undefined' && cardsContainer) {
        cardsContainer.innerHTML = ''; // Clear static content
        portfolioStocks.forEach(stock => {
            cardsContainer.innerHTML += createStockCardHTML(stock);
        });
    } else {
        console.error("Could not find portfolio stocks data or cards container element.");
    }


    // === Chart Data Lookup Function ===
    function getChartDataForRange(range) {
        // Returns the correct pre-defined data object from data.js based on range
        switch (range) {
            case "1d": return chartData_1d;
            case "5d": return chartData_5d;
            case "1m": return chartData_1m;
            case "6m": return chartData_6m;
            case "YTD": return chartData_YTD;
            case "1y": return chartData_1y;
            case "5y": return chartData_5y;
            case "Max": return chartData_Max;
            default:
                console.warn(`Unknown range: ${range}. Defaulting to Max.`);
                return chartData_Max; // Default to Max data
        }
    }


    // --- Initialize Main Chart ---
    let portfolioLineChart = null; // Variable to hold the chart instance
    const ctx = document.getElementById('portfolioChart'); // Get canvas element
    const initialChartRange = "1y"; // Default range to show on load

    const initialChartData = getChartDataForRange(initialChartRange); // Get data for default range

    // Check if canvas and initial data exist
    if (ctx && initialChartData && initialChartData.datasets && initialChartData.datasets[0].data && initialChartData.datasets[0].data.length > 0) {
       try {
           // Calculate initial min/max with padding for the Y-axis
           const initialDataPoints = initialChartData.datasets[0].data;
           const initialDataMin = Math.min(...initialDataPoints);
           const initialDataMax = Math.max(...initialDataPoints);
           // Calculate padding (e.g., 10% of the data range)
           const initialPadding = (initialDataMax - initialDataMin) * 0.1;
           // Calculate axis limits, ensuring min isn't below 0 if data is positive
           const initialAxisMin = Math.floor(Math.max(0, initialDataMin - initialPadding));
           const initialAxisMax = Math.ceil(initialDataMax + initialPadding);

           // Create the chart instance
           portfolioLineChart = new Chart(ctx, {
                type: 'line',
                data: initialChartData, // Use the data object for the initial range
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Important for sizing in container
                    plugins: {
                        legend: {
                            display: false // Hide dataset label legend
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false, // Don't force start at 0
                            // Set initial calculated min/max
                            min: initialAxisMin,
                            max: initialAxisMax
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error initializing main chart:", error);
        }
    } else {
        console.error("Could not find chart canvas element or initial chart data.");
    }


    // --- Populate Sidebar Watchlist ---
    const watchlistContainer = document.querySelector('.sidebar-watchlist');
    function createWatchlistItemHTML(item) {
        // Function to generate HTML for one watchlist item
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
     // Check for data and container, then populate
    if (typeof sidebarWatchlist !== 'undefined' && watchlistContainer) {
        watchlistContainer.innerHTML = ''; // Clear static content
        sidebarWatchlist.forEach(item => {
            watchlistContainer.innerHTML += createWatchlistItemHTML(item);
        });
    } else {
        console.error("Could not find sidebar watchlist data or container element.");
    }


    // --- Populate Details Panel ---
    const sp500DetailsContainer = document.querySelector('.sp500-details .details-card-body');
    const marketCapValueElement = document.querySelector('.market-cap-summary .market-cap-value');
    function updateDetailsPanel(data) {
        // Function to update text content in the details panel cards
        if (!data || !data.sp500) return; // Exit if data is missing

        // Update S&P 500 details card
        if (sp500DetailsContainer) {
            const detailItems = sp500DetailsContainer.querySelectorAll('.detail-item');
            detailItems.forEach(item => {
                const keyElement = item.querySelector('.detail-key');
                const valueElement = item.querySelector('.detail-value');
                if (keyElement && valueElement) {
                    const keyText = keyElement.textContent.trim();
                    let dataKey = '';
                    // Map display text to data object key
                    if (keyText === 'Previous Close') dataKey = 'previousClose';
                    else if (keyText === 'Day Range') dataKey = 'dayRange';
                    else if (keyText === 'Year Range') dataKey = 'yearRange';
                    else if (keyText === 'Market Cap') dataKey = 'marketCap';
                    else if (keyText === 'Volume') dataKey = 'volume';
                    else if (keyText === 'Dividend Yield') dataKey = 'dividendYield';
                    else if (keyText === 'P/E Ratio') dataKey = 'peRatio';

                    // Update text if key found in data, otherwise show '-'
                    if (dataKey && data.sp500[dataKey] !== undefined) {
                        valueElement.textContent = data.sp500[dataKey];
                    } else {
                        valueElement.textContent = '-';
                    }
                }
            });
        }
        // Update separate Market Cap summary card
        if (marketCapValueElement && data.marketCapSummary !== undefined) {
            marketCapValueElement.textContent = data.marketCapSummary;
        } else if (marketCapValueElement) {
            marketCapValueElement.textContent = '-';
        }
    }
    // Check for data and call update function
    if (typeof detailsData !== 'undefined') {
        updateDetailsPanel(detailsData);
    } else {
         console.error("Could not find details panel data.");
    }


    // --- Add Event Listeners for Time Range Buttons ---
    const timeRangeButtons = document.querySelectorAll('.chart-time-ranges .time-range-btn');
    // Check if buttons exist
    if (timeRangeButtons.length > 0) {
        // Activate the button corresponding to the initial chart range
         const initialActiveButton = document.querySelector(`.chart-time-ranges .time-range-btn[data-range="${initialChartRange}"]`);
         // Need to add data-range attribute in loop first or use textContent comparison
         // Let's add data-range in the loop below

        timeRangeButtons.forEach(button => {
            // Store the range string in a data attribute for easy access
            button.dataset.range = button.textContent.trim();

            // Add click listener to each button
            button.addEventListener('click', function(event) {
                console.log("Button clicked!", this);
                event.preventDefault(); // Prevent default link/button behavior
                const selectedRange = this.dataset.range; // Get range from data attribute

                // Update active state styling
                timeRangeButtons.forEach(btn => { btn.classList.remove('active'); });
                this.classList.add('active');
                console.log("Selected time range:", selectedRange);

                // --- Update Chart Data ---
                if (portfolioLineChart) { // Check if chart instance exists
                    const newData = getChartDataForRange(selectedRange); // Get the correct dataset

                    // Check if data for the range was found and is valid
                    if(newData && newData.datasets && newData.datasets.length > 0 && newData.datasets[0].data && newData.datasets[0].data.length > 0) {
                        const dataPoints = newData.datasets[0].data;
                        const dataMin = Math.min(...dataPoints);
                        const dataMax = Math.max(...dataPoints);
                        // Calculate padding (e.g., 10% of data range, or a fixed amount if range is 0)
                        const padding = (dataMax - dataMin) === 0 ? 10 : (dataMax - dataMin) * 0.1;

                        // Calculate new axis limits
                        const axisMin = Math.floor(Math.max(0, dataMin - padding)); // Ensure min >= 0
                        const axisMax = Math.ceil(dataMax + padding);

                        // Update chart data object
                        portfolioLineChart.data.labels = newData.labels;
                        portfolioLineChart.data.datasets[0].label = newData.datasets[0].label;
                        portfolioLineChart.data.datasets[0].data = dataPoints;

                        // Update chart options for Y-axis scale
                        portfolioLineChart.options.scales.y.min = axisMin;
                        portfolioLineChart.options.scales.y.max = axisMax;

                        // Redraw the chart
                        portfolioLineChart.update();
                        console.log(`Chart updated for range: ${selectedRange}. Y-axis: ${axisMin}-${axisMax}`);
                    } else {
                        console.error("No data found or data is empty for selected range:", selectedRange);
                    }
                } else {
                    console.error("Chart instance not found, cannot update.");
                }
            });
        });

         // Now activate the initial button after setting data-range
         const initialActiveButtonFound = document.querySelector(`.chart-time-ranges .time-range-btn[data-range="${initialChartRange}"]`);
         if(initialActiveButtonFound) initialActiveButtonFound.classList.add('active');

    } else {
        console.error("Could not find time range buttons.");
    }

}); // End of DOMContentLoaded listener
