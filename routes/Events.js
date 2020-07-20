
const express = require('express');
const router = express.Router();
const EventsModel = require('../models/Eventsmodel');

router.post(
    '/',
    (req, res) => {

        const formData = {
            community: req.body.community,
            description: req.body.description,
            city: req.body.city,
            eventdate: req.body.eventdate,
            members: req.body.members
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

module.exports = router