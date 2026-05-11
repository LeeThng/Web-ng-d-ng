const Auth = require('../models/authModel');

const authController = {
    showLogin: (req, res) => {
        res.render('login', { error: null }); 
    },

    processLogin: (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        Auth.getUserByEmail(email, (err, user) => {
            if (err) return res.status(500).send('Lỗi hệ thống!');
            if (!user) return res.render('login', { error: 'Tài khoản không tồn tại trên hệ thống!' });
            if (user.password !== password) return res.render('login', { error: 'Sai mật khẩu, vui lòng thử lại!' });

            req.session.user = user;
            res.redirect('/');
        });
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) console.error('Lỗi khi đăng xuất:', err);
            res.redirect('/');
        });
    },

    // ==========================================
    // PHẦN MỚI THÊM: XỬ LÝ ĐĂNG KÝ TÀI KHOẢN
    // ==========================================
    
    // 4. Hiển thị form đăng ký
    showRegister: (req, res) => {
        res.render('register', { error: null });
    },

    // 5. Thẩm định và Lưu hồ sơ
    processRegister: (req, res) => {
        const { full_name, email, password, phone, address } = req.body;

        // Bước A: Kiểm tra xem Email đã có ai dùng chưa (Tránh trùng lặp tài khoản)
        Auth.getUserByEmail(email, (err, existingUser) => {
            if (err) return res.status(500).send('Lỗi hệ thống!');
            
            if (existingUser) {
                // Email đã bị đăng ký trước đó
                return res.render('register', { error: 'Email này đã được sử dụng! Vui lòng chọn email khác.' });
            }

            // Bước B: Nếu email hợp lệ, tiến hành lưu vào DB
            const newUser = { full_name, email, password, phone, address };
            
            Auth.registerUser(newUser, (err, result) => {
                if (err) return res.status(500).send('Lỗi khi tạo tài khoản!');

                // Bước C: Tự động đăng nhập luôn cho khách (Auto-login)
                newUser.id = result.insertId; // Lấy ID vừa được MySQL tạo ra
                newUser.role_id = 3;
                req.session.user = newUser;

                // Chuyển thẳng về trang chủ mua sắm
                res.redirect('/');
            });
        });
    },
    // 6. Hiển thị trang chỉnh sửa tài khoản
    showEditAccount: (req, res) => {
        // Nếu chưa đăng nhập thì không cho vào trang này
        if (!req.session.user) return res.redirect('/login');
        res.render('edit_account', { user: req.session.user, message: null });
    },

    // 7. Xử lý cập nhật thông tin
    processEditAccount: (req, res) => {
        const userId = req.session.user.id;
        const { full_name, phone, address } = req.body;

        Auth.updateUser(userId, { full_name, phone, address }, (err, result) => {
            if (err) return res.status(500).send('Lỗi cập nhật!');

            // QUAN TRỌNG: Cập nhật lại thông tin trong Session để Header hiển thị tên mới ngay lập tức
            req.session.user.full_name = full_name;
            req.session.user.phone = phone;
            req.session.user.address = address;

            res.render('edit_account', { 
                user: req.session.user, 
                message: 'Cập nhật thông tin thành công!' 
            });
        });
    }
};

module.exports = authController;