var mutations = {
    encode: function (input) {
        return encodeURIComponent(input);
    },
    uppercase: function (input) {
        return input.toUpperCase();
    },
    // Change this
    camelize: function (input) {
        return input.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    },
    substitue: function (input, options) {
        var map = typeof options.map === 'object' ? options.map : {},
            defaultOption = typeof options.default === 'string' ? options.default : '';

        if (typeof map[input] !== 'undefined') {
            return map[input];
        }

        return defaultOption;
    },
    toHelp: function (input, options) {
        // Return a URL to the options page hiding all keywords except path given
        return '';
    },
};