import axios from "axios"
import store from "@/store"
import { deleteCookie, getToken, messageMap, redirectToHome } from "@/libs/util"

import { Message } from "iview"
import config from "@/config/config" // 为引入的配置文件 如果原本就有可忽略
const headersObject = config.headers // 取出headers对象
const { TOKEN_KEY } = config
const notNeedTableLoadList = ["/api/assets/v1/rentSchema/queryNo", "/api/assets/v1/rentSchema/queryAuthCo"]
class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        "Authorization": getToken(),
        "token": getToken(),
        ...headersObject
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      let tableLoading = !~notNeedTableLoadList.indexOf(url)
      // table的loading
      tableLoading && config.data && !config.data._silence && config.data.pageSize && store.commit("changeLoadingFlag", true)

      // get 方法中可以添加Content-Type
      if (config.method === "get") {
        config.data = true
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      // console.log(res, 1)
      this.destroy(url)
      // 区分开
      if (url === "/api/common/v1/questionnaire/pushConfig/uploadUserData") {
        const { data, status } = res
        return { data, status }
      } else {
        res.config && res.config.data && typeof (res.config.data) !== "boolean" && typeof (res.config.data) !== "object" && res.config.data.indexOf("pageSize") > -1 && store.commit("changeLoadingFlag", false)

        if (res && res.data && !res.data.success) {
          if (messageMap[res.data.code]) {
            deleteCookie(TOKEN_KEY)
            redirectToHome()
          }
          if (res.data.msg) {
            Message.error({
              content: res.data.msg,
              duration: 5
            })
          }
          return Promise.reject(res)
        } else {
          const { data, status } = res
          return { data, status }
        }
      }
    }, error => {
      console.log(error, 2)
      let res = error.response
      store.commit("changeLoadingFlag", false)
      this.destroy(url)
      Message.error({
        content: (res && res.data && res.data.msg) || "系统错误，请联系管理员",
        duration: 5
      })
      return Promise.reject(error)
    })
  }
  request(options) {
    const instance = axios.create({})
    // eslint-disable-next-line no-param-reassign
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
