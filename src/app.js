const express = require('express');
const app = express();
const PORT = 3000;

const { adminAuth , userAuth} = require('./middleware/auth');

app.use("/admin", adminAuth);
app.use("/user", userAuth);

app.get("/user/data", userAuth, (req, res) => {
    res.send("user data sent");
});

app.get("/admin/getAllData", (req, res) => {
    res.send("All data is sent");
})

app.get("/admin/deleteUser", (req, res) => {
    res.send("Deleted User");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
