const db = require('../db');

const authModel = {
    // 1. Tìm người dùng dựa trên email (dùng cho cả Đăng nhập và Kiểm tra trùng lặp)
    getUserByEmail: function(email, callback) {
        const sql = `SELECT * FROM Users WHERE email = ?`;
        db.query(sql, [email], (err, results) => {
            if (err) return callback(err, null);
            if (results.length > 0) return callback(null, results[0]);
            return callback(null, null);
        });
    },

    // 2. Mở tài khoản mới (Insert vào Database)
    registerUser: function(userData, callback) {
        // Mặc định khách hàng tự đăng ký trên web sẽ có role_id = 3 (Customer)
        const sql = `INSERT INTO Users (role_id, full_name, email, password, phone, address) VALUES (3, ?, ?, ?, ?, ?)`;
        
        const values = [userData.full_name, userData.email, userData.password, userData.phone, userData.address];
        
        db.query(sql, values, (err, result) => {
            if (err) return callback(err, null);
            return callback(null, result);
        });
    },

    // Hàm cập nhật thông tin người dùng
    updateUser: function(id, userData, callback) {
        const sql = `UPDATE Users SET full_name = ?, phone = ?, address = ? WHERE id = ?`;
        const values = [userData.full_name, userData.phone, userData.address, id];
        
        db.query(sql, values, callback);
    }
};

module.exports = authModel;