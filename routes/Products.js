// Import express into the file
const express = require('express');
const router = express.Router();
const ProductsModel = require('../models/ProductsModel');


// POST route for creating product
router.post(
    '/',        // http://localhost:8080/GearBoutique
    (req, res)=>{
        // Capture the form data
        const formData = {

            price: req.body.price,
            description: req.body.description,
            image: req.body.image

        }

        // Instantiate the ProductsModel
        const newProductsModel = ProductsModel(formData);
        newProductsModel.save();

        res.send('Product has been saved!');
    }
);


// POST route to update product
router.post(
    '/update',
    (req, res) => {
        const formData = {
            price: req.body.price,
            _id: req.body._id
        };

        ProductsModel
        .findOneAndUpdate(
            { _id: formData._id }, // search criteria
            { price: formData.price }, // the keys & values to update
            {}, // options (if any)
            (err, document) => {

                if(err) {
                    console.log(err);
                } else {
                    res.json(
                        {
                            message: 'Product updated',
                            document: document
                        }
                    )
                }
            }
        )
    }
);


router.get(
    '/',
    (req, res)=>{

        ProductsModel.find()

        .then(
            (results) => {
     
                res.json({products: results})
            }
        )
        .catch( 
            (e)=> {
                console.log('error occured', e)
            }
        );

    }
);

module.exports = router;