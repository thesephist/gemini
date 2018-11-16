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
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

};

const getCurrentUser = req => {
    if (secrets.DEVELOPMENT) {
        return User.all()[0];
    }

    if (req.user) {
        const users = User.where({
            google_id: req.user.id,
        });
        if (users.length === 0) {
            return false;
        } else {
            return users[0];
        }
    } else {
        return false;
    }
}

const requestAuthentication = res => {
    res.redirect(302, '/auth');
}

module.exports = {
    auth,
    getCurrentUser,
    requestAuthentication,
}

