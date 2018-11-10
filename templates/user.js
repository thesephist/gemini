const render = ({
    name,
    email,
}) => {
    return `
        <h1>${name}</h1>
        <h2>${email}</h2>
        <a href="/requests">See Studybuddy requests</a>
    `;
}

module.exports = render;

