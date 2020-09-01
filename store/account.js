export const state = () => ({
  account: null,
})

export const mutations = {
  setAccount(state, val) {
    console.log('set account')
    state.account = val
  },
}

export const actions = {}
