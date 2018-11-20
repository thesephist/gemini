# Gemini

Studybuddy Prototype.

## TODOs

### Business logic

- Persist session token records in db/sessions.json

- Temporarily add functionality to remove the current request and make a new one
- Update the button on the front page to not take an email field
- Profiles should have a year and major

Verified tutor program-related
    - Make tutor a special level of proficiency, and give them a badge that's "Verified tutor"
    - Put verified tutors on the top of the list in search in a separate subsection
    - Add a section to the landing page that calls out tutors to sign up.

### Usability / bug

- Fix design issues
    - The no-request first login screen on dashboard
    - The new_request page
- Profile view
- Update screenshots on the landing page to be actually screenshots, not renders.
- Make the proficiency level on the signup page a slider input

### Technical

- Make the contact form work through mailgun, not IFTTT
- Google Analytics through l7@berkeley.edu
- speed up `getCurrentUser` in `./src/auth.js` with an in-memory key value store for `user.google_id` -> `user.id`
- in JSONStorage, revise `async flush()` so it's safe to call multiple times without awaiting previous calls manually

