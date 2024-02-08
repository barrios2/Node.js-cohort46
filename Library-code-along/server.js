'use strict'

const express = require('express');
const { v4: uuidv4 } = require('uuid'); // to generate a unique universal ID 

const app = express();

app.use(express.json()); // for parsing json in request body

const data = require('./books.json'); // to retrieve local library

app.get('/books', function (req, res) { readBooks(req, res); })
app.post('/books', function (req, res) { createBook(req, res); })
app.put('/books/:id', function (req, res) { updateBook(req, res); })
app.delete('/books/:id', function (req, res) { deleteBook(req, res); })

function deleteBook(req, res) {
  const bookToDelete = data.find(book => book.id == req.params.id); // to find book ID
  // checking if book exists
  if ( typeof bookToDelete == 'undefined' ) {
    res.status(404);
    res.send('Book not found!');
    res.end();
    return;
  }
  data.splice(data.indexOf(bookToDelete), 1) // splice method to delete 1 elem & indexOf to select book by ID
  res.send('ok');
}

function updateBook(req, res) {
  if ( isInvalid(req) ) {
      res.status(400);
      res.send('invalid request');
      return;
  }
  const bookToUpdate = data.find(book => book.id == req.params.id); // to find book ID
  // checking if book exists
  if ( typeof bookToUpdate == 'undefined' ) {
    res.status(404);
    res.send('Book not found!');
    return;
  }
  bookToUpdate.title = req.body.title;
  bookToUpdate.author = req.body.author;
  res.send('ok');
}

function createBook(req, res) {
  if ( isInvalid(req) ) {
      res.status(400);
      res.send('invalid request');
      return;
  }
  const id = uuidv4(); // to generate universal unique ID
  let newBook = {
    id: id,
    title: req.body.title,
    author: req.body.author
  }
  data.push(newBook);
  res.status(201); // created status
  res.send(id);
}

function readBooks(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(data);
}

function isInvalid(req) {
  if ( typeof req.body == 'undefined' ||
       typeof req.body.title == 'undefined' ||
       typeof req.body.author == 'undefined' ) {
      return true;
  } else {
      return false;
  }
}
app.listen(3000)