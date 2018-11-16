# Gemini

Studybuddy Prototype.

## General Administrivia

- Make tutor a special level of proficiency, and give them a badge that's "Verified tutor", put them on the top of the list in search in a separate subsection
- Add a section to the landing page that calls out tutors to sign up.
- Profiles should have a year and major
- Profile view with year and major
- Disallow creating two requests at the same time (for now) at the model level
- Limit login to CalNet emails
- Update the button on the front page to not take an email field
- Log out button
- Validate input on the "working on" in request form
- Make sure people can't access profile info about others that isn't public. (email)

- Limit it to berkeley.edu emails to start
- Temporarily add functionality to remove the current request and make a new one
- When attempting to send a match request to a request that has already requested a match, don't double-send
- Make the proficiency level on the signup page a slider input

- Make the contact form work through mailgun, not IFTTT
- Google Analytics through l7@berkeley.edu
- Update Google Analytics to be at getstudybuddy.com

- speed up `getCurrentUser` in `./src/auth.js` with an in-memory key value store for `user.google_id` -> `user.id`

