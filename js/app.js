var app = new Vue({
    el: "#app",
    data: {
        keywordObjects: [],
        promptOnDelete: true,
        minimized: false,
        componentKey: 0,
        showModal: false,
        navImages: {
            save: false,
            add: false,
            minimizeExpand: false,
        },
    },
    beforeMount: function () {
        var self = this;

        getFromStorage(['keywordObjects'], (result) => {
            self.keywordObjects = result.keywordObjects;
        });
    },
    computed: {
        minimizeExpand: function () {
            return this.minimized ? 'Expand' : 'Minimize';
        },
    },
    methods: {
        addPrimaryKeyword: function () {
            var keywordObjects = this.keywordObjects;

            // keywordObjects[uniqid] = defaultOptions;

            keywordObjects.push(defaultOptions);

            // this.keywordObjects = keywordObjects;
            // this.componentKey += 1;
        },
        disablePromptOnDelete: function () {
            this.promptOnDelete = false;
        },
        toggleMinExpand: function () {
            this.$refs.hierarchy.minimizeNodes(!this.minimized);

            this.minimized = !this.minimized;
        },
        showNavImage: function (navImage) {
            this.navImages[navImage] = true;
        },
        hideNavImage: function (navImage) {
            this.navImages[navImage] = false;
        },
        save: function () {
            var keywordObjects = this.$refs.hierarchy.getData();

            console.log(keywordObjects);

            // @TODO implement storage sync save
            // saveKeywordHierarchy(keywordHierarchy);
        },
    }
});
