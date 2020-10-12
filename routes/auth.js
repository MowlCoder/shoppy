const express = require('express');

const authController = require('./../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignUp);

router.get('/reset', authController.getResetPassword);
router.post('/reset', authController.postResetPassword);

router.get('/reset/:token', authController.getUpdatePassword);
router.post('/updatePassword', authController.postUpdatePassword);

router.post('/logout', authController.postLogOut);

module.exports = router;