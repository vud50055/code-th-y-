import { HTTP } from '../plugins/http-common'

const userState = {
  userInfo: null
}

const getters = {
  getUser: () => userState.userInfo
}

const actions = {
  async setUser({ commit }, params) {
    try {
      const res = await HTTP.post('/auth/login-google', params)
      commit('SET_USER', res.data.data)
      localStorage.setItem('accesstoken', res.data.data.access_token)
      localStorage.setItem('refresh', res.data.data.refresh_token)
      localStorage.setItem('try', 0)
      return res.data.data
    } catch (e) {
      console.log(e)
    }
  }
}

const mutations = {
  SET_USER(state, userInfo) {
    state.userInfo = userInfo
  }
}
export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state: userState
}
