const { defineConfig } = require('@vue/cli-service')
// element-plus按需自动导入
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  indexPath: 'index.html',
  assetsDir: 'static',
  lintOnSave: false,
  runtimeCompiler: true,
  productionSourceMap: false,

  chainWebpack: config => {
    // 修复热更新失效
    config.resolve.symlinks(true) 
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin('html').tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = 'none'
      return args
    })
    // SVG配置 npm i svg-sprite-loader svgo-loader -D
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/svg'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },

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
    //       target: 'http://',//后端接口地址
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
