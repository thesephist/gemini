const now = () => {
    return ~~(new Date().getTime() / 1000);
}

const makeAvailability = () => {
    return {};
}

module.exports = {
    now,
    makeAvailability,
}

