const mysql = require('mysql2');

// Cấu hình thông tin kết nối
const connection = mysql.createConnection({
  host: '127.0.0.1', // Dùng IP này để tránh lỗi vặt của localhost
  user: 'root',
  password: '',      // Mặc định XAMPP để trống
  database: 'dental_shop'
});

// Thử kết nối
connection.connect((err) => {
  if (err) {
    console.error('❌ Lỗi kết nối MySQL: ' + err.stack);
    return;
  }
  console.log('✅ Đã kết nối MySQL thành công! ID kết nối: ' + connection.threadId);
});

module.exports = connection;