import Vue from 'vue';
import Vuex, { MutationTree, ActionTree } from 'vuex';
// import moment from 'moment';

import { User } from '../../../types';

Vue.use(Vuex);

export interface RootState {
    user: User,
}

export default new Vuex.Store<RootState>({
    state: {
        user: {
            id: '',
            username: '',
            createdAt: '',
            updatedAt: ''
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        logoutUser(state) {
            state.user = {
                id: '',
                username: '',
                createdAt: '',
                updatedAt: ''
            }
        },
    } as MutationTree<RootState>,
    actions: {

    } as ActionTree<RootState, RootState>,
});
