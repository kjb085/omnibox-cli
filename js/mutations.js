const mutations = {
    encode: (input) => {
        return encodeURIComponent(input);
    },
    uppercase: (input) => {
        return input.toUpperCase();
    },
    // @TODO Update this
    camelize: (input) => {
        return input.replace(/(?:^\w|[A-Z]|\b\w)/g,(word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    },
    substitue: (input, options) => {
        const map = typeof options.map === 'object' ? options.map : {},
            defaultOption = typeof options.default === 'string' ? options.default : '';

        if (typeof map[input] !== 'undefined') {
            return map[input];
        }

        return defaultOption;
    },
    toHelp: (input, options) => {
        // @TODO - Return a URL to the options page hiding all keywords except path given
        return null;
    },
};