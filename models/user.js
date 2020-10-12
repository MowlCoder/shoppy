const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String
    },
    resetTokenExpiration: {
        type: Date
    },
    cart: {
        items: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.product.toString() === product._id.toString();
    });
    
    let newQty = 1;
    const updateCartItems = [...this.cart.items];
    
    if (cartProductIndex >= 0) {
        newQty = this.cart.items[cartProductIndex].quantity + 1;
        updateCartItems[cartProductIndex].quantity = newQty;
    }
    else {
        updateCartItems.push({ product: product._id, quantity: newQty });
    }
    
    const updateCart = { items: updateCartItems };
    
    this.cart = updateCart;
    
    return this.save();
};

userSchema.methods.removeFromCart = function(id) {
    const updateCartItems = this.cart.items.filter(item => {
        return item.product.toString() !== id.toString();
    });
    
    this.cart.items = updateCartItems;
    
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = {
        items: []
    }
    
    this.save();
};

module.exports = mongoose.model('User', userSchema);
