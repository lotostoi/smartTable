module.exports = {
    chainWebpack: config => {
      config.module
        .rule('graphql')
        .test(/\.mov$/)
        .use('file-loader')
          .loader('file-loader')
          .end()

    },  configureWebpack: (config) => {
      return {
        devServer: {
          proxy: {
            '/rout': {
              target: 'http://0.0.0.0:3000',
              secure: false,
              changeOrigin: true,
            },
          },
        },
      }
    },
  }