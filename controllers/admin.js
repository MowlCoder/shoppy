const Product = require('./../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', { path: '/admin/add-product' });
};

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('admin/products', { prods: products, path: '/admin/products' });  
    });
};

exports.postAddProduct = (req, res) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    
    res.redirect('/admin/add-product');
};