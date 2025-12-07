import Vue from 'vue';
import Vuex from 'vuex';
import {
  LOGIN,
} from './types.js';

import userInfo from './userInfo.js';
import cart from './cart.js';

Vue.use(Vuex)

export default () => new Vuex.Store({
  modules: {
    userInfo,
    cart
  },

  state: {
    count: 0,
    時間: '',
  },
  mutations: {
    increment(state) { state.count++; },
    decrement(state) { state.count--; },
    setTime(state, time) { state.時間 = time; }
  },
  actions: {
    addCount({ commit }) { commit('increment'); },
    downCount({ commit }) { commit('decrement'); },
    updateTime({ commit }, time) { commit('setTime', time); },
    nuxtServerInit({ commit }, { req }) { /* ... */ }
  }
});
