// Mock Data Structure Example

// 1. Data for the "Your Stock Portfolio" cards
const portfolioStocks = [
    {
        id: 1,
        name: "Apple, Inc",
        ticker: "AAPL",
        logoUrl: "placeholder-logo-apple.png", // Placeholder path
        portfolioValue: 15215.70,
        dayChangePercent: 0.66,
        // Placeholder data for mini-chart (e.g., last 7 days closing price)
        miniChartData: [50, 52, 51, 53, 54, 53, 55]
    },
    {
        id: 2,
        name: "Google LLC",
        ticker: "GOOGL",
        logoUrl: "placeholder-logo-google.png", // Placeholder path
        portfolioValue: 10570.45,
        dayChangePercent: -0.25, // Example of negative change
        miniChartData: [100, 98, 99, 97, 96, 98, 97]
    },
    {
        id: 3,
        name: "Tesla, Inc.",
        ticker: "TSLA",
        logoUrl: "placeholder-logo-tesla.png", // Placeholder path
        portfolioValue: 8750.00,
        dayChangePercent: 1.85,
        miniChartData: [200, 205, 210, 208, 212, 215, 214]
    }
    // Add more stock objects as needed
];

// 2. Data for the Main Chart (e.g., S&P 500 Watchlist)
const mainChartData = {
    // Labels for the X-axis (e.g., dates or times)
    labels: ["Apr 8", "Apr 9", "Apr 10", "Apr 11", "Apr 12", "Apr 13", "Apr 14"],
    // Datasets for the Y-axis
    datasets: [
        {
            label: 'S&P 500 Value', // Label for the dataset
            data: [5300, 5320, 5310, 5350, 5380, 5400, 5405.97], // Example Y-values
            borderColor: '#28a745', // Line color (green)
            tension: 0.1, // Makes the line slightly curved
            fill: false // Don't fill area under the line
        }
        // Add more datasets if comparing multiple lines
    ]
};

// 3. Data for Sidebar Watchlist (simplified)
const sidebarWatchlist = [
    { ticker: "S&P 500", value: "4,543.76", changePercent: 0.30 },
    { ticker: "NYSE", value: "17,821.15", changePercent: 1.11 }
    // Add more items
];

// 4. Data for Details Panel (simplified for now)
const detailsData = {
    sp500: {
        previousClose: "5,363.36",
        dayRange: "5,358.02 - 5,459.46",
        yearRange: "4,835.04 - 6,147.43",
        marketCap: "$40.3 T USD",
        volume: "2,924,736",
        dividendYield: "1.43%",
        peRatio: "31.08"
    },
    marketCapSummary: "$49.8 T"
};

// Note: For a real app, especially chart data, this would likely come
// from an API call, but for this hackathon, mock data is perfect.

