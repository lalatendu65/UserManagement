const  bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const { promisify } = require("util");
// db connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_crud",
});



//handell post request for signup

exports.register = (req, res) => {
  console.log(req.body);
  const { username, email, password, cpassword } = req.body;
  db.query(
    "SELECT  email FROM login WHERE email=?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render("signup", {
          message: "this email is alreday used",
        });
      } else if (password !== cpassword) {
        return res.render("signup", {
          message: "password do not match",
        });
      }
      let haspassword = await bcrypt.hash(password, 8);
      console.log(haspassword);
      db.query(
        "INSERT INTO login SET ?",
        { username: username, email: email, password: haspassword },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            return res.render("signup", {
              message: "user register ",
            });
          }
        }
      );
    }
  );
};
