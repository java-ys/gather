import config from "@/config/config"
import extend from "./extend"
const { plugin } = config

export default (Vue) => {
  for (let name in plugin) {
    if (plugin.hasOwnProperty(name)) {
      const value = plugin[name]
      Vue.use(require(`./${name}`).default, typeof value === "object" ? value : undefined)
    }
  }
  extend(Vue)
}
