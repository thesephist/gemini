const now = () => {
    return ~~(new Date().getTime() / 1000);
}

const makeAvailability = () => {
    return {};
}

const COURSES = {
    compsci_8: 'CS C8 / Data 8',
    compsci_61a: 'CS 61A',
    compsci_61b: 'CS 61B',
    compsci_70: 'CS 70',

    eleceng_16a: 'EE 16A',
    eleceng_16b: 'EE 16B',

    math_1a: 'MATH 1A',
    math_1b: 'MATH 1B',
    math_10a: 'MATH 10A',
    math_10b: 'MATH 10B',
    math_54: 'MATH 54',
    math_55: 'MATH 55',

    chem_1a: 'CHEM 1A',
    chem_1b: 'CHEM 1B',

    phys_7a: 'PHYS 7A',
    phys_7b: 'PHYS 7B',
}
const courseFromSlug = slug => {
    return COURSES[slug] || 'Invalid course';
}

module.exports = {
    now,
    makeAvailability,
    COURSES,
    courseFromSlug,
}

