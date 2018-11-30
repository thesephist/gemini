# Gemini

Studybuddy Prototype.

## TODOs

### Business logic

- Give users the ability to create new "courses" in the database that'll then autocomplete for other students. Not having all the courses is really creating a bottleneck.
- Have a view that shows everyone that's looking for studybuddies and show it when no requests are visible and on the first login screen. This will help it feel less desolate. Also, remove the test users me #2 and Divyansh fake divyansh.
- On the landing page, the key call to action next to sign up should be lower barrier: have a view of everyone that's looking for studybuddies, filterable by subject. (`/list?filter=<course>`) If not logged in, the "message" button should go to the google OAuth screen.

Landing page improvements

- The answer to "why not just study with friends?" should be _right on the front page_, so everybody who lands there can answer that question.
- "Is this for me?" that articulates the problem and solvency is great to have on the landing page
- Update screenshots on the landing page to be actually screenshots, not renders.

Verified tutor program-related

- Make tutor a special level of proficiency, and give them a badge that's "Verified tutor"
- Put verified tutors on the top of the list in search in a separate subsection
- Add a section to the landing page that calls out tutors to sign up.

### Usability / bug

- Temporarily add functionality to remove (read: `close()`) the current request and make a new one
- Fix design issues
    - The no-request first login screen on dashboard
- Profile view
    - Profiles should have a year and major
- Make the proficiency level on the signup page a slider input

### Technical

- Make the contact form work through mailgun, not IFTTT
- speed up `passport.deserializeUser` in `./src/auth.js` with an in-memory key value store for `user.google_id` -> `user.id`
- in JSONStorage, revise `async flush()` so it's safe to call multiple times without awaiting previous calls manually

