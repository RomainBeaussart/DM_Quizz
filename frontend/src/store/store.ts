import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

var store: any = {
    state: {
      user: { id: 1, name: 'testUser'}
    },
    mutations: {
    },
    actions: {
    },
    modules: {
    },
}

export default new Vuex.Store(store);
