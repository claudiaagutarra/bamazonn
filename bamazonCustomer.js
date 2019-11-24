var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

  function start() {
    inquirer
      .prompt({
        name: "display",
        type: "list",
        message: "Welcome to Bamazon! Would you like to browse our products?",
        choices: ["Yes!", "No"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.display === "Yes!") {
          display();
        }
        else if(answer.display === "No") {
          connection.end();
        }
      });
  }
  