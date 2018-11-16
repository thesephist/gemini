const matchBox = require('./sections/match.js');

const render = (current_user, {
    match,
} = {}) => {
    const requesterIsCurrentUser = current_user.id === match.requesterRequest.user.id;
    const otherUser = requesterIsCurrentUser ? match.respondentRequest.user : match.requesterRequest.user;

    return `
      ${requesterIsCurrentUser ? (
        `<h1>Match with ${otherUser.get('name')}</h1>`
      ) : (
        `<h1>Request from ${otherUser.get('name')}</h1>`
      )}

      ${matchBox(current_user, match)}

      <script src="/static/js/match.js"></script>
    `;
}

module.exports = render;

