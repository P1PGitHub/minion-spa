export default function ({ store, redirect }) {
  if (!store.state.account.account) {
    redirect('/auth/login')
  }
}
