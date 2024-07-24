const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://elliott:999@kenkey-sales-app.2hmrfsj.mongodb.net/kenkey-sales-app?retryWrites=true&w=majority";

// Middleware to parse JSON data
app.use(bodyParser.json());

// Endpoint to submit quantity data
app.post('/submitQuantity', async (req, res) => {
    await handleSubmission(req, res, false);
});

// Endpoint to submit returns data
app.post('/submitReturns', async (req, res) => {
    await handleSubmission(req, res, true);
});

// Common function to handle data submission
async function handleSubmission(req, res, isReturns) {
    const { shop, date, data } = req.body;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, ssl: true, tls: true });

    try {
        await client.connect();
        const database = client.db('kenkey-sales-app');
        const collection = database.collection(shop);

        // Check if a document with the given date already exists
        const existingDocument = await collection.findOne({ date: date });

        if (existingDocument) {
            // If the document exists, update it with the new data
            const updatedData = existingDocument.data.map(existingItem => {
                const matchingReturnItem = data.find(returnItem => returnItem.foodItem === existingItem.foodItem);

                if (isReturns) {
                    // Update for returns submission
                    return {
                        ...existingItem,
                        quantityReturned: matchingReturnItem ? matchingReturnItem.quantity : 0,
                        amountReturned: matchingReturnItem ? matchingReturnItem.amount : 0,
                    };
                } else {
                    // Update for quantity submission
                    return {
                        ...existingItem,
                        quantity: matchingReturnItem ? existingItem.quantity + matchingReturnItem.quantity : existingItem.quantity,
                        amount: matchingReturnItem ? existingItem.amount + matchingReturnItem.amount : existingItem.amount,
                    };
                }
            });

            await collection.updateOne({ date: date }, { $set: { data: updatedData } });
        } else {
            // If the document doesn't exist, insert a new one
            const newData = data.map(returnItem => {
                if (isReturns) {
                    // Insert for returns submission
                    return {
                        foodItem: returnItem.foodItem,
                        quantity: 0,
                        amount: 0,
                        quantityReturned: returnItem.quantity,
                        amountReturned: returnItem.amount,
                    };
                } else {
                    // Insert for quantity submission
                    return {
                        foodItem: returnItem.foodItem,
                        quantity: returnItem.quantity,
                        amount: returnItem.amount,
                        quantityReturned: 0,
                        amountReturned: 0,
                    };
                }
            });

            await collection.insertOne({ date: date, data: newData });
        }

        res.json({ success: true, message: 'Data submitted successfully' });

        // If it's returns, also query and log data from the database
        if (isReturns) {
            const result = await collection.find({ date: date }).toArray();
            console.log('Data from the database for Shop:', shop, 'Date:', date);
            console.log(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}


// Helper function to process data for the cash report
function processDataForCashReport(data) {
    const cashReportData = [];

    data.forEach(item => {
        const processedData = item.data.map(foodItem => ({
            foodItem: foodItem.foodItem,
            quantity: foodItem.quantity || 0,
            quantityReturned: foodItem.quantityReturned || 0,
            amount: foodItem.amount || 0,
            amountReturned: foodItem.amountReturned || 0,
        }));

        cashReportData.push({ date: item.date, data: processedData });
    });

    return cashReportData;
}




// Add a new endpoint for cash report
app.get('/getCashReport', async (req, res) => {
    const { shop, startDate, endDate } = req.query;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, ssl: true, tls: true });

    try {
        await client.connect();
        const database = client.db('kenkey-sales-app');

        // Log the available collections
        const collections = await database.listCollections().toArray();
        console.log('Available Collections:', collections.map(col => col.name));

        // Determine the collection based on the user's shop selection
        let collection;
        if (shop === 'all') {
            // If 'all' is selected, fetch data from all collections
            const allData = await Promise.all(collections.map(async col => {
                const data = await database.collection(col.name).find().toArray();
                console.log(`Raw Data from ${col.name}:`, data);
                const filteredData = data.filter(item => item.date >= startDate && item.date <= endDate);
                console.log(`Filtered Data from ${col.name}:`, filteredData);
                return { date: filteredData[0].date, data: filteredData };
            }));

            console.log('All Data:', allData);
            res.json({ success: true, data: allData });
            return;
        } else {
            // If a specific shop is selected, fetch data from that collection
            collection = database.collection(shop);
        }

        // Retrieve data based on the filter
        const rawResult = await collection.find().toArray();
        console.log(`Raw Data from ${shop}:`, rawResult);
        const result = rawResult.filter(item => item.date >= startDate && item.date <= endDate);
        console.log(`Filtered Data from ${shop}:`, result);

        // Process the data to generate the required format for the cash report
        const cashReportData = processDataForCashReport(result);

        res.json({ success: true, data: cashReportData });
    } catch (error) {
        console.error('Error fetching cash report:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

// Add a new endpoint to retrieve printable data
app.get('/getPrintableData', async (req, res) => {
    const { date, shop } = req.query;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, ssl: true, tls: true });

    try {
        await client.connect();
        const database = client.db('kenkey-sales-app');
        const collection = database.collection(shop);

        const result = await collection.findOne({ date: date });

        if (result) {
            res.json({ success: true, data: result.data });
        } else {
            res.json({ success: false, message: 'No data found for the selected date and shop' });
        }
    } catch (error) {
        console.error('Error fetching printable data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


// Endpoint to submit quantity data
app.post('/submitQuantity', async (req, res) => {
    await handleSubmission(req, res, false);
});

// Endpoint to submit returns data
app.post('/submitReturns', async (req, res) => {
    await handleSubmission(req, res, true);
});

// Endpoint to get data for printing
app.get('/getData', async (req, res) => {
    const { shop, date } = req.query;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, ssl: true, tls: true });

    try {
        await client.connect();
        const database = client.db('kenkey-sales-app');
        const collection = database.collection(shop);

        // Retrieve data for the selected shop and date
        const result = await collection.findOne({ date: date });

        if (result) {
            res.json({ success: true, data: result.data });
        } else {
            res.json({ success: false, message: 'No data found for the selected shop and date' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

// Middleware to serve static files (e.g., CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to handle root route and serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
