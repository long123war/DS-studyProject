module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    //   配置生产环境
    config.when(process.env.NODE_ENV === "production", config => {
      config
        .entry("app")
        .clear()
        .add("./src/main-prod.js");

      config.set("externals", {
        vue: "Vue",
        "vue-router": "VueRouter",
        axios: "axios",
        lodash: "_",
        echarts: "echarts",
        nprogress: "NProgress",
        "vue-quill-editor": "VueQuillEditor"
      });
    });
    // 配置开发环境
    config.when(process.env.NODE_ENV === "development", config => {
      config
        .entry("app")
        .clear()
        .add("./src/main-dev.js");
    });
  }
  //   configureWebpack: config => {
  //     if (process.env.NODE_ENV === "production") {
  //       // 为生产环境修改配置...
  //       config
  //         .entry("app")
  //         .clear()
  //         .add("./src/main-prod.js");
  //     } else {
  //       // 为开发环境修改配置...
  //       config
  //         .entry("app")
  //         .clear()
  //         .add("./src/main-dev.js");
  //     }
  //   }
};
