import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

const app = express();

//DB config
const db = require('../../.env').mongoURI;

//Connect to MongoDB
mongoose.connect(db)
    .then(()=> console.log('MongoDB is now connected'))
    .catch(err => console.log(err));

// Defining public path (relative path)
const publicPath = path.resolve(__dirname, '..', '..', 'public');
app.use(express.static(publicPath));

// Simply logging to console
app.listen(3000, () => {
    console.log(`MERN Boilerplate listening on port 3000`);
});