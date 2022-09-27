const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdBy:{
        type:String,
        required:true
    },
    targets:{
        type:[Object], 
        required:true
    },
    rolls:{
        type:[String], 
        required:true   
    }
})
module.exports = mongoose.model('Notice',noticeSchema)