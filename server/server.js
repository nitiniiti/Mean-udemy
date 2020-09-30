const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");

const app = express();

mongoose.connect("mongodb+srv://mongo_user:19911121@cluster0.xjpof.mongodb.net/node-angular?retryWrites=true&w=majority").then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Error occured while connecting DB", err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(__dirname + "/images"));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With,Content-Type, Accept, content-type"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PATCH,DELETE,OPTIONS,PUT"
    );
    next();
});

app.use(postRoutes);


app.listen(3000, () => {
    console.log("Listening on port - 3000");
})