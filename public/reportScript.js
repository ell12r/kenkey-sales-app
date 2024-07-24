async function fetchCashReportData(shop, startDate, endDate) {
    try {
        const response = await fetch(`/getCashReport?shop=${shop}&startDate=${startDate}&endDate=${endDate}`);
        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            console.error(`Failed to fetch cash report data for ${shop}`);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching cash report data for ${shop}:`, error);
        return [];
    }
}

// Helper function to process data for the cash report
function processDataForCashReport(data) {
    const cashReportData = [];

    // Assuming each item in data has a 'foodItem', 'amount', and 'amountReturned'
    const processedData = data.map(item => ({
        foodItem: item.foodItem,
        amount: item.amount || 0,
        amountReturned: item.amountReturned || 0,
    }));

    cashReportData.push(...processedData);

    return cashReportData;
}

// Display the cash report on the page
function displayReport(shop, reportData) {
    const reportContainer = document.getElementById('reportContainer');
    reportContainer.innerHTML = ''; // Clear previous content

    reportData.forEach(dateData => {
        const table = document.createElement('table');
        table.innerHTML = `<caption><h2>${shop} - Cash Report - ${dateData.date}</h2></caption>
                            <thead>
                                <tr>
                                    <th>Food Item</th>
                                    <th>Quantity</th>
                                    <th>Quantity Returned</th>
                                    <th>Amount to Receive</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dateData.data.map(({ foodItem, quantity, quantityReturned, amount, amountReturned }) => `
                                    <tr>
                                        <td>${foodItem}</td>
                                        <td>${quantity}</td>
                                        <td>${quantityReturned}</td>
                                        <td>${(amount - amountReturned).toFixed(2)} Cedis</td>
                                    </tr>
                                `).join('')}
                                <tr>
                                    <td><strong>Total</strong></td>
                                    <td><strong>${dateData.data.reduce((total, item) => total + item.quantity, 0)}</strong></td>
                                    <td><strong>${dateData.data.reduce((total, item) => total + item.quantityReturned, 0)}</strong></td>
                                    <td><strong>${dateData.data.reduce((total, item) => total + (item.amount - item.amountReturned), 0).toFixed(2)} Cedis</strong></td>
                                </tr>
                            </tbody>`;

        reportContainer.appendChild(table);
    });
}

// Fetch and log the cash report data for the selected shop and date range
async function generateCashReport() {
    // Get user input
    const selectedShop = document.getElementById('shop').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Fetch and log the cash report data for the selected shop and date range
    const reportData = await fetchCashReportData(selectedShop, startDate, endDate);
    console.log(`Data received for ${selectedShop}:`, reportData);

    // Display the cash report on the page
    displayReport(selectedShop, reportData);
}

async function printCashReport() {
    // Get user input
    const selectedShop = document.getElementById('shop').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Fetch the cash report data for the selected shop and date range
    const reportData = await fetchCashReportData(selectedShop, startDate, endDate);

    // Check if the report data is available
    if (reportData.length > 0) {
        // Display the cash report on the page
        displayReport(selectedShop, reportData);

        // Trigger the print dialog
        window.print();
    } else {
        // If no data is available, show an alert to the user
        alert('No data available for the selected shop and date range. Please generate the report first.');
    }
}



