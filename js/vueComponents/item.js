var defaultOptions = {
    self: '',
    replace: false,
    input: {
        accept: false,
        count: 0,
        defaults: [],
        suggestions: [],
        mutations: [],
        formats: [],
    },
    next: {},
    new: null, // Options: null, 'tab', 'window'
    suggestions: [], // Still to decide on this
};

var item = Vue.component('item', {
    props: ['options', 'level', 'index'],
    data: function () {
        return {
            show: true,
            showOptions: false,
            showModal: false,
            delete: true,
            minimized: false,
            // $_urlComponent: null,
            $_options: null,
            $_input: null,
            modalKey: 0,
        };
    },
    beforeMount: function () {
        var defaults = Object.assign({}, defaultOptions);
            // keywordTest = parseFloat(this.keyword);

        // Prevent mutation of props and store needed values on data
        // this.$_keyword = keywordTest < 1 && keywordTest !== 0 ? '' : this.keyword;
        // this.$_urlComponent = typeof this.options === 'object' ? this.options.self : this.options;
        // Massage the data if is object
        this.$_options = typeof this.options === 'object' ? Object.assign(defaults, this.options) : defaults;
        this.$_input = typeof this.options.input === 'object' ? this.options.input : {};
    },
    methods: {
        getId: function (prefix) {
            return [prefix, this.level, this.index].join('-');
        },
        getBuffer: function (index) {
            return 'buffer-' + index;
        },
        openModal: function () {
            this.showModal = true;
        },
        closeModal: function () {
            this.$_input = this.$refs.input.getData();
            this.modalKey += 1;
            this.showModal = false;
        },
        toggleOptions: function () {
            this.showOptions = !this.showOptions;
        },
        minimize: function (shouldMinimize) {
            var shouldMinimize = typeof shouldMinimize !== 'undefined' && shouldMinimize !== null ? !!shouldMinimize : null,
                show = shouldMinimize !== null ? !shouldMinimize : !this.show,
                minimized = shouldMinimize !== null ? shouldMinimize : this.minimize;

            this.show = show;
            this.minimized = minimized;
        },
        getData: function () {
            var keyword = this.$_keyword,
                options = this.$_options;

            // options['self'] = this.$_urlComponent;

            if (typeof this.$refs.hierarchy !== 'undefined') {
                options['next'] = this.$refs.hierarchy.getData();
            }

            if (typeof this.$_input.accpet !== 'undefined') {
                options['input'] = this.$_input;
            }

            // return {
            //     keyword: keyword,
            //     options: options,
            // };
            return options;
        },
        removeKeyword: function () {
            var self = this;

            if (app.promptOnDelete) {
                swal({
                    title: "Are you sure you want to delete this keyword?",
                    text: "All subsequent keywords will also be deleted.\n" +
                        "(Your changes won't take effect until you press save)",
                    icon: "warning",
                    buttons: {
                        cancel: {
                            text: 'Cancel',
                            visible: true,
                            className: "swal-button--cancel",
                        },
                        neverAsk: {
                            text: "Never ask again",
                            className: "swal-button--danger",
                        },
                        delete: {
                            text: "Delete",
                            className: "swal-button--danger"
                        },
                    },
                })
                .then(function (result) {
                    switch (result) {
                        case 'neverAsk':
                            app.promptOnDelete = false;
                        case 'delete':
                            self.deleteItem();
                            break;
                    }
                });
            } else {
                self.deleteItem();
            }
        },
        deleteItem: function () {
            this.delete = true;
            this.show = false;
        },
        addSubKeyword: function () {
            this.$refs.hierarchy.addKeyword();
        },
        getLabelClass: function (variable) {
            return variable ? 'active' : '';
        },
    },
    computed: {
        optionsArrow: function () {
            return this.showOptions ? 'arrow_drop_up' : 'arrow_drop_down';
        },
        showHideIcon: function () {
            return this.show ? 'remove' : 'add';
        },
        // Figure this shit out
        keywordLabelClass: function () {
            // return this.$_keyword ? 'active' : '';
            return this.getLabelClass(this.$_keyword);
        },
        urlComponentLabelClass: function () {
            return this.getLabelClass(this.$_urlComponent);
        },
    },
    template: '#item-template'
});
