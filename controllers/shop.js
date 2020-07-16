const Product = require('./../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
    Product.findAll()
    .then(products => {
        res.render('shop/index', { prods: products, path: '/' });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getCart = (req, res) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const productsCart = [];
            
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    productsCart.push({ productData: product, qty: cartProductData.qty });
                }
            }
            
            res.render('shop/cart', { path: '/cart', prods: productsCart });
        })
    });
};

exports.postCart = (req, res) => {
    const { productId } = req.body;
    
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);    
    });
    
    res.redirect('/cart');
};

exports.postDeleteCartItem = (req, res) => {
    const { productId } = req.body;
    
    Product.findById(productId, (product) => {
        Cart.deleteProduct(productId, product.price);
        
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res) => {
    res.render('shop/orders', { path: '/orders' });
}

exports.getProducts = (req, res) => {
    Product.findAll()
    .then(products => {
        res.render('shop/product-list', { prods: products, path: '/products' });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProduct = (req, res) => {
    const prodId = req.params.productId;
    
    Product.findByPk(prodId)
    .then(product => {
        res.render('shop/product-detail', { product, path: '/products' });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', { path: '/checkout'})  
};
