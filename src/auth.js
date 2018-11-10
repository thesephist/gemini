const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const secrets = require('../secrets.js');

const {
    User,
} = require('./storage.js');

const auth = passport => {

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(
        new GoogleStrategy(
            {
                clientID: secrets.CLIENT_ID,
                clientSecret: secrets.CLIENT_SECRET,
                callbackURL: secrets.AUTH_HOST + secrets.AUTH_REDIRECT_URL,
            },
            (token, refreshToken, profile, done) => {
                console.log(profile);
                return done(null, {
                    profile: profile,
                    token: token,
                });
            }
        )
    );
};

const getCurrentUser = req => {
    // TODO: speed this up with an in-memory
    //  dict of email => user ID in our system

    if (req.user) {
        return User.where({
            email: req.user.email,
        });
    } else {
        return false;
    }
}

module.exports = {
    auth,
    getCurrentUser,
}

