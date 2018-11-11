const sendMessage = evt => {
    const request_id = evt.target.getAttribute('data-request-id');
    const respondent_request_id = evt.target.getAttribute('data-respondent-request-id');

    // TODO: make this atrocity not suck as much
    const message = window.prompt('What\'s your message?');

    fetch(`/api/request/${request_id}/match`, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            respondent_request_id: respondent_request_id,
            message: message,
        }),
    })
    .then(res => res.json)
    .then(response => {
        window.alert('Your message was sent!');
    });
}

const sendAccept = evt => {
    const match_id = evt.target.getAttribute('data-match-id');

    fetch(`/api/match/${match_id}/accept`, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
    });
}

const sendDecline = evt => {
    const match_id = evt.target.getAttribute('data-match-id');

    fetch(`/api/match/${match_id}/reject`, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.matches').addEventListener('click', evt => {
        const cls = evt.target.classList;
        if (cls.contains('acceptButton')) {
            sendAccept(evt);
        } else if (cls.contains('declineButton')) {
            sendDecline(evt);
        }
    });

    document.querySelector('.candidates').addEventListener('click', evt => {
        if (evt.target.classList.contains('messageButton')) {
            sendMessage(evt);
        }
    });
});


