const {
    User,
    Request,
    Match,
} = require('./storage.js');

const success = () => {
    return {
        success: true,
    }
}
const error = reason => {
    return {
        success: false,
        error: reason,
    }
}

const api = {
    user: {},
    request: {},
    match: {},
}

// USER

api.user.get = (current_user, params) => {
    const user = User.find(params.user_id);
    if (user) {
        return user.toJSON();
    } else {
        return error(`Could not find user with id ${params.user_id}`);
    }
}

// REQUEST

api.request.get = (current_user, params) => {
    const request = Request.find(params.request_id);
    if (request) {
        return request.toJSON();
    } else {
        return error(`Could not find request with id ${params.request_id}`);
    }
}

api.request.create = (current_user, params, body) => {
    const request = current_user.createRequest(
        body.course,
        body.proficiency,
        body.reason
    );
    return request.toJSON();
}

api.request.update = (current_user, params, body) => {
    const request = Request.find(params.request_id);
    if (request) {
        for (const [attr, value] of Object.entries(body)) {
            request.set(attr, value);
        }
        request.save();
        return request.toJSON();
    } else {
        return error(`Could not find request with id ${params.request_id}`);
    }
}

api.request.close = (current_user, params) => {
    const request = Request.find(params.request_id);
    if (request) {
        request.set('closed', true);
        request.save();
        return request.toJSON();
    } else {
        return error(`Could not find request with id ${params.request_id}`);
    }
}

// MATCH

api.match.get = (current_user, params) => {
    const match = Match.find(params.match_id);
    if (match) {
        return match.toJSON();
    } else {
        return error(`Could not find match with id ${params.match_id}`);
    }
}

api.match.create = (current_user, params, body) => {
    const request = Request.find(params.request_id);
    const respondentRequest = Request.find(body.respondent_request_id);
    if (request) {
        const match = request.createMatch(respondentRequest, body.message);
        return match.toJSON();
    } else {
        return error(`Could not find requests with id ${params.request_id} and ${body.respondent_request_id}`);
    }
}

api.match.update = (current_user, params, body) => {
    const match = Match.find(params.match_id);
    if (match) {
        for (const [attr, value] of Object.entries(body)) {
            match.set(attr, value);
        }
        match.save();
        return match.toJSON();
    } else {
        return error(`Could not find match with id ${params.match_id}`);
    }
}

api.match.accept = (current_user, params) => {
    const match = Match.find(params.match_id);
    if (match) {
        match.accept();
        return match.toJSON();
    } else {
        return error(`Could not find match with id ${params.match_id}`);
    }
}

api.match.reject = (current_user, params) => {
    const match = Match.find(params.match_id);
    if (match) {
        match.reject();
        return match.toJSON();
    } else {
        return error(`Could not find match with id ${params.match_id}`);
    }
}

module.exports = api;

