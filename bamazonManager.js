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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Cancel"]
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
            else if (answer.menu === "Cancel") {
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
            console.log("Quantity: " + results[i].stock_quantity)
        }
        mainMenu();
    })

}
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",
        function (err, results) {
            if (err) throw err;
            if (results.length === 0) {
                console.log("---------------")
                console.log("All products are sufficiently stocked!")
                console.log("---------------")
                confirmReturnMenu();
            }
            else {
                console.log("---------------")
                console.log("These are the items with an inventory count lower than five")
                for (var i = 0; i < results.length; i++) {
                    console.log("---------------")
                    console.log("ID number: " + results[i].id)
                    console.log("Product Name: " + results[i].product_name)
                    console.log("Price: $" + results[i].price)
                    console.log("Quantity: " + results[i].stock_quantity)
                    onsole.log("---------------")
                }

                confirmReturnMenu();
            }
        })

}

function addInventory() {
    inquirer
        .prompt([
            {
                name: "idchoice",
                type: "input",
                message: "Please enter the product's ID number:"
            }
            ,
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to add?"
            }
        ])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE id = ?",
                [
                    parseInt(answer.idchoice)
                ],
                function (err, res) {
                    if (err) throw err;
                    var quantity = parseInt(res[0].stock_quantity)
                    var product = res[0].product_name
                    var chosenID = parseInt(res[0].id)
                    var updatedquantity = quantity + parseInt(answer.quantity)
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updatedquantity
                            },
                            {
                                id: chosenID
                            }
                        ],
                        function (err, results) {
                            if (err) throw err;
                            console.log("---------------")
                            console.log("Inventory was added successfully!")
                            console.log("---------------")
                        })
                    connection.query("SELECT * FROM products WHERE id = ?",
                        [
                            parseInt(answer.idchoice)
                        ],
                        function (err, res) {
                            if (err) throw err;
                            console.log("Total number of " + product + "s now available: " + res[0].stock_quantity)
                            console.log("---------------")
                            console.log("---------------")
                            confirmReturnMenu();
                        })
                }

            );

        });
}

function addNewProduct() {
    inquirer
        .prompt([
            {
                name: "newproductname",
                type: "input",
                message: "Please enter the name of the new product you'd like to add: "
            }
            ,
            {
                name: "dept",
                type: "input",
                message: "What department does it fall under? (Ex: Alexa, Beauty, Electronics, Furniture)"
            }
            ,
            {
                name: "newprice",
                type: "input",
                message: "Please enter the price of the new product: "
            }
            ,
            {
                name: "newquantity",
                type: "input",
                message: "Please enter the quantity of the new product: "
            }
        ])
        .then(function (answer) {
            const newproduct = { product_name: answer.newproductname, department_name: answer.dept, price: parseInt(answer.newprice), stock_quantity: parseInt(answer.newquantity) };
            connection.query('INSERT INTO products SET ?', newproduct, (err, res) => {
                if (err) throw err;
                var newitemID = res.insertId;
                console.log("Item Added Successfully! ID of new product: " + newitemID);
            });
            connection.query("SELECT * FROM products WHERE product_name = ?",
                [
                    answer.newproductname
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log("---------------")
                    console.log("Details for New Product")
                    console.log("---------------")
                    console.log("ID number: " + res[0].id)
                    console.log("Product Name: " + res[0].product_name)
                    console.log("Price: $" + res[0].price)
                    console.log("Quantity: " + res[0].stock_quantity)
                    console.log("---------------")
                    confirmReturnMenu();
                })

        })

}

function confirmReturnMenu() {
    inquirer
        .prompt({
            name: "confirmMenu",
            type: "list",
            message: "Would you like to go back to the main menu?",
            choices: ["Yes!", "No"]
        })
        .then(function (answer) {
            if (answer.confirmMenu === "Yes!") {
                mainMenu();
            }
            else if (answer.confirmMenu === "No") {
                connection.end();
            }
        });
}