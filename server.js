require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');

const userRoute = require('./User/router');

app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log("Server running on port 3000...")
})

app.use("/api/users", userRoute);

// DB connection
mongoose.connect(process.env.DB_URL)
.then(() => {
    console.log("Connected to Database!");
})
.catch(() => {
    console.log("Connection failed! Check your .env file for 'DB_URL'");
})