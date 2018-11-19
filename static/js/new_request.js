const createRequest = () => {
    const getValueForName = name => {
        return document.querySelector(`[name="${name}"]`).value;
    }

    const course = getValueForName('user_class');
    const proficiency = getValueForName('user_level');
    const reason = getValueForName('user_topic');

    if (!course.trim()) {
        window.alert('Please pick a course for your studybuddy.');
        return;
    } else if (!reason.trim()) {
        window.alert('Please let other students know what you\'re looking to work on');
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
            reason: reason.trim(),
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

