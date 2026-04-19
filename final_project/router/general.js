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
public_users.get('/', async function (req, res) {
    try {
        let getBooks = new Promise((resolve, reject) => {
            if (books) resolve(books);
            else reject("No books found");
        });

        let result = await getBooks;
        return res.send(JSON.stringify(result, null, 4));
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});


// =========================
// TASK 2: GET BY ISBN
// =========================
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        let getBook = new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        });

        let result = await getBook;
        return res.send(result);

    } catch (err) {
        return res.status(404).json({ message: err });
    }
});


// =========================
// TASK 3: GET BY AUTHOR
// =========================
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        let getBooksByAuthor = new Promise((resolve, reject) => {
            let result = {};

            for (let isbn in books) {
                if (books[isbn].author === author) {
                    result[isbn] = books[isbn];
                }
            }

            if (Object.keys(result).length > 0) resolve(result);
            else reject("No books found for this author");
        });

        let result = await getBooksByAuthor;
        return res.send(result);

    } catch (err) {
        return res.status(404).json({ message: err });
    }
});


// =========================
// TASK 4: GET BY TITLE
// =========================
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        let getBooksByTitle = new Promise((resolve, reject) => {
            let result = {};

            for (let isbn in books) {
                if (books[isbn].title === title) {
                    result[isbn] = books[isbn];
                }
            }

            if (Object.keys(result).length > 0) resolve(result);
            else reject("No books found with this title");
        });

        let result = await getBooksByTitle;
        return res.send(result);

    } catch (err) {
        return res.status(404).json({ message: err });
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