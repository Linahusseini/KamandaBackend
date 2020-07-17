
const mongoose = require('mongoose');


const ProductsSchema = new mongoose.Schema(
    {
        price: {
            type: Number,
            required: true
        },

        description: {
            type: String,
        },
        image: {
            type: String,
        }

    }
);


const ProductsModel = mongoose.model('products', ProductsSchema);
module.exports = ProductsModel;