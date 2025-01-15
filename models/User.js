const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character']
    },
    role: {
        type: String,
        enum: ['user', 'admin'], //allow user or admin roles
        default: 'user',
    }, 
    isVerified: {
        type: Boolean,
        default: false  
    },
    image: {
        type: String,
        default: null,
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);