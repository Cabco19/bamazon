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
    start();
    
});

// Function that runs at the start of the App and retrieves product information from SQL database
function start() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n----------------------------------------------------------------------");
        console.log("\nWelcome to Bamazon!\n" + "We have the following products available for purchase:\n" + "------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {            
            console.log("Product ID: " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$"+res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("------------------------------------------------------------");
        promptCustomer(res);
        // connection.end();
    });
}

// Function to prompt customer
function promptCustomer(res) {
    inquirer.prompt({
        name:"itemId",
        type:"input",
        message:"What is the Product ID of the item you would like to purchase today?"
    }
).then(function(answer){
    // var correct = false;
    for (var i = 0; i < res.length; i++){
        if (res[i].item_id == answer.itemId){
            correct = true;
            var id=i;
            var productId = res[i].item_id;
            var productName = res[i].product_name;
            console.log("Product Search: " + productName);
            inquirer.prompt({
                name:"quantity",
                type:"input",
                message:"How many units would you like to purchase for this item?",
                validate: function(value){
                    if(isNaN(value)==false){
                        return true;
                    } else {
                        return false;
                    }
                }
            }).then(function(answer){
                if((res[id].stock_quantity-answer.quantity)>0){
                    console.log("Item to purchase: " +productName);
                    var total = res[id].price*answer.quantity;
                    console.log("Your order was successfully placed!");
                    connection.query("UPDATE products SET stock_quantity='"+(res[id].stock_quantity-answer.quantity)+"' WHERE item_id='"+productId+"'", function(err,res2){
                        console.log("Your order was placed for " + productName + "\nOrder Total: $" +total );
                        start();
                    })
                }
            })
        }
    }
})
}