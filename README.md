# Gemini

Studybuddy Prototype.

## TODOs

### Business logic

- Temporarily add functionality to remove (read: `close()`) the current request and make a new one

Verified tutor program-related
    - Make tutor a special level of proficiency, and give them a badge that's "Verified tutor"
    - Put verified tutors on the top of the list in search in a separate subsection
    - Add a section to the landing page that calls out tutors to sign up.

### Usability / bug

- Fix design issues
    - The no-request first login screen on dashboard
    - The new_request page
- Profile view
    - Profiles should have a year and major
- Update screenshots on the landing page to be actually screenshots, not renders.
- Make the proficiency level on the signup page a slider input

### Technical

- Make the contact form work through mailgun, not IFTTT
- Google Analytics through l7@berkeley.edu
- speed up `passport.deserializeUser` in `./src/auth.js` with an in-memory key value store for `user.google_id` -> `user.id`
- in JSONStorage, revise `async flush()` so it's safe to call multiple times without awaiting previous calls manually

