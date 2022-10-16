// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import store from "./store";
import router from "./router";
import moment from "moment";
import t3Ui from "m2-ui"
import i18n from "@/locale";
import config from "@/config/config";
import importDirective from "_g/directive";
import installPlugin from "@/plugin";
import "@/plugin/compositionApi"
import { formatAmount, checkHasBtn } from "@/libs/util.js";
import { startMicoApp } from "./micro"
import "./index.less";
import "_g/assets/fonts/iconfont.css";

import WebStorageCache from "web-storage-cache"
import { hasPermission } from "_o/common/common";
// import { handleExpired } from "@/js/account";
export const webStorageCache = new WebStorageCache()
let isDev = process.env.NODE_ENV === "development"

Vue.use(t3Ui)

// 薪酬管理需要用到这个store
Vue.prototype.store = webStorageCache;
Vue.prototype.hasPermission = hasPermission;
// end

// import directive from "@/directive/directives";
// 实际打包时应该不引入mock,
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

/**
 * @description 注册插件
 */
installPlugin(Vue);
/**
 * @description 注册指令
 */
importDirective(Vue);
/**
 * @description 自定义组件
 */
const customPlugins = {
  install: function(Vue) {
    config.components.forEach(component => {
      Vue.component(component.name, component);
    });
  }
};
Vue.use(customPlugins);

moment.locale("zh-cn");
/**
 * @description 上传图片用url
 */
const baseUrl =
  isDev
    ? config.baseUrl.dev
    : config.baseUrl.pro;
for (const basePath of config.basePathList) {
  Vue.prototype[basePath.name] = baseUrl + basePath.value;
}

const uploadUrl = isDev ? config.uploadUrl.dev : config.uploadUrl.pro;
Vue.prototype._uploadUrl = uploadUrl;


Vue.prototype._log = isDev ? t => console.log(JSON.stringify(t, null, 2)) : () => {}
Vue.prototype.$checkHasBtn = checkHasBtn
/**
 * @description format工具
 */
Vue.prototype.formatAmount = formatAmount;
/**
 * @description 时间格式化工具
 */
Vue.prototype.$moment = moment;
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;
Vue.prototype.busEvents = new Vue();
if(isDev) {
  Vue.prototype._isDev = isDev;
}

window.c = isDev ? console.log.bind(document) : () => {}

startMicoApp()

/* eslint-disable no-new */
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app');
