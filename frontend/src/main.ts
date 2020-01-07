import Vue from 'vue';
import VueApollo from 'vue-apollo'

import VueUploadComponent from 'vue-upload-component'

import vuetify from './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store/store';

import VueChatScroll from 'vue-chat-scroll'
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
Vue.use(VueChatScroll)
Vue.component('file-upload', VueUploadComponent)

require('vue-select-image/dist/vue-select-image.css')

new Vue({
    router,
    store,
    vuetify,
    // @ts-ignore

    render: h => h(App)
} as any).$mount('#app');
