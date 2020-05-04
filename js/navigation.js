const navigation = {
    openNewWindow: (url, options) => {
        let $options = typeof options !== 'undefined' ?
                options :
                {
                    focused: true,
                    incognito: false,
                };

        // Remove to allow use of file and other chromium protocols
        if (url.indexOf('http') !== 0) {
            url = 'http://' + url;
        }

        $options.url = url;

        chrome.windows.create($options);
    },
    openInCurrentTab: (url) => {
        // Remove to allow use of file and other chromium protocols
        if (url.indexOf('http') !== 0) {
            url = 'http://' + url;
        }

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.update(tabs[0].id, {url: url});
        });
    },
    openInNewTab: (url, options) => {
        // Remove to allow use of file and other chromium protocols
        if (url.indexOf('http') !== 0) {
            url = 'http://' + url;
        }

        chrome.tabs.query({active: false, currentWindow: true}, (tabs) => {
            chrome.tabs.create({url: url});
        });
    },
};
