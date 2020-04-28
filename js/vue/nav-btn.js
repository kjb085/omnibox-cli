var navBtn = Vue.component('nav-btn', {
    props: ['btnName', 'btnImage'],
    data: function () {
        return {
            displayImage: false,
        }
    },
    methods: {
        showImage: function () {
            this.displayImage = true;
        },
        hideImage: function () {
            this.displayImage = false;
        },
    },
    template: '#nav-btn-template'
});
