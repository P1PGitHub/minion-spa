const getDefaultState = () => {
  return {
    account: null,
  }
}

export const state = getDefaultState()

export const mutations = {
  setAccount(state, val) {
    state.account = val
  },
  reset(state) {
    Object.assign(state, getDefaultState())
  },
}

export const actions = {
  logout(context) {
    context.commit('reset')
    context.commit('api/reset', {}, { root: true })
    context.commit('team/reset', {}, { root: true })
  },
}
