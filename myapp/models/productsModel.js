const db = require('../db');

const productsModel = {
    // Hàm 1: Lấy danh sách (giữ nguyên)
    getAll: function(sort, callback) {
        let orderBy = "p.id DESC"; // Mặc định là mới nhất
        if (sort === 'price-asc') orderBy = "p.price ASC";
        if (sort === 'price-desc') orderBy = "p.price DESC";

        const sql = `
            SELECT p.*, c.name as category_name 
            FROM Products p 
            LEFT JOIN Categories c ON p.category_id = c.id
            ORDER BY ${orderBy}
        `;
        db.query(sql, callback);
    },

    // Hàm 2: Lấy chi tiết 1 sản phẩm theo ID (MỚI THÊM)
    getById: function(id, callback) {
        const sqlProduct = `
            SELECT p.*, c.name as category_name 
            FROM Products p 
            LEFT JOIN Categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;
        
        db.query(sqlProduct, [id], (err, productResult) => {
            if (err) return callback(err, null);
            if (productResult.length === 0) return callback(null, null); // Không tìm thấy

            const product = productResult[0];

            // Truy vấn lấy thêm ảnh từ bảng Product_Images
            const sqlImages = `SELECT * FROM Product_Images WHERE product_id = ?`;
            db.query(sqlImages, [id], (err, imageResults) => {
                if (err) return callback(err, null);
                
                // Gắn mảng ảnh tìm được vào object product
                product.images = imageResults; 
                callback(null, product); 
            });
        });
    },

    // Hàm lấy sản phẩm đang giảm giá (Flash Sale)
    getFlashSales: function(callback) {
        const sql = `
            SELECT p.*, c.name as category_name 
            FROM Products p 
            LEFT JOIN Categories c ON p.category_id = c.id
            WHERE p.old_price IS NOT NULL AND p.old_price > p.price
            ORDER BY (p.old_price - p.price) DESC 
            LIMIT 4
        `;
        // Giải thích: Lọc những món có giá cũ > giá mới, ưu tiên món giảm sâu nhất lên đầu
        db.query(sql, callback);
    },
    getTopSellingOfMonth: function(limit, callback) {
        const sql = `
            SELECT p.*, SUM(oi.quantity) as total_sold 
            FROM Products p
            JOIN Order_Items oi ON p.id = oi.product_id
            JOIN Orders o ON oi.order_id = o.id
            WHERE MONTH(o.order_date) = MONTH(CURRENT_DATE()) 
              AND YEAR(o.order_date) = YEAR(CURRENT_DATE())
              AND o.status = 'completed'
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT ?
        `;
        db.query(sql, [limit], callback);
    },
    // Hàm lấy sản phẩm theo danh mục
    getByCategory: function(categoryId, sort, callback) {
        let orderBy = "p.id DESC";
        if (sort === 'price-asc') orderBy = "p.price ASC";
        if (sort === 'price-desc') orderBy = "p.price DESC";

        const sql = `
            SELECT p.*, c.name as category_name 
            FROM Products p 
            LEFT JOIN Categories c ON p.category_id = c.id
            WHERE p.category_id = ?
            ORDER BY ${orderBy}
        `;
        db.query(sql, [categoryId], callback);
    },
};

module.exports = productsModel;