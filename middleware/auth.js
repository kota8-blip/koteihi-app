export default function ({ store, redirect }) {
  if (process.client && !store.state.jwt) {
    store.commit('LOAD_FROM_STORAGE');
  }
  if (!store.state.jwt) {
    return redirect('/login')
  }
}
