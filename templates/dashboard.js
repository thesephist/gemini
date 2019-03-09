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
    const requests = current_user.getCurrentRequests();

    if (requests.length > 0) {
        const req = requests[0];
        const course = courseFromSlug(req.get('course'));

        const acceptedMatches = req.getAcceptedMatches();
        const requestedMatches = req.getRequestedMatches();
        const candidates = req.getSortedCandidates();

        let candidatesPanelContents = '';
        if (req.get('closed')) {
            candidatesPanelContents = emptyMessage(`You're currently invisible to your classmates. To send studybuddy requests, become visible again.`);
        } else if (candidates.length > 0) {
            candidatesPanelContents = candidates.map(request => candidateBox(current_user, request.user, req, request)).join('\n')
        } else {
            candidatesPanelContents = emptyMessage('Nobody from your course is here yet. Invite them to join!')
        }

        return `
          <h1>Studybuddy <em>dashboard</em></h1>
          <h2 class="pageSub">${current_user.get('name')} | ${current_user.get('email')}</h2>

          <div class="currentRequest panel">
              <p>This semester, you're looking for a Studybuddy for <strong>${course}</strong> to work on: <strong>${req.get('reason')}</strong>.</p>
              <p>Start by messaging your classmates below! When another classmate sends you a message, you'll see it forwarded to your email inbox.</p>
              <hr/>
              ${req.get('closed') ? (
                  `
                  <p>You're currently <strong>hidden from classmates</strong>. Become visible to your classmates to send and receive studybuddy requests.</p>
                  <button class="openRequestButton">Become visible</button>
                  `
              ) : (
                  `
                  <p>You're currently <strong>visible to your classmates</strong>. If you've found enough studybuddies, you can go invisible to prevent other classmates from sending you more requests.</p>
                  <button class="closeRequestButton">Go invisible</button>
                  `
              )}
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
              ${candidatesPanelContents}
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
