import axios from 'axios'
import { Message } from "iview"
import config from "@/config/config" // 为引入的配置文件 如果原本就有可忽略
import { queryToObj } from "@/libs/util"

const isDev = process.env.NODE_ENV === "development";
const baseUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro

const headersObject = config.headers // 取出headers对象


const getInsideConfig = (options) => {
  const prefixed = queryToObj()
  // if (prefixed['client'] === '__customer') return

  const config = {
    baseURL: `${baseUrl}/m2-cc-web-api`,
    headers: {
      "Authorization": prefixed.token,
      "token": prefixed.token,
      ...headersObject,
    },
    ...options, // url
  }
  return config
}

const $instance = axios.create()

$instance.interceptors.request.use(
  async config => {
    return config
  },
  async error => {
    return Promise.reject(error)
  }
)

$instance.interceptors.response.use(
  async res => {
    if (res && res.data && !res.data.success) {
      if (res.data.msg) {
        Message.error({ content: res.data.msg, duration: 5 })
      }
      return Promise.reject(res)
    } else {
      const { data, status } = res
      return { data, status }
    }
  },
  async error => {
    let res = error.response
    Message.error({
      content: (res && res.data && res.data.msg) || "系统错误，请联系管理员!",
      duration: 5
    })
    return Promise.reject(error)
  }
)


export default {
  request: (options) => {
    const { url } = options
    const config = getInsideConfig(options)
    return $instance(url, config)
  }
}
