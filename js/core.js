var pathCache = {},
    cacheEnabled = true;

/**
 * @param {Object} keywordHierarchy
 * @param {String} text
 */
var getPath = function (keywordHierarchy, text) {
    var text = sanitizedText(text),
        pieces = text.split(' '),
        current = keywordHierarchy,
        path = [],
        activeInput = {},
        inputCount = 0,
        inputLimit = 0;

    // Temporarily disabled
    if (cacheEnabled && Array.isArray(pathCache[text])) {
        return pathCache[text];
    }

    pieces.forEach(function (piece) {
        // Is actively expecting input
        if (inputCount < inputLimit) {
            path.push(getInputPathItem(piece, activeInput, inputCount));

            inputCount++;
        } else if (piece.indexOf('-') === 0) {
            path.push(getFlagPathItem(piece));
        } else {
            var currentIndex = current._nextIndex[piece] ?? null;

            if (currentIndex !== null) {
                current = current.next[currentIndex];
                activeInput = {};
                inputCount = 0;
                inputLimit = 0;

                if (isObject(current.input)) {
                    inputLimit = current.input.count ?? 1;
                    activeInput = current.input;
                }

                path.push(getStandardPathItem(piece, current));
            }
        }
    });

    // Finish out path with needed inputs
    if (inputCount < inputLimit) {
        while (inputCount < inputLimit) {
            path.push(getInputPathItem(null, activeInput, inputCount));

            inputCount++;
        }
    }

    if (cacheEnabled) {
        pathCache[text] = path;
    }

    return path;
};

/**
 * @param {String} piece
 * @param {Object} activeInput
 * @param {Number} inputIndex
 * @return {Object}
 */
var getInputPathItem = function (piece, activeInput, inputIndex) {
    return {
        text: piece,
        isInput: true,
        isFlag: false,
        suggestions: activeInput.suggestions[inputIndex] ?? [],
        default: activeInput.defaults[inputIndex] ?? '',
        mutations: activeInput.mutations[inputIndex] ?? [],
        formats: activeInput.formats[inputIndex] ?? null,
        inputIndex: inputIndex,
    };
};

/**
 * @param {String} piece
 * @param {Object} keywordObject
 * @return {Object}
 */
var getStandardPathItem = function (piece, keywordObject) {
    return {
        text: piece,
        isInput: false,
        isFlag: false,
        replace: keywordObject.replace ?? false,
        urlPiece: keywordObject.self,
        suggestions: keywordObject._suggestions,
    };
};

/**
 * @param {String} piece
 * @return {Object}
 */
var getFlagPathItem = function (piece) {
    return {
        text: piece,
        isInput: false,
        isFlag: true,
        suggestions: null,
    };
};

/**
 * Get suggestions to display for omnibox autocomplete
 *
 * @TODO - solve for multi input suggestions
 *
 * @param {Object} keywordHierarchy
 * @param {String} text
 * @return {Object}
 */
var getSuggestionInfo = function (keywordHierarchy, text) {
    var path = getPath(keywordHierarchy, text),
        pieces = text.split(' '),
        lastItemIndex = pieces.length - 1,
        lastPiece = pieces[lastItemIndex],
        suggestions = [],
        prefix = [];

    path.forEach(function (pathItem) {
        prefix.push(pathItem.text);
    });

    if (path.length === 0) {
        suggestions = keywordHierarchy._suggestions;
    } else if (lastPiece.indexOf('-') === 0) {
        suggestions = Object.keys(globalFlags);
    } else {
        // Grab last set of valid suggestions
        for (var index = path.length - 1; -1 < index; index--) {
            if (path[index].suggestions !== null) {
                suggestions = path[index].suggestions;
                break;
            }
        }
    }

    if (lastPiece) {
        suggestions = suggestions.filter(function (keyword) {
            return keyword.indexOf(lastPiece) === 0;
        });
    }

    return {
        suggestions: suggestions,
        prefix: prefix,
    };
};

/**
 * Get detailed information regarding the URL and navigation
 *
 * @param {Object} keywordHierarchy
 * @param {String} text
 * @return {Object}
 */
var getAction = function (keywordHierarchy, text) {
    var path = getPath(keywordHierarchy, text),
        action = {
            url: '',
            urlPieces: [],
            inputPieces: text.split(' '),
            navigate: navigation.openInCurrentTab,
            navigateOptions: {},
            // Add in 'endsOnInput'?
        };

    path.forEach(function (pathItem) {
        if (pathItem.isFlag) {
            action = updateFlagAction(action, pathItem);
        } else if (pathItem.isInput) {
            action = updateItemAction(action, pathItem);
        } else {
            action = updateStandardAction(action, pathItem);
        }
    });

    action.url = action.urlPieces.join('');

    return action;
};

/**
 *
 * @param {String} text
 * @return {String}
 */
var sanitizedText = function (text) {
    return text.trimRight().replace(/\s\s+/g, ' ');
};

var updateFlagAction = function (action, pathItem) {
    var text = pathItem.text,
        flag = globalFlags[text] ?? null;

    if (flag !== null) {
        flag.mutations.forEach(function (mutation) {
            action = mutation(action);
        });

        if (isFunction(flag.navigate)) {
            action.navigate = flag.navigate;
        }

        if (isObject(flag.navigateOptions)) {
            action.navigateOptions = Object.assign(action.navigateOptions, flag.navigateOptions);
        }
    }

    return action;
};

var updateItemAction = function (action, pathItem) {
    var text = pathItem.text;

    if (!text) {
        text = pathItem.default;
    }

    if (pathItem.mutations.length > 0) {
        pathItem.mutations.forEach(function (mutationName) {
            text = mutations[mutationName](text);
        });
    }

    if (pathItem.format) {
        text = pathItem.format.replace('{+}', input);
    }

    action.urlPieces.push(text);

    return action;
};

var updateStandardAction = function (action, pathItem) {
    if (pathItem.replace) {
        action.urlPieces = [pathItem.urlPiece];
    } else {
        action.urlPieces.push(pathItem.urlPiece);
    }

    return action;
};

/**
 * @param {Object} keywordHierarchy
 */
var saveKeywordHierarchy = function (keywordHierarchy) {
    chrome.storage.sync.set({ keywordHierarchy: keywordHierarchy }, function (result) {
        alert('Saved');
    });
};

/**
 * @param {Object} keywordHierarchy
 * @return {Object}
 */
var createComputedProps = function (keywordHierarchy) {
    keywordHierarchy._nextIndex = {};
    keywordHierarchy._suggestions = [];

    if (isArray(keywordHierarchy.next)) {
        keywordHierarchy.next.forEach(function (keywordObj, index) {
            var keyword = keywordObj.keyword;

            keywordHierarchy._nextIndex[keyword] = index;
            keywordHierarchy._suggestions.push(keyword);

            keywordObj = createComputedProps(keywordObj);
        });
    }

    return keywordHierarchy;
};