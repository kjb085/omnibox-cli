var navigation = {
    openNewWindow: function (url, options) {
        var options = typeof options !== 'undefined' ?
            options :
            {
                focused: true,
                incognito: false,
            };

        // Remove to allow use of file and other chromium protocols
        if (url.indexOf('http') !== 0) {
            url = 'http://' + url;
        }

        options.url = url;

        chrome.windows.create(options);
    },
    openInCurrentTab: function (url) {
        // Remove to allow use of file and other chromium protocols
        if (url.indexOf('http') !== 0) {
            url = 'http://' + url;
        }

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.update(tabs[0].id, {url: url});
        });
    },
    openInNewTab: function (url, options) {
        // Remove to allow use of file and other chromium protocols
        if (url.indexOf('http') !== 0) {
            url = 'http://' + url;
        }

        chrome.tabs.query({active: false, currentWindow: true}, function(tabs) {
            chrome.tabs.create({url: url});
        });
    },
};
