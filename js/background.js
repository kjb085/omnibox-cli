var refreshHierarchy = false;

function resetDefaultSuggestion() {
    chrome.omnibox.setDefaultSuggestion({
        "description": "%s"
    });
}

/**
 * @param {string[]} suggestions
 * @param {string|Array} prefix
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

// Probably just remove this
// chrome.omnibox.onInputStarted.addListener(function () {
//     console.log('started');
// });

chrome.omnibox.onInputCancelled.addListener(function() {
    resetDefaultSuggestion();
});

var gitlabRepo = {
    commits: {
        self: 'commits/',
        input: {
            count: 1,
            defaults: [''],
            suggestions: [['staging', 'master', 'kb/']]
        }
    },
    merge_requests: 'merge_requests/',
    compare: {
        self: 'merge_requests/new?utf8=✓&merge_request%5Bsource_branch%5D={1}&merge_request%5Btarget_branch%5D={2}',
        input: {
            count: 2,
            defaults: ['staging', 'master'],
            suggestions: [['kb/', 'staging'], ['staging', 'master']],
        }
    }
};

var keywordHierarchy = {
    abc: {
        self: 'https://www.google.com',
        replace: false,
        next: {
            def: '/test'
        }
    },
    test: 'www.bing.com',
    gitlab: {
        self: 'https://gitlab.dev.tripadvisor.com/cruise/',
        next: {
            php: {
                self: 'cruisecritic-php/',
                next: gitlabRepo
            },
            admin: {
                self: 'cc-admin-php/',
                next: gitlabRepo
            },
            images: {
                self: 'cc-images/',
                next: gitlabRepo
            },
            utils: {
                self: 'cc-utils/',
                next: gitlabRepo
            },
            docker: {
                self: 'cc-php7-docker/',
                next: gitlabRepo
            },
            'hipship-php': {
                self: 'cc-api-php/',
                next: gitlabRepo
            },
            'hipship-js': {
                self: 'cc-api-js/',
                next: gitlabRepo
            },
            messaging: {
                self: 'cc-messaging/',
                next: gitlabRepo
            },
            todo: 'dashboard/todos',
        },
    },
    r: {
        self: 'www.reddit.com/r/',
        // acceptsInput: true,
        input: {
            count: 1,
            suggestions: ['jailbreak', 'eagles', 'goldandblack']
        }
    },
    atp: {
        self: 'https://www.atptour.com/en/',
        next: {
            rankings: 'rankings/singles/',
            tournaments: 'tournaments',
        }
    },
    special: 'http://theweekdaycafe.com/menuPDF/TheWeekdayCafe-Ewing-Specials.pdf',
    jenkins: {
        self: 'http://jenkins.dev.cruisecritic.net/',
        next: {
            php: {
                self: 'job/cruisecritic-php/{1}',
                input: {
                    count: 1,
                    defaults: [''],
                    suggestions: ['kb/'],
                    mutations: [['encode']],
                    formats: ['job/{+}']
                }
            }
        }
    },
    "pto": "https://docs.tamg.io/display/FCC/Flights%2C+Cruise%2C+Car",
    "traffic": "https://www.google.com/maps/@40.2446906,-74.8084201,13.62z/data=!5m1!1e1",
};

if (refreshHierarchy) {
    chrome.storage.sync.set({ keywordHierarchy: keywordHierarchy }, function () {
        console.log('set');
    });
}

// chrome.storage.sync.get(['keywordHierarchy'], function (result) {
//     keywordHierarchy = result.keywordHierarchy;

//     console.log('here1');
//     console.log(result);
// });

chrome.storage.onChanged.addListener(function () {
    console.log('Storage change triggered');

    chrome.storage.sync.get(['keywordHierarchy'], function (result) {
        keywordHierarchy = result.keywordHierarchy;

        console.log('Keyword hierarchy changed:');
        console.log(result);
    });


});

chrome.omnibox.onInputChanged.addListener(function (text, suggestCallback) {
    // var pieces = text.split(' '),
    //     suggestions = Object.keys(keywordHierarchy),
    //     prefix = [],
    //     suggestionCount = 0,
    //     suggestionLimit = 1,
    //     current = keywordHierarchy;

    // pieces.forEach(function (piece) {
    //     if (currentPieceIsObject && typeof currentPiece.input === 'object'
    //         && Array.isArray(currentPiece.input.suggestions)
    //         && suggestionCount < suggestionLimit) {
    //         suggestions = currentPiece.input.suggestions[suggestionCount];

    //         suggestionLimit = currentPiece.input.suggestions.length;
    //         suggestionCount++;
    //     } else {
    //         var currentPiece = current[piece],
    //         currentPieceIsObject = typeof currentPiece === 'object';

    //         if (currentPieceIsObject && typeof currentPiece.next === 'object') {
    //             suggestions = Object.keys(currentPiece.next);
    //             current = currentPiece.next;
    //             prefix.push(piece);

    //             suggestionCount = 0;
    //             suggestionLimit = 1;
    //         } else  {
    //             suggestions = suggestions.filter(function (keyword) {
    //                 return keyword.indexOf(piece) === 0;
    //             });

    //             return;
    //         }
    //     }
    // });

    suggestionsAndPrefix = getSuggestions(keywordHierarchy, text);
    suggestions = suggestionsAndPrefix[0];
    prefix = suggestionsAndPrefix[1];

    suggestCallback(getSuggestionResults(suggestions, prefix));
});

chrome.omnibox.onInputEntered.addListener(function(text) {
    // var pieces = text.split(' '),
    //     current = keywordHierarchy,
    //     url = '',
    //     urlPieces = [],
    //     isInput = false,
    //     inputCounter = 0,
    //     inputLimit = 0,
    //     input = null;

    // /**
    //  * Need to implement input defaults
    //  */

    // pieces.forEach(function (piece) {
    //     var currentPiece = current[piece],
    //         typeOf = typeof currentPiece;

    //     if (isInput) {
    //         url += piece;

    //         inputCounter++;

    //         urlPieces = updateLastUrlPiece(urlPieces, piece, inputCounter, input);
    //         // lastUrlPiece = urlPieces.pop();
    //         // // lastUrlPiece = lastUrlPiece.replace('{' + inputCounter + '}', piece);
    //         // urlPieces.push(updateUrlPiece(lastUrlPiece, piece, inputCounter));

    //         if (inputCounter === inputLimit) {
    //             isInput = false;
    //             input = null;
    //         }
    //     } else if (typeOf === 'string') {
    //         url += currentPiece;
    //         urlPieces.push(currentPiece);
    //     } else if (typeOf === 'object') {
    //         if (typeof currentPiece.self === 'string') {
    //             if (typeof currentPiece.replace === true) {
    //                 url = currentPiece.self;
    //                 url = [currentPiece.self];
    //             } else {
    //                 url += currentPiece.self;
    //                 urlPieces.push(currentPiece.self);
    //             }
    //         }

    //         if (currentPiece.acceptsInput) {
    //             isInput = true;
    //         } else if (typeof currentPiece.input === 'object') {
    //             isInput = true;
    //             inputLimit = currentPiece.input.count;
    //             input = currentPiece.input;
    //         }

    //         if (typeof currentPiece.next === 'object') {
    //             current = currentPiece.next;
    //         } else if (!isInput) {
    //             return;
    //         }
    //     }
    // });

    // // Apply defaults if no further pieces set while expecting input
    // if (isInput && typeof input === 'object' && Array.isArray(input.defaults)) {
    //     input.defaults.forEach(function (def, index) {
    //         urlPieces = updateLastUrlPiece(urlPieces, def, index + 1, input);
    //     });
    // }
    // // console.log(url);
    // // console.log(urlPieces.join(''))
    // // navigate(url);

    // var url = getUrl(keywordHierarchy, text);
    // navigate(url);

    var action = getAction(keywordHierarchy, text),
        navigate = typeof action.navigate === 'function' ? action.navigate : openInCurrentTab;

    navigate(action.url, action.navigateOptions);
});
