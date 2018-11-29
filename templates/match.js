const matchBox = require('./sections/match.js');

const render = (current_user, {
    match,
} = {}) => {
    const requesterIsCurrentUser = current_user.id === match.requesterRequest.user.id;
    const otherUser = requesterIsCurrentUser ? match.respondentRequest.user : match.requesterRequest.user;

    return `
      ${requesterIsCurrentUser ? (
          `
          <h1>Match with ${otherUser.get('name')}</h1>
          <p>Click on the email below to start the conversation!</p>
          `
      ) : (
          `
          <h1>Request from ${otherUser.get('name')}</h1>
          <p>Accept the request to see ${otherUser.get('name')}'s contact information, and start a conversation!</p>
          `
      )}

      ${matchBox(current_user, match)}

      <script src="/static/js/match.js"></script>
    `;
}

module.exports = render;

