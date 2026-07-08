const express = require('express');
const app = express();
const PORT = 3000;


// this will only handle the get request for /user route
app.get("/user", (req, res) => {
    res.send({ firstName : "ABHISHEK", lastName : "AGRAWAL"});
})

app.post("/user", (req, res) => {
    res.send("user created succesfully!");
});

app.delete("/user", (req, res) => {
    res.send("user deleted succcesfully!");
})


//this will match all the HTTP method API calls to /user route
app.use("/user", (req, res) => {
    res.send("user updated succesfully!");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});