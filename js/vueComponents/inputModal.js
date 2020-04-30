var inputModal = Vue.component("input-modal", {
    props: ['options'],
    data: function () {
        return {
            count: 0,
            suggestions: [],
            defaults: [],
            mutations: [],
            formats: [],
        }
    },
    beforeMount: function () {
        var self = this,
            optionProps = [
                'count',
                'suggestions',
                'defaults',
                'mutations',
                'formats',
            ];

        optionProps.forEach(function (optionProp) {
            self[optionProp] = typeof self.options[optionProp] !== 'undefined' ? self.options[optionProp] : self[optionProp];
        });
    },
    methods: {
        getData: function () {
            return {
                accept: !!(this.count),
                count: this.count,
                suggestions: this.suggestions,
                defaults: this.defaults,
                mutations: this.mutations,
                formats: this.formats,
            };
        },
    },
    template: "#input-modal-template"
});
