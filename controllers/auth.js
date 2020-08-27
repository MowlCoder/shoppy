const bcrypt = require('bcryptjs');

const User = require("../models/user");

exports.getLogin = (req, res) => {
    res.render('auth/login', { path: '/login', isLogged: false });
};

exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    
    
    User.findOne({ email: email })
    .then(user => {
        if (!user) return res.redirect('/login');
        
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
    res.render('auth/signup', { path: '/signup', isLogged: false });
};

exports.postSignUp = (req, res) => {
    const { email, password, password2 } = req.body;
    
    User.findOne({ email: email })
    .then(user => {
        if (user) return res.redirect('/signup');
        
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