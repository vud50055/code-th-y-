import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from '@/plugins/i18n'
import store from './store'
import GAuth from 'vue-google-oauth2'
import AudioPlayer from '@liripeng/vue-audio-player'

const gauthOption = {
  clientId: process.env.VUE_APP_CLIENT_ID,
  scope: 'profile email',
  prompt: 'consent',
  fetch_basic_profile: true,
  plugin_name: 'chat'
}
Vue.use(AudioPlayer)
Vue.use(GAuth, gauthOption)
Vue.config.productionTip = false
Vue.prototype.$store = store
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
