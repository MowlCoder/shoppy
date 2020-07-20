const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

const config = require('./config');
const User = require('./models/user');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5f1591e8f57c9d1fb4e7889e')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404);

mongoose.connect(`mongodb+srv://mowl:${config.mongoDbPass}@shoppy.dj4e1.mongodb.net/shop?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true })
.then(() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})
