export const state = () => ({
  isLoading: false,
})

export const mutations = {
  startLoading(state) {
    state.isLoading = true
  },
  stopLoading(state) {
    state.isLoading = false
  },
}
