const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbConfig.file);
 
db.serialize(function() {
  db.run("CREATE TABLE packages (name TEXT)");
  db.run("CREATE TABLE ratings (package_id INT, timestamp Date, rating REAL)");
 
  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();
 
  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});
 
//db.close();

// define a simple route
app.get('/', (req, res) => {
    var json = {"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."};
    json.db = [];
    console.log("here");
    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        json.db[row.id] = row.id + ": " + row.info;
        console.log("rows");
    }, (err, count) => {
        res.json(json);    
    });
    console.log("there");

    //res.json(json);
    // res.json(
    //     {"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes.", "dbs" : [

    //     ]}
    // );    
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});