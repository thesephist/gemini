const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const api = require('./api.js');
const views = require('./views.js');

const config = require('../config.js');

// STATIC ASSETS
const STATIC_PATHS = {
    '/': 'index.html',
    '/contact': 'contact.html',
    '/faq': 'faq.html',
    '/signup': 'signup.html',
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
    '/requests': views.matchlistView,
    '/match/:match_id': views.matchView,
}
for (const [uri, renderer] of Object.entries(VIEW_PATHS)) {
    app.get(uri, (req, res) => {
        try {
            // TODO: authentication!
            const current_user = new User();

            res.set('Content-Type', 'text/html');
            const html = renderer(current_user, req.params);
            if (html !== false) {
                res.send(html);
            } else {
                respondWith(res, '404.html');
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
    'GET /api/user/:user_id': api.user_get,
    'PUT /api/user/:user_id': api.user_update,

    'GET /api/match/:match_id': api.match_get,
    'POST /api/match': api.match_create,
    'PUT /api/match/:match_id': api.match_update,
    'POST /api/accept_match/:match_id': api.match_accept,
    'POST /api/reject_match/:match_id': api.match_reject,
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
            // TODO: authentication!
            const current_user = new User();

            res.set('Content-Type', 'application/json');
            res.send(handler(current_user, req.params, req.body));
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
