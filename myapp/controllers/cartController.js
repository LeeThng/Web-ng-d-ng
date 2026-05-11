const Product = require('../models/productsModel');

const cartController = {
    // Xem danh sách giỏ hàng
    showCart: (req, res) => {
        const cart = req.session.cart || [];
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        res.render('cart', { cart, total, title: 'Giỏ hàng - Onyx Dental' });
    },

    // Thêm sản phẩm
    addToCart: (req, res) => {
        const productId = req.body.productId;
        const quantity = parseInt(req.body.quantity) || 1;

        if (!req.session.cart) req.session.cart = [];
        const cart = req.session.cart;

        const itemIndex = cart.findIndex(p => p.id == productId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += quantity;
            res.redirect('/cart');
        } else {
            Product.getById(productId, (err, product) => {
                if (product) {
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.main_image,
                        quantity: quantity
                    });
                }
                res.redirect('/cart');
            });
        }
    }
};
module.exports = cartController;