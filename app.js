//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const { stringify } = require("querystring");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const secret = "Thisisourlittlesecret."
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);


app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function (req, res) {
    const { username, password } = req.body;
  
    const newUser = new User({
      email: username,
      password: password,
    });
  
    newUser.save()
      .then(() => {
        res.render("secrets");
      })
      .catch((err) => {
        console.error(err);
        // Handle the error, you might want to send an error response to the client.
        res.status(500).send("Internal Server Error");
      });
  });


  app.post("/login", function (req, res) {
    const { username, password } = req.body;
  
    User.findOne({ email: username })
      .then((foundUser) => {
        if (foundUser && foundUser.password === password) {
          res.render("secrets");
        } else {
          // User not found or incorrect password
          res.status(401).send("Unauthorized");
        }
      })
      .catch((err) => {
        console.error(err);
        // Handle the error, you might want to send an error response to the client.
        res.status(500).send("Internal Server Error");
      });
  });










app.listen(3000,function(){
    console.log("Server started on port 3000.");
});