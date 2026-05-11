const Product = require('../models/productsModel');

const productsController = {
    // 1. Hiển thị danh sách sản phẩm (Có hỗ trợ lọc theo danh mục)
    list: (req, res) => {
        const categoryId = req.query.category;
        const sort = req.query.sort || 'newest'; // Lấy tham số sort, mặc định là newest

        if (categoryId) {
            Product.getByCategory(categoryId, sort, (err, results) => {
                if (err) return res.status(500).send("Lỗi");
                res.render('shop', { 
                    products: results, 
                    title: 'Danh mục sản phẩm',
                    currentCategory: categoryId,
                    currentSort: sort, // Gửi tham số sắp xếp hiện tại sang EJS
                    user: req.session.user || null 
                });
            });
        } else {
            Product.getAll(sort, (err, results) => {
                if (err) return res.status(500).send("Lỗi");
                res.render('shop', { 
                    products: results, 
                    title: 'Tất cả sản phẩm',
                    currentCategory: null,
                    currentSort: sort, // Gửi tham số sắp xếp hiện tại sang EJS
                    user: req.session.user || null 
                });
            });
        }
    },

    // 2. Hiển thị chi tiết 1 sản phẩm
    detail: (req, res) => {
        const productId = req.params.id;
        Product.getById(productId, (err, product) => {
            if (err) return res.status(500).send("Lỗi hệ thống");
            if (!product) return res.status(404).send("Không tìm thấy sản phẩm");
            
            res.render('product_detail', { 
                product: product, 
                user: req.session.user || null // Để Header biết ai đang đăng nhập
            });
        });
    },

    // 3. Xử lý tìm kiếm sản phẩm
    search: (req, res) => {
        const query = req.query.q;
        // Bạn có thể viết thêm hàm search trong Model hoặc dùng db.query trực tiếp ở đây
        const sql = "SELECT * FROM Products WHERE name LIKE ?";
        const db = require('../db'); 
        db.query(sql, [`%${query}%`], (err, results) => {
            if (err) return res.status(500).send("Lỗi tìm kiếm");
            res.render('shop', { 
                products: results, 
                title: `Kết quả tìm kiếm cho: "${query}"`,
                user: req.session.user || null
            });
        });
    }
};

module.exports = productsController;