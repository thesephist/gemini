const createRequest = () => {
    const getValueForName = name => {
        return document.querySelector(`[name="${name}"]`).value;
    }

    const course = getValueForName('user_class');
    const proficiency = getValueForName('user_level');
    const reason = getValueForName('user_topic');

    if (!course) {
        window.alert('Please pick a course for your studybuddy.');
        return;
    }

    fetch('/api/request', {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            course,
            proficiency,
            reason,
        }),
    })
    .then(res => res.json)
    .then(response => {
        window.location.href = '/dashboard';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.submitButton').addEventListener('click', evt => {
        createRequest();
    });
});

