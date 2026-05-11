const db = require('./db'); 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 1. Import thư viện session vừa cài
var session = require('express-session'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

// 2. Đổi extended thành true để lấy dữ liệu từ Form gửi lên chuẩn xác hơn
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 3. Cấu hình Session (Bộ nhớ tạm của server)
app.use(session({
  secret: 'dental_shop_secret_key_2026', // Mã bảo mật (bạn có thể đổi tùy ý)
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // Thời gian nhớ đăng nhập: 24 tiếng (tính bằng mili-giây)
}));

// 4. Khai báo biến toàn cục (middleware): Truyền thông tin user và số lượng giỏ hàng
app.use(function(req, res, next) {
  res.locals.user = req.session.user || null; 
  
  // TÍNH TỔNG SỐ LƯỢNG TRONG GIỎ HÀNG
  let count = 0;
  if (req.session.cart) {
      req.session.cart.forEach(item => {
          count += item.quantity;
      });
  }
  res.locals.cartCount = count; // Biến này sẽ dùng ở header.ejs
  
  next();
});

// Các Routes chính
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;