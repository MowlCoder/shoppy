const Product = require('./../models/product');
const Order = require('./../models/order');
const mongoose = require('mongoose');

exports.getIndex = (req, res) => {
    Product.find()
    .then(products => {
        res.render('shop/index', { 
            prods: products,
            path: '/'
         });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res) => {
    Product.find()
    .then(products => {
        res.render('shop/product-list', { prods: products, path: '/products' });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    
    if (!mongoose.isValidObjectId(prodId)) return next();

    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-detail', { product, path: '/products' });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getCart = (req, res) => {
    req.user.populate('cart.items.product')
    .execPopulate()
    .then(user => {
        const products = user.cart.items;    
        res.render('shop/cart', { path: '/cart', prods: products });
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postCart = (req, res) => {
    const { productId } = req.body;
    
    Product.findById(productId).then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        res.redirect('/cart');
    });
};

exports.postDeleteCartItem = (req, res) => {
    const { productId } = req.body;

    console.log(req.body);
    
    req.user.removeFromCart(productId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getOrders = (req, res) => {
    Order.find({ 'user.userId': req.user._id })
    .then(orders => {
        res.render('shop/orders', { path: '/orders', orders });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postOrder = (req, res) => {
    req.user.populate('cart.items.product')
    .execPopulate()
    .then(user => {
        const products = user.cart.items.map(i => {
            return { quantity: i.quantity, productData: { ...i.product._doc } };
        });
        
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            products
        });
        
        return order.save();
    })
    .then(() => {
        return req.user.clearCart();
    })
    .then(() => {
        res.redirect('/orders');
    })
    .catch(err => {
        console.log(err);
    });
};
