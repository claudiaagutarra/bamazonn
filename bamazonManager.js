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
    console.log("----------------")
    console.log("MAIN MENU")
    console.log("----------------")
    mainMenu();
});

function mainMenu() {
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            if (answer.menu === "View Products for Sale") {
                display();
            }
            else if (answer.menu === "View Low Inventory") {
                lowInventory();
            }
            else if (answer.menu === "Add to Inventory") {
                addInventory();
            }
            else if (answer.menu === "Add New Product") {
                addNewProduct();
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
            console.log("Quantity: " + results[i].stock_quantity)
        }
    })
}