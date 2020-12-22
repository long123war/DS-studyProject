import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import "./plugins/element.js";
import "./assets/css/global.css";
import "./assets/fonts/iconfont.css";
// 页面加载条css导入
// import "nprogress/nprogress.css";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
