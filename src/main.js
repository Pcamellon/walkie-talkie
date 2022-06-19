import Vue from 'vue'
import App from './App.vue'
import { firestorePlugin } from 'vuefire'
import VueRouter from 'vue-router'

import VueCompositionApi from '@vue/composition-api'

Vue.use(VueCompositionApi)
Vue.use(VueRouter)
Vue.use(firestorePlugin)

// Dates formatter
Vue.use(require('vue-moment'));

Vue.config.productionTip = false

import Home from './components/Home'
import ChatRoom from './components/ChatRoom'
import vuetify from './plugins/vuetify'

const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/chats/:id', component: ChatRoom, name: 'chat' }
  ]
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
