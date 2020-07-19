const mongoDb = require('mongodb');
const getDb = require('./../util/database').getDb;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }
    
    save() {
        const db = getDb();
        
        return db.collection('users').insertOne(this)
        .catch(err => {
            console.log(err);
        });
    }
    
    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        
        let newQty = 1;
        const updateCartItems = [...this.cart.items];
        
        if (cartProductIndex >= 0) {
            newQty = this.cart.items[cartProductIndex].quantity + 1;
            updateCartItems[cartProductIndex].quantity = newQty;
        }
        else {
            updateCartItems.push({ productId: new mongoDb.ObjectId(product._id), quantity: newQty });
        }
        
        const updateCart = { items: updateCartItems };
        const db = getDb();
        
        db.collection('users').updateOne({ _id: new mongoDb.ObjectId(this._id) }, { $set: { cart: updateCart } });
    }
    
    getCart() {
        const db = getDb();
        
        const productIds = this.cart.items.map(idx => {
            return idx.productId;
        });
        
        return db.collection('products').find({
            _id: {
                $in: productIds
            }
        }).toArray()
        .then(products => {
            return products.map(p => {
                return { ...p, quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity }
            });
        });
    }
    
    deleteItemFromCart(id) {
        const updateCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== id.toString();
        });
        
        const db = getDb();
        
        return db.collection('users').updateOne({ _id: new mongoDb.ObjectId(this._id) }, { $set: { cart: { items: updateCartItems } } });
    }
    
    addOrder() {
        const db = getDb();
        return this.getCart()
        .then(products => {
            const order = {
                items: products,
                user: {
                    _id: new mongoDb.ObjectId(this._id),
                    username: this.username,
                    email: this.email
                }
            };
            
            return db.collection('orders').insertOne(order);
        })
        .then(result => {
            this.cart = { items: [] };
            return db.collection('users').updateOne({ _id: new mongoDb.ObjectId(this._id) }, { $set: { cart: { items: [] } } });
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    getOrders() {
        const db = getDb();
        
        return db.collection('orders').find({
            'user._id': new mongoDb.ObjectId(this._id)
        }).toArray()
        .catch(err => {
            console.log(err);
        });
    }
    
    static findById(id) {
        const db = getDb();
        
        return db.collection('users').findOne({ _id: new mongoDb.ObjectId(id) })
        .catch(err => {
            console.log(err);
        })
    }
}

module.exports = User;
