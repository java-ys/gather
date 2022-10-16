/**
 * @description
 * 根据不同的host 去设置不同的请求Ip
 */
import { webApi } from "m2-request-url"
import { npsPreviewUrl } from "@/libs/npsPreviewUrl"
// 引入自定义组件
import VTable from "_a/v-table/v-table"
import SearchList from "_a/search-list/search-list"
import TTable from "_a/m2-table/v-table"

export default {
  /**
   * @description 是否需要登录
   */
  isNeedLogin: false,
  /**
   * @description 三户中心登录名
   */
  userName: "",
  /**
   * @description 三户中心登录密码
   */
  password: "",
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description
   * 是否使用国际化，默认为false1
   * 如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: "xxx"}
   * 用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description
   *  headers 请求头部新增参数
   *  grayVersion： 灰度标识
   *  W_operation_709 //   W代表web,operation代表各个平台标识，灰度文件中有，709代表项目版本号
   */
  headers: {
    grayVersion: "W_operation_709"
  },
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    // dev: "/api", // 代理
    // dev: "http://172.16.19.199:20904", // local环境
    // dev: "http://172.16.1.33:20904", // 开发环境
    // dev: "http://10.3.64.187", // 重庆开发环境
    dev: "https://webapi-b-dev2.m2cn.com.cn", // 华为dev
    // dev: "http://10.3.97.243", // cqtest
    // dev: 'https://webapi-b-test2.m2cn.com.cn', // 华为测试环境
    // dev: "https://webapi-b-pre.m2cn.com.cn", // pre 环境
    // dev: "http://172.16.24.44:20904", // 新集成测试环境
    // dev: "http://172.16.2.209:20904", // 热修复环境
    // dev: "http://172.16.27.129:20904", // kae环境
    // dev: "http://172.16.50.130:20904", // 压测环境
    // dev: "http://47.111.32.53:20904", // UAT环境外网
    // dev: "http://172.16.0.211:20904", // 等保环境
    // dev: "http://10.4.50.81", //  生产环境-华为云
    pro: webApi().baseUrl
  },
  uploadUrl: {
    // dev: 'https://uploadlocal.m2cn.vip:4443', //local
    // dev: "https://uploaddev.m2cn.cn:11443", // dev
    // dev: "https://uploadcqdev.m2cn.cn", // 重庆开发环境
    // dev: "https://upload-dev2.m2cn.cn", // 华为dev
    // dev: "https://uploadcqtest.m2cn.cn", // cqtest
    dev: 'https://upload-test2.m2cn.cn/',// 华为test
    // dev: 'https://uploadhotfix.m2cn.cn', //hotfix
    // dev:'https://upload.m2cn.cn' //prod
    pro: webApi().uploadUrl
  },
  previewUrl: {
    // dev: 'https://uploadlocal.m2cn.vip:4443', //local
    // dev: "https://uploaddev.m2cn.cn:11443", // dev
    // dev: "https://wxpubliccqdev.m2cn.cn", // 重庆开发环境
    dev: "https://uploadcqtest.m2cn.cn", // cqtest
    // dev: 'https://uploadhotfix.m2cn.cn', //hotfix
    // dev:'https://upload.m2cn.cn' //prod
    pro: npsPreviewUrl().url
  },
  mediaUrl: {
    // dev: "http://10.3.68.25:8008", // 重庆开发环境
    dev: "http://10.3.96.26:8008", // 重庆测试环境
    // dev: "http://172.16.60.177:8008", // 重庆压测环境
    // dev: "http://172.16.112.64:8008", // 热修复环境
    // dev: "http://10.0.12.32:8008", // 生产环境
    pro: webApi().mediaUrl
  },
  /**
   * @description  配置请求根路径
   */
  basePathList: [
    {
      name: "_baseUrl4Manager",
      value: "/m2-manager-web"
    },
    {
      name: "_baseUrl",
      value: "/m2-admin"
    },
    {
      name: "_baseUrl4Company",
      value: "/org-manager-boss"
    },
    {
      name: "_baseUrl4Exam",
      value: "/exam-web-api"
    },
    {
      name: "_baseUrl4Finance",
      value: "/finance-web-api"
    },
    {
      name: "_baseUrl4Supplier",
      value: "/supplier-web-api"
    },
    {
      name: "_baseUrlCommon",
      value: ""
    },
    {
      name: "_baseUrl4School",
      value: "/pickride-business-web-api"
    },
    {
      name: "_baseUrl4CommonWeb",
      value: "/common-web-api"
    },
    {
      name: "_baseUrl4Driver",
      value: "/vigen-web-api"
    },
    {
      name: "_baseUrl4Crm",
      value: "/crm-web-api"
    },
    {
      name: "_base4Driver",
      value: "/m2-driver-resume-web"
    },
    {
      name: "_base4Mall",
      value: "/mall-web-api"
    },
    {
      name: "_base4Task",
      value: "/task-manage-api"
    },
    {
      name: "_baseResourceRecruit",
      value: "/resource-recruit-web-api"
    },
    {
      name: "_base4Asset",
      value: "/asset-supplier-api"
    },
    {
      name: "_workOrder",
      value: "/partner-workorder-web"
    },
    {
      name: "_Asset",
      value: "/asset-api"
    },
    {
      name: "_routeAdmin",
      value: "/route-admin-api"
    },
    {
      name: "_routeAdmin",
      value: "/route-admin-api"
    },
    {
      name:"_basePrediction",
      value:"/operations-research-prediction"
    },
  ],
  version: {
    dev: "v0.9.24",
    pro: "v0.9.24"
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: "home",
  /**
   * @description 工作台首页
   */
  dashboardUrl: "/m2-web-dashboard/",
  /**
   * @description 需要加载的插件
   */
  plugin: {
    "error-store": {
      showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    },
    amap: {},
    iview: {},
    "element-ui": {},
    "ant-design-vue": {}
  },
  /**
   * @description 需要加载的组件
   */
  components: [VTable, SearchList, TTable],
  /**
   * @description 导航标签、菜单、按钮、用户名存储key名
   */
  tagStorageKey: "navList-general",
  menuStorageKey: "menuList-general",
  microMenuRouteStorageKey: "menuRouteList-micro",
  microSubRouteStorageKey: "subRouteMap-micro",
  btnStorageKey: "btnList-general",
  usernameStorageKey: "username-operation-dash",
  TOKEN_KEY: "new_operation_token",
  limitMenuDataStorageKey: "limitMenuData",
}
