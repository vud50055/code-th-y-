import { HTTP } from '../plugins/http-common'

const recordState = {
  langs: []
}

const getters = {
  getLangs: () => recordState.langs
}

const actions = {
  async uploadRecord({ commit }, params) {
    const res = await HTTP.post('/files', params)
    return res.data
  },
  async getRecords({ commit }) {
    const res = await HTTP.get('/files')
    return res.data
  },
  async deleteRecord({ commit }, params) {
    const res = await HTTP.delete(`/files/${params.id}`)
    return res.data
  },
  async detailRecord({ commit }, params) {
    const res = await HTTP.get(`/files/${params.id}`, { params: { lang: params.lang } })
    return res.data
  },
  async readRecord({ commit }, params) {
    const res = await HTTP.get(`/files/read/${params.id}`)
    return res
  },
  async resultsRecord({ commit }, params) {
    const res = await HTTP.get(`/results/${params.id}`)
    return res.data
  },
  async updateResultsRecord({ commit }, params) {
    const res = await HTTP.patch(`/results/${params.id}`, params.data)
    return res.data
  },
  async getFullLang({ commit }) {
    const res = await HTTP.get('/files/language')
    commit('SET_FULL_LANG', res.data.data)
    return res.data
  }
}

const mutations = {
  SET_MENU(state, menu) {
    state.menu = menu
  },
  SET_FULL_LANG(state, langs) {
    state.langs = langs
  }
}
export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state: recordState
}
