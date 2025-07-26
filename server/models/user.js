const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username:String,
  email:String,
  password:String,
  bio:String,
  posts:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'post'
  },
},{
  timestamps:true
})

module.exports = mongoose.model('User',userSchema);