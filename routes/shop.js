const express = require('express');

const shopController = require('./../controllers/shop');
const isAuthMiddleware = require('./../middlewares/isAuth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuthMiddleware, shopController.getCart);
router.post('/cart', isAuthMiddleware, shopController.postCart);
router.post('/cart-delete-item', isAuthMiddleware, shopController.postDeleteCartItem)

router.get('/orders', isAuthMiddleware, shopController.getOrders);
router.post('/create-order', isAuthMiddleware, shopController.postOrder);

module.exports = router;