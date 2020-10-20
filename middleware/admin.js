export default function ({ store, redirect }) {
    if (!store.state.account.account.report_admin) {
      redirect('/')
    }
  }
  