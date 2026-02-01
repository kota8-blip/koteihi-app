/**
 * 用户模块
 */
import cookies from "js-cookie";
import {
  LOGIN,
  OUT_LOGIN,
  USER_INFO_UPDATA
} from './types.js';

const state = () => ({
  userInfo: {},
  successToast: false,
  errorToast: false,
});

const getters = {
  userInfo(state) {
    // if (typeof window !== "undefined" && JSON.stringify(state.userInfo) === '{}' && cookies.get('userInfo')) {
    //   state.userInfo = JSON.parse(cookies.get('userInfo'));
    // }
    return state.userInfo;
  },
  successToast(state) {
    return state.successToast;
  }
}

const actions = {
  restoreUserInfo({ commit }, user) {
  if (user) {
    commit('SET_USERINFO', user);
  } else if (typeof window !== "undefined" && cookies.get('userInfo')) {
    // cookieから復元
    commit('SET_USERINFO', JSON.parse(cookies.get('userInfo')));
  }
},
  login({
    commit
  }, value) {
    commit(LOGIN, value);
  },
  outLogin({
    commit
  }) {
    commit(OUT_LOGIN);
  },
  update({
    commit
  }, value) {
    commit(USER_INFO_UPDATA, value);
  }
}

const mutations = {
  SET_USERINFO(state, value) {
    state.userInfo = value;
  },
  [LOGIN](state, value) {
    cookies.set('userInfo', {
      avatar: value.avatar,
      // create_time: value.create_time,
      mobile: value.mobile,
      user_id: value.user_id,
      username: value.username
    });
    state.userInfo = value;
  },
  [OUT_LOGIN](state) {
    cookies.remove('userInfo');
    state.userInfo = {};
  },
  [USER_INFO_UPDATA](state, value) {
    state.userInfo = Object.assign(state.userInfo, value);
    cookies.set('userInfo', state.userInfo);
  },
  setToast(state, { type,  message }) {
    if (type === 'success') {
      state.successToast = message;
      setTimeout(() => {
        state.successToast = false;
      }, 3000)
    } else if (type === 'error') {
      state.errorToast = message;
      setTimeout(() => {
        state.errorToast = false;
      }, 3000)
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
