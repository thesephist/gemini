const render = (current_user) => {
    return `
      <h1>Match list for ${current_user.get('name').split(' ')[0]}</h1>
      <p>under construction...</p>
    `;
}

module.exports = render;

