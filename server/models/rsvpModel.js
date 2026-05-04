const pool = require('../db/pool');

module.exports.create = async (user_id, event_id) => {
    const query = `INSERT INTO rsvps (user_id, event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *;`
    const { rows } = await pool.query(query, [user_id, event_id]);
    return rows[0] || null;
};

module.exports.destroy = async (user_id, event_id) => {
    const query = `DELETE FROM rsvps WHERE user_id = $1 AND event_id = $2 RETURNING *;`
    const { rows } = await pool.query(query, [user_id, event_id]);
    return rows[0] || null;
};

module.exports.list = async (user_id) => {
    const query = `SELECT events.*, users.username, COUNT(rsvps.rsvp_id) AS rsvp_count  
    FROM rsvps AS user_rsvps
    INNER JOIN events ON user_rsvps.event_id = events.event_id
    INNER JOIN users ON events.user_id = users.user_id
    LEFT JOIN rsvps ON events.event_id = rsvps.event_id
    WHERE user_rsvps.user_id = $1
    GROUP BY events.event_id, users.username
    ORDER BY events.date ASC;`
    const { rows } = await pool.query(query, [user_id]);
    return rows;
};
