var getSuggestions = function (keywordHierarchy, text) {
    var pieces = text.split(' '),
        suggestions = Object.keys(keywordHierarchy),
        prefix = [],
        suggestionCount = 0,
        suggestionLimit = 1,
        current = keywordHierarchy;

    pieces.forEach(function (piece) {
        var currentPiece = current[piece],
            currentPieceIsObject = typeof currentPiece === 'object';

        if (currentPieceIsObject && typeof currentPiece.input === 'object'
            && Array.isArray(currentPiece.input.suggestions)
            && suggestionCount < suggestionLimit) {
            suggestions = currentPiece.input.suggestions[suggestionCount];

            suggestionLimit = currentPiece.input.suggestions.length;
            suggestionCount++;
        } else {
            if (currentPieceIsObject && typeof currentPiece.next === 'object') {
                suggestions = Object.keys(currentPiece.next);
                current = currentPiece.next;
                prefix.push(piece);

                suggestionCount = 0;
                suggestionLimit = 1;
            } else  {
                suggestions = suggestions.filter(function (keyword) {
                    return keyword.indexOf(piece) === 0;
                });

                return;
            }
        }
    });

    return [suggestions, prefix];
};

var updateLastUrlPiece = function (urlPieces, input, count, inputOptions) {
    var lastUrlPiece = urlPieces.pop(),
        toReplace = '{' + count + '}';

    if (typeof inputOptions === 'object') {
        if (Array.isArray(inputOptions.mutations)) {
            var inputMutations = inputOptions.mutations[count - 1];

            inputMutations.forEach(function (mutation) {
                mutationFunction = mutations[mutation];

                if (typeof mutationFunction === 'function') {
                    input = mutationFunction(input);
                }
            });
        }

        if (Array.isArray(inputOptions.formats)) {
            var format = inputOptions.formats[count - 1];

            input = format.replace('{+}', input);
        }
    }

    if (lastUrlPiece.indexOf(toReplace) > -1) {
        lastUrlPiece = lastUrlPiece.replace(toReplace, input);
    } else if (typeof inputOptions.appendWith !== 'undefined') {
        lastUrlPiece = lastUrlPiece + inputOptions.appendWith + input;
    } else {
        lastUrlPiece = lastUrlPiece + input;
    }

    urlPieces.push(lastUrlPiece);

    return urlPieces;
};

// var getUrl = function (keywordHierarchy, text) {
//     var pieces = text.split(' '),
//         current = keywordHierarchy,
//         url = '',
//         urlPieces = [],
//         isInput = false,
//         inputCounter = 0,
//         inputLimit = 0,
//         input = null;

//     pieces.forEach(function (piece) {
//         var currentPiece = current[piece],
//             typeOf = typeof currentPiece;

//         if (isInput) {
//             url += piece;

//             inputCounter++;

//             urlPieces = updateLastUrlPiece(urlPieces, piece, inputCounter, input);
//             // lastUrlPiece = urlPieces.pop();
//             // // lastUrlPiece = lastUrlPiece.replace('{' + inputCounter + '}', piece);
//             // urlPieces.push(updateUrlPiece(lastUrlPiece, piece, inputCounter));

//             if (inputCounter === inputLimit) {
//                 isInput = false;
//                 input = null;
//             }
//         } else if (typeOf === 'string') {
//             url += currentPiece;
//             urlPieces.push(currentPiece);
//         } else if (typeOf === 'object') {
//             if (typeof currentPiece.self === 'string') {
//                 if (typeof currentPiece.replace === true) {
//                     url = currentPiece.self;
//                     url = [currentPiece.self];
//                 } else {
//                     url += currentPiece.self;
//                     urlPieces.push(currentPiece.self);
//                 }
//             }

//             if (currentPiece.acceptsInput) {
//                 isInput = true;
//             } else if (typeof currentPiece.input === 'object') {
//                 isInput = true;
//                 inputLimit = currentPiece.input.count;
//                 input = currentPiece.input;
//             }

//             if (typeof currentPiece.next === 'object') {
//                 current = currentPiece.next;
//             } else if (!isInput) {
//                 return;
//             }
//         }
//     });

//     console.log(urlPieces);

//     // Apply defaults if no further pieces set while expecting input
//     if (isInput && typeof input === 'object' && Array.isArray(input.defaults)) {
//         console.log('updating for input');
//         console.log(input.defaults);

//         input.defaults.forEach(function (def, index) {
//             urlPieces = updateLastUrlPiece(urlPieces, def, index + 1, input);
//         });
//     }

//     console.log(urlPieces);

//     // console.log(url);
//     // console.log(urlPieces.join(''))
//     // navigate(url);
//     return urlPieces.join('');
// };

var getAction = function (keywordHierarchy, text) {
    var pieces = text.split(' '),
        current = keywordHierarchy,
        url = '', // create default 404 page
        urlPieces = [],
        urlPiecesFull = [],
        isInput = false,
        inputCounter = 0,
        inputLimit = 0,
        input = null,
        localFlags = {},
        flags = [];

    pieces.forEach(function (piece) {
        var currentPiece = current[piece],
            typeOf = typeof currentPiece;

        if (isInput) {
            url += piece;

            inputCounter++;

            urlPieces = updateLastUrlPiece(urlPieces, piece, inputCounter, input);
            // lastUrlPiece = urlPieces.pop();
            // // lastUrlPiece = lastUrlPiece.replace('{' + inputCounter + '}', piece);
            // urlPieces.push(updateUrlPiece(lastUrlPiece, piece, inputCounter));

            if (inputCounter === inputLimit) {
                isInput = false;
                input = null;
            }
        } else if (typeOf === 'string') {
            url += currentPiece;
            urlPieces.push(currentPiece);
            urlPiecesFull.push({})
        } else if (typeOf === 'object') {
            if (typeof currentPiece.self === 'string') {
                if (typeof currentPiece.replace === true) {
                    url = currentPiece.self;
                    url = [currentPiece.self];
                } else {
                    url += currentPiece.self;
                    urlPieces.push(currentPiece.self);
                }
            }

            if (currentPiece.acceptsInput) {
                isInput = true;
            } else if (typeof currentPiece.input === 'object') {
                isInput = true;
                inputLimit = currentPiece.input.count;
                input = currentPiece.input;
            }

            // Currently this only allows flags to be accepted after the piece that
            // calls for them is declared - possibly look to correct for this
            if (Array.isArray(currentPiece.flags)) {
                currentPiece.flags.forEach(function (flag) {
                    localFlags.push(flag);
                });
            }

            if (typeof currentPiece.next === 'object') {
                current = currentPiece.next;
            } else if (!isInput) {
                // Why is this doing this?
                return;
            }
        } else if (typeof globalFlags[piece] === 'object') {
            flags.push(globalFlags[piece]);
        } else if (typeof localFlags[piece] === 'object') {
            flags.push(localFlags[piece]);
        }
    });

    // console.log(urlPieces);

    // Apply defaults if no further pieces set while expecting input
    if (isInput && typeof input === 'object' && Array.isArray(input.defaults)) {
        console.log('updating for input');
        console.log(input.defaults);

        input.defaults.forEach(function (def, index) {
            urlPieces = updateLastUrlPiece(urlPieces, def, index + 1, input);
        });
    }

    var action = {
        urlPieces: urlPieces,
        urlPiecesFull: urlPiecesFull,
        inputPieces: pieces,
        navigate: openInCurrentTab,
        navigateOptions: {},
        endsOnInput: isInput,
    };

    flags.forEach(function (flag) {
        if (Array.isArray(flag.mutations)) {
            flag.mutations.forEach(function (mutation) {
                action = mutation(action);
            });
        }

        if (typeof flag.navigate === 'function') {
            action.navigate = flag.navigate;
        }

        if (typeof flag.navigateOptions === 'object') {
            action.navigateOptions = Object.assign(action.navigateOptions, flag.navigateOptions);
        }
    });

    action.url = action.urlPieces.join('');
    // console.log(urlPieces);

    // console.log(url);
    // console.log(urlPieces.join(''))
    // navigate(url);
    // return urlPieces.join('');
    return action;
};