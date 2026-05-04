**1. What did you ask the AI to help you with, and why did you choose to use AI for that specific task?**

For the `GET/api/:user_id/rsvps` endpoint I needed to return full event objects with `username` and `rsvp_count` for every event a specific user had rsvped to. The query I wrote wasn't working correctly and I didn't understand why. I knew I needed to use the rsvp table but I couldn't figure out how to both filter by the user and count all RSVPs at the same time.

I asked AI:
I'm building an event-planning API. I have a users, events, and RSVPs table. I need to return full event objects with username and rsvp_count for all events a specific user has RSVPed to. Is this correct? (Then I pasted my query.)

I felt like this was a good opportunity to use AI because the problem was specific to my schema and I wanted to understand what was wrong with my query.

**2. How did you evaluate whether the AI's output was correct or useful before using it?**

The AI explained that the problem with my original query was that filtering by `WHERE rsvps.user_id = $1` on a `LEFT JOIN` cancels out the left join and makes it behave like an `INNER JOIN`, which meant the `COUNT` would always return 1 instead of the actual total. Claude first gave me a subquery fix using `WHERE event_id IN (SELECT event_id FROM rsvps WHERE user_id = $1)`. I tested it and it worked but I didn't fully understand it. I asked if there was another way to write it without the subquery and also asked Claude to explain each line of both solutions. THen I tested the final query with curl and checked that `rsvp_count` was returning the correct total and not just 1 every time.

**3. How did what the AI produced differ from what you ultimately used, and what does that tell you about your own understanding of the problem?**

The AI first gave me a solution with a subquery but I didn't use it and asked for a version without it because I wanted to understand the solution not just use it. That led to a different approach where you start `FROM rsvps AS user_rsvps`. Which made more sense to me to start from the `rsvps` table and joining outward to get the event and username instead of using a subquery. I also learned that joining the same table twice requires a different name so the database knows which reference you mean in each part of the query.

**4. What did you learn from using AI in this way?**

It clarified for me why you can't always filter and count on the same table in one join. When they conflict you need to separate them using either a different name or a subquery. I also learned that pushing back and asking "can I do it this way instead" and "explain each line" is way more useful than just copying the first answer. Going back and forth with AI to understand the why behind something rather than just copying the solution is something I want to keep doing in order to learn.
