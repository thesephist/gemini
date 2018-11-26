# Gemini

Studybuddy Prototype.

## TODOs

### Business logic

- Temporarily add functionality to remove (read: `close()`) the current request and make a new one
- Have a view that shows everyone that's looking for studybuddies and show it when no requests are visible and on the first login screen. This will help it feel less desolate. Also, remove the test users me #2 and Divyansh fake divyansh.
- Make it SUPER CLEAR that you can't respond to the request email -- you have to click through and find their email address. This is confusing for me as an end user.
- There needs to be smoother lead-in from accepting a request to actually sending an email to them for the first time. _This is the awkwardness barrier. Fix it._
- If authenticating from an external link, redirect them after auth!
- It's not super obvious that you wait for an email if you don't find someone on there already. Make it obvious.

Landing page improvements

- On the landing page, the key call to action next to sign up should be lower barrier: have a view of everyone that's looking for studybuddies, filterable by subject. (`/list?filter=<course>`) If not logged in, the "message" button should go to the google OAuth screen.
- The answer to "why not just study with friends?" should be _right on the front page_, so everybody who lands there can answer that question.
- "Is this for me?" that articulates the problem and solvency is great to have on the landing page

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

