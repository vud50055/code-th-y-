import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
function lazyLoad(view) {
  return () => import(`../views/${view}.vue`)
}
const routes = [
  {
    path: '/',
    name: 'home',
    component: lazyLoad('HomeView')
  },
  {
    path: '/products/:id',
    name: 'products',
    component: lazyLoad('PageProduct')
  },
  {
    path: '/admin/records/:id',
    name: 'record-detail',
    component: lazyLoad('records/RecordDetail')
  },
  {
    path: '/admin/records',
    name: 'records',
    component: lazyLoad('records/RecordList')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
