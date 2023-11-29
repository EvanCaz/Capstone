const cs = "mongodb+srv://evan:BigMistake@cluster.0b689p3.mongodb.net/?retryWrites=true&w=majority";

const {MongoClient} = require('mongodb');
const client = new MongoClient(cs);
const express = require('express');

let db;
let books;
var app = express();
app.use(express.json());

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === "OPTIONS") res.sendStatus(200);
    else next();
    });

async function start(){
    const client = new MongoClient(cs);
    await client.connect();
    db = client.db('DB1');
    books = db.collection('Capstone'); 
    console.log("Connected to database");
    app.listen(3000);
}
 // need the standard functions to handle server requests and update the monogo server
 app.get('/books', (req, res) => {
    let status = req.query.avail === "true";
    let projection = { title: 1, id: 1, _id:0, author:1 }; // Include only title and id fields
    if (req.query.avail === undefined) {
        books.find({}, { projection }).toArray().then(books => res.json(books));
    } else {
        books.find({ avail: status }, { projection }).toArray().then(books => res.json(books));
    }
    //console.log("Returning books");
});

app.put('/books/:id', (req, res) => {
    let newbook = req.body;
    books.updateOne({ id: req.params.id }, { $set: newbook }).then(result => {
        res.status(result.modifiedCount > 0 ? 200 : 404).json(result.modifiedCount > 0 ? "Book updated" : "Book not found");
    });
});


start();