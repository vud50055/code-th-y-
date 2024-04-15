import * as products from './example/product.json'

const productState = {}

const getters = {}

const actions = {
  async getProductInfo({ state }, params) {
    const listProducts = products.data
    const res = listProducts.find((e) => params == e.id)
    if (res.error) return res.error
    return res
  }
}

const mutations = {}
export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state: productState
}
