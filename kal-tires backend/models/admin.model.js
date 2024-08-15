const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            require: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            require: [true]
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

const Admin = mongoose.model("admin", AdminSchema)

module.exports = Admin;