const rsvpModel = require('../models/rsvpModel');

const createRsvp = async (req, res, next) => {
    try {
        const eventId = Number(req.params.event_id)

        const rsvp = await rsvpModel.create(req.session.userId, eventId);
        res.status(201).send(rsvp);
    } catch (err) {
        next(err);
    }
};

const deleteRsvp =  async (req, res, next) => {
    try {
        const eventId = Number(req.params.event_id);

        const rsvp = await rsvpModel.destroy(req.session.userId, eventId);

        res.send(rsvp);
    } catch (err) {
        next(err); 
    }
};

const listRsvp = async (req, res, next) => {
    try {
        const userId = Number(req.params.user_id);
        const rsvp = await rsvpModel.list(userId);
        res.send(rsvp);
    } catch (err) {
        next(err);
    }
};

module.exports = { createRsvp, deleteRsvp, listRsvp };
