import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import axios from 'axios'
import home from '../components/home.vue'

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
  },
  {
    path: '/home',
    name: 'home',
    component: home
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if(to.path === "/login"){
    return next();
  }
  if(window.sessionStorage.getItem("token")){
    return next();
  }else{
    return next("/login");
  }
})
export default router
