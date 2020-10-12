const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require("../models/user");

const cfg = require('./../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: cfg.emailData.user,
      pass: cfg.emailData.pass
    }
});

exports.getLogin = (req, res) => {
    const errorMessage = req.flash('error');
    const successMessage = req.flash('success');
    
    res.render('auth/login', { 
        path: '/login', 
        errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
        successMessage: successMessage.length > 0 ? successMessage[0] : null
    });
};

exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'Invalid email or password');
            
            return res.redirect('/login');
        }
        
        return bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
            
                    return req.session.save((err) => {
                        if (err) console.log(err);
                        res.redirect('/');
                    });
                }
                
                req.flash('error', 'Invalid email or password');
                res.redirect('/login');
            })
            .catch(err => {
                console.log(err);
                res.redirect('/login');
            });
    })
    .catch(err => console.log(err));
};

exports.getSignUp = (req, res) => {
    const errorMessage = req.flash('error');
    
    res.render('auth/signup', { 
        path: '/signup',
        errorMessage: errorMessage.length > 0 ? errorMessage[0] : null
    });
};

exports.postSignUp = (req, res) => {
    const { email, password, password2 } = req.body;
    
    User.findOne({ email: email })
    .then(user => {
        if (user) {
            req.flash('error', 'E-mail already exist.');
            return res.redirect('/signup');
        }
        
        return bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const newUser = new User({ 
                    email: email, 
                    password: hashedPassword, 
                    cart: { items: [] } }
                );
                
                return newUser.save();
            })
            .then(user => {
                const mailOptions = {
                    from: cfg.emailData.user,
                    to: user.email,
                    subject: 'Thanks for using Shoppy!',
                    text: 'We appreciate that you have choosed our marketplace!'
                };
                
                transporter.sendMail(mailOptions, (err, info) => {                    
                    if (err) console.log(err);
                });
                
                res.redirect('/login');
            })
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.getResetPassword = (req, res) => {
    const errorMessage = req.flash('error');
    
    res.render('auth/reset', { 
        path: '/reset',
        errorMessage: errorMessage.length > 0 ? errorMessage[0] : null
    });
};

exports.postResetPassword = (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        
        const token = buffer.toString('hex');
        
        User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                req.flash('error', 'No account with that email found.');
                return res.redirect('/reset');
            }
            
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(user => {
            const mailOptions = {
                from: cfg.emailData.user,
                to: user.email,
                subject: 'Reseting your password (Shoppy)',
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${user.resetToken}">link</a> to set a new password</p>
                `
            };
            
            transporter.sendMail(mailOptions, (err, info) => {                    
                if (err) console.log(err);
            });
            
            req.flash('success', 'Reset link was successfully sent to your email address.');
            res.redirect('/');
        })
        .catch(err => console.log(err));
    });
};

exports.getUpdatePassword = (req, res) => {
    const token = req.params.token;
    
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
        if (!user) {
            req.flash('error', 'Invalid reset link.');
            return res.redirect('/');
        }
        
        res.render('auth/reset-form', { path: '/updatePassword', userId: user._id.toString(), passwordToken: token });
    })
    .catch(err => console.log(err));
}

exports.postUpdatePassword = (req, res) => {
    const { resetPassword, userId, passwordToken } = req.body;
    let resetUser;
    
    User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(resetPassword, 12);
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        
        return resetUser.save();
    })
    .then(() => {
        req.flash('success', 'You successfully changed password.');
        res.redirect('login');
    })
    .catch(err => console.log(err));
}

exports.postLogOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err);

        res.redirect('/');
    });
};