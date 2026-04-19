const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// =========================
// TASK 6: REGISTER USER
// =========================
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users[username]) {
        return res.status(400).json({ message: "User already exists" });
    }

    users[username] = password;

    return res.status(200).json({ message: "User registered successfully" });
});


// =========================
// TASK 1: GET ALL BOOKS
// =========================
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});


// =========================
// TASK 2: GET BY ISBN
// =========================
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.send(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


// =========================
// TASK 3: GET BY AUTHOR
// =========================
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = {};

    for (let isbn in books) {
        if (books[isbn].author === author) {
            result[isbn] = books[isbn];
        }
    }

    if (Object.keys(result).length > 0) {
        return res.send(result);
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});


// =========================
// TASK 4: GET BY TITLE
// =========================
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = {};

    for (let isbn in books) {
        if (books[isbn].title === title) {
            result[isbn] = books[isbn];
        }
    }

    if (Object.keys(result).length > 0) {
        return res.send(result);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});


// =========================
// TASK 5: GET REVIEWS
// =========================
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.send(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;