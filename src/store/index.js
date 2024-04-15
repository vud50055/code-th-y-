import Vuex from 'vuex'
import Vue from 'vue'

import home from './home'
import product from './product'
import user from './user'
import records from './records'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    home,
    product,
    user,
    records
  },
  strict: debug
})
export default store
