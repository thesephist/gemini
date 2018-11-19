const sendMessage = evt => {
    const request_id = evt.target.getAttribute('data-request-id');
    const respondent_request_id = evt.target.getAttribute('data-respondent-request-id');

    const name = evt.target.getAttribute('data-user-name');
    const course = evt.target.getAttribute('data-course');

    const message = window.prompt(
        'What\'s your message?',
        `Hi! I'm ${name} and I'm looking for a study buddy for ${course}. Are you available?`
    );

    if (message) {
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
                window.location.href = '/dashboard';
            });
    } else {
        console.log('Message cancelled.');
    }

}

const sendAccept = evt => {
    const match_id = evt.target.getAttribute('data-match-id');

    fetch(`/api/match/${match_id}/accept`, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
    });

    window.location.href = '/dashboard';
}

const sendDecline = evt => {
    const match_id = evt.target.getAttribute('data-match-id');

    fetch(`/api/match/${match_id}/reject`, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
    });

    window.location.href = '/dashboard';
}

const goToMatch = evt => {
    const match_id = evt.target.getAttribute('data-match-id');

    window.location.href = `/match/${match_id}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const matchClicks = evt => {
        const cls = evt.target.classList;
        if (cls.contains('acceptButton')) {
            sendAccept(evt);
        } else if (cls.contains('declineButton')) {
            sendDecline(evt);
        } else if (cls.contains('itemName')) {
            goToMatch(evt);
        }
    }

    document.querySelector('.accepted').addEventListener('click', matchClicks);
    document.querySelector('.matches').addEventListener('click', matchClicks);

    document.querySelector('.candidates').addEventListener('click', evt => {
        if (evt.target.classList.contains('messageButton')) {
            sendMessage(evt);
        }
    });
});


