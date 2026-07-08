const express = require('express');
const app = express();
const PORT = 3000;

app.get("/", (err, req, res, next) => {
    if(err) {
        res.status(500).send("Internal server error");
    }
})

app.get("/getUserData", (req, res) => {
    try {
        throw new Error("User data not found");
        res.send("User data retrieved successfully");
    }catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/", (err, req, res, next) => {
    if(err) {
        res.status(500).send("Internal server error");
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
