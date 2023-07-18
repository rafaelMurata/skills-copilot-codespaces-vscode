// Create web server
// 
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use public folder to serve static files
app.use(express.static(path.join(__dirname, "./client/static")));

// set up views folder and ejs
app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

// connect to mongoose
mongoose.connect('mongodb://localhost/animal_dashboard');

// define animal schema
var AnimalSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"], minlength: 2 },
    type: { type: String, required: [true, "Type is required"], minlength: 2 },
    description: { type: String, required: [true, "Description is required"], minlength: 2 },
    likes: { type: Number, required: true }
}, { timestamps: true });

// set our models by passing them their respective Schemas
mongoose.model('Animal', AnimalSchema);

// store our models in variables
var Animal = mongoose.model('Animal');

// root route to render the index.ejs view
app.get('/', function (req, res) {
    // get all animals from db
    Animal.find({}, function (err, animals) {
        // console.log(animals);
        if (err) {
            console.log("Error finding all animals");
            res.render('index', { errors: animals.errors });
        } else {
            console.log("Successfully found all animals");
            res.render('index', { animals: animals });
        }
    });
});

// route to create animal
app.post('/animals', function (req, res) {
    console.log("POST DATA", req.body);
    // create a new animal with req.body
    var animal = new Animal(req.body);
    // save new animal to db
    animal.save(function (err) {
        if (err) {
            console.log("Error saving animal");
            res.render('index', { errors: animal.errors });
        } else {
            console.log("Successfully saved animal");
            res.redirect('/');
        }
    });
});