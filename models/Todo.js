const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    URLSlugs = require('mongoose-url-slugs');


const todoSchema = new Schema({

    subject:{
        type: String
    },

    slug:{
        type: String
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    file:{
        type: String
    },

    note:{
        type: String
    },

    status:{
        type: Boolean,
        default: true
    },

    completion_status:{
        type: Boolean,
        default: false
    },

    date:{
        type: Date
    }
})    


todoSchema.plugin(URLSlugs('subject', {field: 'slug'})) //
module.exports = mongoose.model('todos', todoSchema)