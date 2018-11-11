const {
    User,
    Request,
} = require('../src/storage.js');

const {
    courseFromSlug,
} = require('../src/utils.js');

const emptyMessage = message => {
    return `
    <div class="emptyMessage">
        <div class="message">
            ${message}
        </div>
    </div>
    `;
}

const render = (current_user) => {

    // one request per user for now
    const requests = Request.where({
        user_id: current_user.id,
    });

    if (requests.length > 0) {
        const req = requests[0];
        const course = courseFromSlug(req.get('course'));

        const resolvedMatches = req.getResolvedMatches();
        const requestedMatches = req.getRequestedMatches();
        const candidates = req.getSortedCandidates();

        return `
          <h1>Studybuddy <em>dashboard</em></h1>
          <h2 class="pageSub">${current_user.get('name')} | ${current_user.get('email')}</h2>

          <div class="currentRequest panel">
              <div>You're looking for a Studybuddy for <strong>${course}</strong> to work on <strong>${req.get('reason')}</strong>.</div>
          </div>

          <div class="resolved panel">
            <h2>Accepted Studybuddies</h2>
            <div class="grid">
              ${
                resolvedMatches.length ? (
                    req.getResolvedMatches().map(match => matchBox(match, true))
                ) : (
                    emptyMessage(`You haven't accepted any requests yet`)
                )
              }
            </div>
          </div>

          <div class="matches panel">
            <h2>Requests for you</h2>
            <div class="grid">
              ${requestedMatches.length ? (
                  req.getRequestedMatches().map(match => matchBox(match, false))
              ) : (
                  emptyMessage('No requests for you yet')
              )}
            </div>
          </div>

          <div class="candidates panel">
            <H2>Other students in ${course}</h2>
            <div class="grid">
              ${candidates.length ? (
                  req.getSortedCandidates().map(request => candidateBox(request.user, req, request))
              ) : (
                  emptyMessage('Nobody from your course is here yet. Invite them to join!')
              )}
            </div>
          </div>

          <script src="/static/js/dashboard.js"></script>
        `;
    } else {
        return `
          <h1>Studybuddy <em>dashboard</em></h1>
          <h2>${current_user.get('name')} | ${current_user.get('email')}</h2>

          <h3>Find your studybuddy. Start <a href="/new_request">here</a>.</h3>
        `;
    }

}

const matchBox = (match, resolved) => {
    const user = match.requesterRequest.user;
    const email = user.get('email');

    return `
    <div class="requestedMatch gridItem">
      <div class="itemName">${user.get('name')}</div>
      ${resolved ? `<div class="itemSub"><a href="mailto:${email}">${email}</a></div>` : ''}
      <div class="itemDescription"><strong>Wants to work on:</strong> ${match.requesterRequest.get('reason')}</div>

      ${resolved ? '' : (
      `<div class="buttonSet">
        <button class="declineButton" data-match-id="${match.id}">Decline</button>
        <button class="acceptButton" data-match-id="${match.id}">Accept</button>
      </div>`
      )}
    </div>
    `;
}

const candidateBox = (user, myRequest, otherRequest) => {
    return `
    <div class="candidateItem gridItem">
      <div class="itemName">${user.get('name')}</div>
      <div class="itemDescription"><strong>Wants to work on:</strong> ${otherRequest.get('reason')}</div>

      ${myRequest.hasRequestedMatch(otherRequest) ? (
            `<button class="messageButton" data-request-id="${myRequest.id}" data-respondent-request-id="${otherRequest.id}">Message</button>`
      ) : (
          `<button data-request-id="${myRequest.id}" data-respondent-request-id="${otherRequest.id}" disabled>Messaged</button>`
      )}
    </div>
    `;
}

module.exports = render;

