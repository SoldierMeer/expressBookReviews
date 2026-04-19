const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// =========================
// CHECK VALID USER
// =========================
const isValid = (username) => {
    return users.includes(username);
};


// =========================
// AUTHENTICATE USER
// =========================
const authenticatedUser = (username, password) => {
    let validUsers = users.find((user) => {
        return user.username === username && user.password === password;
    });

    return validUsers;
};


// =========================
// TASK 7: LOGIN (JWT TOKEN)
// =========================
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "test" && password === "123") {

        let accessToken = jwt.sign(
            { username },
            "fingerprint_customer",
            { expiresIn: "1h" }
        );

        req.session.authorization = {
            accessToken,
            username
        };

        return res.json({ message: "Login successful", token: accessToken });
    }

    return res.status(401).json({ message: "Invalid credentials" });
});


// =========================
// TASK 8: ADD / MODIFY REVIEW
// =========================
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or update review by same user
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});


// =========================
// TASK 9: DELETE REVIEW
// =========================
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];

        return res.status(200).json({
            message: "Review deleted successfully",
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({ message: "Review not found for this user" });
    }
});


// =========================
// EXPORTS
// =========================
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;