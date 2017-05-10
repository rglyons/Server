import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import router from './router'

import 'vuetify/dist/vuetify.min.css'
import './style/material_icon.css'
import 'reset-css/reset.css'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(Vuetify)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
