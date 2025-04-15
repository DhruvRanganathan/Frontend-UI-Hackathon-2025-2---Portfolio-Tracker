// Wait for the HTML document to fully load before running scripts
document.addEventListener('DOMContentLoaded', function() {

    // --- Populate "Your Stock Portfolio" Row ---

    const cardsContainer = document.querySelector('.cards-container');

    // Function to create the HTML for a single stock card
    function createStockCardHTML(stock) {
        // Determine if the change is positive or negative for styling
        const perfClass = stock.dayChangePercent >= 0 ? 'positive' : 'negative';
        const sign = stock.dayChangePercent >= 0 ? '+' : ''; // Add '+' sign for positive numbers

        // Basic HTML structure for the card - mirrors the static one we had
        // NOTE: Mini-chart generation is not included here yet.
        return `
            <div class="stock-card">
                <div class="card-top">
                    <div class="stock-info">
                        <img src="${stock.logoUrl}" alt="${stock.name} Logo" class="stock-logo">
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
    if (portfolioStocks && cardsContainer) {
        // Clear any existing static content (though we removed it from HTML)
        cardsContainer.innerHTML = '';
        // Loop through the mock data and generate HTML for each stock
        portfolioStocks.forEach(stock => {
            const cardHTML = createStockCardHTML(stock);
            // Append the generated card HTML to the container
            cardsContainer.innerHTML += cardHTML;
            // We would call a function here later to render the mini-chart for stock.id
        });
    } else {
        console.error("Could not find portfolio stocks data or cards container element.");
    }

    // --- Initialize Main Chart ---

    const ctx = document.getElementById('portfolioChart');

    if (ctx && mainChartData) { // Check if canvas element and data exist
        new Chart(ctx, {
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
    } else {
         console.error("Could not find chart canvas element or main chart data.");
    }

    // --- Other JavaScript functionality would go here ---
    // e.g., Update details panel, sidebar watchlist, handle button clicks
    // Wait for the HTML document to fully load before running scripts
    document.addEventListener('DOMContentLoaded', function() {

    // --- Populate "Your Stock Portfolio" Row ---
    // ... (existing code for populating stock cards remains here) ...
    const cardsContainer = document.querySelector('.cards-container');
    function createStockCardHTML(stock) {
        const perfClass = stock.dayChangePercent >= 0 ? 'positive' : 'negative';
        const sign = stock.dayChangePercent >= 0 ? '+' : '';
        return `
            <div class="stock-card">
                <div class="card-top"> <div class="stock-info"> <img src="${stock.logoUrl}" alt="${stock.name} Logo" class="stock-logo"> <span class="stock-name">${stock.name}</span> </div> <div class="stock-ticker-perf"> <span class="stock-ticker">${stock.ticker}</span> <span class="stock-perf ${perfClass}">${sign}${stock.dayChangePercent.toFixed(2)}%</span> </div> </div> <div class="card-bottom"> <div class="portfolio-value"> <span class="portfolio-label">Portfolio</span> <span class="portfolio-amount">${stock.portfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span> </div> <div class="mini-chart" id="mini-chart-${stock.id}"></div> </div>
            </div>
        `;
    }
    if (portfolioStocks && cardsContainer) {
        cardsContainer.innerHTML = '';
        portfolioStocks.forEach(stock => {
            const cardHTML = createStockCardHTML(stock);
            cardsContainer.innerHTML += cardHTML;
        });
    } else { /* console.error(...) */ }


    // --- Initialize Main Chart ---
    // ... (existing code for initializing main chart remains here) ...
    const ctx = document.getElementById('portfolioChart');
    if (ctx && mainChartData) {
        new Chart(ctx, { /* ... chart options ... */ });
    } else { /* console.error(...) */ }


    // ==========================================
    // === START: New Code for Sidebar & Details ===
    // ==========================================

    // --- Populate Sidebar Watchlist ---

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

    if (sidebarWatchlist && watchlistContainer) {
        // Clear any static items if needed (though HTML is empty)
        watchlistContainer.innerHTML = '';
        // Loop through data and append items
        sidebarWatchlist.forEach(item => {
            watchlistContainer.innerHTML += createWatchlistItemHTML(item);
        });
    } else {
        console.error("Could not find sidebar watchlist data or container element.");
    }


    // --- Populate Details Panel ---

    // Select elements within the S&P 500 details card
    const sp500DetailsContainer = document.querySelector('.sp500-details .details-card-body');
    // Select elements within the Market Cap summary card
    const marketCapValueElement = document.querySelector('.market-cap-summary .market-cap-value');

    function updateDetailsPanel(data) {
        if (!data || !data.sp500) return; // Ensure data exists

        // Update S&P 500 details using the keys from data.js
        if (sp500DetailsContainer) {
            const detailItems = sp500DetailsContainer.querySelectorAll('.detail-item');
            detailItems.forEach(item => {
                const keyElement = item.querySelector('.detail-key');
                const valueElement = item.querySelector('.detail-value');
                if (keyElement && valueElement) {
                    const keyText = keyElement.textContent.trim();
                    // Find corresponding key in data.sp500 (needs adjustment for matching keys)
                    let dataKey = '';
                    if (keyText === 'Previous Close') dataKey = 'previousClose';
                    else if (keyText === 'Day Range') dataKey = 'dayRange';
                    else if (keyText === 'Year Range') dataKey = 'yearRange';
                    else if (keyText === 'Market Cap') dataKey = 'marketCap';
                    else if (keyText === 'Volume') dataKey = 'volume';
                    else if (keyText === 'Dividend Yield') dataKey = 'dividendYield';
                    else if (keyText === 'P/E Ratio') dataKey = 'peRatio';

                    if (dataKey && data.sp500[dataKey]) {
                        valueElement.textContent = data.sp500[dataKey];
                    }
                }
            });
        }

        // Update the separate Market Cap summary card
        if (marketCapValueElement && data.marketCapSummary) {
            marketCapValueElement.textContent = data.marketCapSummary;
        }
    }

    // Call the function to populate the details panel
    if (detailsData) {
        updateDetailsPanel(detailsData);
    } else {
         console.error("Could not find details panel data.");
    }

    // ==========================================
    // === END: New Code for Sidebar & Details ===
    // ==========================================


}); // End of DOMContentLoaded listener


