function isDefined(test) {
    return typeof test !== 'undefined';
}

function isArray(test) {
    return Array.isArray(test);
}

function isObject(test) {
    return isDefined(test) && typeof test === 'object';
}

function isFunction(test) {
    return isDefined(test) && typeof test === 'function';
}