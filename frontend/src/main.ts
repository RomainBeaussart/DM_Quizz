import Vue from 'vue';
import VueApollo from 'vue-apollo'

import VueUploadComponent from 'vue-upload-component'

import vuetify from './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store/store';

import { createProvider } from './vue-apollo'
import VueSelectImage from 'vue-select-image'

//
// end register
//
Vue.config.productionTip = false;

// const datepickerOptions = {
// }

Vue.use(VueApollo)
Vue.use(VueSelectImage)
Vue.component('file-upload', VueUploadComponent)

require('vue-select-image/dist/vue-select-image.css')

new Vue({
    router,
    store,

    vuetify,
    // @ts-ignore

    apolloProvider: createProvider(),
    render: h => h(App)
} as any).$mount('#app');
