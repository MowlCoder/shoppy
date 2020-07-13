const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, data) => {
            let cart = { products: [], totalPrice: 0 };
            
            if (!err) {
                cart = JSON.parse(data);
            }
            
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            
            let updateProduct;
            
            if (existingProduct) {
                updateProduct = {...existingProduct};
                updateProduct.qty = updateProduct.qty + 1;    
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updateProduct;    
            }
            else {
                updateProduct = {
                    id,
                    qty: 1
                };
                cart.products = [...cart.products, updateProduct];
            }
            
            cart.totalPrice = cart.totalPrice + +productPrice;
            
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }
    
    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, data) => {
            if (err) {
                return;
            }
            
            const cart = { ...JSON.parse(data) };
            const product = cart.products.find(prod => prod.id === id);
            
            cart.products = cart.products.filter(prod => prod.id !== id);
            cart.totalPrice = cart.totalPrice - productPrice * product.qty;
            
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }
};