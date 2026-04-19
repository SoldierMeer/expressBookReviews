const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// ✅ SESSION MUST BE HERE (GLOBAL)
app.use(session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: true
}));

// AUTH middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization.accessToken;

        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authorized" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// ROUTES
app.use("/customer", genl_routes);
app.use("/customer/auth", customer_routes);

const PORT = 5000;

app.listen(PORT, () => console.log("Server running on 5000"));