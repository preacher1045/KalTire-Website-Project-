const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            reqiured: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },
        firebaseUid: {
            type: String,
            required: true
        }
    },
    {
        Timestamps: true
    }
);

const User = mongoose.model("User", UserSchema);

module.exports = User