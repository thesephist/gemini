const render = (current_user) => {
    // TODO:implement

    return `
      <h1>Studybuddy <em>dashboard</em></h1>
      <h2>${current_user.get('name')} | ${current_user.get('email')}</h2>
      <p>Under construction...</p>
    `;
}

const candidateBox = candidateUser => {
    return `
    Name,
    reason,

    [contact button with email icon]
    `;
}

module.exports = render;

