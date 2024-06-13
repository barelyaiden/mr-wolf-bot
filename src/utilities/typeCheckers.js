function isFloat(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

module.exports = { isFloat };
