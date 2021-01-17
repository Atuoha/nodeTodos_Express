const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({

    fullname:{
        type: String
    },

    email:{
        type: String
    },

    password:{
        type: String
    },

    status:{
        type: String,
        default: 'active'
    },

    file:{
        type: String
    },

    phone:{
        type: String
    },

    role:{
        type: String,
        default: 'Subscriber'
    }
})    


module.exports = mongoose.model('users', userSchema);