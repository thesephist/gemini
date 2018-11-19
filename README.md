# Gemini

Studybuddy Prototype.

## TODOs

### Business logic

- Update the button on the front page to not take an email field
- Disallow creating two requests at the same time (for now) at the model level
- Temporarily add functionality to remove the current request and make a new one
- When attempting to send a match request to a request that has already requested a match, don't double-send
- Persist session token records in db/sessions.json

- Make tutor a special level of proficiency, and give them a badge that's "Verified tutor"
- Put verified tutors on the top of the list in search in a separate subsection
- Add a section to the landing page that calls out tutors to sign up.
- Profiles should have a year and major

### Usability / bug

- Profile view
- Update screenshots on the landing page to be actually screenshots, not renders.
- Make the proficiency level on the signup page a slider input

### Technical

- Make sure people can't access profile info about others that isn't public. (email)
- Make the contact form work through mailgun, not IFTTT
- Google Analytics through l7@berkeley.edu
- speed up `getCurrentUser` in `./src/auth.js` with an in-memory key value store for `user.google_id` -> `user.id`
- in JSONStorage, revise `async flush()` so it's safe to call multiple times without awaiting previous calls manually

