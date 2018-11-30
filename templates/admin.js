const {
    User,
    Request,
    Match,
} = require('../src/models.js');

const {
    COURSES,
    courseFromSlug,
} = require('../src/utils');

const sortBy = require('lodash.sortby');

const render = (current_user) => {
    return `
    <style>
        ol {
            max-height: 300px;
            overflow: auto;
            padding: 14px;
            background: #fff;
            border-radius: 4px;
        }
        ol li {
            margin-left: 24px;
        }
        .light {
            color: #777;
            font-style: italic;
        }
        .fadeout {
            opacity: .25;
        }
    </style>

    <h1>Studybuddy <em>Admin + Statistics</em></h1>

    <h2>Users</h2>

    <p><strong>${User.all().length}</strong> Users Signed Up, <strong>${User.all().filter(u => u.get('email').includes('berkeley')).length}</strong> Registered berkeley.edu emails</p>

    <h3>List of all users (non-berkeley are greyed out)</h3>
    <ol>
        ${sortBy(User.all(), 'created_time').map(u => {
            const created_time = u.get('created_time') ? (
                new Date(u.get('created_time') * 1000).toISOString().substr(0, 10)
            ) : 'unknown';

            return `
                <li class="${u.get('email').includes('berkeley') ? '' : 'fadeout'}">
                    <strong>${u.get('name')}</strong>
                    &lt;<a href="mailto:${u.get('email')}">${u.get('email')}</a>&gt;
                    - <span class="light">first login ${created_time}</span>
                </li>
            `
        }).join('')}
    </ol>

    <hr/>

    <h2>Requests (Users that have listed for classes)</h2>

    <p><strong>${Request.all().length}</strong> Users Listed for a Class</p>

    <h3>Courses by popularity</h3>
    <ol>
        ${sortBy(Object.keys(COURSES), c => -Request.where({course: c}).length).map(courseSlug => {
            return `
                <li>
                    <strong>${courseFromSlug(courseSlug)}</strong>: ${Request.where({course: courseSlug}).length} students
                </li>
            `
        }).join('')}
    </ol>

    <h3>List of all requests</h3>
    <ol>
        ${sortBy(Request.all(), 'created_time').sort().map(r => {
            return `
                <li>
                    <strong>${User.find(r.get('user_id')).get('name')}</strong>:
                    ${courseFromSlug(r.get('course'))}
                    - <span class="light">${r.get('reason')}</span>
                </li>
            `
        }).join('')}
    </ol>

    <hr/>

    <h2>Matches (Messages that people have sent, and responses)</h2>

    <p>
        <strong>${Match.all().length}</strong> messages sent,
        <strong>${Match.all().filter(m => m.get('accepted') !== null).length}</strong> messages with responses,
        <strong>${Match.all().filter(m => m.get('accepted') === true).length}</strong> accepted messages (pairs formed)
    </p>

    <h3>List of all messages sent (⏳ waiting | ✅ accepted | 🛑 declined)</h3>
    <ol>
        ${sortBy(Match.all(), 'created_time').map(m => {
            let response = '⏳';
            if (m.get('accepted') === true) {
                response = '✅';
            } else if (m.get('accepted') === false) {
                response = '🛑';
            }
            return `
                <li>
                    ${response}
                    <strong>${User.find(m.requesterRequest.get('user_id')).get('name')}</strong>
                    to
                    <strong>${User.find(m.respondentRequest.get('user_id')).get('name')}</strong>
                    - <span class="light">${m.get('message')}</span>
                </li>
            `
        }).join('')}
    </ol>

    `;
}

module.exports = render;

