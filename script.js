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

}); // End of DOMContentLoaded listener
