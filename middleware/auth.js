export default async function ({ app, store, redirect }) {
  if (!store.state.account.account) {
    let isLoggedIn = await store.dispatch('api/loginFromCookies')
    console.log(isLoggedIn)
    if (!isLoggedIn) {
      redirect({ name: 'auth-login' })
    }
  }
}
