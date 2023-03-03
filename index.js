const express = require('express')
const app = express()
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.json());

// solves CORS issue that frond and back on one origin
app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.contentType('application/json');
    next();
  });
  
// all the routes are in external file
const routes = require('./routes/index.js')
app.use('/api', routes)

// production settings
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('/build'));
    app.get('*', (req, res) => {
        res.sendFile('index.html');
    });
}

// Start the server and connect to MongoDB
const start = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://vdafeider:vdafeider@cluster0.scevpep.mongodb.net/?retryWrites=true&w=majority"
        );
        if (mongoose.connection.readyState == 1) { 
            console.log('DB connected') 
        } else { 
            console.log('DB connection troubles') 
        };
        app.listen(port, () => console.log(`Server in devmode started on port ${port}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();