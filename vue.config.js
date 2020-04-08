
module.exports = {
//baseUrl: '/',
publicPath:'/dwadmin/', 
  // publicPath:'/static/hm505/dwadmin/', //生产
  assetsDir: 'assets',
  lintOnSave: false,
  devServer: {
    port: 8888, // 端口号
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    disableHostCheck: true,
    // proxy: 'http://localhost:8000' // 配置跨域处理,只有一个代理
    proxy: {
      '/foo': {
        target: '<other_url>'
      },
      '/static': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/static': '/static'
        }
      },
      '/competitors': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/competitors': '/competitors'
        }
      }
    }// 配置多个代理
  }
}
