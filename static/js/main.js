// Active A/B tests go here
const AB_TEST_REPLACEMENTS = {
    // el: [...textContentOptions]
    'main .question': [
        'Midterms coming up?',
        'Lost in class?',
        'Can\'t focus alone?',
    ],
    '.signupButton': [
        'Sign up',
        'Get matched',
        'Start looking',
    ],
};

const log = (...args) => {
    console.log(...args);
}

const chooseRandom = (list) => {
    return list[~~(Math.random() * list.length)];
}

const replaceABTestTarget = (query, phrases) => {
    const el = document.querySelector(query);
    if (el) el.textContent = chooseRandom(phrases);
}

document.addEventListener('DOMContentLoaded', () => {
    for (const [query, phrases] of Object.entries(AB_TEST_REPLACEMENTS)) {
        if (document.querySelector(query)) {
            replaceABTestTarget(query, phrases);
        }
    }
});
