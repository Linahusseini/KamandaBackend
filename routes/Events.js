
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const EventsModel = require('../models/Eventsmodel');

router.post(
    '/',
    (req, res) => {

        const formData = {
            community: req.body.community,
            description: req.body.description,
            city: req.body.city,
            eventdate: req.body.eventdate,
            members: req.body.members,
            joined: req.body.joined
        }

        const newEventsModel = EventsModel(formData);
        newEventsModel.save();

        res.send ({message: 'Event has been saved!'});
    }
)

router.post(
    '/update',
    (req, res) => {
        const formData = {
            description: req.body.description,
            _id: req.body._id
        };

        EventsModel
        .findOneAndUpdate(
            { _id: formData._id }, // search criteria
            { description: req.body.description }, // the keys & values to update
            {}, // options (if any)
            (err, document) => {

                if(err) {
                    console.log(err);
                } else {
                    res.json(
                        {
                            message: 'Event description updated',
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

        // (1) Fetch all the documents using .find()
        EventsModel.find()

        // (2) Once the results are ready, use .json() to send the results
        .then(
            (results) => {
                // res.json = res.send() + converts to JSON
                res.json({events: results})
            }
        )
        .catch( 
            (e)=> {
                console.log('error occured', e)
            }
        );

    }
);

router.post(
    '/join',
    (req, res) => {

        const formData = {
            eventId: req.events.ObjectId,
            userId: req.users.ObjectId,
        };

        EventsModel.findOne (
            { "_id": formData.eventId },           
            function ( err, foundEvent ) {

                if (err) {

                    console.log(err);

                } else {
                    if (!foundEvent) {

                        res.send("Event not found");

                    } else {

                        if (foundEvent.joined.includes(formData.userId)){

                            EventsModel.update(
                                {"_id" : mongoose.Types.ObjectId(formData.eventId)},
                                {$pull: { "joined" : [mongoose.Types.ObjectId(formData.userId)]}},
                                (err, res) => {
                                    if (err) {
                                        console.log("not updated")
                                    }
                                    else{
                                       console.log("Updated");
                                    }
                                }
                            );
                        }
                        else {

                            EventsModel.update(
                                {"_id" : mongoose.Types.ObjectId(formData.eventId)},
                                {$push: { "joined" : [mongoose.Types.ObjectId(formData.userId)]}},
                                (err, res) => {
                                    if (err) {
                                        console.log("not updated")
                                    }
                                    else{
                                       console.log("Updated");
                                    }
                                }
                            );

                        }

                    }
                }
            }
        )
        
    }
    
)

module.exports = router