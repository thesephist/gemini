const {
    User,
    Request,
} = require('../src/storage.js');

const {
    courseFromSlug,
} = require('../src/utils.js');

const render = (current_user) => {

    // one request per user for now
    const requests = Request.where({
        user_id: current_user.id,
    });
    if (requests.length > 0) {
        const req = requests[0];

        return `
          <h1>Studybuddy <em>dashboard</em></h1>
          <h2>${current_user.get('name')} | ${current_user.get('email')}</h2>

          <h3>You're looking for a Studybuddy for ${courseFromSlug(req.get('course'))} to work on ${req.get('reason')}.</h3>

          <div class="matches">
          ${req.getRequestedMatches().map(match => matchBox(match))}
          </div>

          <div class="candidates">
          ${req.getSortedCandidates().map(request => candidateBox(request.user, req, request))}
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

const matchBox = (match) => {
    const user = match.requesterRequest.user;
    return `
    <div class="requestedMatch">
      <div class="candidateName">${user.get('name')}</div>
      <div class="candidateReason">${match.requesterRequest.get('reason')}</div>

      <button class="acceptButton" data-match-id="${match.id}">Accept</button>
      <button class="declineButton" data-match-id="${match.id}">Decline</button>
    </div>
    `;
}

const candidateBox = (user, myRequest, otherRequest) => {
    return `
    <div class="candidateItem">
      <div class="candidateName">${user.get('name')}</div>
      <div class="candidateReason">${otherRequest.get('reason')}</div>

      ${myRequest.hasRequestedMatch(otherRequest) ? (
            `<button class="messageButton" data-request-id="${myRequest.id}" data-respondent-request-id="${otherRequest.id}">Message</button>`
      ) : (
          `<button data-request-id="${myRequest.id}" data-respondent-request-id="${otherRequest.id}" disabled>Messaged</button>`
      )}
    </div>
    `;
}

module.exports = render;

