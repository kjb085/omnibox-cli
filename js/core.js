let pathCache = {},
    actionCache = {},
    cacheEnabled = true;

/**
 * @param {Object} keywordHierarchy
 * @param {String} text
 */
const getPath = (keywordHierarchy, text) => {
    const sanitizedText = getSanitizedText(text);

    let current = keywordHierarchy,
        path = [],
        activeInput = {},
        inputCount = 0,
        inputLimit = 0;

    // Temporarily disabled
    // if (cacheEnabled && Array.isArray(pathCache[sanitizedText])) {
    //     return pathCache[sanitizedText];
    // }

    sanitizedText.split(' ').forEach((piece) => {
        // Is actively expecting input
        if (inputCount < inputLimit) {
            path.push(getInputPathItem(piece, activeInput, inputCount));

            inputCount++;
        } else if (piece.indexOf('-') === 0) {
            path.push(getFlagPathItem(piece));
        } else {
            const currentIndex = current._nextIndex[piece] ?? null;

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

    // Temporarily disabled
    // if (cacheEnabled) {
    //     pathCache[sanitizedText] = path;
    // }

    return path;
};

/**
 * @param {String} piece
 * @param {Object} activeInput
 * @param {Number} inputIndex
 * @return {Object}
 */
const getInputPathItem = (piece, activeInput, inputIndex) => {
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
const getStandardPathItem = (piece, keywordObject) => {
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
const getFlagPathItem = (piece) => {
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
const getSuggestionInfo = (keywordHierarchy, text) => {
    let path = getPath(keywordHierarchy, text),
        pieces = text.split(' '),
        lastItemIndex = pieces.length - 1,
        lastPiece = pieces[lastItemIndex],
        suggestions = [],
        prefix = [];

    path.forEach((pathItem) => {
        prefix.push(pathItem.text);
    });

    if (path.length === 0) {
        suggestions = keywordHierarchy._suggestions;
    } else if (lastPiece.indexOf('-') === 0) {
        suggestions = Object.keys(globalFlags);
    } else {
        // Grab last set of valid suggestions
        for (let index = path.length - 1; -1 < index; index--) {
            if (path[index].suggestions !== null) {
                suggestions = path[index].suggestions;
                break;
            }
        }
    }

    if (lastPiece) {
        suggestions = suggestions.filter((keyword) => {
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
const getAction = (keywordHierarchy, text) => {
    if (typeof actionCache[text] !== 'undefined') {
        return actionCache[text];
    }

    let path = getPath(keywordHierarchy, text),
        action = {
            url: '',
            urlPieces: [],
            inputPieces: text.split(' '),
            navigate: navigation.openInCurrentTab,
            navigateOptions: {},
            // Add in 'endsOnInput'?
        };

    path.forEach((pathItem) => {
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
const getSanitizedText = (text) => {
    return text.trimRight().replace(/\s\s+/g, ' ');
};

/**
 * @param {Object} action
 * @param {Object} pathItem
 * @return {Object}
 */
const updateFlagAction = (action, pathItem) => {
    let text = pathItem.text,
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

/**
 * @param {Object} action
 * @param {Object} pathItem
 * @return {Object}
 */
const updateItemAction = (action, pathItem) => {
    let text = pathItem.text;

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

/**
 * @param {Object} action
 * @param {Object} pathItem
 * @return {Object}
 */
const updateStandardAction = (action, pathItem) => {
    if (pathItem.replace) {
        action.urlPieces = [pathItem.urlPiece];
    } else {
        action.urlPieces.push(pathItem.urlPiece);
    }

    return action;
};

/**
 * @param {Object} action
 */
const executeAction = (action) => {
    let navigate = navigation.openInCurrentTab;

    if (typeof action.navigate === 'function') {
        navigate = action.navigate;
    }

    if (typeof action.navigateOptions.delay !== 'undefined') {
        setTimeout(function () {
            navigate(action.url, action.navigateOptions);
        }, action.navigateOptions.delay * 1000);
    } else {
        navigate(action.url, action.navigateOptions);
    }
};

/**
 * @param {Array} keywordObjects
 */
const saveKeywordObjects = (keywordObjects) => {
    const reservedKeywords = Object.keys(specialActions);
    let okToSave = true,
        errorKeywords = [];

    keywordObjects.forEach((item) => {
        const keyword = item.keyword;

        if (reservedKeywords.indexOf(keyword) > -1) {
            okToSave = false;
            errorKeywords.push(keyword);
        }
    });

    if (okToSave) {
        chrome.storage.sync.set({ keywordObjects: keywordObjects }, (result) => {
            alert('Saved');
        });
    } else {
        alert('Following keywords are reserved words and cannot be used as top level commands: ' +
            errorKeywords.join(', '));
    }
};

/**
 * @param {Array} keywordHierarchy
 * @return {Object}
 */
const getKeywordHierarchy = (keywordObjects) => {
    let keywordHierarchy = {
        next: keywordObjects,
    };

    keywordHierarchy = addComputedProps(keywordHierarchy);

    return keywordHierarchy;
};

/**
 * @param {Object} keywordHierarchy
 * @return {Object}
 */
const addComputedProps = (keywordHierarchy) => {
    keywordHierarchy._nextIndex = {};
    keywordHierarchy._suggestions = [];

    if (isArray(keywordHierarchy.next)) {
        keywordHierarchy.next.forEach((keywordObj, index) => {
            let keyword = keywordObj.keyword;

            keywordHierarchy._nextIndex[keyword] = index;
            keywordHierarchy._suggestions.push(keyword);

            keywordObj = addComputedProps(keywordObj);
        });
    }

    return keywordHierarchy;
};

/**
 * @param {Array} keys
 */
const getFromStorage = (keys, callback) => {
    chrome.storage.sync.get(keys, (result) => {
        callback(result);
        // console.log(result);

        // keywordHierarchy = getKeywordHierarchy(result.keywordObjects);
        // // Move this and/or have setKeywordHierarchy accept a callback
        // commandCache = {};

        // console.log('Keyword hierarchy changed:');
        // console.log(result);
    });
};

// Reserved keywords that are saved for future purposes of adding meta functionality to the omnibox
const specialActions = {
    add: {},
    update: {},
    delete: {},
    bookmarks: {},
};