const express = require('express');
const router = express.Router();

// Import các Controller và Model cần thiết
const productsController = require('../controllers/productsController');
const authController = require('../controllers/authController');
const Product = require('../models/productsModel');
const cartController = require('../controllers/cartController');


/* 1. TRANG CHỦ - Tách biệt Flash Sale và Sản phẩm Bán chạy nhất tháng */
router.get('/', function(req, res, next) {
    // Bước A: Lấy hàng Flash Sale
    Product.getFlashSales((err, flashSales) => {
        if (err) flashSales = [];

        // Bước B: Lấy hàng Bán chạy nhất tháng (Hàm vừa thêm ở trên)
        Product.getTopSellingOfMonth(4, (err, topSelling) => {
            if (err) {
                console.error("Lỗi lấy hàng bán chạy:", err);
                topSelling = [];
            }

            // Nếu tháng này chưa có ai mua (topSelling trống), 
            // ta lấy tạm 4 sản phẩm mới nhất để hiện thị cho đẹp
            Product.getAll((err, allProducts) => {
                const featured = (topSelling && topSelling.length > 0) 
                                 ? topSelling 
                                 : (allProducts || []).slice(0, 4);

                res.render('index', { 
                    title: 'Nha Khoa Onyx', 
                    featuredProducts: featured, 
                    flashSaleProducts: flashSales || []
                });
            });
        });
    });
});

/* 2. TRANG SẢN PHẨM */
router.get('/products', productsController.list);
router.get('/products/:id', productsController.detail);

/* 3. QUẢN LÝ TÀI KHOẢN & XÁC THỰC */
router.get('/login', authController.showLogin);
router.post('/login', authController.processLogin);
router.get('/logout', authController.logout);

router.get('/register', authController.showRegister);
router.post('/register', authController.processRegister);

router.get('/account/edit', authController.showEditAccount);
router.post('/account/edit', authController.processEditAccount);

// Quản lý giỏ hàng
router.get('/cart', cartController.showCart);
router.post('/cart/add', cartController.addToCart);

module.exports = router;