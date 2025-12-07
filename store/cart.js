import cookies from "js-cookie";
import { cartItems } from "../assets/services/cart.js";

const state = () => ({
  cartItems: [],
});

const getters = {
  cartItems(state) {
    return state.cartItems;
  }
}

const actions = {
  addItem({ commit, state }, item) {
    const newCartItems = [...state.cartItems, item];
    commit("SetCartItems", newCartItems);
  },
  deleteItem({ commit, state }, item) {
    const newCartItems = state.cartItems.filter(i => i.id !== item.id);
    commit("SetCartItems", newCartItems);
  }
}


const mutations = {
  SetCartItems(state, value) {
    state.cartItems = value;
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
