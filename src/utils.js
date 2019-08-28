const now = () => {
    return ~~(new Date().getTime() / 1000);
}

const makeAvailability = () => {
    return {};
}

const COURSES = {
    compsci_8: 'CS C8 / Data 8',
    compsci_10: 'CS 10',
    compsci_61a: 'CS 61A',
    compsci_61b: 'CS 61B',
    compsci_61c: 'CS 61C',
    compsci_70: 'CS 70',

    eleceng_16a: 'EE 16A',
    eleceng_16b: 'EE 16B',

    math_1a: 'MATH 1A',
    math_1b: 'MATH 1B',
    math_10a: 'MATH 10A',
    math_10b: 'MATH 10B',
    math_16a: 'MATH 16A',
    math_16b: 'MATH 16B',
    math_54: 'MATH 54',
    math_55: 'MATH 55',
    math_104: 'MATH 104',
    math_110: 'MATH 110',
    math_113: 'MATH 113',
    math_128A: 'MATH 128A',
    math_185: 'MATH 185',

    astro_c10: 'ASTRO C10',
    econ_1: 'ECON 1',
    ugba_10: 'UGBA 10',
    espm_10: 'ESPM 10',
    ls_25: 'L&S 25',

    stat_140: 'STAT 140',

    chem_1a: 'CHEM 1A',
    chem_1b: 'CHEM 1B',

    phys_7a: 'PHYS 7A',
    phys_7b: 'PHYS 7B',
}

const courseFromSlug = slug => {
    return COURSES[slug] || 'Invalid course';
}

const ADMINS = [
    'l7@berkeley.edu',
    // 'divsaksena@berkeley.edu',
];

module.exports = {
    now,
    makeAvailability,
    COURSES,
    courseFromSlug,
    ADMINS,
}

