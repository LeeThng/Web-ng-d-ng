const db = require('../db');
const categoriesModel = {
    getAll: (callback) => {
        db.query('SELECT * FROM categories', callback);
    },
    getById: (id, callback) => {
        db.query('SELECT * FROM categories WHERE id = ?', [id], callback);
    }
};
module.exports = categoriesModel;