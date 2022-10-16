import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";
import store from "@/store";
import iView from "iview";
import { getToken, fetchNecessaryData, pushToAnotherModule, isCustomer } from "@/libs/util";
import config from "@/config/config";
import { trackRoute, adaptMicroAppGuards } from "@/micro/appUtils"

const LOGIN_PAGE_NAME = "login";
const CHANGE_PAGE_NAME = "change-pwd";
const FORGET_PAGE_NAME = "forget-pwd";

Vue.use(Router);
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location)
};
Router.prototype.pushToAnotherModule = (...args) => {
  return pushToAnotherModule.apply(this, args)
}
const router = new Router({
  routes
  // mode: 'history'
});

const isDev = process.env.NODE_ENV === "development";

if (isDev) {

  const { homeName } = config;

  router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    const token = getToken();
	  window.sensors && window.sensors.registerPage({is_login: Boolean(token)})
    if (isCustomer()) {
      next();
      return
    }
    if (!token) {
      // 没token忘记密码/修改密码和登录页随便进
      if (
        to.name === FORGET_PAGE_NAME ||
        to.name === LOGIN_PAGE_NAME ||
        to.name === CHANGE_PAGE_NAME
      ) {
        next();
        return;
      }
      next({ name: LOGIN_PAGE_NAME });
      return;
    }
    // 有token不用登录直接去首页
    if (to.name === LOGIN_PAGE_NAME) {
      next({ name: homeName });
      return;
    }

    adaptMicroAppGuards(to, from, next)
    fetchNecessaryData()
  });
} else {
  router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    if (isCustomer()) {
      next();
      return
    }
    const token = getToken()

    if (!token) {
      window.location.href = config.dashboardUrl
      return
    }

    adaptMicroAppGuards(to, from, next, trackRoute)
    fetchNecessaryData()
  })
}

router.afterEach(() => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
