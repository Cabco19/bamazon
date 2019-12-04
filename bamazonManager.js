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
        console.log(answer);
    })
}
function start() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n----------------------------------------------------------------------");
        console.log("\nManager Functionality\n------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {            
            console.log("Product ID: " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$"+res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("------------------------------------------------------------");
        


        // promptCustomer(res);
        // connection.end();
    });
}