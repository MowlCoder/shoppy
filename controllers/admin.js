const Product = require('./../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', { path: '/admin/add-product', isLogged: req.session.isLoggedIn });
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
        
        res.render('admin/edit-product', { path: '/admin/edit-product', editing: editMode, product , isLogged: req.session.isLoggedIn });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res) => {
    Product.find()
    .then(products => {
        res.render('admin/products', { prods: products, path: '/admin/products', isLogged: req.session.isLoggedIn });
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postAddProduct = (req, res) => {
    const { title, imageUrl, price, description } = req.body;
    
    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId: req.user._id
    });
    
    product.save()
    .then(result => {
        res.redirect('/admin/add-product');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postEditProduct = (req, res) => {
    const { productId, title, price, imageUrl, description } = req.body;
    
    Product.findById(productId)
    .then(product => {
        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;
        return product.save();
    })
    .then(() => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postDeleteProduct = (req, res) => {
    const { productId } = req.body;
    
    Product.findByIdAndDelete(productId)
    .then(() => {
        res.redirect('/admin/products'); 
    })
    .catch(err => {
        console.log(err);
    });
};
