require('dotenv').config();

const path = require('path');
const express = require('express');

const cookieSession = require('cookie-session');

const logRoutes = require('./middleware/logRoutes');

const checkAuthentication = require('./middleware/checkAuthentication');

const { register, login, getMe, logout } = require('./controllers/authControllers');
const { updateUser, deleteUser } = require('./controllers/userControllers');
const { listEvents, createEvent, updateEvent, deleteEvent, listUserEvents } = require('./controllers/eventControllers');
const { createRsvp, deleteRsvp, listRsvp } = require('./controllers/rsvpControllers');

const app = express();

const PORT = process.env.PORT || 8080;

const pathToFrontend = process.env.NODE_ENV === 'production' ? '../frontend/dist' : '../frontend';

app.use(logRoutes);

app.use(cookieSession ({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, pathToFrontend)));

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', getMe);
app.delete('/api/auth/logout', logout);

app.patch('/api/users/:user_id', checkAuthentication, updateUser);
app.delete('/api/users/:user_id', checkAuthentication, deleteUser);

app.get('/api/events', listEvents);
app.post('/api/events', checkAuthentication, createEvent);
app.patch('/api/events/:event_id', checkAuthentication, updateEvent);
app.delete('/api/events/:event_id', checkAuthentication, deleteEvent);
app.get('/api/users/:user_id/events', listUserEvents);

app.post('/api/events/:event_id/rsvps', checkAuthentication, createRsvp);
app.delete('/api/events/:event_id/rsvps', checkAuthentication, deleteRsvp);
app.get('/api/users/:user_id/rsvps', listRsvp);

const handleError = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: 'Internal Server Error'})
};

app.use(handleError);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
