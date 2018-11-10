const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({
    extended: false,
}));

const api = require('./api.js');
const views = require('./views.js');

const config = require('../config.js');

// STATIC ASSETS
const STATIC_PATHS = {
    '/': 'index.html',
    '/contact': 'contact.html',
    '/faq': 'faq.html',
    '/signup': 'signup.html',
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


// VIEWS


// API


// 404 last
app.use((req, res) => respondWith(res, '404.html'));

app.listen(
    config.PORT,
    () => console.log(`Gemini running on localhost:${config.PORT}`)
);

