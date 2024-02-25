const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const { Organization, Item } = require('./models/model');

const PORT = 4500;
const DATABASE_URL = "mongodb+srv://vishnumothukuru:foodie123@cluster0.pu7yxkg.mongodb.net/foodie?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("*"));

// DATABASE CONNECTION
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log('db error', error);
});

const calculateTotalPrice = async (organizationId, itemId, zone , totalDistance) => {
    try {
        // check organizationId validation
        let organization = await Organization.findOne({organizationId})
        if(!organization){
            return 'Organization is not found'
        }
        let item = await Item.findOne({itemId});
        if(!item){
            return 'Item is not found'
        }
       
        let baseDistanceInKm = 5;
        const perKmPrice = item.itemType.toLowerCase() === 'perishable' ? 1.5 : 1;
        const fixedPrice = 10;

        const totalDistanceBeyondBase = Math.max(0, totalDistance - baseDistanceInKm);
        const totalPriceCents = Math.round(fixedPrice * 100 + totalDistanceBeyondBase * perKmPrice * 100);
        return totalPriceCents / 100;
    } catch (error) {
        console.error('Error calculating total price:', error.message);
    }
};

app.post('/register', async (req, res) => {
    try {
        const { organizationId, organizationName } = req.body;
        console.log(organizationId , organizationName);
        let exists = await Organization.findOne({ organizationId })
        console.log(exists)
        if (exists) {
            return res.status(400).json({ message: 'Organization already exists' })
        }
        else {
            let newOrganization = new Organization({
                organizationId,
                organizationName
            })
            await newOrganization.save();
            return res.status(200).json({ message: 'Registerd successfully' })
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

app.post('/add-item', async (req, res) => {
    try {
        const { itemId, itemType , itemDescription } = req.body;
        console.log(itemId)
            let newItem = new Item({
                itemId,
                itemType,
                itemDescription
            })
            await newItem.save();
            return res.status(200).json({ message: 'item added successfully'})
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

app.post('/total-price', async (req, res) => {
    try {
        const { organizationId, itemId, zone, totalDistance } = req.body;
        if (organizationId) {
            const totalPrice = await calculateTotalPrice(organizationId ,itemId, zone, totalDistance);
            return res.status(200).json({ totalPrice });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

