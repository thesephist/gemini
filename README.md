# Gemini

Studybuddy Prototype.

## General Administrivia

## TODOs

### Business logic

- Make tutor a special level of proficiency, and give them a badge that's "Verified tutor"
- If you hit "cancel" on the message send dialog, it still sends a message. Fix this.
- Put verified tutors on the top of the list in search in a separate subsection
- Add a section to the landing page that calls out tutors to sign up.
- Profiles should have a year and major
- Update screenshots on the landing page to be actually screenshots, not renders.
- Log out button

### Usability / bug

- Update the button on the front page to not take an email field
- Profile view
- Disallow creating two requests at the same time (for now) at the model level
- Validate input on the "working on" in request form
- Temporarily add functionality to remove the current request and make a new one
- When attempting to send a match request to a request that has already requested a match, don't double-send
- Make the proficiency level on the signup page a slider input

### Technical

- Make sure people can't access profile info about others that isn't public. (email)
- Make the contact form work through mailgun, not IFTTT
- Google Analytics through l7@berkeley.edu
- speed up `getCurrentUser` in `./src/auth.js` with an in-memory key value store for `user.google_id` -> `user.id`

