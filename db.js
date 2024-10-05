const mongoose = require("mongoose");
const mongoUrl = "mongodb+srv://aziz_7477:aziz_7477@cluster0.ahfgjpj.mongodb.net/Myntra?retryWrites=true&w=majority&appName=Cluster0"
const mongoDB = async () => {
    try {
        await mongoose.connect(mongoUrl)
        console.log("Connected to MongoDB");
        const fetchProductData = await mongoose.connection.db.collection("Products_Data").find({}).toArray();
        global.products = fetchProductData;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

module.exports = mongoDB;
