const Product = require('./../models/product');

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
    req.user.getCart()
    .then(cart => {
        return cart.getProducts();
    })
    .then(products => {
        res.render('shop/cart', { path: '/cart', prods: products });
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postCart = (req, res) => {
    const { productId } = req.body;
    
    let fetchedCart;
    let newQuantity = 1;
    
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({
            where: {
                id: productId
            }
        })
    })
    .then(products => {
        let product;
        
        if (products) {
            product = products[0];
        }
        
        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            
            return product;
        }
        
        return Product.findByPk(productId);
    })
    .then(product => {
        return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postDeleteCartItem = (req, res) => {
    const { productId } = req.body;
    
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({
            where: {
                id: productId
            }
        })
    })
    .then(products => {
        if (!products) {
            return;
        }
        
        const product = products[0];
        
        return product.cartItem.destroy();
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getOrders = (req, res) => {
    req.user.getOrders({ include: ['products'] })
    .then(orders => {
        res.render('shop/orders', { path: '/orders', orders });
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postOrder = (req, res) => {
    let fetchedCart;
    
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            return order.addProducts(products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            }));
        })
        .catch(err => {
            console.log(err);
        });
    })
    .then(result => {
        return fetchedCart.setProducts(null);
    })
    .then(result => {
        res.redirect('/orders');
    })
    .catch(err => {
        console.log(err);
    });
};

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
