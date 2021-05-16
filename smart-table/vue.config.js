module.exports = {
    chainWebpack: config => {
      config.module
        .rule('graphql')
        .test(/\.mov$/)
        .use('file-loader')
          .loader('file-loader')
          .end()

    }
  }