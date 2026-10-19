const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid (does it already exist?)
const isValid = (username) => {
  let filteredusers = users.filter((user) => user.username === username);
  return filteredusers.length > 0;
}

// Check if username and password match the ones in records
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => user.username === username && user.password === password);
  return validusers.length > 0;
}

// Task 7: Only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({ message: "Review content cannot be empty" });
  }

  if (books[isbn]) {
    let bookReviews = books[isbn].reviews;
    bookReviews[username] = review;
    // Return both the message and the updated reviews object
    return res.status(200).json({ message: "The review was successfully added/updated.", reviews: bookReviews });
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    let bookReviews = books[isbn].reviews;
    if (bookReviews[username]) {
      delete bookReviews[username];
      return res.status(200).json({ message: "Review successfully deleted." });
    } else {
      return res.status(404).json({ message: "Review by the current user not found for this book." });
    }
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
