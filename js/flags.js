var flagDefinitions = {
    newTab: {
        mutations: [],
        navigate: openInNewTab,
    },
    newWindow: {
        mutate: [],
        navigate: openNewWindow,
    },
    incognito: {
        mutate: [],
        navigate: openNewWindow,
        navigateOptions: {
            incognito: true,
        }
    },
    mutatePieceExample: {
        mutate: [
            {
                piece: 0,
                whole: false,
                mutate: encode,
            }
        ]
    },
    mutateWholeExample: {
        mutate: [
            {
                whole: true,
                mutate: encode,
            }
        ]
    },
    help: {
        mutate: [
            {
                whole: true,
                mutate: toHelp, // Format a request to 
            }
        ],
    }
};

var globalFlags = {
    '--new-tab': flagDefinitions.newTab,
    '-t': flagDefinitions.newTab,
    '--new-window': flagDefinitions.newWindow,
    '-w': flagDefinitions.newWindow,
    '--incognito': flagDefinitions.incognito,
    '-i': flagDefinitions.incognito,
};
