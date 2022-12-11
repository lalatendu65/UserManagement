const path = require("path");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const authcontroller = require("./controleer/auth");

const { promisify } = require("util");
var session = require("express-session");

app.use(
  session({
    secret: "ABCDefg",
    resave: true,
    saveUninitialized: true,
  })
);

const encoder = bodyParser.urlencoded();

//data base connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_crud",
});

connection.connect(function (error) {
  if (!!error) console.log(error);
  else console.log("Database Connected!");
});

//set views file
app.set("views", path.join(__dirname, "views"));

//set view engine
app.set("view engine", "ejs");
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// handel get request for login

app.get("/", async (req, res) => {
  res.render("login.hbs");
});
// handel post request for login
app.post("/auth/login", function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  var sql = `select * from login where email = '${email}' and password='${password}'`;

  connection.query(sql, [email], function (err, result, fields) {
    if (err) throw err;
   

    if (result.length && (password, result[0].password)) {
      req.session.email = email;
      req.session.password = password;
      res.redirect("/dashboard");
    } else {
      req.session.flag = 4;
      return res.render("login", {
        message: "Email and Password is in correct ",
      });
    }
  });
});

//handel get request for signup

app.get("/signup", (req, res) => {
  res.render("signup.hbs");
});

//handel post request for signup
app.post("/auth/register", authcontroller.register);

app.get("/dashboard", (req, res) => {
  let sql = "SELECT * FROM users";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("user_index.ejs", {
      users: rows,
    });
  });
});

// add user page

app.get("/adduser", (req, res) => {
  res.render("adduser.ejs");
});

// handel post request for adduser

app.post("/save", (req, res) => {
  let data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    Confirm_Password: req.body.Confirm_Password,
  };
  let sql = "INSERT INTO users SET ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/dashboard");
  });
});

//edit user
app.get("/edit/:userId", (req, res) => {
  const userId = req.params.userId;
  let sql = `Select * from users where id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("user_edit.ejs", {
      user: result[0],
    });
  });
});
//edit user
app.post("/update", (req, res) => {
  const userId = req.body.id;
  let sql =
    "update users SET username='" +
    req.body.username +
    "',  email='" +
    req.body.email +
    "',  password='" +
    req.body.password +
    "', Confirm_Password='" +
    req.body.Confirm_Password +
    "'    where id =" +
    userId;
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/dashboard");
  });
});

//delete user
app.get("/delete/:userId", (req, res) => {
  const userId = req.params.userId;
  let sql = `DELETE from users where id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/dashboard");
  });
});

// Server Listening
app.listen(4000, () => {
  console.log("Server is running at port 4000");
});
