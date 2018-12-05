# TODOs

## Business logic (in order of priority)

- Add `User.available_times` and `User.available_locations` (both user input strings) and ask then on `/new_request` as optional.
  - Show on `matchbox` view.
- Give users the ability to create new "courses" in the database that'll then autocomplete for other students. Not having all the courses is really creating a bottleneck.
- Add functionality to mark one's request as "closed", if you've already found the right partners. Otherwise the top people will get all the messages.
- As a footer of all the emails we send, link to `/contact` and ask for feedback / improvements / class suggestions.
- On landing page show "X Berkeley students looking for studybuddies in (top courses list)".
- Have a view that shows everyone that's looking for studybuddies and show it when no requests are visible and on the first login screen. This will help it feel less desolate. Also, remove the test users me #2 and Divyansh fake divyansh.
- Short, 140-character bio per profile.

## Landing page improvements

- The answer to "why not just study with friends / use Piazza / Facebook?" should be _right on the front page_, so everybody who lands there can answer that question.
- "Is this for me?" that articulates the problem and solvency is great to have on the landing page
- Update screenshots on the landing page to be actually screenshots, not renders.
- On the landing page, the key call to action next to sign up should be lower barrier: have a view of everyone that's looking for studybuddies, filterable by subject. (`/list?filter=<course>`) If not logged in, the "message" button should go to the google OAuth screen.

## Security and permissions
- Make sure `/match/` and `/request/` routes return a 404 for models that the requester doesn't have access t
    - A great way to solve this would be to add a `StoredObject.prototype.allForUser(current_user: User)` method for each class.

## Usability / bug

- Improve what happens when you first log in -- getting redirected to `/new_request` as a new user might be turning some people away.
- Make the proficiency level on the signup page a slider input
- Ability to use phone number as contact that shows up when accepted, in addition to email.

## Technical

- `become_user` functionality -- implement by authenticating their request as another user. Look up how to do in passport maybe?
- Add ability for view renderers to respond with HTTP response code and redirect options instead of simply `false`.
- Make the contact form work through mailgun, not IFTTT, sending emails to hi@studybuddy.com.
- speed up `passport.deserializeUser` in `./src/auth.js` with an in-memory key value store for `user.google_id` -> `user.id`
- in JSONStorage, revise `async flush()` so it's safe to call multiple times without awaiting previous calls manually

