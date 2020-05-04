const flagDefinitions = {
    newTab: {
        navigate: navigation.openInNewTab,
    },
    newWindow: {
        navigate: navigation.openNewWindow,
    },
    incognito: {
        navigate: navigation.openNewWindow,
        navigateOptions: {
            incognito: true,
        }
    },
    delay: {
        navigateOptions: {
            delay: 30,
        },
        input: true,
    },
    mutatePieceExample: {
        mutate: [
            {
                piece: 0,
                whole: false,
                mutate: mutations.encode,
            },
        ]
    },
    mutateWholeExample: {
        mutate: [
            {
                whole: true,
                mutate: mutations.encode,
            },
        ]
    },
    help: {
        mutate: [
            {
                whole: true,
                mutate: mutations.toHelp, // Format a request to go to config page with everything except specified path minimized
            },
        ],
    }
};

const globalFlags = {
    // New tab
    '--new-tab': flagDefinitions.newTab,
    '-t': flagDefinitions.newTab,
    // New window
    '--new-window': flagDefinitions.newWindow,
    '-w': flagDefinitions.newWindow,
    // New incognito window
    '--incognito': flagDefinitions.incognito,
    '-i': flagDefinitions.incognito,
    // Delayed open - temporarily disabled
    // '--delay': flagDefinitions.delay,
    // '-d': flagDefinitions.delay,
};
