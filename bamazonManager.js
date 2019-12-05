var mysql = require("mysql");
var inquirer = require("inquirer");

// Create mysql connection
var connection = mysql.createConnection({
    host: "localhost",

    // Port
    port: 3306,

    // My Username
    user: "root",

    // My Password
    password: "DewT%@!!9",
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
        message: "Choose an operation",
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
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        console.log("\n----------------------------------------------------------------------");
        console.log("\nManager Functionality\n" +"***Viewing All Products for Sale***\n------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {            
            console.log("Product ID: " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$"+res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("------------------------------------------------------------");
            
        // connection.end();
    });
}
function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
        if (err) throw err;
        console.log(res);
        console.log("\n----------------------------------------------------------------------");
        console.log("\nManager Functionality\n" +"***Viewing Low Inventory***\n------------------------------------------------------------");
        if (res) {
            for (var i = 0; i < res.length; i++) {            
                console.log("Product ID: " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$"+res[i].price + " | " + res[i].stock_quantity);
            }     
        }
        // console.log("No low inventory to show. All products have more than 5 units each.");              
        console.log("------------------------------------------------------------");
        // connection.end();
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
            })
        });
        
        // connection.end();
    });
}