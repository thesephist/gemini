const render = (current_user, {
    name,
    email,
} = {}) => {
    return `
        <h1>${name}</h1>
        <h2>${email}</h2>
    `;
}

module.exports = render;

