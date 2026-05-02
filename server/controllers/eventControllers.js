const eventModel = require('../models/eventModel');

const listEvents = async (req, res, next) => {
    try {
    const events = await eventModel.list();
    res.send(events)
    } catch (err) {
        next(err);
    }
};

const createEvent = async (req, res, next) => {
    try {
        const eventsArr = ['conference', 'workshop', 'social', 'networking', 'concert', 'sports', 'fundraiser', 'other']

        const { title, description, date, location, event_type, max_capacity } = req.body;

        if(!title || !description || !date || !location || !eventsArr.includes(event_type.toLowerCase()) || !max_capacity) {
            return res.status(400).send({error: 'Missing required fields or invalid event_type'});
        };

        const event = await eventModel.create(title, description, date, location, event_type, max_capacity);

        res.status(201).send(event);
    } catch (err) {
        next(err);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const eventId = Number(req.params.event_id);

        const existing = await eventModel.find(eventId);

        if(!existing) return res.status(404).send({ message: 'Event not found' });

        if (existing.user_id !== req.session.userId) {
            return res.status(403).send({ message: 'Not the owner' });
        };

        const { title, description, date, location, event_type, max_capacity, event_id } = req.body;

        const event = await eventModel.update(title ?? existing.title, description ?? existing.description, date ?? existing.date, location ?? existing.location, event_type ?? existing.event_type, max_capacity ?? existing.max_capacity, event_id ?? existing.event_id);
        res.send(event);
    } catch (err) {
        next(err)
    }
};

const deleteEvent = async (req, res, next) => {
    try {
        const eventId = Number(req.params.event_id);

        const existing = await eventModel.find(eventId);

        if (!existing) return res.status(404).send({ message: 'Event not found' });

        if (existing.user_id !== req.session.userId) {
            return res.status(403).send( { message: 'Not the owner' });
        };

        const event = await eventModel.destroy(eventId);
        res.send(event);
    } catch (err) {
        next(err);
    }
};

const listUserEvents = async (req, res, next) => {
    try {
        const userId = Number(req.params.user_id);
        const event = await eventModel.listEventsByUser(userId);
        res.send(event);
    } catch (err) {
        next(err);
    }
};

module.exports = { listEvents, createEvent, updateEvent, deleteEvent, listUserEvents };
