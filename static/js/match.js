const sendAccept = evt => {
    const match_id = evt.target.getAttribute('data-match-id');

    fetch(`/api/match/${match_id}/accept`, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
    }).then(() => {
        window.location.href = '/dashboard';
    });
}

const sendDecline = evt => {
    const match_id = evt.target.getAttribute('data-match-id');

    fetch(`/api/match/${match_id}/reject`, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
    }).then(() => {
        window.location.href = '/dashboard';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.requestedMatch').addEventListener('click', evt => {
        const cls = evt.target.classList;
        if (cls.contains('acceptButton')) {
            sendAccept(evt);
        } else if (cls.contains('declineButton')) {
            sendDecline(evt);
        }
    });
});


