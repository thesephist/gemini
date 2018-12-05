# Studybuddy

Studybuddy helps university students find classmates to study with.

![Studybuddy Screenshot](https://github.com/thesephist/gemini/doc/img/screenshot.png)

Studybuddy is still in the alpha phase, and is more a proof of concept and less a production app. Lots of things are not scalable, and lots of things are changing pretty rapidly (including the database schema, which is why we roll custom for now).

## Setup and installation

Studybuddy is a Nodejs and Express app. To run your own instance:

1. Clone the repository: `git clone https://github.com/thesephist/gemini.git`
2. Install NPM dependencies. If you use yarn, you can run `yarn install` to install based on the provided lockfile. Otherwise, `npm install` will work just fine.
3. The app needs a `secrets.js` file in the root folder of the project with configuration variables to do some of its authentication / email automation magic. Here's a breakdown of an example:
    ```js
    // secrets.js

    module.exports = {
        // Domain at which the app runs.
        // This will be used to redirect from Google's authentication page
        AUTH_HOST: 'http://localhost:5050',

        // Authentication redirect URL path. `/auth/google/redirect` should work just fine.
        AUTH_REDIRECT_URL: '/auth/google/redirect',

        // Google OAuth API keys
        // You can get these keys at Google Developer Console by creating a new app
        CLIENT_ID: '<put your OAuth API key here>.apps.googleusercontent.com',
        CLIENT_SECRET: '<put your secret key here>',

        // This is a random , persistent key used to generate cookies used
        //  in the authentication process. Pick any sufficiently random string.
        COOKIE_KEY: '<your cookie key>',

        // Mailgun API keys -- get them at mailgun.com for free (with a domain)
        //  These keys aren't needed for you to use the rest of the app, but
        //  having incorrect keys will make your email requests error in production.
        MG_DOMAIN: '<your mailgun domain>',
        MG_API_KEY: '<your mailgun API key>',

        // If you're running a development version, setting this to true
        //  will disable real emails from being sent during testing.
        // This is `false` by default.
        DEVELOPMENT: true,
    }
    ```
4. Start the app with `yarn start` or `npm start`!

The app should persist database data to `/db/db.json` and session data to `/db/sessions/` by default. Modify them in `config.js` to change them.

## TODOs

### Business logic (in order of priority)

- Add `User.available_times` and `User.available_locations` (both user input strings) and ask then on `/new_request` as optional.
  - Show on `matchbox` view.
- Give users the ability to create new "courses" in the database that'll then autocomplete for other students. Not having all the courses is really creating a bottleneck.
- Add functionality to mark one's request as "closed", if you've already found the right partners. Otherwise the top people will get all the messages.
- As a footer of all the emails we send, link to `/contact` and ask for feedback / improvements / class suggestions.
- On landing page show "X Berkeley students looking for studybuddies in (top courses list)".
- Have a view that shows everyone that's looking for studybuddies and show it when no requests are visible and on the first login screen. This will help it feel less desolate. Also, remove the test users me #2 and Divyansh fake divyansh.
- Short, 140-character bio per profile.

### Landing page improvements

- The answer to "why not just study with friends / use Piazza / Facebook?" should be _right on the front page_, so everybody who lands there can answer that question.
- "Is this for me?" that articulates the problem and solvency is great to have on the landing page
- Update screenshots on the landing page to be actually screenshots, not renders.
- On the landing page, the key call to action next to sign up should be lower barrier: have a view of everyone that's looking for studybuddies, filterable by subject. (`/list?filter=<course>`) If not logged in, the "message" button should go to the google OAuth screen.

### Security and permissions
- Make sure `/match/` and `/request/` routes return a 404 for models that the requester doesn't have access t
    - A great way to solve this would be to add a `StoredObject.prototype.allForUser(current_user: User)` method for each class.

### Verified tutor program-related

- Make tutor a special type of user, and give them a badge that's "Verified tutor"
- Put verified tutors on the top of the list in search in a separate subsection
- Add a section to the landing page that calls out tutors to sign up.

### Usability / bug

- Make the proficiency level on the signup page a slider input
- Ability to use phone number as contact that shows up when accepted, in addition to email.

### Technical

- `become_user` functionality -- implement by authenticating their request as another user. Look up how to do in passport maybe?
- Add ability for view renderers to respond with HTTP response code and redirect options instead of simply `false`.
- Make the contact form work through mailgun, not IFTTT, sending emails to hi@studybuddy.com.
- speed up `passport.deserializeUser` in `./src/auth.js` with an in-memory key value store for `user.google_id` -> `user.id`
- in JSONStorage, revise `async flush()` so it's safe to call multiple times without awaiting previous calls manually

## Contributing

If you'd like to contribute new features, file bugs, or implement some of the TODO features above, please fele free to put in a PR or file an issue!

