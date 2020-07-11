const Product = require('./../models/product');

exports.getIndex = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/index', { prods: products, path: '/' });
    });
};

exports.getCart = (req, res) => {
    res.render('shop/cart', { path: '/cart' });  
};

exports.getOrders = (req, res) => {
    res.render('shop/orders', { path: '/orders' });
}

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', { prods: products, path: '/products' }); 
    });
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', { path: '/checkout'})  
};
