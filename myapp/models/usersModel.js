const db = require('../db');
const usersModel = {
    getAll: (callback) => {
        db.query('SELECT * FROM users', callback);
    },
    getById: (id, callback) => {
        db.query('SELECT * FROM users WHERE id = ?', [id], callback);
    }
};
module.exports = usersModel;