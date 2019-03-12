const mailgun = require('mailgun.js');

const secrets = require('../secrets.js');

const mg = mailgun.client({
    username: 'api',
    key: secrets.MG_API_KEY,
});

const EMAIL_FOOTER = `
<p>Have questions or feedback about Studybuddy? Let us know <a href="https://getstudybuddy.com/contact">here</a>, we're all ears!</p>
`;

const notify = (target_user, subject, message) => {

    const body = message + EMAIL_FOOTER;

    if (secrets.DEVELOPMENT) {
        return console.log(
            'NOTIFY:',
            target_user.get('email'),
            subject,
            body,
        );
    }

    return mg.messages.create(secrets.MG_DOMAIN, {
        from: 'Studybuddy <notify@getstudybuddy.com>',
        to: [target_user.get('email')],
        subject: subject,
        text: body,
        html: body,
    })
    .then(msg => console.log(msg))
    .catch(err => console.error(err));
}

const contact = (sender_name, sender_email, sender_type, message) => {
    if (secrets.DEVELOPMENT) {
        return console.log(
            'CONTACT:',
            sender_name,
            sender_email,
            sender_type,
            message
        );
    }
    return mg.messages.create(secrets.MG_DOMAIN, {
        from: `${sender_name} <${sender_email}>`,
        to: ['hi@getstudybuddy.com'],
        subject: `Question from ${sender_name} [${sender_type}]`,
        text: message,
    })
    .then(msg => console.log(msg))
    .catch(err => console.error(err));
}

module.exports = {
    notify,
    contact,
}

