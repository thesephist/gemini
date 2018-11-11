const {
    User,
    Match,
} = require('./storage.js');

const headerTemplate = require('../templates/pageheader.js');
const footerTemplate = require('../templates/pagefooter.js');

const userTemplate = require('../templates/user.js');
const matchTemplate = require('../templates/match.js');
const dashboardTemplate = require('../templates/dashboard.js');
const newRequestTemplate = require('../templates/new_request.js');
const matchlistTemplate = require('../templates/matchlist.js');

const config = require('../config.js');

/**
 * Renders a full page with Studybuddy header and footer
 */
const renderFullPage = (current_user, title, innerPage) => {
    return headerTemplate(current_user, {
        title: title,
    }) + innerPage + footerTemplate(current_user, {});
}

const userView = (current_user, {
    user_id,
}) => {
    const user = User.find(user_id);
    if (user) {
        const innerPage = userTemplate(current_user, {
            name: user.get('name'),
            email: user.get('email'),
        });

        return renderFullPage(
            current_user,
            `${user.get('name')} | Studybuddy`,
            innerPage
        );
    } else {
        return false;
    }
}

const matchView = (current_user, {
    match_id,
}) => {
    const match = Match.find(match_id);
    if (match) {
        const innerPage = matchTemplate(current_user, {
            match,
        });

        return renderFullPage(
            current_user,
            `Match Request | Studybuddy`,
            innerPage
        );
    } else {
        return false;
    }
}

const dashboardView = (current_user) => {
    const innerPage = dashboardTemplate(current_user, {
        // TODO
    });

    return renderFullPage(
        current_user,
        `Dashboard | Studybuddy`,
        innerPage
    );
}

const newRequestView = (current_user) => {
    const innerPage = newRequestTemplate(current_user, {
        // TODO
    });

    return renderFullPage(
        current_user,
        `New request | Studybuddy`,
        innerPage
    );
}

const matchlistView = (current_user) => {
    const innerPage = matchlistTemplate(current_user, {
        // TODO
    });

    return renderFullPage(
        current_user,
        `Match requests | Studybuddy`,
        innerPage
    );
}

module.exports = {
    userView,
    dashboardView,
    newRequestView,
    matchView,
    matchlistView,
};

