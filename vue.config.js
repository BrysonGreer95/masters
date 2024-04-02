const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
    transpileDependencies: true,
      css: {
        loaderOptions: {
        scss: {
          additionalData: `@import "~@/variables.scss";`
        },
        // pass Less.js Options to less-loader
        less:{
          globalVars: {
            primary: '#174038'
          }
        }
      }
    }
    })