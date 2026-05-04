const userModel = require('../models/userModel');

const updateUser = async (req, res, next) => {
    try {
        const userId = Number(req.params.user_id);

        if (userId !== req.session.userId) {
            return res.status(403).send({ message: 'Trying to update a different user'})
        }

        const { password_hash } = req.body;

        if (!password_hash) {
            return res.status(400).send({error: 'Missing password'});
        };

        const user = await userModel.update(userId, password_hash);

        if (!user) return res.status(404).send({ message: 'User not found'});
        res.send(user);
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = Number(req.params.user_id);

        if (userId != req.session.userId) {
            return res.status(403).send({ message: 'Trying to delete a different user'})
        }

        const user = await userModel.destroy(userId);
        if (!user) return res.status(404).send({ message:  'User not found'});
        res.send(user);
    } catch (err) {
        next(err);
    }
};

module.exports = { updateUser, deleteUser };