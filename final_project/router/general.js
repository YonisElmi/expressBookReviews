const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1 & Task 10: Get the book list available in the shop using Async-Await
public_users.get('/', async function (req, res) {
  try {
    let getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    
    let allBooks = await getBooks;
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.toString() });
  }
});

// Task 2 & Task 11: Get book details based on ISBN using Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    let getBookByIsbn = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });

    let bookDetails = await getBookByIsbn;
    return res.status(200).send(JSON.stringify(bookDetails, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});
   
// Task 3 & Task 12: Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    let getBooksByAuthor = new Promise((resolve, reject) => {
      let filteredBooks = [];
      let keys = Object.keys(books);

      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          filteredBooks.push(books[key]);
        }
      });

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("Author not found");
      }
    });

    let authorBooks = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(authorBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 4 & Task 13: Get all books based on title using Async-Await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    let getBooksByTitle = new Promise((resolve, reject) => {
      let filteredBooks = [];
      let keys = Object.keys(books);

      keys.forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          filteredBooks.push(books[key]);
        }
      });

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("Title not found");
      }
    });

    let titleBooks = await getBooksByTitle;
    return res.status(200).send(JSON.stringify(titleBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
