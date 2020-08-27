const path = require('path');
const express = require('express');

const adminController = require('./../controllers/admin');
const isAuthMiddleware = require('./../middlewares/isAuth');

const router = express.Router();

router.get('/add-product', isAuthMiddleware, adminController.getAddProduct);
router.post('/add-product', isAuthMiddleware, adminController.postAddProduct);

router.get('/products', isAuthMiddleware, adminController.getProducts);
router.get('/edit-product/:productId', isAuthMiddleware, adminController.getEditProduct);
router.post('/edit-product', isAuthMiddleware, adminController.postEditProduct);

router.post('/delete-product', isAuthMiddleware, adminController.postDeleteProduct);

module.exports = router;
