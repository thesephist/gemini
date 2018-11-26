const {
    User,
    Request,
} = require('../src/models.js');

const matchBox = require('./sections/match.js');

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

        const acceptedMatches = req.getAcceptedMatches();
        const requestedMatches = req.getRequestedMatches();
        const candidates = req.getSortedCandidates();

        return `
          <h1>Studybuddy <em>dashboard</em></h1>
          <h2 class="pageSub">${current_user.get('name')} | ${current_user.get('email')}</h2>

          <div class="currentRequest panel">
              <div>You're looking for a Studybuddy for <strong>${course}</strong> to work on <strong>${req.get('reason')}</strong>.</div>
          </div>

          <div class="accepted panel">
            <h2>Accepted Studybuddies</h2>
            <div class="grid">
              ${
                acceptedMatches.length ? (
                    acceptedMatches.map(match => matchBox(current_user, match)).join('\n')
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
                  requestedMatches.map(match => matchBox(current_user, match)).join('\n')
              ) : (
                  emptyMessage('No requests for you yet')
              )}
            </div>
          </div>

          <div class="candidates panel">
            <H2>Your other classmates in ${course}</h2>
            <div class="grid">
              ${candidates.length ? (
                  candidates.map(request => candidateBox(current_user, request.user, req, request)).join('\n')
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

const candidateBox = (current_user, user, myRequest, otherRequest) => {
    return `
    <div class="candidateItem gridItem">
      <div class="itemName">${user.get('name')}</div>
      <div class="itemDescription"><strong>Wants to work on:</strong> ${otherRequest.get('reason')}</div>

      ${!myRequest.hasRequestedMatch(otherRequest) ? (
          `<button class="messageButton"
                    data-request-id="${myRequest.id}"
                    data-respondent-request-id="${otherRequest.id}"
                    data-user-name="${current_user.get('name')}"
                    data-course="${courseFromSlug(myRequest.get('course'))}"
          >Message</button>`
      ) : (
          `<button data-request-id="${myRequest.id}" data-respondent-request-id="${otherRequest.id}" disabled>Messaged</button>`
      )}
    </div>
    `;
}

module.exports = render;

