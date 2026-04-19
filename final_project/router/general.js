const express = require('express');
const axios = require('axios');

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = "http://localhost:5000/books";


// =========================
// TASK 6: REGISTER
// =========================
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (users[username]) {
        return res.status(400).json({ message: "User already exists" });
    }

    users[username] = password;

    return res.json({ message: "User registered successfully" });
});


// =========================
// TASK 10: GET ALL BOOKS (AXIOS)
// =========================
public_users.get('/', async function (req, res) {
    try {
        let response = await axios.get(BASE_URL);
        return res.json(response.data);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});


// =========================
// TASK 11: GET BY ISBN (AXIOS)
// =========================
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        let response = await axios.get(BASE_URL);
        let booksData = response.data;

        let book = booksData[req.params.isbn];

        if (book) {
            return res.json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }

    } catch (err) {
        return res.status(500).json({ message: "Error fetching book" });
    }
});


// =========================
// TASK 12: GET BY AUTHOR (AXIOS)
// =========================
public_users.get('/author/:author', async function (req, res) {
    try {
        let response = await axios.get(BASE_URL);
        let booksData = response.data;

        let result = {};

        for (let isbn in booksData) {
            if (booksData[isbn].author === req.params.author) {
                result[isbn] = booksData[isbn];
            }
        }

        return res.json(result);

    } catch (err) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});


// =========================
// TASK 13: GET BY TITLE (AXIOS)
// =========================
public_users.get('/title/:title', async function (req, res) {
    try {
        let response = await axios.get(BASE_URL);
        let booksData = response.data;

        let result = {};

        for (let isbn in booksData) {
            if (booksData[isbn].title === req.params.title) {
                result[isbn] = booksData[isbn];
            }
        }

        return res.json(result);

    } catch (err) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});


// =========================
// TASK 5: GET REVIEWS (unchanged)
// =========================
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;

    axios.get(BASE_URL)
        .then(response => {
            let booksData = response.data;

            if (booksData[isbn]) {
                return res.json(booksData[isbn].reviews);
            } else {
                return res.status(404).json({ message: "Book not found" });
            }
        })
        .catch(err => {
            return res.status(500).json({ message: "Error fetching reviews" });
        });
});


// =========================
module.exports.general = public_users;