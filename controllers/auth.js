exports.getLogin = (req, res) => { 
    res.render('auth/login', { path: '/login', isLogged: req.isLogged });
};

exports.postLogin = (req, res) => {
    res.redirect('/');
};