
const mongoose = require('mongoose');

const EventsSchema = new mongoose.Schema(
    {
        community: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        eventdate: {
            type: Date,
            required: true
        },
        members: {
            type: Number,
        },
        joined: {
            type: Array
        }
    }
);

const EventsModel = mongoose.model ('events', EventsSchema);
module.exports = EventsModel;