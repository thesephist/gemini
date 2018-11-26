// Active A/B tests go here
const AB_TEST_REPLACEMENTS = {
    // el: [...textContentOptions]
    '.signupButton': [
        // 'Sign Up',
        // 'Start Looking',
        'Get Started',
    ],
};

const chooseRandom = (list) => {
    return list[~~(Math.random() * list.length)];
}

const replaceABTestTarget = (query, phrases) => {
    const el = document.querySelector(query);
    if (el) el.textContent = chooseRandom(phrases);
}

const validateGenericEmail = address => {
    return address.match(/.+@.+/) !== null;
}

const ifttt_request = (eventName, ...parameters) => {
    const queries = `value1=${parameters[0]}&value2=${parameters[1]}&value3=${parameters[2]}`;
    return fetch(`https://maker.ifttt.com/trigger/${eventName}/with/key/dd-ddOLbwB-c4dpX84bFd6?${queries}`, {
        method: 'GET',
        mode: 'no-cors', // no need to get the request result
    });
}

const ifttt_contact = (...parameters) => {
    return ifttt_request('studybuddycal_contact', ...parameters);
}

const validateInputFields = validationDict => {
    let allValid = true;
    for (const [query, { func, message }] of Object.entries(validationDict)) {
        if (!func(document.querySelector(query).value)) {
            allValid = false;
            alert(message);
            break;
        }
    }
    return allValid;
}

const analytics = (category, action, label, value) => {
    return new Promise((res, rej) => {
        let resolved = false;
        if ('ga' in window) {
            ga('send', 'event', category, action, label, value, {
                hitCallback: () => {
                    if (!resolved) {
                        resolved = true;
                        res();
                    }
                },
            });
            setTimeout(() => {
                if (!resolved) res();
            }, 1500); // timeout if GA doesn't work for some reason
        } else {
            res();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    for (const [query, phrases] of Object.entries(AB_TEST_REPLACEMENTS)) {
        if (document.querySelector(query)) {
            replaceABTestTarget(query, phrases);
        }
    }

    const signupButton = document.querySelector('.signupButton');
    const sendButton = document.querySelector('.sendButton');

    if (signupButton) {
        signupButton.addEventListener('click', async () => {
            await analytics('Landing page', 'submit');
            window.location.href = '/signup';
        });
    }

    if (sendButton) {
        // on the contacts page
        const notEmpty = data => data.toString().trim() !== '';
        const VALIDATION = {
            'input[name=user_name]': {
                func: notEmpty,
                message: 'Please tell us your name!',
            },
            'input[name=user_email]': {
                func: validateGenericEmail,
                message: 'Did you correctly enter your email?'
            },
            'textarea[name=user_content]': {
                func: notEmpty,
                message: 'Did you mean to say something in the email?',
            },
        };

        // attach event listener
        sendButton.addEventListener('click', () => {
            if (validateInputFields(VALIDATION)) {

                const KEY_INPUT_NAME = {
                    name: 'user_name',
                    email: 'user_email',
                    type: 'user_type',
                    content: 'user_content',
                };

                const parse = (tpl, ...parameters) => {
                    const getval = key => {
                        return document.querySelector(`[name=${KEY_INPUT_NAME[key]}]`).value.trim();
                    }

                    let result = tpl[0];
                    let counter = 0;
                    for (const piece of tpl.slice(1)) {
                        result += getval(parameters[counter++]) + piece;
                    }
                    return result;
                }

                ifttt_contact(
                    parse`${'name'} (${'email'})`,
                    parse`${'type'}`,
                    parse`${'content'}`
                ).then(() => {
                    alert(parse`Thanks for reaching out, ${'name'}! We'll get back to you in the next few days.`);
                    window.location.href = '/contact';
                }).catch(e => {
                    analytics('Contact page', 'erorr');
                    alert(`Looks like there was an error somewhere. Would you try again?\nError: ${e}`);
                });
            }

        });

    }

    const videoThumb = document.querySelector('.videoThumbs .video');
    const thumbs = document.querySelector('.videoThumbs');

    if (videoThumb) {
        videoThumb.addEventListener('click', evt => {
            if (!thumbs.classList.contains('playing')) {
                thumbs.classList.add('playing');
                document.querySelector('#desktopthumb').src += '&autoplay=1';
            }
        });
        document.querySelector('.closeButton').addEventListener('click', evt => {
            thumbs.classList.remove('playing');
            document.querySelector('#desktopthumb').src = document.querySelector('#mobilethumb').src;
        });
    }
});
