const Model = require('../models/categoriesModel');

const categoriesController = {
    list: (req, res) => {
        Model.getAll((err, results) => {
            if (err) return res.status(500).send(err);
            res.render('categories', { data: results });
        });
    },
    detail: (req, res) => {
        Model.getById(req.params.id, (err, result) => {
            if (err) return res.status(500).send(err);
            res.render('categories_detail', { item: result[0] });
        });
    }
};
module.exports = categoriesController;