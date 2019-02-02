const GoogleStrategy = require('passport-google-oauth20').Strategy;

const secrets = require('../secrets.js');

const {
    User,
} = require('./models.js');
const {
    now,
} = require('./utils.js');

const auth = passport => {

    passport.use(
        new GoogleStrategy(
            {
                clientID: secrets.CLIENT_ID,
                clientSecret: secrets.CLIENT_SECRET,
                callbackURL: secrets.AUTH_HOST + secrets.AUTH_REDIRECT_URL,
            },
            (token, refreshToken, profile, done) => {
                const users = User.where({
                    google_id: profile.id,
                });
                if (users.length > 0) {
                    return done(null, users[0]);
                } else {
                    const user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        google_id: profile.id,
                        photo_url: profile.photos && profile.photos[0] && profile.photos[0].value,
                        created_time: now(),
                    });
                    user.save();
                    return done(null, user);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((user_id, done) => {
        done(null, User.find(user_id) || false);
    });

};

module.exports = {
    auth,
}

