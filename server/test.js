// server/test.js — delete after testing
require('dotenv').config();
const eventModel = require('./models/eventModel');

const test = async () => {
  console.log(await eventModel.find(1)); // list all events with username and rsvp_count

  // more model methods...

  // Kill the process (the open pool connections) after running queries
  process.exit();
}
test();