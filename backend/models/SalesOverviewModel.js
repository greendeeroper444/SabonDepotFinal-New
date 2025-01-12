const mongoose = require('mongoose');

const TotalSaleSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    totalProduct: {
        type: Number,
        default: 0,
    },
    totalSales: {
        type: Number,
        default: 0,
    },
    quantitySold: {
        type: Number,
        default: 0,
    },
    day: {
        type: Date,
        required: true,
        // remove unique here if you want to allow multiple records for the same day and product
    },
}, { timestamps: true });


const BestSellingSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    totalProduct: {
        type: Number,
        default: 0,
    },
    totalSales: {
        type: Number,
        default: 0,
    },
    quantitySold: {
        type: Number,
        default: 0,
    },
    sizeUnit: {
        type: String, 
    },
    productSize: {
        type: String,
    },
    lastSoldAt: {
        type: Date,
    },
}, {timestamps: true});

const TotalSaleModel = mongoose.model('TotalSale', TotalSaleSchema)
const BestSellingModel = mongoose.model('BestSelling', BestSellingSchema)

module.exports ={ 
    TotalSaleModel,
    BestSellingModel
}
