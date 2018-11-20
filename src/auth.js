const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const secrets = require('../secrets.js');

const {
    User,
} = require('./storage.js');

const auth = passport => {

    passport.use(
        new GoogleStrategy(
            {
                clientID: secrets.CLIENT_ID,
                clientSecret: secrets.CLIENT_SECRET,
                callbackURL: secrets.AUTH_HOST + secrets.AUTH_REDIRECT_URL,
            },
            (token, refreshToken, profile, done) => {
                return done(null, profile);
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((google_id, done) => {
        const users = User.where({
            google_id: google_id,
        });
        if (users.length === 0) {
            done(null);
        } else {
            done(null, users[0]);
        }
    });

};

module.exports = {
    auth,
}

