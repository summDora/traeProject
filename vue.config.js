const path = require("path");

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    watchOptions: {
      poll: 1000,
      ignored: /node_modules/,
    },
    proxy: {
      /* 全战略态势大屏：图表数据接口（后端地址按实际部署调整） */
      "/qzlt-api": {
        target: "http://127.0.0.1:8010",
        changeOrigin: true,
        pathRewrite: { "^/qzlt-api": "" },
      },
      "/pv-storage-api": {
        target: "http://127.0.0.1:8011",
        changeOrigin: true,
        pathRewrite: { "^/pv-storage-api": "" },
      },
      "/green-power-api": {
        target: "http://127.0.0.1:8003",
        changeOrigin: true,
        pathRewrite: { "^/green-power-api": "" },
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@/pages/common", path.resolve(__dirname, "src/hy/demo/common"))
      .set(
        "@/pages/public/checkOpinions/checkOpinions.vue",
        path.resolve(__dirname, "src/hy/demo/common/checkOpinions/checkOpinions.vue")
      )
      .set(
        "@/pages/public/uploadFile.vue",
        path.resolve(__dirname, "src/hy/demo/components/uploadFile/index.vue")
      )
      .set(
        "@/pages/public/viewMaterial.vue",
        path.resolve(__dirname, "src/hy/demo/components/viewMaterial/index.vue")
      )
      .set(
        "@/pages/szh_base/cs_base/csSzhProjectDeclaration/addDialogTemp/addDialogTemp.vue",
        path.resolve(__dirname, "src/hy/demo/csProjectInternalAudit/addDialogTemp/addDialogTemp.vue")
      )
      .set(
        "@/pages/szh_base/cs_base/csSzhProjectDeclaration/batchImportModal/batchImportModal.vue",
        path.resolve(__dirname, "src/hy/demo/csProjectInternalAudit/batchImportModal/batchImportModal.vue")
      )
      .set("@", path.resolve(__dirname, "src"));

    config.plugin("html").tap((args) => {
      args[0].title = "sysbase";
      return args;
    });
  },
};
