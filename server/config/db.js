const mongoose = require('mongoose');
require('dotenv').config();

const db = () =>{
  mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    console.log('Connected to MongoDB')
  })
  .catch(()=>{
    console.log('Error connecting to MongoDB')
  })
}

module.exports = db;