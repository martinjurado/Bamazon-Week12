var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon_db'
});

// total number of products 
var product;
var quantity;
var productPrice;

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected as id: ' + connection.threadId);
    start();
});


// displays product info

// function shopQuery() {
//     connection.query('SELECT * FROM products', function (err, res) {
//         if (err) throw err;

//         console.log('Welcome to Bamazon! Feel free to shop.');
//         console.log('....................................................................');
//         for (var i = 0; i < res.length; i++) {

//             //  displays product catalog
//             console.log('Product Id: ' + res[i].product_id + ' | ' + 'Product Name: '
//                 + res[i].product_name + ' | ' + 'Department: ' + res[i].department_name
//                 + " | " + 'Price: ' + res[i].price + ' | ' + "Stock: " + res[i].stock_quantity);
//         };
//         connection.end();
        
//     });
// }

// prompts if customer wants buy or not 
function start(){
    inquirer
        .prompt({
            name: 'buyorNot',
            type: 'list',
            message: 'Would you like to shop with us today?',
            choices: ['YES', 'NO']
        })
        .then(function(answer){
            if(answer.buyorNot.toUpperCase() === 'YES'){
                shopQuery();
             
            }
            else{
                console.log(' Thanks for shopping. See you again!');
            }
        });
        
}

function shopQuery() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;

        console.log('...............................................................................');
        console.log('Welcome to Bamazon! Feel free to shop.');
        console.log('...............................................................................');
        for (var i = 0; i < res.length; i++) {

            //  displays product catalog
            console.log('Product Id: ' + res[i].product_id + ' | ' + 'Product Name: '
                + res[i].product_name + ' | ' + 'Department: ' + res[i].department_name
                + " | " + 'Price: $' + res[i].price + ' | ' + "Stock: " + res[i].stock_quantity);
        };
        inquirer
        .prompt([{
    
            // Product ID
    
            name: 'productID',
            message: 'What is the ID of the product you are looking for?',
            type: 'input',
            validate: function(value){
                
                if(isNaN(value) == false && parseInt(value) <= res.length &&  parseInt(value) > 0){
                    return true;
                } 
                else{
                    console.log(' Please enter a valid ID!');
                    return false;
                }
            }
        
        }, 
        
        // Product Quantity
            {
                name: 'Quantity',
                message: 'How many would you like?',
                type: 'input',
                validate: function(value) {
                    if((isNaN(value) === false)){
                        return true;
                    }
                    else{
                        console.log('Enter a valid number')
                        return false;
                    }
                }
            }
        ])
        .then(function(answer){
            
            for(var i = 0; i < res.length; i++) {
                
                if(res[i].product_id === (parseInt(answer.productID))){

                    product = res[i].product_name;
                    quantity = res[i].stock_quantity;
                    productPrice = res[i].price;
                }
            }

            console.log('Product ID: ' + answer.productID);
            console.log('Buy: ' + product);
            console.log('Quantity: ' + quantity);
            
            var newQuantity = (quantity - answer.Quantity);

            if(newQuantity < 0){
                console.log('Insufficient Stock!');
            }
            else {
                connection.query('UPDATE products SET ?  WHERE ?',
                [
                    {
                        product_name: product
                    }

                ], function (err, res){
                    console.log('Your total is $' + (parseInt(answer.Quantity)* parseInt(productPrice)));
                });
                connection.query('UPDATE products SET? WHERE ?',
                [
                    {
                        product_name: product
                    }
                ], function(err,res){
                    console.log('You have purchased: ' + answer.Quantity + ' ' + product + 's');

                    console.log('.................TRANSACTION COMPLETE.................');
                    console.log('Product ID: ' + answer.Quantity);
                    console.log('Product Name" ' + product);
                    console.log('New Stock: ' + newQuantity);
                });
            }
            
        });
    });
}
        
