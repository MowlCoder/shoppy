const Product = require('./../models/product');

exports.getIndex = (req, res) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/index', { prods: products, path: '/' });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getCart = (req, res) => {
    req.user.getCart()
    .then(products => {
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
    
    req.user.deleteItemFromCart(productId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getOrders = (req, res) => {
    req.user.getOrders()
    .then(orders => {
        res.render('shop/orders', { path: '/orders', orders });
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postOrder = (req, res) => {
    req.user.addOrder()
    .then(result => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/product-list', { prods: products, path: '/products' });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProduct = (req, res) => {
    const prodId = req.params.productId;
    
    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-detail', { product, path: '/products' });
    })
    .catch(err => {
        console.log(err);
    });
};
