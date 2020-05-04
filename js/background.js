let keywordHierarchy = {};

/**
 * TODO - move invocation of addComputedProps to the save function
 */
const setKeywordHierarchy = () => {
    chrome.storage.sync.get(['keywordHierarchy'], (result) => {
        keywordHierarchy = addComputedProps(result.keywordHierarchy);
        // Move this and/or have setKeywordHierarchy accept a callback
        commandCache = {};

        console.log('Keyword hierarchy changed:');
        console.log(result);
    });
};

// Set keyword hierachy as local variable
setKeywordHierarchy();

const resetDefaultSuggestion = () => {
    chrome.omnibox.setDefaultSuggestion({
        "description": "%s"
    });
};

/**
 * @param {String[]} suggestions
 * @param {String|Array} prefix
 */
const getSuggestionResults = (suggestions, prefix) => {
    let results = [];

    if (typeof prefix !== 'string') {
        if (Array.isArray(prefix)) {
            prefix = prefix.join(' ');
        } else {
            prefix = '';
        }
    }

    suggestions.forEach((string) => {
        results.push({content: prefix + ' ' + string, description: string});
    });

    return results;
};

chrome.omnibox.onInputCancelled.addListener(() => {
    resetDefaultSuggestion();
});

chrome.storage.onChanged.addListener(() => {
    console.log('Storage change triggered');

    setKeywordHierarchy();
});

chrome.omnibox.onInputChanged.addListener((text, suggestCallback) => {
    const suggestionInfo = getSuggestionInfo(keywordHierarchy, text),
        suggestionResults = getSuggestionResults(suggestionInfo.suggestions, suggestionInfo.prefix);

    suggestCallback(suggestionResults);
});

chrome.omnibox.onInputEntered.addListener((text) => {
    const action = getAction(keywordHierarchy, text);

    executeAction(action);
});
