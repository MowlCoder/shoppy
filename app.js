const path = require('path');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

const config = require('./config');
const User = require('./models/user');

const DB_URI = `mongodb+srv://mowl:${config.mongoDbPass}@shoppy.dj4e1.mongodb.net/shop?w=majority`;

const app = express();
const store = new MongoDbStore({
    uri: DB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: config.sessionSecretKey, resave: false, saveUninitialized: false, store: store }));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) return next();

    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    });
});

app.use((req, res, next) => {
    res.locals.isLogged = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(DB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
.then(() => {
    app.listen(3000);
    console.log('Server started at port 3000');
})
.catch(err => {
    console.log(err);
})
