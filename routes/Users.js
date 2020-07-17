const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = "s3cr3t100";

const UsersModel = require('../models/UsersModel');

// /register
router.post(
    '/register',     // http://localhost:8080/users/register
    (req, res) => {
        const formData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,  
            password: req.body.password
        };
        console.log(formData)

        // Step 1) Generate a salt
        bcrypt.genSalt(
            (err, salt) => {

                // Step 2) Generate a hash
                bcrypt.hash(
                    formData.password, // first ingredient
                    salt, // second ingredient
                    (err, hashedPassword) => {

                        const newUsersModel = new UsersModel(formData);

                        // Step 3) Replace the original password with hash
                        newUsersModel.password = hashedPassword;

                        // Step 4) Save user data to database (with encrypted password)
                        newUsersModel.save(
                            (err, dbResult) => {

                                // If something goes wrong, send error
                                if(err) {
                                    res.json(err);
                                }
                                // Otherwise, send success message
                                else {
                                    res.json("User has been saved");
                                }
                            }
                        );

                    }
                )
            }
        );
    }
);

// /login
router.post(
    '/login',
    (req, res) => {

        // npm packages: passport, passport-jwt, jsonwebtoken

        // Step 1. Capture formData (email & password)
        const formData = {
            username: req.body.username,
            password: req.body.password
        }
        // Step 2a. In database, find account that matches email
        UsersModel.findOne(
            {username: formData.username},
            (err, document) => { 
                console.log(document);

                // Step 2b. If username NOT match, reject the login request
                if(!document) { 
                    res.json("Please check username or password");
                }

                // Step 3. If there's matching username, examine the document's password
                else {

                    // Step 4. Compare the encrypted password in db with incoming password
                    bcrypt.compare(formData.password, document.password)
                    .then(
                        (isMatch) => {

                            // Step 5a. If the password matches, generate web token (JWT)
                            if(isMatch === true) {
                                // Step 6. Send the JWT to the client
                                const payload = { 
                                    id: document.id,
                                    username: document.username
                                };

                                jwt.sign(
                                    payload,
                                    secret,
                                    (err, jsonwebtoken) => {
                                        res.json(
                                            {
                                                msg: 'Login successful',
                                                jsonwebtoken: jsonwebtoken
                                            }
                                        )
                                    }
                                )

                            }

                            // Step 5b. If password NOT match, reject login request
                            else {
                                res.json("Please check username or password")
                            }
                        }
                    )
                }
                

            }
        )
    }
)


router.post(
    '/update',
    (req, res) => {
        const formData = {
            username: req.body.username,
            _id: req.body._id,
            lastName: req.body.lastName,
            firstName: req.body.firstName
        };

        UsersModel
        .findOneAndUpdate(
            { _id: formData._id }, // search criteria
            { firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
             }, // the keys & values to update
            {}, // options (if any)
            (err, document) => {

                if(err) {
                    console.log(err);
                } else {
                    res.json(
                        {
                            message: 'User updated',
                            document: document
                        }
                    )
                }
            }
        )
    }
);


module.exports = router;
