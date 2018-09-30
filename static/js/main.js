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

const validateBerkeleyEmail = address => {
    return address.match(/.+@berkeley.edu/) !== null;
}

const ifttt_request = (eventName, ...parameters) => {
    const queries = `value1=${parameters[0]}&value2=${parameters[1]}&value3=${parameters[2]}`;
    return fetch(`https://maker.ifttt.com/trigger/${eventName}/with/key/dd-ddOLbwB-c4dpX84bFd6?${queries}`, {
        method: 'GET',
        mode: 'no-cors', // no need to get the request result
    });
}

const ifttt_signup = (...parameters) => {
    return ifttt_request('studybuddycal_signup', ...parameters);
}

document.addEventListener('DOMContentLoaded', () => {
    for (const [query, phrases] of Object.entries(AB_TEST_REPLACEMENTS)) {
        if (document.querySelector(query)) {
            replaceABTestTarget(query, phrases);
        }
    }

    const signupButton = document.querySelector('.signupButton');
    const submitButton = document.querySelector('.submitButton');

    if (signupButton) {
        const signupInput = document.querySelector('.signupEmail');
        signupButton.addEventListener('click', () => {
            const email = signupInput.value;
            if (validateBerkeleyEmail(email)) {
                window.location.href = `/signup?email=${email}`;
            }
        });
    }

    if (submitButton) {

        // first, if the link is with an email put that in
        const emailMatch = window.location.search.match(/\?email=(.+@.+)/);
        if (emailMatch) {
            const email = emailMatch[1];
            document.querySelector('[name=user_email').value = email;
        }

        // attach event listeners
        const notEmpty = data => data.toString().trim() !== '';
        const VALIDATION = {
            'input[name=user_name]': {
                func: notEmpty,
                message: 'Please tell us your name!',
            },
            'input[name=user_email]': {
                func: validateBerkeleyEmail,
                message: 'Did you correctly enter your berkeley.edu email?'
            },
            'select[name=user_class]': {
                func: notEmpty,
                message: 'Did you pick a class?',
            },
        };

        submitButton.addEventListener('click', () => {
            let allValid = true;
            for (const [query, { func, message }] of Object.entries(VALIDATION)) {
                if (!func(document.querySelector(query).value)) {
                    allValid = false;
                    alert(message);
                    break;
                }
            }

            if (allValid) {

                const parameters = {
                    name: 'user_name',
                    email: 'user_email',
                    class: 'user_class',
                    level: 'user_level',
                    topic: 'user_topic',
                    avail: 'user_availability',
                };

                const getval = key => {
                    return document.querySelector(`[name=${parameters[key]}]`).value;
                }

                const parse = (tpl, ...parameters) => {
                    let result = tpl[0];
                    let counter = 0;
                    for (const piece of tpl.slice(1)) {
                        result += getval(parameters[counter++]) + piece;
                    }
                    return result;
                }

                ifttt_signup(
                    parse`${'name'} <${'email'}>`,
                    parse`${'class'}: ${'level'}`,
                    parse`${'topic'}, AVAIL ${'avail'}`
                ).then(() => {
                    alert(parse`Thanks ${'name'}! We'll get back to you in the next few days with your group!`);
                    window.location.href = '/';
                }).catch(e => {
                    alert(`Looks like there was an error signing up. Would you try again?\nError: ${e}`);
                });
            }

        });
    }
});
