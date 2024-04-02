const { defineConfig } = require('@vue/cli-service');
const path = require('path');

export default defineConfig({
    transpileDependencies: true,
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `
              @import "./src/styles/_animations.scss";
              @import "./src/styles/_variables.scss";
              @import "./src/styles/_mixins.scss";
              @import "./src/styles/_helpers.scss";
            `
          }
        }
      }
    })