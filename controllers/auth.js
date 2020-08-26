const User = require("../models/user");

exports.getLogin = (req, res) => {
    res.render('auth/login', { path: '/login', isLogged: req.session.isLoggedIn });
};

exports.postLogin = (req, res) => {
    User.findById('5f435622f6fae6050424f51a')
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;

        req.session.save((err) => {
            if (err) console.log(err);
            res.redirect('/');
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