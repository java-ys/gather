const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const resolve = dir => {
  return path.join(__dirname, dir);
};

const { appName, appTitle, appPort } = require("./src/config/setting");

// 这里可以自定义port，优先使用在 .env.development 设置的port，其次使用在命令中指定的port（npm run dev --port=8753），最后使用setting中设置的port
const port = process.env.port || process.env.npm_config_port || appPort; // dev port

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  publicPath: "./",
  lintOnSave: false,
  outputDir: appName,
  configureWebpack: {
    // 设置name，以便 index.html 注射正确的文件
    name: appTitle,
    devtool: isDev ? "eval-source-map" : undefined,
    resolve: {
      // 常用的引用文件名别名
      alias: {
        "@": resolve("src"),
        _c: resolve("src/components"), // 非业务组件
        _g: resolve("src/view/general-module"), // 综合模块
        _gc: resolve("src/view/general-module/config"), // 综合设置
        _a: resolve("src/view/general-module/components"), // 业务组件
        _o: resolve("src/view/other-modules"), // 其他模块
      }
    }
  },
  productionSourceMap: false,
  devServer: {
    port,
    host: "0.0.0.0",
    https: false,
    open: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/api": {
        target: "http://192.168.33.183:6231",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  chainWebpack(config) {
    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config.when(!isDev, config => {
      config
        .plugin("ignore")
        .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)); // 忽略/moment/locale下的所有文件
      config.optimization.minimizer([
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log"]
            }
          }
        })
      ]);
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          iViewUI: {
            name: "chunk-iViewUI", // split iview into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?iview(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/view/general-module/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
    });
  }
};
