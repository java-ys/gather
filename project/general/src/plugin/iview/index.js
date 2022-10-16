import iView from "iview";
import iviewArea from "iview-area";
import i18n from "@/locale";

export default {
  install(Vue) {
    Vue.use(iView, { i18n: (key, value) => i18n.t(key, value) });
    Vue.use(iviewArea);
  }
};
