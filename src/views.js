const {
    User,
    Match,
} = require('./storage.js');

const headerTemplate = require('../templates/pageheader.js');
const footerTemplate = require('../templates/pagefooter.js');

const userTemplate = require('../templates/user.js');
const matchTemplate = require('../templates/match.js');
const matchlistTemplate = require('../templates/matchlist.js');

const config = require('../config.js');

/**
 * Renders a full page with Studybuddy header and footer
 */
const renderFullPage = (title, innerPage) => {
    return headerTemplate({
        title: title,
    }) + innerPage + footerTemplate({});
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
    if (user && match) {
        const innerPage = matchTemplate(current_user, {
            match,
        });

        return renderFullPage(
            `Match Request | Studybuddy`,
            innerPage
        );
    } else {
        return false;
    }
}

const matchlistView = (current_user) => {
    const innerPage = matchlistTemplate(current_user, {
        // TODO
    });

    return renderFullPage(
        `Match requests | Studybuddy`,
        innerPage
    );
}

module.exports = {
    userView,
    matchView,
    matchlistView,
};

