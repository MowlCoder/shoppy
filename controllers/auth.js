const bcrypt = require('bcryptjs');

const User = require("../models/user");

exports.getLogin = (req, res) => {
    let message = req.flash('error');
    
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    
    res.render('auth/login', { path: '/login', errorMessage: message });
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
    let message = req.flash('error');
    
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    
    res.render('auth/signup', { path: '/signup', errorMessage: message });
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
            .then(() => {
                res.redirect('/login');
            });
    })
    .catch(err => console.log(err));
};

exports.postLogOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err);

        res.redirect('/');
    });
};