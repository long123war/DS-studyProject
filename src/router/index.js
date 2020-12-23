import Vue from "vue";
import VueRouter from "vue-router";
// import login from "../components/login.vue";
// import home from "../components/home.vue";
// import welcome from "../components/welcome.vue";
const login = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ "../components/login.vue"
  );
const home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ "../components/home.vue");
const welcome = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ "../components/welcome.vue"
  );
import axios from "axios";

// import users from "../components/user/users.vue";
const users = () =>
  import(/* webpackChunkName: "users" */ "../components/user/users.vue");
// import rights from "../components/power/rights.vue";
// import roles from "../components/power/roles.vue";
const rights = () =>
  import(
    /* webpackChunkName: "rights_roles" */ "../components/power/rights.vue"
  );
const roles = () =>
  import(
    /* webpackChunkName: "rights_roles" */ "../components/power/roles.vue"
  );
// import categories from "../components/goods/Cate.vue";
// import params from "../components/goods/params.vue";
const categories = () =>
  import(
    /* webpackChunkName: "categories_params" */ "../components/goods/Cate.vue"
  );
const params = () =>
  import(
    /* webpackChunkName: "categories_params" */ "../components/goods/params.vue"
  );
import ZkTable from "vue-table-with-tree-grid";
// 页面加载条导入
import NProgress from "nprogress";

Vue.use(ZkTable);
Vue.use(VueRouter);
Vue.prototype.$http = axios;
//配置請求的默认路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
axios.interceptors.request.use(
  config => {
    // 发送请求时为请求头添加token
    config.headers.Authorization = window.sessionStorage.getItem("token");
    NProgress.start();
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  config => {
    // 请求响应时关闭加载条
    NProgress.done();
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

const routes = [
  {
    path: "/",
    redirect: "login"
  },
  {
    path: "/login",
    name: "login",
    component: login
  },
  {
    path: "/home",
    name: "home",
    component: home,
    redirect: "/welcome",
    children: [
      { path: "/welcome", name: "welcome", component: welcome },
      { path: "/users", name: "users", component: users },
      { path: "/rights", name: "rights", component: rights },
      { path: "/roles", name: "roles", component: roles },
      { path: "/categories", name: "categories", component: categories },
      { path: "/params", name: "params", component: params }
    ]
  }
];

const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if (to.path === "/login") {
    return next();
  }
  if (window.sessionStorage.getItem("token")) {
    return next();
  } else {
    return next("/login");
  }
});
export default router;
