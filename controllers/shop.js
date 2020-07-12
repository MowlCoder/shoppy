const Product = require('./../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/index', { prods: products, path: '/' });
    });
};

exports.getCart = (req, res) => {
    res.render('shop/cart', { path: '/cart' });  
};

exports.postCart = (req, res) => {
    const { productId } = req.body;
    
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);    
    });
    
    res.redirect('/cart');
};

exports.getOrders = (req, res) => {
    res.render('shop/orders', { path: '/orders' });
}

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', { prods: products, path: '/products' }); 
    });
};

exports.getProduct = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', { product, path: '/products' });
    })
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', { path: '/checkout'})  
};
