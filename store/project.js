const getDefaultState = () => {
  return {
    projectStatusChoices: [],
    updateStatusChoices: [],
  }
}

export const state = () => getDefaultState()

export const mutations = {
  setProjectStatusChoices(state, val) {
    state.projectStatusChoices = val
  },
  setUpdateStatusChoices(state, val) {
    state.updateStatusChoices = val
  },
  reset(state) {
    Object.assign(state, getDefaultState())
  },
}

export const actions = {
  async getProjectStatusChoices(context) {
    let choices = await context.dispatch('api/get', '/projects/choices/', {
      root: true,
    })
    context.commit('setProjectStatusChoices', choices)
  },
  async getUpdateStatusChoices(context) {
    let choices = await context.dispatch(
      'api/get',
      '/projects/updates/choices/',
      { root: true }
    )
    context.commit('setUpdateStatusChoices', choices)
  },
}
