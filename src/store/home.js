import * as homeMenu from './example/home.json'

const homeState = {
  menu: []
}

const getters = {
  getMenu: () => homeState.menu
}

const actions = {
  async setHomeMenu({ commit }) {
    const res = homeMenu
    if (res.error) return res.error
    commit('SET_MENU', res.data)
  }
}

const mutations = {
  SET_MENU(state, menu) {
    state.menu = menu
  }
}
export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state: homeState
}
