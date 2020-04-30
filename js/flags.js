var flagDefinitions = {
    newTab: {
        mutations: [],
        navigate: navigation.openInNewTab,
    },
    newWindow: {
        mutate: [],
        navigate: navigation.openNewWindow,
    },
    incognito: {
        mutate: [],
        navigate: navigation.openNewWindow,
        navigateOptions: {
            incognito: true,
        }
    },
    mutatePieceExample: {
        mutate: [
            {
                piece: 0,
                whole: false,
                mutate: mutations.encode,
            }
        ]
    },
    mutateWholeExample: {
        mutate: [
            {
                whole: true,
                mutate: mutations.encode,
            }
        ]
    },
    help: {
        mutate: [
            {
                whole: true,
                mutate: mutations.toHelp, // Format a request to
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
