// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const Scheme = mongoose.Schema;

const userSchema = new Scheme({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
},
{
    timestamp: true,
});

const User = mongoose.model('User', userSchema);
// module.exports = User;
export default User;