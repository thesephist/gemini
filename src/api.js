const storage = require('./storage.js');

const config = require('../config.js');

/*
 * We need APIs for...
 *
 * Users
 * 1. updating
 * 2. fetching data
 *
 * Match
 * 1. creating
 * 2. updating
 * 3. accepting and rejecting (yes, separately)
 * 4. fetching data
 */

const user_update = (current_user, params, body) => {
    // TODO: implement
}

const user_get = (current_user, params, body) => {
    // TODO: implement
}

const match_create = (current_user, params, body) => {
    // TODO: implement
}

const match_update = (current_user, params, body) => {
    // TODO: implement
}

const match_accept = (current_user, params, body) => {
    // TODO: implement
}

const match_reject = (current_user, params, body) => {
    // TODO: implement
}

const match_get = (current_user, params, body) => {
    // TODO: implement
}

module.exports = {
    user_update,
    user_get,

    match_create,
    match_update,
    match_accept,
    match_reject,
    match_get,
};

