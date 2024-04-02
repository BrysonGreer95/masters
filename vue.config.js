const { defineConfig } = require("@vue/cli-service");

defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      css: {
        // options here will be passed to css-loader
      },
      postcss: {
        // options here will be passed to postcss-loader
      },
    },
  },
});
