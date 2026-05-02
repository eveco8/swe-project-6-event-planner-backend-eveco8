const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
    await pool.query('DROP TABLE IF EXISTS rsvps');
    await pool.query('DROP TABLE IF EXISTS events');
    await pool.query('DROP TABLE IF EXISTS users');

    await pool.query(`
        CREATE TABLE users (
        user_id         SERIAL  PRIMARY KEY,
        username        TEXT    NOT NULL  UNIQUE,
        password   TEXT    NOT NULL
        )
        `);
    
    await pool.query(`
        CREATE TABLE events (
        event_id        SERIAL  PRIMARY KEY,
        title           TEXT    NOT NULL,
        description     TEXT,    
        date            TEXT    NOT NULL,
        location        TEXT    NOT NULL,
        event_type      TEXT    NOT NULL,
        max_capacity    INT     NOT NULL,
        user_id         INT     REFERENCES users(user_id) ON DELETE CASCADE
        )
        `);

    await pool.query(`
        CREATE TABLE rsvps (
        rsvp_id     SERIAL  PRIMARY KEY,
        user_id     INT     REFERENCES users(user_id) ON DELETE CASCADE,
        event_id    INT     REFERENCES events(event_id) ON DELETE CASCADE,
        UNIQUE (user_id, event_id)
        )
        `);

    const markHash = await bcrypt.hash('sixseven', SALT_ROUNDS);
    const evelinHash = await bcrypt.hash('iliketurtles', SALT_ROUNDS);
    const luigiHash = await bcrypt.hash('mario123', SALT_ROUNDS);

    const insertUserSql = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id'

    const markResponse = await pool.query(insertUserSql, ['mark', markHash]);
    const evelinResponse = await pool.query(insertUserSql, ['evelin', evelinHash]);
    const luigiResponse = await pool.query(insertUserSql, ['luigi', luigiHash]);

    const markId = markResponse.rows[0].user_id;
    const evelinId = evelinResponse.rows[0].user_id;
    const luigiId = luigiResponse.rows[0].user_id;

    const insertEventsSql = 'INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING event_id'
     
    const eventMarkResponse = await pool.query(insertEventsSql, ['Tech Conference 2026', 'Annual technology conference.', '2026-06-15', 'San Francisco Convention Center, CA', 'conference', 500, markId]);
    const eventEvelinResponse = await pool.query(insertEventsSql, ['Community Yoga in the Park', 'A relaxing outdoor yoga session!', '2026-05-10', 'Central Park, New York, NY', 'social', 75, evelinId]);
    const eventLouigiResponse = await pool.query(insertEventsSql, ['Startup Pitch Night', 'Early-stage founders pitch their ideas.', '2026-05-22', 'WeWork Downtown, Chicago, IL', 'networking', 150, luigiId]);
    
    const eventMarkId = eventMarkResponse.rows[0].event_id;
    const eventEvelinId = eventEvelinResponse.rows[0].event_id;
    const eventLouigiId = eventLouigiResponse.rows[0].event_id;

    const insertRspvsSql = 'INSERT INTO rsvps (user_id, event_id) VALUES ($1, $2)';
    await pool.query(insertRspvsSql, [markId, eventMarkId]);
    await pool.query(insertRspvsSql, [evelinId, eventMarkId]);
    await pool.query(insertRspvsSql, [evelinId, eventEvelinId]);
    await pool.query(insertRspvsSql, [markId, eventEvelinId]);
    await pool.query(insertRspvsSql, [luigiId, eventEvelinId]); 
    await pool.query(insertRspvsSql, [luigiId, eventLouigiId]); 
    await pool.query(insertRspvsSql, [evelinId, eventLouigiId]);
};

seed()
    .catch((err) => {
        console.error('Error seeding database:', err);
        process.exit(1)
    })
    .finally(() => pool.end());
