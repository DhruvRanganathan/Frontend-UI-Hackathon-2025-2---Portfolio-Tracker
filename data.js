// Mock Data File (data.js)

// 1. Data for the "Your Stock Portfolio" cards (Expanded to 8)
const portfolioStocks = [
    { id: 1, name: "Apple, Inc", ticker: "AAPL", logoUrl: "placeholder-logo-apple.png", portfolioValue: 15215.70, dayChangePercent: 0.66, miniChartData: [50, 52, 51, 53, 54, 53, 55] },
    { id: 2, name: "Google LLC", ticker: "GOOGL", logoUrl: "placeholder-logo-google.png", portfolioValue: 10570.45, dayChangePercent: -0.25, miniChartData: [100, 98, 99, 97, 96, 98, 97] },
    { id: 3, name: "Tesla, Inc.", ticker: "TSLA", logoUrl: "placeholder-logo-tesla.png", portfolioValue: 8750.00, dayChangePercent: 1.85, miniChartData: [200, 205, 210, 208, 212, 215, 214] },
    { id: 4, name: "Microsoft", ticker: "MSFT", logoUrl: "placeholder-logo-msft.png", portfolioValue: 12345.67, dayChangePercent: 0.95, miniChartData: [300, 302, 301, 305, 304, 306, 307] },
    { id: 5, name: "Amazon", ticker: "AMZN", logoUrl: "placeholder-logo-amzn.png", portfolioValue: 9876.54, dayChangePercent: -0.10, miniChartData: [150, 151, 149, 148, 150, 152, 151] },
    { id: 6, name: "NVIDIA", ticker: "NVDA", logoUrl: "placeholder-logo-nvda.png", portfolioValue: 11111.11, dayChangePercent: 2.50, miniChartData: [400, 410, 405, 415, 420, 418, 425] },
    { id: 7, name: "Meta", ticker: "META", logoUrl: "placeholder-logo-meta.png", portfolioValue: 7654.32, dayChangePercent: -0.80, miniChartData: [250, 248, 245, 246, 247, 244, 242] },
    { id: 8, name: "Netflix", ticker: "NFLX", logoUrl: "placeholder-logo-nflx.png", portfolioValue: 6543.21, dayChangePercent: 1.15, miniChartData: [500, 505, 510, 508, 512, 515, 514] }
];

// 2. Data for Sidebar Watchlist (simplified)
const sidebarWatchlist = [
    { ticker: "S&P 500", value: "5,405.97", changePercent: 0.79 }, // Updated to match chart example
    { ticker: "NYSE", value: "17,821.15", changePercent: 1.11 }
];

// 3. Data for Details Panel (simplified for now)
const detailsData = {
    sp500: { previousClose: "5,363.36", dayRange: "5,358.02 - 5,459.46", yearRange: "4,835.04 - 6,147.43", marketCap: "$40.3 T USD", volume: "2,924,736", dividendYield: "1.43%", peRatio: "31.08" },
    marketCapSummary: "$49.8 T"
};

// 4. Fixed Performance Data for S&P 500
// Matches the time range button values/data-range attributes
const sp500Performance = {
    '1d':  { percent: 0.79,  absolute: 42.61,  labelSuffix: "Today" },
    '5d':  { percent: 1.52,  absolute: 81.30,  labelSuffix: "in 5 Days" },
    '1m':  { percent: 3.10,  absolute: 160.55, labelSuffix: "in 1 Month" },
    '6m':  { percent: 12.50, absolute: 602.10, labelSuffix: "in 6 Months" },
    // 'YTD' removed as requested
    '1y':  { percent: 25.80, absolute: 1105.40,labelSuffix: "in 1 Year" },
    '5y':  { percent: 85.30, absolute: 2501.90,labelSuffix: "in 5 Years" },
    'Max': { percent: 450.10,absolute: 4405.20,labelSuffix: "All Time" }
};


// 5. Fixed Chart Data for Different Time Ranges
// Base styling (can be reused)
const baseDatasetOptions = {
    borderColor: '#28a745', // Green line color
    tension: 0.1,
    fill: false
};

const chartData_1d = {
    labels: ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm"],
    datasets: [{ label: 'S&P 500 Value (1d)', data: [5375, 5388, 5392, 5401, 5395, 5405, 5400, 5406], ...baseDatasetOptions }]
};

const chartData_5d = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [{ label: 'S&P 500 Value (5d)', data: [5320, 5355, 5340, 5380, 5406], ...baseDatasetOptions }]
};

const chartData_1m = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ label: 'S&P 500 Value (1m)', data: [5250, 5290, 5350, 5406], ...baseDatasetOptions }]
};

const chartData_6m = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ label: 'S&P 500 Value (6m)', data: [5000, 5150, 5200, 5180, 5300, 5406], ...baseDatasetOptions }]
};

// Removed chartData_YTD object

const chartData_1y = {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    datasets: [{ label: 'S&P 500 Value (1y)', data: [4850, 4900, 5050, 5100, 5000, 4950, 5050, 5100, 5150, 5200, 5180, 5406], ...baseDatasetOptions }]
};

const chartData_5y = {
    labels: ["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"], // Simplified labels
    datasets: [{ label: 'S&P 500 Value (5y)', data: [3800, 4200, 4100, 4800, 5406], ...baseDatasetOptions }]
};

const chartData_Max = { // Can be same as 5y or use longest available data
    labels: ["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"],
    datasets: [{ label: 'S&P 500 Value (Max)', data: [3800, 4200, 4100, 4800, 5406], ...baseDatasetOptions }]
};
