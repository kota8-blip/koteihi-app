const state = () => ({
  favoriteItems: [],
});

const getters = {
  getFavoriteItems(state) {
    return state.favoriteItems;
  }
}

const mutations = {
  setFavoriteItems(state, value) {
    console.log('SetFavoriteItems', value);
    state.favoriteItems = value;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
