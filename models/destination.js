const mongoose = require('mongoose');


const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    peopleLooking: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    placeImage: {
        type: String,
    },
    // purpose: {
    //     type: String,
    //     required: true,
    // },

    addedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        userProfileImage: 
            {
                type: String,
            },
        
    },
    members: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            userName: {
                type: String,
                required: true,
            },
            memberDateOfBirth: {
                type: Date,

            },
            memberProfileImage: {
                type: String,
                
            },
            status: {
                type: String,
                enum: ['Pending', 'Accepted'],
                default: 'Pending',
            },
        },
    ],
});


module.exports = mongoose.model('Destination', destinationSchema);
