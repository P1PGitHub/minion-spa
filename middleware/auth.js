export default async function ({ app, store, redirect }) {
  if (!store.state.account.account) {
    let isLoggedIn = await store.dispatch('api/loginFromCookies')
    if (!isLoggedIn) {
      redirect({ name: 'auth-login' })
    }
  }
}
