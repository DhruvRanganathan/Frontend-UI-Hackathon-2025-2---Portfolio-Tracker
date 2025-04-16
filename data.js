// Mock Data File (data.js)

// 1. Data for the "Your Stock Portfolio" cards
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
    { indexId: "SP500", ticker: "S&P 500", value: "5,405.97", changePercent: 0.79 }, // Added indexId
    { indexId: "NYSE", ticker: "NYSE", value: "17,821.15", changePercent: 1.11 }  // Added indexId
];

// 3. Data for Details Panel (Can add NYSE details later if needed)
const detailsData = {
    sp500: { previousClose: "5,363.36", dayRange: "5,358.02 - 5,459.46", yearRange: "4,835.04 - 6,147.43", marketCap: "$40.3 T USD", volume: "2,924,736", dividendYield: "1.43%", peRatio: "31.08" },
    marketCapSummary: "$49.8 T" // This might need context change too
    // nyse: { ... add NYSE specific details if needed ... }
};

// 4. Fixed Performance Data for Indices
const sp500Performance = {
    '1d':  { percent: 0.79,  absolute: 42.61,  labelSuffix: "Today" },
    '5d':  { percent: 1.52,  absolute: 81.30,  labelSuffix: "in 5 Days" },
    '1m':  { percent: 3.10,  absolute: 160.55, labelSuffix: "in 1 Month" },
    '6m':  { percent: 12.50, absolute: 602.10, labelSuffix: "in 6 Months" },
    '1y':  { percent: 25.80, absolute: 1105.40,labelSuffix: "in 1 Year" },
    '5y':  { percent: 85.30, absolute: 2501.90,labelSuffix: "in 5 Years" },
    'Max': { percent: 450.10,absolute: 4405.20,labelSuffix: "All Time" }
};
// === NEW: NYSE Performance Data ===
const nysePerformance = {
    '1d':  { percent: 1.11,  absolute: 195.80, labelSuffix: "Today" },
    '5d':  { percent: 2.10,  absolute: 370.15, labelSuffix: "in 5 Days" },
    '1m':  { percent: 4.50,  absolute: 780.90, labelSuffix: "in 1 Month" },
    '6m':  { percent: 15.20, absolute: 2350.60,labelSuffix: "in 6 Months" },
    '1y':  { percent: 30.50, absolute: 4150.20,labelSuffix: "in 1 Year" },
    '5y':  { percent: 95.00, absolute: 8650.00,labelSuffix: "in 5 Years" },
    'Max': { percent: 510.00,absolute: 15000.00,labelSuffix: "All Time" }
};
// === END NEW ===


// 5. Fixed Chart Data for Different Time Ranges

// --- S&P 500 Data ---
const baseDatasetOptionsSP500 = { borderColor: '#28a745', tension: 0.1, fill: false };
const chartData_SP500_1d = { labels: ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm"], datasets: [{ label: 'S&P 500 Value (1d)', data: [5375, 5388, 5392, 5401, 5395, 5405, 5400, 5406], ...baseDatasetOptionsSP500 }] };
const chartData_SP500_5d = { labels: ["Mon", "Tue", "Wed", "Thu", "Fri"], datasets: [{ label: 'S&P 500 Value (5d)', data: [5320, 5355, 5340, 5380, 5406], ...baseDatasetOptionsSP500 }] };
const chartData_SP500_1m = { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], datasets: [{ label: 'S&P 500 Value (1m)', data: [5250, 5290, 5350, 5406], ...baseDatasetOptionsSP500 }] };
const chartData_SP500_6m = { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], datasets: [{ label: 'S&P 500 Value (6m)', data: [5000, 5150, 5200, 5180, 5300, 5406], ...baseDatasetOptionsSP500 }] };
const chartData_SP500_1y = { labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"], datasets: [{ label: 'S&P 500 Value (1y)', data: [4850, 4900, 5050, 5100, 5000, 4950, 5050, 5100, 5150, 5200, 5180, 5406], ...baseDatasetOptionsSP500 }] };
const chartData_SP500_5y = { labels: ["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"], datasets: [{ label: 'S&P 500 Value (5y)', data: [3800, 4200, 4100, 4800, 5406], ...baseDatasetOptionsSP500 }] };
const chartData_SP500_Max = { labels: ["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"], datasets: [{ label: 'S&P 500 Value (Max)', data: [3800, 4200, 4100, 4800, 5406], ...baseDatasetOptionsSP500 }] };

// --- NYSE Data (Example - adjust values) ---
const baseDatasetOptionsNYSE = { borderColor: '#007bff', tension: 0.1, fill: false }; // Different color
const chartData_NYSE_1d = { labels: ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm"], datasets: [{ label: 'NYSE Value (1d)', data: [17650, 17700, 17720, 17780, 17750, 17810, 17800, 17821], ...baseDatasetOptionsNYSE }] };
const chartData_NYSE_5d = { labels: ["Mon", "Tue", "Wed", "Thu", "Fri"], datasets: [{ label: 'NYSE Value (5d)', data: [17500, 17600, 17550, 17700, 17821], ...baseDatasetOptionsNYSE }] };
const chartData_NYSE_1m = { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], datasets: [{ label: 'NYSE Value (1m)', data: [17100, 17300, 17500, 17821], ...baseDatasetOptionsNYSE }] };
const chartData_NYSE_6m = { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], datasets: [{ label: 'NYSE Value (6m)', data: [16000, 16500, 16800, 16700, 17200, 17821], ...baseDatasetOptionsNYSE }] };
const chartData_NYSE_1y = { labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"], datasets: [{ label: 'NYSE Value (1y)', data: [15000, 15200, 15500, 15800, 15600, 15400, 16000, 16500, 16800, 17000, 17100, 17821], ...baseDatasetOptionsNYSE }] };
const chartData_NYSE_5y = { labels: ["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"], datasets: [{ label: 'NYSE Value (5y)', data: [12000, 13000, 12500, 15000, 17821], ...baseDatasetOptionsNYSE }] };
const chartData_NYSE_Max = { labels: ["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"], datasets: [{ label: 'NYSE Value (Max)', data: [12000, 13000, 12500, 15000, 17821], ...baseDatasetOptionsNYSE }] };
