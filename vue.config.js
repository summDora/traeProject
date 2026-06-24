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
