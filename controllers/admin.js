const Product = require('./../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', { path: '/admin/add-product' });
};

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    
    if(!editMode) {
        return res.redirect('/');
    }
    
    const { productId } = req.params;
    
    Product.findById(productId, product => {
        if (!product) {
            return res.redirect('/');
        }
        
        res.render('admin/edit-product', { path: '/admin/edit-product', editing: editMode, product });  
    });
};

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('admin/products', { prods: products, path: '/admin/products' });  
    });
};

exports.postAddProduct = (req, res) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    
    res.redirect('/admin/add-product');
};

exports.postEditProduct = (req, res) => {
    const { productId, title, price, imageUrl, description } = req.body;
    
    const product = new Product(productId, title, imageUrl, description, price);
    product.save();
    
    res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res) => {
    const { productId } = req.body;
    
    Product.deleteById(productId);
    res.redirect('/admin/products');
};
