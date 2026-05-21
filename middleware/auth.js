export default function ({ store, redirect }) {
  if (!store.state.jwt) {
    return redirect('/login')
  }
}
