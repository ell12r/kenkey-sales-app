const foodItems = [
    { name: 'Kenkey-5cedis', price: 5 },
    { name: 'Kenkey-4cedis', price: 4 },
    { name: 'Small Fish', price: 5 },
    { name: 'One man-1000', price: 5 },
    { name: 'Shrimps', price: 5 },
    { name: 'Fish-10Cedis', price: 10 },
    { name: 'Red Fish-10Cedis', price: 10 },
    { name: 'Red Fish-15Cedis', price: 15 },
    { name: 'Red Fish-20Cedis', price: 20 },
    { name: 'Chicken-8cedis', price: 8 },
    { name: 'Chicken-6cedis', price: 6 },
    { name: 'Octopus-5Cedis', price: 5 },
    { name: 'Octopus-10Cedis', price: 10 },
    { name: 'Chofi-20Cedis', price: 20 },
    { name: 'Beef', price: 5 },
    { name: 'Okro Fish-7Cedis', price: 7 },
    { name: 'Okro Fish-5Cedis', price: 5 },
    { name: 'Wele', price: 3 },
    { name: 'Shrimps Pack', price: 10 },
    { name: 'Tilapia Pack', price: 10 },
    { name: 'One man-1000 Pack', price: 10 },
    { name: 'Gravy 5cedis', price: 5 },
    { name: 'Fish 5Cedis', price: 5 },
    { name: 'Fish 12Cedis', price: 12 },
    { name: 'Fish 14Cedis', price: 14 },
    { name: 'Egg', price: 3 },
    { name: 'Sardine', price: 8 },
    { name: 'Mackerel', price: 15 },
    // Add more items as needed
];

function showQuantityForm() {
    const quantityForm = document.getElementById('quantityForm');
    const returnsForm = document.getElementById('returnsForm');

    // Show quantity form and hide returns form
    quantityForm.classList.remove('hidden');
    returnsForm.classList.add('hidden');

    const foodItemsContainer = document.getElementById('foodItemsContainer');
    foodItemsContainer.innerHTML = ''; // Clear previous content

    // Create table header for quantity
    const quantityTable = document.createElement('table');
    const tableBody = document.createElement('tbody'); // Add this line

    const headerRow = document.createElement('tr');
    const foodItemHeader = document.createElement('th');
    const quantityHeader = document.createElement('th');
    const amountHeader = document.createElement('th');

    foodItemHeader.textContent = 'Food Item';
    quantityHeader.textContent = 'Quantity';
    amountHeader.textContent = 'Amount';

    headerRow.appendChild(foodItemHeader);
    headerRow.appendChild(quantityHeader);
    headerRow.appendChild(amountHeader);

    quantityTable.appendChild(headerRow);
    quantityTable.appendChild(tableBody); // Add this line
    foodItemsContainer.appendChild(quantityTable);

    // Iterate over food items and create rows in the table
    let totalQuantity = 0;
    let totalAmount = 0;

    foodItems.forEach(item => {
        const row = tableBody.insertRow(); // Change this line

        const nameCell = row.insertCell();
        const quantityCell = row.insertCell();
        const amountCell = row.insertCell();

        nameCell.textContent = item.name;

        // Add an input field for quantity
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.placeholder = 'Enter Quantity';
        quantityInput.style.appearance = 'textfield';
        quantityInput.style.webkitAppearance = 'textfield';
        quantityInput.addEventListener('input', () => calculateAmount(row, item.price, item.name));

        quantityCell.appendChild(quantityInput);

        amountCell.textContent = '0'; // Initialize amount to 0
    });

    // Add a last row for total
    const totalRow = quantityTable.insertRow(); // Change this line
    const totalLabelCell = totalRow.insertCell();
    const totalQuantityCell = totalRow.insertCell();
    const totalAmountCell = totalRow.insertCell();

    totalLabelCell.textContent = 'Total:';
    totalLabelCell.style.fontWeight = 'bold';
    totalQuantityCell.textContent = totalQuantity;
    totalQuantityCell.style.fontWeight = 'bold';
    totalAmountCell.textContent = `${totalAmount} Cedis`;
    totalAmountCell.style.fontWeight = 'bold';

    function calculateAmount(row, price, itemName) {
        const quantityInput = row.querySelector('input[type="number"]');
        const amountCell = row.querySelector('td:last-child');

        const previousQuantity = parseFloat(quantityInput.getAttribute('data-previous-value')) || 0;
        const previousAmount = parseFloat(amountCell.getAttribute('data-previous-value')) || 0;

        const quantity = parseFloat(quantityInput.value) || 0;
        const amount = quantity * price;

        amountCell.textContent = `${amount} Cedis`;

        // Update total quantity and amount
        totalQuantity = totalQuantity - previousQuantity + quantity;
        totalAmount = totalAmount - previousAmount + amount;

        // Update the total row
        totalQuantityCell.textContent = totalQuantity;
        totalAmountCell.textContent = `${totalAmount} Cedis`;

        // Store current values as previous values for the next input event
        quantityInput.setAttribute('data-previous-value', quantity);
        amountCell.setAttribute('data-previous-value', amount);
    }
}

function showReturnsForm() {
    const quantityForm = document.getElementById('quantityForm');
    const returnsForm = document.getElementById('returnsForm');

    // Show quantity form and hide returns form
    quantityForm.classList.add('hidden');
    returnsForm.classList.remove('hidden');

    const foodItemsContainer = document.getElementById('returnsItemsContainer');
    foodItemsContainer.innerHTML = ''; // Clear previous content

    // Create table header for quantity
    const quantityTable = document.createElement('table');
    const tableBody = document.createElement('tbody'); // Add this line

    const headerRow = document.createElement('tr');
    const foodItemHeader = document.createElement('th');
    const quantityHeader = document.createElement('th');
    const amountHeader = document.createElement('th');

    foodItemHeader.textContent = 'Food Item';
    quantityHeader.textContent = 'Quantity Returned';
    amountHeader.textContent = 'Amount';

    headerRow.appendChild(foodItemHeader);
    headerRow.appendChild(quantityHeader);
    headerRow.appendChild(amountHeader);

    quantityTable.appendChild(headerRow);
    quantityTable.appendChild(tableBody); // Add this line
    foodItemsContainer.appendChild(quantityTable);

    // Iterate over food items and create rows in the table
    let totalQuantity = 0;
    let totalAmount = 0;

    foodItems.forEach(item => {
        const row = tableBody.insertRow(); // Change this line

        const nameCell = row.insertCell();
        const quantityCell = row.insertCell();
        const amountCell = row.insertCell();

        nameCell.textContent = item.name;

        // Add an input field for quantity
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.placeholder = 'Enter Quantity Returned';
        quantityInput.style.appearance = 'textfield';
        quantityInput.style.webkitAppearance = 'textfield';
        quantityInput.addEventListener('input', () => calculateAmount(row, item.price, item.name));

        quantityCell.appendChild(quantityInput);

        amountCell.textContent = '0'; // Initialize amount to 0
    });

    // Add a last row for total
    const totalRow = quantityTable.insertRow(); // Change this line
    const totalLabelCell = totalRow.insertCell();
    const totalQuantityCell = totalRow.insertCell();
    const totalAmountCell = totalRow.insertCell();

    totalLabelCell.textContent = 'Total:';
    totalLabelCell.style.fontWeight = 'bold';
    totalQuantityCell.textContent = totalQuantity;
    totalQuantityCell.style.fontWeight = 'bold';
    totalAmountCell.textContent = `${totalAmount} Cedis`;
    totalAmountCell.style.fontWeight = 'bold';

    function calculateAmount(row, price, itemName) {
        const quantityInput = row.querySelector('input[type="number"]');
        const amountCell = row.querySelector('td:last-child');

        const previousQuantity = parseFloat(quantityInput.getAttribute('data-previous-value')) || 0;
        const previousAmount = parseFloat(amountCell.getAttribute('data-previous-value')) || 0;

        const quantity = parseFloat(quantityInput.value) || 0;
        const amount = quantity * price;

        amountCell.textContent = `${amount} Cedis`;

        // Update total quantity and amount
        totalQuantity = totalQuantity - previousQuantity + quantity;
        totalAmount = totalAmount - previousAmount + amount;

        // Update the total row
        totalQuantityCell.textContent = totalQuantity;
        totalAmountCell.textContent = `${totalAmount} Cedis`;

        // Store current values as previous values for the next input event
        quantityInput.setAttribute('data-previous-value', quantity);
        amountCell.setAttribute('data-previous-value', amount);
    }
}

function showCashReport() {
    // Open the cashReport page in a new tab
    window.open('/cashReport.html', '_blank');
}

async function submitReturns() {
    const date = document.getElementById('date').value;
    const shop = document.getElementById('shop').value;

    const rows = document.querySelectorAll('#returnsForm table tbody tr');
    const data = [];

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
    
        if (cells.length >= 2) {
            const foodItem = cells[0].textContent;
            const quantityInput = cells[1].querySelector('input');
    
            if (quantityInput) {
                const quantity = parseFloat(quantityInput.value) || 0;
                const amount = parseFloat(cells[2].textContent) || 0;
    
                data.push({ foodItem, quantity, amount });
            } else {
                // Handle the case where quantity input is not found
                // console.error(`Row ${rowIndex + 1} does not have a quantity input.`);
            }
        } else {
            // Handle the case where there are not enough cells
            // console.error(`Row ${rowIndex + 1} does not have enough cells. Cells found:`, cells.length);
        }
    });
    
    // Add this console log to check the data before sending
    console.log('Data to be sent:', data);

    try {
        const response = await fetch('/submitReturns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, shop, data }),
        });
    
        if (response.ok) {
            console.log('Returns data submitted successfully');
            showSuccessAlert("Returns data submitted successfully");
        } else {
            console.error('Error submitting returns data:', response.statusText);
        }
    } catch (error) {
        console.error('Error submitting returns data:', error.message);
    }
}

async function submitQuantity() {
    const date = document.getElementById('date').value;
    const shop = document.getElementById('shop').value;

    const rows = document.querySelectorAll('#quantityForm table tbody tr');
    const data = [];

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');

        // Check if there are enough cells (at least 2)
        if (cells.length >= 2) {
            const foodItem = cells[0].textContent;
            const quantityInput = cells[1].querySelector('input');

            // Check if the quantity input exists in the second cell
            if (quantityInput) {
                const quantity = parseFloat(quantityInput.value) || 0;
                const amount = parseFloat(cells[2].textContent) || 0;

                data.push({ foodItem, quantity, amount });
            } else {
                // Handle the case where quantity input is not found
                // console.error(`Row ${rowIndex + 1} does not have a quantity input.`);
            }
        } else {
            // Handle the case where there are not enough cells
            // console.error(`Row ${rowIndex + 1} does not have enough cells. Cells found:`, cells.length);
        }
    });

    // Add this console log to check the data before sending
    console.log('Data to be sent (Quantity):', data);

    const requestBody = {
        shop: shop,
        date: date,
        isReturns: false, // Update this to indicate it's a quantity submission
        data: data.map(item => ({ foodItem: item.foodItem, quantity: item.quantity, amount: item.amount })),
    };

    const url = '/submitQuantity';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.success) {
            console.log('Quantity data submitted successfully');
            showSuccessAlert("Quantity data submitted successfully");
        } else {
            console.error('Failed to submit quantity data');
            // You may want to add logic here to handle failure
        }
    } catch (error) {
        console.error('Error submitting quantity data:', error);
        // You may want to add logic here to handle errors
    }
}

async function submitData(requestBody, url) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.success) {
            console.log('Data submitted successfully');
        } else {
            console.error('Failed to submit data');
            // You may want to add logic here to handle failure
        }
    } catch (error) {
        console.error('Error submitting data:', error);
        // You may want to add logic here to handle errors
    }
}

function printData() {
    const date = document.getElementById('date').value;
    const shop = document.getElementById('shop').value;

    // Fetch data from the server for the selected shop and date
    fetch(`/getData?shop=${shop}&date=${date}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                generatePrintableTable(data.data);
                window.print(); // Open print dialog
            } else {
                console.error('Failed to fetch data for printing');
                // You may want to add a user-friendly error message
            }
        })
        .catch(error => {
            console.error('Error fetching data for printing:', error);
            // You may want to add a user-friendly error message
        });
}

// Function to generate a printable table
async function generatePrintableTable() {
    const date = document.getElementById('date').value;
    const shop = document.getElementById('shop').value;

    try {
        const response = await fetch(`/getPrintableData?date=${date}&shop=${shop}`);
        const result = await response.json();

        if (result.success) {
            const data = result.data;
            const printWindow = window.open('', '_blank');
            const printDocument = printWindow.document;

            // Add styling to the printable table
            printDocument.write('<html><head><title>Printable Table</title>');
            printDocument.write('<style>');
            printDocument.write('table { border-collapse: collapse; width: 100%; }');
            printDocument.write('th, td { border: 1px solid #dddddd; padding: 8px; text-align: left; }');
            printDocument.write('th { background-color: #f2f2f2; }');
            printDocument.write('</style></head><body>');

            // Add shop name and date at the top
            printDocument.write('<div style="text-align: center; margin-bottom: 20px;">');
            printDocument.write(`<h2>Shop: ${shop}</h2>`);
            printDocument.write(`<h2>Date: ${date}</h2>`);
            printDocument.write('</div>');

            // Create a table
            printDocument.write('<table>');

            // Create table header
            printDocument.write('<tr>');
            ['Food Item', 'Quantity', 'Amount', 'Quantity Returned', 'Amount Returned', 'Amount to Receive'].forEach(headerText => {
                printDocument.write(`<th>${headerText}</th>`);
            });
            printDocument.write('</tr>');

            // Populate table with data
            let totalAmount = 0;
            let totalAmountReturned = 0;
            let totalAmountToReceive = 0;

            data.forEach(item => {
                printDocument.write('<tr>');
                ['foodItem', 'quantity', 'amount', 'quantityReturned', 'amountReturned'].forEach(key => {
                    const cellValue = item[key];
                    printDocument.write(`<td>${cellValue}</td>`);

                    // Calculate totals
                    if (key === 'amount') {
                        totalAmount += parseFloat(cellValue);
                    } else if (key === 'amountReturned') {
                        totalAmountReturned += parseFloat(cellValue);
                    }
                });

                // Calculate "Amount to Receive"
                const amountToReceive = item.amount - item.amountReturned;
                totalAmountToReceive += amountToReceive;

                printDocument.write(`<td>${amountToReceive} Cedis</td>`);
                printDocument.write('</tr>');
            });

            // Add total row
            printDocument.write('<tr>');
            printDocument.write('<td>Total</td>');
            printDocument.write(`<td></td><td>${totalAmount.toFixed(2)} Cedis</td>`);
            printDocument.write(`<td></td><td>${totalAmountReturned.toFixed(2)} Cedis</td>`);
            printDocument.write(`<td>${totalAmountToReceive.toFixed(2)} Cedis</td>`);
            printDocument.write('</tr>');

            // Close the table and the body
            printDocument.write('</table></body></html>');

            printWindow.document.close();
        } else {
            console.error('Failed to fetch printable data:', result.message);
        }
    } catch (error) {
        console.error('Error fetching printable data:', error.message);
    }
}

function showSuccessAlert(message) {
    const alertContainer = document.getElementById('alertContainer');

    if (alertContainer) {
        // Create a div for the alert
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('success-alert');

        // Set the alert message
        alertDiv.textContent = message;

        // Append the alert to the container
        alertContainer.appendChild(alertDiv);

        // Automatically remove the alert after a few seconds (adjust the timeout as needed)
        setTimeout(() => {
            alertContainer.removeChild(alertDiv);
        }, 4000); // 5000 milliseconds (5 seconds)
    }
}

