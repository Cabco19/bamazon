require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var pwrd = process.env.PASSWORD;

// Create mysql connection
var connection = mysql.createConnection({
    host: "localhost",

    // Port
    port: 3306,

    // My Username
    user: "root",

    // My Password
    password: pwrd,
    database: "bamazon"
});

// Initialize connection
connection.connect(function(err){
    if (err) throw err;
    console.log("Connected successfully to mysql");
    // run the start function after the connection is made to prompt the user
    promptManger();
    // start();    
});

function promptManger(){
    inquirer.prompt({        
        type: "list",
        name: "managerPrompt",
        message: "Choose an operation to perform",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(answer){
        if (answer.managerPrompt == "View Products for Sale"){
            viewProducts();
        }
        if (answer.managerPrompt == "View Low Inventory"){
            viewLowInventory();
        }
        if (answer.managerPrompt == "Add to Inventory"){
            addToInventory();
        }
        if (answer.managerPrompt == "Add New Product"){
            addNewProduct();
        }
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n----------------------------------------------------------------------");
        console.log("\nManager Functionality\n" +"***Viewing All Products for Sale***\n------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {            
            console.log("Product ID: " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$"+res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("------------------------------------------------------------\n");
        promptManger();
        // connection.end();
    });
}
function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
        if (err) throw err;
        console.log("\n----------------------------------------------------------------------");
        console.log("Manager Functionality\n\n" +"***Viewing Low Inventory***");
        if (!res.length){
            console.log("All products have inventory above 5 units.\nYour inventory is up to date!");    
            // promptManger();
        }
        if (res) {
            for (var i = 0; i < res.length; i++) {            
                console.log("Product ID: " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$"+res[i].price + " | " + res[i].stock_quantity);
            }    
            // promptManger();
        }
        // console.log("No low inventory to show. All products have more than 5 units each.");              
        console.log("----------------------------------------------------------------------\n\n");
        // connection.end();
        promptManger();
    });
}

function addToInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n----------------------------------------------------------------------");
        console.log("\nManager Functionality\n" +"***Adding to Inventory***\n------------------------------------------------------------");
        if (res) {
            for (var i = 0; i < res.length; i++) {            
                console.log("Product ID: " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$"+res[i].price + " | " + res[i].stock_quantity);
            }     
        }
        console.log("------------------------------------------------------------");

        inquirer.prompt([
            {     
            type: "input",
            name: "productId",
            message: "Enter the Product ID of the item you'd like to update"
            },
            {
            type: "input",
            name: "updateInventory",
            message: "Enter the amount of units you'd like to update for this product"
            }
        ]).then(function(answer){ 
            connection.query("UPDATE PRODUCTS SET stock_quantity = stock_quantity +"+answer.updateInventory+" WHERE item_id ="+answer.productId, function(err, res2) {
                console.log("Product ID #" +answer.productId+" has succesfully been updated with " +answer.updateInventory + " more unit(s).");
                console.log("\n");
                promptManger();
            })
        });
    });    
}

function addNewProduct() {
    console.log("\n----------------------------------------------------------------------");
    console.log("\nManager Functionality\n" +"***Adding New Products to Inventory***\n------------------------------------------------------------");
    inquirer.prompt([
        {     
        type: "input",
        name: "name",
        message: "Enter the new Product Name you would like to add:"
        },
        {
        type: "list",
        name: "dept",
        message: "Choose the category for this product:",
        choices: ["Shoes", "Clothing", "Electronics", "Game and Toys"]
        },
        {
        type: "input",
        name: "price",
        message: "Enter the cost for this product:"
        },
        {
        type: "input",
        name: "quantity",
        message: "Enter the stock quatity:"
        }
    ]).then(function(answer){ 
        console.log(answer);
        connection.query("INSERT INTO products SET ?", {
            product_name:answer.name,
            department_name:answer.dept,
            price:answer.price,
            stock_quantity:answer.quantity
        }, function(err, res2) {
            console.log("New product added successfully: " +answer.name);
            console.log("\n");
            promptManger();
        })
    });


}