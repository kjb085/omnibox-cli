var app = new Vue({
    el: "#app",
    data: {
        keywordHierarchy: [],
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

        chrome.storage.sync.get(['keywordHierarchy'], function (result) {
            self.keywordHierarchy = result.keywordHierarchy.next;
        });
    },
    computed: {
        minimizeExpand: function () {
            return this.minimized ? 'Expand' : 'Minimize';
        },
    },
    methods: {
        addPrimaryKeyword: function () {
            var keywordHierarchy = this.keywordHierarchy,
                uniqid = Math.random();

            keywordHierarchy[uniqid] = defaultOptions;

            this.keywordHierarchy = keywordHierarchy;
            this.componentKey += 1;
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
            var keywordHierarchy = this.$refs.hierarchy.getData();

            console.log(keywordHierarchy);

            // @TODO implement storage sync save
            // saveKeywordHierarchy(keywordHierarchy);
        },
    }
});
