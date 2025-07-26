const express = require('express');
const app = express();
const db = require('./config/db');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
db();
require('dotenv').config();
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const commentRoutes = require('./routes/commentRoutes');
app.use('/api', commentRoutes);
app.use('/api',authRouter);
app.get("/",(req,res)=>{
  res.send("Hello")
})


module.exports = app;