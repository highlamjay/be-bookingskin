const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const routes = require('./routes');  
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
  
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);

mongoose.connect(process.env.MONGO_URI)
    .then(()=> {
        console.log('Database connection successful!')
    })
    .catch((err) => {
        console.error('Database connection error:', err)
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})