import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Setting from '../components/Setting.vue'
import Template from '../components/EwingTemplate.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/dashboard'
  }, {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  }, {
    path: '/setting',
    name: 'setting',
    component: Setting
  }]
})
