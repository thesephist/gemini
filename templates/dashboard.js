const {
    User,
    Request,
} = require('../src/storage.js');

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

          <h3>You're looking for a Studybuddy for ${req.get('course')} to work on ${req.get('reason')}.</h3>

          <div class="candidates">
          ${req.getSortedCandidates().map(request => candidateBox(request.user, request))}
          </div>
        `;
    } else {
        return `
          <h1>Studybuddy <em>dashboard</em></h1>
          <h2>${current_user.get('name')} | ${current_user.get('email')}</h2>

          <h3>Find your studybuddy. Start <a href="/new_request">here</a>.</h3>
        `;
    }

}

const candidateBox = (user, request) => {
    return `
    <div class="candidateName">${user.get('name')}</div>
    <div class="candidateReason">${request.get('reason')}</div>

    [contact button with email icon]
    `;
}

module.exports = render;

