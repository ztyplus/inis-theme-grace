const { defineConfig } = require('@vue/cli-service')
// element-plus按需自动导入
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  indexPath: 'index.html',
  assetsDir: 'static',
  lintOnSave: false,
  runtimeCompiler: true,
  productionSourceMap: false,

  devServer: {
    host: "0.0.0.0",
    port: 8080,
    historyApiFallback: true,
    client: {
      webSocketURL: 'ws://0.0.0.0:8080/ws',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },

    // proxy: {
    //   '/ks': {
    //       // target: SLYT.api + '/',//后端接口地址
    //       target: 'http://119.91.207.234:5012/',//后端接口地址
    //       changeOrigin: true,//是否允许跨越
    //       pathRewrite: {
    //           '^/ks': '/'//重写,
    //       }
    //   }
    // }
  },
  configureWebpack: {
    plugins: [
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
  },
})
