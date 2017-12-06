var express = require('express');
var app = express();
var fs = require("fs");

var path = require("path");
var bodyParser = require("body-parser");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post("/saveSkeptCha", function(req, res){
    console.info("Submitting POST Request to Server");
    // console.info("Request body: " + JSON.stringify(req.body));
    var sketch = JSON.parse(JSON.stringify(req.body));
    // console.info(sketch);

    var name = '../Data/Sketch_Triangle/' + sketch.id + '.json';

    //write the file
    fs.writeFile(name, JSON.stringify(req.body), 
    function(err){
        if(err){
            console.error(err); //print out the error in case there is one
            return res.status(500).json(err);
        }

        //resolve the request with the client
        console.info("Added sketch " + name + " to Database");
        res.send();
    });

    // Append entry to corresponding index File
    var fname = require('../Data/Triangle.json');
    var indexFile = JSON.parse(JSON.stringify(fname));
    // console.info(indexFile);
    indexFile.push(sketch.id);
    fs.writeFile('../Data/Triangle.json', JSON.stringify(indexFile),  function(err) {
    	if(err) {
            console.error(err); //print out the error in case there is one
            return res.status(500).json(err);
        }
    });
    delete require.cache[require.resolve('../Data/Triangle.json')];
})

app.listen(3000, function() {
    console.log('listening on port 3000');
})