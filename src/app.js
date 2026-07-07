const express = require('express');
const app = express();
const PORT = 3000;

app.use("/test", (req, res) => {
    res.send("Hello from the test!");
});

app.use("/hello", (req, res) => {
    res.send("Hello from the hello route!");
});

app.use("/admin", (req, res) => {
    res.send("Hello from the admin route!");
});

app.use("/", (req, res) => {
    res.send("Hello from the Server!");
});// request handler

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});