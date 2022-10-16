import { message } from "ant-design-vue";
import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start,
} from "qiankun";
import apps from "./app";
import router from "../router";
import mainAppShared from "./shared"


registerMicroApps(apps, {
  beforeLoad: (app) => {
    console.log("before load", app.name);
    return Promise.resolve();
  },
  afterMount: (app) => {
    console.log("after mount", app.name);
    return Promise.resolve();
  },
});

addGlobalUncaughtErrorHandler((event) => {
  console.warn("#global error handler: ", event);
  const { message: msg } = event;
  if (msg && msg.includes("died in status LOADING_SOURCE_CODE")) {
    sessionStorage.setItem("HOME-RELOAD-ONCE", 1);
    message.error(msg, 3, () => router.replace("/"));
  }
});

const startMicoApp = function (opt) {
  const { application } = mainAppShared.getState()
  const { microMenuRouteList = [], subRouteData = {} } = application // 缓存的各子应用的路由配置
  if (microMenuRouteList.length > 0) {
    console.log("@addMemoRoutes: ", { menuRouteList: microMenuRouteList, subRouteMap: subRouteData });
    // +copy subRouteData fix 原来的子应用path为空的问题
    mainAppShared.addMemoRoutes({ menuRouteList: microMenuRouteList, subRouteMap: JSON.parse(JSON.stringify(subRouteData)) })
  }

  start({
    excludeAssetFilter: (assetUrl) => {
      if (assetUrl.indexOf("/m2-web-general/editor/") > -1) {
        return true
      }
    }
  })
}

export { startMicoApp };
