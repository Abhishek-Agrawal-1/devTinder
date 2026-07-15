const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8","8.8.4.4"]);

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://mernproject:mern@devtinder.axytf1s.mongodb.net/?appName=devTinder"
  );
};

module.exports = connectDB;