const Model = require('../models/usersModel');

const usersController = {
    list: (req, res) => {
        Model.getAll((err, results) => {
            if (err) return res.status(500).send(err);
            res.render('users', { data: results });
        });
    },
    detail: (req, res) => {
        Model.getById(req.params.id, (err, result) => {
            if (err) return res.status(500).send(err);
            res.render('users_detail', { item: result[0] });
        });
    }
};
module.exports = usersController;