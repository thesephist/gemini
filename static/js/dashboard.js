const refresh = () => {
    window.location.href = '/dashboard';
}

const apiFetch = (uri, options) => {
    return fetch('/api' + uri, {
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        ...options
    });
}

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
        apiFetch(`/request/${request_id}/match`, {
            method: 'POST',
            body: JSON.stringify({
                respondent_request_id: respondent_request_id,
                message: message,
            }),
        }).then(res => res.json()).then(response => {
            window.alert('Your message was sent!');
            refresh();
        });
    } else {
        // message cancelled
    }
}

const sendAccept = evt => {
    const match_id = evt.target.getAttribute('data-match-id');

    apiFetch(`/match/${match_id}/accept`, {
        method: 'POST',
    }).then(() => {
        refresh();
    });
}

const sendDecline = evt => {
    const match_id = evt.target.getAttribute('data-match-id');

    apiFetch(`/match/${match_id}/reject`, {
        method: 'POST',
    }).then(() => {
        refresh();
    });
}

const goToMatch = evt => {
    const match_id = evt.target.getAttribute('data-match-id');

    window.location.href = `/match/${match_id}`;
}

const closeRequest = evt => {
    apiFetch(`/close_current_request`, {
        method: 'POST',
    }).then(() => {
        refresh();
    });
}

const openRequest = evt => {
    apiFetch(`/open_current_request`, {
        method: 'POSt',
    }).then(() => {
        refresh();
    });
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

    const orb = document.querySelector('.openRequestButton');
    const crb = document.querySelector('.closeRequestButton');
    if (orb) {
        orb.addEventListener('click', openRequest);
    }
    if (crb) {
        crb.addEventListener('click', closeRequest);
    }

    document.querySelector('.candidates').addEventListener('click', evt => {
        if (evt.target.classList.contains('messageButton')) {
            sendMessage(evt);
        }
    });
});

