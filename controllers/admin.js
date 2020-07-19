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
    
    Product.findById(productId)
    .then(product => {        
        if (!product) {
            return res.redirect('/');
        }
        
        res.render('admin/edit-product', { path: '/admin/edit-product', editing: editMode, product });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res) => {
    Product.fetchAll()
    .then(products => {
        res.render('admin/products', { prods: products, path: '/admin/products' });
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postAddProduct = (req, res) => {
    const { title, imageUrl, price, description } = req.body;
    
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    
    product.save()
    .then(result => {
        res.redirect('/admin/add-product');
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postEditProduct = (req, res) => {
    const { productId, title, price, imageUrl, description } = req.body;
    
    const product = new Product(title, price, description, imageUrl, productId, req.user._id);
        
    product.save().then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postDeleteProduct = (req, res) => {
    const { productId } = req.body;
    
    Product.deleteById(productId)
    .then(result => {
        res.redirect('/admin/products'); 
    })
    .catch(err => {
        console.log(err);
    });
};
