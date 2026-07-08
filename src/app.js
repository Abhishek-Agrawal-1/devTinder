const express = require('express');
const app = express();
const PORT = 3000;

app.use("/user", (req, res, next) => {
    console.log("request handler 1");
    next();
}, (req, res, next) => {
    console.log("request handler 2");
    next();
}, (req, res, next) => {
    console.log("request handler 3");
    next();
}, (req, res, next) => {
    console.log("request handler 4");
    next();
}, (req, res, next) => {
    console.log("request handler 5");
    res.send("response 5");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});