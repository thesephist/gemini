const fs = require('fs');
const path = require('path');

const secrets = require('../secrets.js');
const config = require('../config.js');

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

app.use(bodyParser.json());

const api = require('./api.js');
const views = require('./views.js');
const {
    User,
} = require('./storage.js');

const {
    auth,
    getCurrentUser,
    requestAuthentication,
} = require('./auth.js');
const session = require('express-session');
app.use(session({
    secret: secrets.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
}));

// AUTHENTICATION
auth(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth', (req, res) => {
    const current_user = getCurrentUser(req);
    if (current_user !== false) {
        res.redirect('/dashboard');
    }
}, passport.authenticate('google', {
    scope: ['email', 'profile'],
}));
app.get('/signup', (req, res) => {
    res.redirect(302, '/auth');
});
app.get(secrets.AUTH_REDIRECT_URL,
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        if (getCurrentUser(req) === false) {
            const user = new User({
                name: req.user.displayName,
                email: req.user.emails[0].value,
                google_id: req.user.id,
                // photo_url: req.photos[0].value,
            });
            user.save();
        }

        res.redirect('/dashboard');
    }
);
app.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});

// MAIN PAGE
app.get('/', (req, res) => {
    try {
        const current_user = getCurrentUser(req);

        if (current_user === false) {
            respondWith(res, 'index.html');
        } else {
            res.redirect(302, '/dashboard');
        }
    } catch (e) {
        console.error(e);
        respondWith(res, '500.html');
    }
});

// STATIC ASSETS
const STATIC_PATHS = {
    '/contact': 'contact.html',
    '/faq': 'faq.html',
    '/privacy': 'privacy.html',
    '/tos': 'tos.html',
}
const respondWith = (res, static_path) => {
    fs.readFile(`static/${static_path}`, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        res.set('Content-Type', 'text/html');
        res.send(data);
    });
}
for (const [uri, path] of Object.entries(STATIC_PATHS)) {
    app.get(uri, (req, res) => {
        try {
            respondWith(res, path);
        } catch (e) {
            console.error(e);
            // For now, assume it's a not-found error
            respondWith(res, '404.html');
        }
    });
}
app.use('/static', express.static('static'));

console.log('Initialized static paths');

// VIEWS
const VIEW_PATHS = {
    '/user/:user_id': views.userView,
    '/dashboard': views.dashboardView,
    '/requests': views.matchlistView,
    '/new_request': views.newRequestView,
    '/match/:match_id': views.matchView,
}
for (const [uri, renderer] of Object.entries(VIEW_PATHS)) {
    app.get(uri, (req, res) => {
        try {
            const current_user = getCurrentUser(req);

            if (current_user === false) {
                requestAuthentication(res);
            } else {
                res.set('Content-Type', 'text/html');
                const html = renderer(current_user, req.params);
                if (html !== false) {
                    res.send(html);
                } else {
                    respondWith(res, '404.html');
                }
            }
        } catch (e) {
            console.error(e);
            respondWith(res, '500.html');
        }
    })
}
console.log('Initialized view paths');


// API
const API_PATHS = {
    'GET /api/user/:user_id': api.user.get,

    'GET /api/request/:request_id': api.request.get,
    'POST /api/request': api.request.create,
    'PUT /api/request/:request_id': api.request.update,
    'DELETE /api/request/:request_id': api.request.close,

    'GET /api/match/:match_id': api.match.get,
    'POST /api/request/:request_id/match': api.match.create,
    'PUT /api/match/:match_id': api.match.update,
    'POST /api/accept_match/:match_id': api.match.accept,
    'POST /api/reject_match/:match_id': api.match.reject,
}
const METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
for (const [spec, handler] of Object.entries(API_PATHS)) {
    const [method, route] = spec.split(' ');
    let appMethod;
    if (METHODS.includes(method)) {
        appMethod = app[method.toLowerCase()].bind(app);
    } else {
        throw new Error(`Method ${method} for route ${route} is not valid`);
    }

    appMethod(route, (req, res) => {
        try {
            const current_user = getCurrentUser(req);

            res.set('Content-Type', 'application/json');
            const result = handler(current_user, req.params, req.body);
            res.send(JSON.stringify(result));
        } catch (e) {
            console.error(e);
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({
                error: '500 server error',
            }));
        }
    });
}
console.log('Initialized api paths');


// 404 last
app.use((req, res) => respondWith(res, '404.html'));

app.listen(
    config.PORT,
    () => console.log(`Gemini running on localhost:${config.PORT}`)
);

