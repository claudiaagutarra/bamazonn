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

connection.connect(function (err) {
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
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.display === "Yes!") {
                display();
            }
            else if (answer.display === "No") {
                connection.end();
            }
        });
}

function display() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("---------------")
            console.log("ID number: " + results[i].id)
            console.log("Product Name: " + results[i].product_name)
            console.log("Price: $" + results[i].price)
        }
        input();
    })

    function input() {
        inquirer
            .prompt([
                {
                    name: "idchoice",
                    type: "input",
                    message: "If you would like to purchase a product, please input the product's ID number:"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to buy?"
                }
            ])
            .then(function(answer) {

                connection.query("SELECT * FROM products", function (err, results) {
                        if (err) throw err;
                  },
                  function(err) {
                    if (err) throw err;
                    console.log("Your auction was created successfully!");
                    start();
                  }
                );
              });
    }
}