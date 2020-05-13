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
    options: {},
};

var nodes = Vue.component('nodes', {
    props: ['nodes', 'level'],
    template: '#nodes-template',
    data: function () {
        return {
            count: 0,
            $_nodes: [],
        }
    },
    // beforeMount: function () {
    //     this.$_nodes = this.nodes;
    // },
    // mounted: function () {
    //     this.count = Array.isArray(this.nodes) ? this.nodes.length : 0;
    //     console.log(this.nodes);
    // },
    computed: {
        countClass: function () {
            // console.log(this.count);

            return 'count-' + this.count;
        }
    },
    methods: {
        addKeyword: function () {
            var nodes = this.nodes,
                uniqid = Math.random();

            nodes[uniqid] = defaultOptions;

            this.nodes = nodes;
            this.count = nodes.length;
        },
        minimizeNodes: function (shouldMinimize) {
            var shouldMinimize = typeof shouldMinimize !== 'undefined' ? !!shouldMinimize : null;

            if (Array.isArray(this.$refs.item)) {
                this.$refs.item.forEach(function ($ref) {
                    $ref.minimize(shouldMinimize);
                });
            } else if (typeof this.$refs.item === 'object') {
                data = this.$refs.item.minimize(shouldMinimize);
            }
        },
        getData: function () {
            let self = this,
                data = [];

            if (Array.isArray(self.$refs.item)) {
                self.$refs.item.forEach(function (ref) {
                    data.push(ref.getData());
                });
            }

            return data;
        },
        // getData: function () {
        //     var self = this,
        //         hierarchy = [];

        //     if (Array.isArray(this.$refs.item)) {
        //         this.$refs.item.forEach(function (ref) {
        //             var data = ref.getData();

        //             hierarchy = self.updateHierarchy(hierarchy, data);
        //         });
        //     } else if (typeof this.$refs.item === 'object') {
        //         data = this.$refs.item.getData();

        //         hierarchy = self.updateHierarchy(hierarchy, data);
        //     }

        //     return hierarchy;
        // },
        // updateHierarchy: function (hierarchy, data) {
        //     var keyword = data.keyword;

        //     console.log(data);

        //     if (!data.options.delete) {
        //         if (typeof hierarchy[keyword] !== 'undefined') {
        //             swal('Keyword collision');

        //             // Add error highlighting

        //             throw new Error('keyword collision: ' + keyword);
        //         }

        //         hierarchy[keyword] = data.options;
        //     }

        //     return hierarchy;
        // },
    },
});
