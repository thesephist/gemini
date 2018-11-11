const matchBox = (match) => {
    const user = match.requesterRequest.user;
    const email = user.get('email');
    const accepted = match.get('accepted') === true;

    return `
    <div class="requestedMatch gridItem">
      <div class="itemName" data-match-id="${match.id}">${user.get('name')}</div>
      ${accepted ? `<div class="itemSub"><a href="mailto:${email}">${email}</a></div>` : ''}
      <div class="itemDescription"><strong>Wants to work on:</strong> ${match.requesterRequest.get('reason')}</div>
      <div class="itemDescription"><strong>Message:</strong> ${match.get('message')}</div>

      ${accepted ? '' : (
      `<div class="buttonSet">
        <button class="declineButton" data-match-id="${match.id}">Decline</button>
        <button class="acceptButton" data-match-id="${match.id}">Accept</button>
      </div>`
      )}
    </div>
    `;
}

module.exports = matchBox;

