const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = "s3cr3t100";
const passport = require('passport');
const cloudinary = require('cloudinary');
const { route } = require('./Products');

const UsersModel = require('../models/UsersModel');

// /register
router.post(
    '/register',     // http://localhost:8080/users/register
    (req, res) => {
        const formData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
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
            email: req.body.email,
            password: req.body.password
        }


        // Step 2a. In database, find account that matches email
        UsersModel.findOne(
            {email: formData.email},
            (err, document) => {

                // Step 2b. If email NOT match, reject the login request
                if(!document) {
                    res.json({message: "Please check email or password"});
                }

                // Step 3. If there's matching email, examine the document's password
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
                                    email: document.email
                                };

                                jwt.sign(
                                    payload,
                                    secret,
                                    (err, jsonwebtoken) => {
                                        res.json(
                                            {
                                                message: 'Login successful',
                                                jsonwebtoken: jsonwebtoken
                                            }
                                        )
                                    }
                                )

                            }

                            // Step 5b. If password NOT match, reject login request
                            else {
                                res.json({message: "Please check email or password"})
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
            _id: req.body._id,
            firstName: req.body.firstName      
        };

        UsersModel
        .findOneAndUpdate(
            { _id: formData._id }, // search criteria
            { firstName: formData.firstName}, // the keys & values to update
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



router.post("/ProfilePage", (req, res) => {
    
    const user = req.user._id;
    console.log(user)
    
    const formData = {
        dateOfBirth: req.body.dateOfBirth,
        occupation: req.body.occupation,
        basedIn: req.body.basedIn,
        nationality: req.body.nationality,
        interests: req.body.interests
    };
  
    // console.log("From the user", formData);
  
        UsersModel.updateMany({_id: user}, {$push: 
            {
            dateOfBirth:    formData.dateOfBirth,
            occupation:     formData.occupation,
            basedIn:        formData.basedIn,
            nationality:    formData.nationality,
            interests:      [formData.interests]   
        }
    },(err,result)=>{
                    if(err) {
                        console.log("there is an error",err)
            
                    }
                    else {console.log("success!",result)}  
               
                                   
                }

            );
            res.json("Your data has been saved!")

        }
    )
    
    router.get(
        '/',
        (req, res)=>{
    
            // (1) Fetch all the documents using .find()
            UsersModel.find()
    
            // (2) Once the results are ready, use .json() to send the results
            .then(
                (results) => {
                    // res.json = res.send() + converts to JSON
                    res.json({user: results})
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
