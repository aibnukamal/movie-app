import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueAxios from 'vue-axios'
import axios from 'axios'
Vue.use(VueAxios, axios)
import store from './store'

import App from './App.vue'
import List from './components/List.vue'
import Detail from './components/Detail.vue'

const routes = [
  {
    name: 'List',
    path: '/',
    component: List
  },
  {
    name: 'Detail',
    path: '/:id-:slug',
    component: Detail
  }
];

const router = new VueRouter({ mode: 'history', routes: routes })
new Vue(Vue.util.extend({ router, store }, App)).$mount('#app')
