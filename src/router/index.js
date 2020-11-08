import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import axios from 'axios'

Vue.use(VueRouter)
Vue.prototype.$http = axios
//配置請求的默认路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  }
]

const router = new VueRouter({
  routes
})

export default router
