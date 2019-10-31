module.exports = {
    chainWebpack: (config) => {
        config.resolve.symlinks(false);
        ["vue-modules", "vue", "normal-modules", "normal"].forEach((match) => {
            config.module.rule('scss').oneOf(match).use('sass-loader')
                .tap(opt => Object.assign(opt, { data: `@import '~@/sass/main.scss';` }))
        })
    },

    configureWebpack: {
        devtool: 'source-map'
    },

    css: {
        loaderOptions: {
            sass: {
                data: `@import "~@/sass/main.scss"`,
            },
        },
    },

    pluginOptions: {
    }
}
