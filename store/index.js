export const state = () => ({
  jwt: null,
  currentColor: '#ffffff',
  fixedCosts: [],
  isPremium: false,
})

export const mutations = {
  LOAD_FROM_STORAGE(state) {
    if (process.client) {
      const token = localStorage.getItem('token');
      if (token) state.jwt = token;

      const color = localStorage.getItem('currentColor');
      if (color) state.currentColor = color;

      const isPremium = localStorage.getItem('isPremium');
      if (isPremium) state.isPremium = isPremium === 'true';
    }
  },
  SET_JWT(state, jwt) {
    state.jwt = jwt;
  },
  SET_CURRENT_COLOR(state, color) {
    state.currentColor = color;
    if (process.client) localStorage.setItem('currentColor', color);
  },
  SET_FIXED_COSTS(state, costs) {
    state.fixedCosts = costs;
  },
  SET_IS_PREMIUM(state, val) {
    state.isPremium = val;
    if (process.client) localStorage.setItem('isPremium', val);
  },
}

export const actions = {
  async logIn({ commit }, payload) {
    const response = await this.$axios.post('/api/login', { ...payload });
    const jwt = response.data.token;
    const isPremium = response.data.isPremium || false;
    commit('SET_JWT', jwt);
    commit('SET_IS_PREMIUM', isPremium);
    if (process.client) localStorage.setItem('token', jwt);
    this.$axios.setHeader('Authorization', `Bearer ${jwt}`);
  },
  async register({ commit }, payload) {
    const response = await this.$axios.post('/api/register', { ...payload });
    const jwt = response.data.token;
    const isPremium = response.data.isPremium || false;
    commit('SET_JWT', jwt);
    commit('SET_IS_PREMIUM', isPremium);
    commit('SET_CURRENT_COLOR', '#ffffff');
    if (process.client) localStorage.setItem('token', jwt);
    this.$axios.setHeader('Authorization', `Bearer ${jwt}`);
  },
  logout({ commit }) {
    commit('SET_JWT', null);
    commit('SET_IS_PREMIUM', false);
    commit('SET_FIXED_COSTS', []);
    if (process.client) {
      localStorage.removeItem('token');
      localStorage.removeItem('isPremium');
    }
    this.$axios.setHeader('Authorization', null);
  },
  async loadFixedCosts({ commit }) {
    const res = await this.$axios.get('/api/fixed-costs');
    commit('SET_FIXED_COSTS', res.data);
  },
  async addFixedCost({ dispatch }, payload) {
    await this.$axios.post('/api/fixed-costs', payload);
    await dispatch('loadFixedCosts');
  },
  async deleteFixedCost({ dispatch }, id) {
    await this.$axios.delete(`/api/fixed-costs/${id}`);
    await dispatch('loadFixedCosts');
  },
  async editFixedCost({ dispatch }, payload) {
    await this.$axios.put(`/api/fixed-costs/${payload.id}`, payload);
    await dispatch('loadFixedCosts');
  },
  async fetchCostHistory() {
    const res = await this.$axios.get('/api/fixed-costs/history');
    return res.data;
  },
}



