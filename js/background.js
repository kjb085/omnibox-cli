var keywordHierarchy = {},
    // Find a way to reduce memory footprint of cache
    commandCache = {};

var setKeywordHierarchy = function () {
    chrome.storage.sync.get(['keywordHierarchy'], function (result) {
        keywordHierarchy = createComputedProps(result.keywordHierarchy);
        commandCache = {};

        console.log('Keyword hierarchy changed:');
        console.log(result);
    });
};

// Initialize keyword hierarchy cache
setKeywordHierarchy();

function resetDefaultSuggestion() {
    chrome.omnibox.setDefaultSuggestion({
        "description": "%s"
    });
}

/**
 * @param {String[]} suggestions
 * @param {String|Array} prefix
 */
function getSuggestionResults(suggestions, prefix) {
    var results = [];

    if (typeof prefix !== 'string') {
        if (Array.isArray(prefix)) {
            prefix = prefix.join(' ');
        } else {
            prefix = '';
        }
    }

    suggestions.forEach(function (string) {
        results.push({content: prefix + ' ' + string, description: string});
    });

    return results;
}

chrome.omnibox.onInputCancelled.addListener(function() {
    resetDefaultSuggestion();
});

chrome.storage.onChanged.addListener(function () {
    console.log('Storage change triggered');

    setKeywordHierarchy();
});

chrome.omnibox.onInputChanged.addListener(function (text, suggestCallback) {
    var suggestionInfo = getSuggestionInfo(keywordHierarchy, text),
        suggestionResults = getSuggestionResults(suggestionInfo.suggestions, suggestionInfo.prefix);

    suggestCallback(suggestionResults);
});

chrome.omnibox.onInputEntered.addListener(function(text) {
    var navigate = navigation.openInCurrentTab,
        action = {
            url: '', // Create and use default options page 404 url
            navigateOptions: {},
        };

    if (typeof commandCache[text] !== "undefined") {
        action = commandCache[text];
    } else {
        action = getAction(keywordHierarchy, text);
        // Set cache for quicker interpretation
        commandCache[text] = action;
    }

    if (typeof action.navigate === 'function') {
        navigate = action.navigate;
    }

    navigate(action.url, action.navigateOptions);
});
