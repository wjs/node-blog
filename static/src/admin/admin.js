import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Login from './component/Login.vue'
import InitSite from './component/InitSite.vue'
import Admin from './component/Admin.vue'
import DashBoard from './component/DashBoard'
import Post from './component/Post'
import Setting from './component/Setting'

Vue.use(VueResource)
Vue.use(VueRouter)

const router = new VueRouter({
  base: '/admin',
  mode: 'history',
  routes: [{
    path: '/login',
    component: Login,
  }, {
    path: '/init',
    component: InitSite,
  }, {
    path: '/',
    component: Admin,
    children: [
      { path: '/add-post', name: 'add-post', component: Post },
      { path: '/edit-post/:id', name: 'edit-post', component: Post },
      { path: '/setting', name: 'setting', component: Setting },
      { path: '', name: 'dashboard', component: DashBoard }
    ]
  }]
})

new Vue({
  router
}).$mount('#root')
