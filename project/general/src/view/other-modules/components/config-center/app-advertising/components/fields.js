import { mapToList } from "@/libs/util.js"
// 版本号
export const appVersionMap = {
  1: "全部版本",
  2: "按版本选择",
  3: "版本之前",
  4: "版本之后"
}
export const appVersionList = mapToList(appVersionMap)
// 弹出频率
export const frequencyMap = {
  1: "每天",
  2: "每周",
  3: "每月",
  4: "无限制"
}
// 商品类型
export const goodTypeList = [
  {
    label: "优惠券",
    value: 1
  },
  {
    label: "礼品卡",
    value: 2
  },
  {
    label: "实物",
    value: 3
  },
  {
    label: "兑换码",
    value: 4
  },
]// 商品类型
export const goodTypeMap = {
  1: "优惠券",
  2: "礼品卡",
  3: "实物",
  4: "兑换码"
}
export const frequencyList = mapToList(frequencyMap)
// 使用common-inner组件所有的变量库
const commonAddData = {
  userTypeLogin: {
    userType: 0
  },
  userTypeCoupon: {
    userType: ""
  },
  isEffectTime: {
    effectTime: []
  },
  isLimitTime: {
    effectPeriodType: 1,
    adEffectTimeList: []
  },
  isbusinessType: {
    businessLine: 1,
    productLineArray: []
  }, // 产品线
  isCity: {
    cityArray: []
  }, // 针对城市
  isAppVersion: {
    appVersionType: null,
    appVersionArray: ""
  }, // app版本
  isUserGroup: {
    userGroupType: 1,
    userGroupArray: [],
    newUserGroupType: 1
  }, // 用户群
  isImageUrl: {
    imageUrl: ""
  }, // 广告图
  isLink: {
    adUrl: ""
  }, // 跳转链接
  isRate: {
    frequencyType: 4,
    frequencyVal: null
  }, // 弹出频率
  isLogo: {
    logoFlag: 1
  }, // 底部是否展示T3LOGO
  isShowTime: {
    showTime: null
  }, // 展示时长
  isH5Url: {
    h5Url: null
  }, // 展示H5链接
  isTitle: {
    title: null
  }, // 展示标题文案
  isMoreUrl: {
    moreUrl: null
  }, // 展示更多链接
  isProductTypeArray: {
    productTypeArray: []
  }, // 展示商品类型
  isProductSelectType: {
    productSelectType: null
  }, // 展示选品方式
  isShopMaxNum: {
    shopMaxNum: null
  }, // 展示最大商品数量
  isUnitId: {
    unitId: ""
  }, // 广告编码
  isOpenScreenType: {
    openScreenType: null
  }, // 广告编码
  isPopupAdType: {
    popupAdType: null
  }, // 弹窗类型：
  isLinkReward: {
    grantRewardReqList: []
  } // 关联奖励
}
// 根据使用common组件的配置，组装该功能所需变量
const getCommonData = (settingObj) => {
  let res = {}
  for (let key in settingObj) {
    if (Object.prototype.hasOwnProperty.call(settingObj, key) && settingObj[key]) {
      res = { ...res, ...commonAddData[key] }
    }
  }
  return res
}
// 开屏类型
export const screenSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isCity: true, // 针对城市
  isAppVersion: true, // app版本
  isUserGroup: true, // 用户群
  isLogo: true, // 底部是否展示T3LOGO
  isImageUrl: true, // 广告图
  imageLabel: "背景图：",
  isLink: true, // 跳转链接
  isShowTime: true, // 展示时长
  isOpenScreenType: true, // 开屏广告类型
}
// 弹窗类型
export const popupSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isbusinessType: true, // 产品线
  isCity: true, // 针对城市
  isAppVersion: true, // app版本
  isUserGroup: true, // 用户群
  isImageUrl: true, // 广告图
  isPopupAdType: true, // 弹窗类型：
  isLink: true, // 跳转链接
  isRate: true // 弹出频率
}
// 优惠券  用户类型缺少
export const couponSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isbusinessType: false, // 产品线
  isCity: true, // 针对城市
  isAppVersion: true, // app版本
  isUserGroup: false, // 用户群
  isUserType: true,
  userTypeLabel: "用户类型：",
  userTypeCoupon: true,
  isImageUrl: true, // 广告图
  imageLabel: "背景图",
  // isPopupAdType: true, // 弹窗类型：
  isLink: false, // 跳转链接
  isRate: true // 弹出频率
}
// 登录引导  用户类型缺少
export const loginGuardSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isbusinessType: false, // 产品线
  isCity: true, // 针对城市
  isAppVersion: true, // app版本
  isUserGroup: false, // 用户群
  isUserType: true, // 用户类型
  userTypeLabel: "用户类型：",
  userTypeLogin: true,
  isImageUrl: true, // 广告图
  imageLabel: "背景图",
  // isPopupAdType: true, // 弹窗类型：
  isLink: true, // 跳转链接
  isRate: false// 弹出频率
}
// 行程结束领券弹窗
export const tripEndCouponPopupSetting = {
  ...popupSetting,
  isAppVersion: false,
  isLink: false,
  isPopupAdType: false,
  isLinkReward: true // 关联奖励
}
// 行程结束任务
export const tripEndTaskPopupSetting = {
  ...popupSetting,
  isAppVersion: false,
  isLink: false,
  isPopupAdType: false
}
// 行程结束行程分享活动
export const tripEndTripSharePopupSetting = {
  ...popupSetting,
  isAppVersion: false,
  isImageUrl: false,
  isLink: false,
  isPopupAdType: false
}
// 行程结束广告提醒
export const tripEndAdsPopupSetting = {
  ...popupSetting,
  isAppVersion: false,
  isPopupAdType: false
}
// 小程序弹窗类型
export const minipopupSetting = {
  ...popupSetting,
  isAppVersion: false, // 小程序 不要 app版本
}
// 小程序弹窗优惠券
export const minicouponSetting = {
  ...couponSetting,
  isAppVersion: false, // 小程序 不要 app版本
}
// 小程序弹窗登录引导
export const miniloginGuardSetting = {
  ...loginGuardSetting,
  isAppVersion: false, // 小程序 不要 app版本
}
// 会员类型
export const vipSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isbusinessType: true, // 产品线
  isCity: true, // 针对城市
  isAppVersion: true, // app版本
  isUserGroup: true// 用户群
}
// 任务类型
export const taskSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isbusinessType: true, // 产品线
  isCity: true, // 针对城市
  isAppVersion: true, // app版本
  isUserGroup: true, // 用户群
}
// 商城类型
export const shopSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isbusinessType: true, // 产品线
  isCity: true, // 针对城市
  isAppVersion: true, // app版本
  isUserGroup: true, // 用户群
  isTitle: true, // 标题文案
  isMoreUrl: true, // 更多链接
  isProductTypeArray: true, // 商品类型
  isProductSelectType: true, // 选品方式
  isShopMaxNum: true, // 最大商品数量
}
// 自定义h5类型
export const h5Setting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isbusinessType: true, // 产品线
  isCity: true, // 针对城市
  isAppVersion: true, // app版本
  isUserGroup: true, // 用户群
  isH5Url: true // H5链接
}
// 轮播的新增
export const cascaderAddSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isAppVersion: true, // app版本
  isUserGroup: true, // 用户群
  isImageUrl: true, // 广告图
  isLink: true// 跳转链接
}
// 小程序首页banner-轮播的新增
export const appletCascaderAddSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isUserGroup: true, // 用户群
  isImageUrl: true, // 广告图
  isLink: true// 跳转链接
}

// 小程序流量主-小程序流量主
export const miniMainFlowSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isbusinessType: true, // 产品线
  isCity: true, // 针对城市
  isUserGroup: true, // 用户群
  isUnitId: true  // 广告编码
}

// 小程序 登录页-背景图
export const miniLoginBackgroundSetting = {
  isEffectTime: true, // 有效时间
  isCity: true, // 针对城市
  isImageUrl: true, // 广告图
  imageLabel: "广告图：", // 背景图
}

// 我的发票banner-轮播的新增
export const invoiceCascaderAddSetting = {
  ...appletCascaderAddSetting
}
// 我的发票banner-新增主页
export const invoiceCascaderSetting = {
  isCity: true,
  isEffectTime: true,
}
// 司机App服务页banner-轮播的新增
export const driverAppBannerCascaderAddSetting = {
  isbusinessType: false, // 产品线
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isUserGroup: true, // 用户群
  isImageUrl: true, // 广告图
  isLink: true,// 跳转链接
  isCity: true, // 针对城市
}
// 我的优惠券banner-轮播的新增
export const myCouponAddSetting = {
  ...appletCascaderAddSetting
}
// 我的优惠券banner-新增主页
export const myCouponSetting = {
  isCity: true,
  isEffectTime: true,
}
// 轮播主页默认配置项-
export const cascaderSetting = {
  isbusinessType: true,
  isCity: true,
  isEffectTime: true,
}
// 领券中心更多福利轮播的新增
export const couponHomeAddSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isUserGroup: true, // 用户群
  isImageUrl: true, // 广告图
  isLink: true// 跳转链接
}
// 领券中心更多福利-新增主页
export const couponHomeCascaderSetting = {
  isCity: true,
  isEffectTime: true,
}
// 行程结束页-轮播的新增
export const endTripAddSetting = {
  isEffectTime: true, // 有效时间
  isLimitTime: true, // 限制时段
  isUserGroup: true, // 用户群
  isImageUrl: true, // 广告图
  isLink: true, // 跳转链接
  isAdName: true // 广告展示
}


// 出租车app首页配图banner-轮播的新增
export const taxiappletCascaderAddSetting = {
  isCity: true,
  isAppVersion: true, // app版本
  isEffectTime: true,
  isbusinessType: true,

}
// 开屏
export const screenAddData = getCommonData(screenSetting)
// 弹窗类型
export const popupAddData = getCommonData(popupSetting)
// 优惠券
export const couponAddData = getCommonData(couponSetting)
// 登录引导
export const loginGuardAddData = getCommonData(loginGuardSetting)
// 会员
export const vipAddData = getCommonData(vipSetting)
// 任务
export const taskAddData = getCommonData(taskSetting)
// 商城
export const shopAddData = getCommonData(shopSetting)
// 自定义h5
export const h5AddData = getCommonData(h5Setting)
// 轮播的新增
export const cascaderInnerAddData = getCommonData(cascaderAddSetting)
// 小程序首页banner-轮播的新增
export const appletCascaderInnerAddData = getCommonData(appletCascaderAddSetting)
// 我的发票banner-轮播的新增
export const invoiceCascaderInnerAddData = getCommonData(invoiceCascaderAddSetting)
// 我的优惠券banner-轮播的新增
export const myCouponInnerAddData = getCommonData(myCouponAddSetting)
// 领券中心-轮播的新增
export const couponHomeCascaderInnerAddData = getCommonData(couponHomeAddSetting)
// 行程结束页-轮播的新增
export const endTripInnerAddData = getCommonData(endTripAddSetting)
// 行程结束领券弹窗
export const tripEndCouponPopupAddData = getCommonData(tripEndCouponPopupSetting)
// 行程结束任务
export const tripEndTaskPopupAddData = getCommonData(tripEndTaskPopupSetting)
// 行程结束行程分享活动
export const tripEndTripSharePopupAddData = getCommonData(tripEndTripSharePopupSetting)
// 行程结束广告提醒
export const tripEndAdsPopupAddData = getCommonData(tripEndAdsPopupSetting)
// 小程序弹窗
export const minipopupAddData = getCommonData(minipopupSetting)
// 小程序优惠券
export const minicouponAddData = getCommonData(minicouponSetting)
// 小程序登录引导
export const miniloginGuardAddData = getCommonData(miniloginGuardSetting)
// 小程序登陆页 背景图
export const miniLoginBackgroundAddData = getCommonData(miniLoginBackgroundSetting)

// 轮播-默认
export const cascaderAddData = {
  carouselList: [],
  ...getCommonData(cascaderSetting)
}
// 轮播-发票
export const nvoiceCascaderAddData = {
  carouselList: [],
  ...getCommonData(invoiceCascaderSetting)
}
// 轮播-我的优惠券
export const myCouponAddData = {
  carouselList: [],
  ...getCommonData(myCouponSetting)
}
// 轮播-领券
export const couponHomeCascaderAddData = {
  carouselList: [],
  ...getCommonData(couponHomeCascaderSetting)
}
// 轮播-出租车app首页配图banner-轮播
export const taxiCascaderAddData = {
  carouselList: [],
  ...getCommonData(taxiappletCascaderAddSetting)
}

// 新增参数（公共部分）
export const detaultAddData = {
  position: null,
  type: null,
  name: "",
  priority: null,
}
// 根据图片type判断限制图片大小
const imgSizeValid = (file) => {
  let isSuccess = false
  let msg = ""
  if (file.type === "image/gif") {
    isSuccess = (file.size / 1024) > 2048 ? false : true
    msg = `请上传大小在2M 以内的gif图片`
  } else {
    isSuccess = (file.size / 1024) > 500 ? false : true
    msg = `请上传大小在500KB 以内的图片`
  }
  return { isSuccess, msg }
}
// 新增下半部分参数
// key值为String（位置枚举值）+String（广告类型枚举值）
/**
 * data: 除detaultAddData外其他新增所需变量
 * addData： 如果为轮播类型，轮播内部添加所需变量
 * setting：除通用配置外，还需哪些配置项
 * imgInfo：有图片上传的话，图片限制部分
 */
export const otherAddDataMap = {
  "11": { // 开屏-开屏
    data: screenAddData,
    setting: screenSetting,
    imgInfo: {
      width: 1125,
      height: 2436,
      logoWidth: 1125,
      logoHeight: 2064,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：jpg/png最大500KB，gif最大2M",
      mixValid: imgSizeValid
    }
  },
  "29": {  // 弹窗-优惠券
    data: couponAddData,
    setting: couponSetting,
    imgInfo: {
      width: 840,
      height: 1120,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：JPG\PNG最大500k，GIF最大2M",
      mixValid: imgSizeValid
    }
  },
  "22": { // 弹窗-弹窗
    data: popupAddData,
    setting: popupSetting,
    imgInfo: {
      width: 840,
      height: 1120,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：JPG\PNG最大500k，GIF最大2M",
      mixValid: imgSizeValid
    }
  },
  "210": { // 弹窗-登录引导
    data: loginGuardAddData,
    setting: loginGuardSetting,
    imgInfo: {
      width: 840,
      height: 1120,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：JPG\PNG最大500k，GIF最大2M",
      mixValid: imgSizeValid
    }
  },
  "43": { // 首页负屏幕-会员
    data: vipAddData,
    setting: vipSetting
  },
  "44": { // 首页负屏幕-轮播
    data: cascaderAddData,
    setting: cascaderAddSetting,
    addData: cascaderInnerAddData,
    imgInfo: {
      width: 1065,
      height: 426,
      format: ["jpg", "png"],
      maxSize: 500
    }
  },
  "45": { // 首页负屏幕-任务
    data: taskAddData,
    setting: taskSetting
  },
  "46": { // 首页负屏幕-商城
    data: shopAddData,
    setting: shopSetting
  },
  "47": { // 首页负屏幕-h5
    data: h5AddData,
    setting: h5Setting
  },
  "34": { // 首页顶栏-轮播（额外增加刘海屏广告）
    data: cascaderAddData,
    addData: {
      ...cascaderInnerAddData,
      imageBangUrl: ""
    },
    setting: {
      ...cascaderAddSetting,
      isBangImage: true
    },
    imgInfo: {
      width: 1125,
      height: 192,
      format: ["jpg", "png"],
      maxSize: 500,
      bangInfo: { // 刘海屏广告图配置
        width: 1125,
        height: 264,
        format: ["jpg", "png"],
        maxSize: 500,
      }
    }
  },
  "54": { // 小程序banner-轮播
    data: cascaderAddData,
    setting: appletCascaderAddSetting,
    addData: appletCascaderInnerAddData,
    imgInfo: {
      width: 1053,
      height: 216,
      format: ["jpg", "png"],
      maxSize: 500
    }
  },
  "64": {  // 发票banner-轮播
    data: nvoiceCascaderAddData,
    dataSetting: invoiceCascaderSetting,
    setting: invoiceCascaderAddSetting,
    addData: invoiceCascaderInnerAddData,
    imgInfo: {
      width: 1029,
      height: 264,
      format: ["jpg", "png"],
      maxSize: 500
    }
  },
  "74": {  // 领券中心-轮播
    data: couponHomeCascaderAddData,
    dataSetting: couponHomeCascaderSetting,
    setting: couponHomeAddSetting,
    addData: couponHomeCascaderInnerAddData,
    imgInfo: {
      width: 327,
      height: 327,
      format: ["jpg", "png"],
      maxSize: 500
    }
  },
  "84": {  // 行程结束页-轮播
    data: cascaderAddData,
    setting: endTripAddSetting,
    addData: endTripInnerAddData,
    imgInfo: {
      width: 120,
      height: 120,
      format: ["jpg", "png"],
      maxSize: 500
    }
  },
  "92": { // 小程序弹窗-弹窗
    data: minipopupAddData,
    setting: minipopupSetting,
    imgInfo: {
      width: 840,
      height: 1120,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：JPG\PNG最大500k，GIF最大2M",
      mixValid: imgSizeValid
    }
  },
  "99": { // 小程序弹窗-优惠券
    data: minicouponAddData,
    setting: minicouponSetting,
    imgInfo: {
      width: 840,
      height: 1120,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：JPG\PNG最大500k，GIF最大2M",
      mixValid: imgSizeValid
    }
  },
  "910": { // 小程序弹窗-登录引导
    data: miniloginGuardAddData,
    setting: miniloginGuardSetting,
    imgInfo: {
      width: 840,
      height: 1120,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：JPG\PNG最大500k，GIF最大2M",
      mixValid: imgSizeValid
    }
  },
  "104": {  // 出租车app首页配图banner-轮播
    data: cascaderAddData,
    addData: cascaderInnerAddData,
    setting: cascaderAddSetting,
    imgInfo: {
      width: 1053,
      height: 216,
      format: ["jpg", "png"],
      maxSize: 500
    }
  },
  "113": { // 小程序负屏幕-会员
    setting: {
      ...vipSetting,
      isAppVersion: false
    },
    data: getCommonData({
      ...vipSetting,
      isAppVersion: false
    })
  },
  "114": { // 小程序负屏幕-轮播
    data: cascaderAddData,
    setting: {
      ...cascaderAddSetting,
      isAppVersion: false
    },
    addData: getCommonData({
      ...cascaderAddSetting,
      isAppVersion: false
    }),
    imgInfo: {
      width: 1065,
      height: 426,
      format: ["jpg", "png"],
      maxSize: 500
    }
  },
  "115": { // 小程序负屏幕-任务
    setting: {
      ...taskSetting,
      isAppVersion: false
    },
    data: getCommonData({
      ...taskSetting,
      isAppVersion: false
    })
  },
  "116": { // 小程序负屏幕-商城
    setting: {
      ...shopSetting,
      isAppVersion: false
    },
    data: getCommonData({
      ...shopSetting,
      isAppVersion: false
    })
  },
  "117": { // 小程序负屏幕-h5
    setting: {
      ...h5Setting,
      isAppVersion: false
    },
    data: getCommonData({
      ...h5Setting,
      isAppVersion: false
    })
  },
  "128": { // 小程序流量主-小程序流量主
    data: getCommonData(miniMainFlowSetting),
    setting: miniMainFlowSetting
  },
  "134": {  // 出租车app首页配图banner-轮播
    data: cascaderAddData,
    // newUserGroupType 人群类型 1-用户画像/2-司机画像/3-车辆画像
    addData: { ...cascaderInnerAddData, ...{ newUserGroupType: 2 } },
    setting: cascaderAddSetting,
    imgInfo: {
      width: 1053,
      height: 282,
      format: ["jpg", "png"],
      maxSize: 500
    }
  },
  "141": { // 出租车开屏-开屏
    data: screenAddData,
    setting: screenSetting,
    imgInfo: {
      width: 1125,
      height: 2436,
      logoWidth: 1125,
      logoHeight: 2064,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：jpg/png最大500KB，gif最大2M",
      mixValid: imgSizeValid
    }
  },
  "1511": { // 小程序登录页-背景图
    data: miniLoginBackgroundAddData,
    setting: miniLoginBackgroundSetting,
    imgInfo: {
      width: 1051,
      height: 2094,
      logoWidth: 1051,
      logoHeight: 2094,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：jpg/png最大500KB，gif最大2M",
      mixValid: imgSizeValid
    }
  },
  "164": {  // 我的优惠券banner-轮播
    data: myCouponAddData,
    dataSetting: myCouponSetting,
    setting: myCouponAddSetting,
    addData: myCouponInnerAddData,
    imgInfo: {
      width: 1029,
      height: 264,
      format: ["jpg", "png"],
      maxSize: 500
    }
  },
  "1712": { // 行程结束领券弹窗
    data: tripEndCouponPopupAddData,
    setting: tripEndCouponPopupSetting,
    imgInfo: {
      width: 840,
      height: 1120,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：JPG/PNG最大500k，GIF最大2M",
      mixValid: imgSizeValid
    }
  },
  "1713": { // 行程结束任务
    data: tripEndTaskPopupAddData,
    setting: tripEndTaskPopupSetting,
    imgInfo: {
      width: 840,
      height: 1120,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：JPG/PNG最大500k，GIF最大2M",
      mixValid: imgSizeValid
    }
  },
  "1714": { // 行程结束行程分享活动
    data: tripEndTripSharePopupAddData,
    setting: tripEndTripSharePopupSetting,
    imgInfo: {
      width: 840,
      height: 1120,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：JPG/PNG最大500k，GIF最大2M",
      mixValid: imgSizeValid
    }
  },
  "1715": { // 行程结束行程广告提醒
    data: tripEndAdsPopupAddData,
    setting: tripEndAdsPopupSetting,
    imgInfo: {
      width: 840,
      height: 1120,
      format: ["jpg", "png", "gif"],
      mixMsg: "大小：JPG/PNG最大500k，GIF最大2M",
      mixValid: imgSizeValid
    }
  },
  "214": { // 司机App banner广告
    data: cascaderAddData,
    setting: cascaderAddSetting,
    dataSetting: driverAppBannerCascaderAddSetting,
    addData: cascaderInnerAddData,
    imgInfo: {
      width: 1404,
      height: 360,
      format: ["jpg", "png"],
    }
  },
}

// 选择新用户群-画像系统
export const userGroupColumnsNew = (that) => {
  return [
    {
      title: "序号",
      type: "index",
      width: 60
    },
    {
      title: "用户群名称",
      key: "userGroupName",
      tooltip: true,
      ellipsis: true
    },
    {
      title: "用户群编码",
      key: "userGroupCode",
      tooltip: true,
      ellipsis: true
    },
    {
      title: "是否动态更新",
      key: "dynamicUpdate",
      width: 120,
      render: (h, params) => {
        return h("div", params.row.dynamicUpdate === 1 ? "是" : "否");
      }
    },
    {
      title: "用户群人数",
      key: "userGroupCount",
      width: 120,
    },
    {
      title: "操作",
      key: "action",
      width: 80,
      render: (h, params) => {
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "text",
                size: "small"
              },
              style: {
                color: "#57a3f3"
              },
              on: {
                click: () => {
                  that.addData.userGroupArray.splice(params.index, 1);
                }
              }
            },
            "删除"
          )
        ]);
      }
    }
  ]; // 用户群标题
};
// 轮播类型-表格-表头
export const cascaderTableColumns = (that) => {
  return [
    {
      title: "序号",
      type: "index",
      width: 60,
    },
    {
      title: "广告图",
      key: "imageUrl",
      width: 120,
      align: "center",
      render: (h, params) => {
        if (params.row.imageUrl) {
          return h("img", {
            attrs: {
              src: params.row.imageUrl
            },
            class: {
              tableImg: true
            }
          })
        } else {
          return h("p", "无")
        }
      }
    },
    {
      title: "有效时间",
      key: "effectTime",
      minWidth: 180,
      render: (h, params) => {
        let res = params.row.effectTime.join(" 至 ")
        return h("p", res)
      }
    },
    {
      title: "APP版本",
      key: "appVersionType",
      minWidth: 140,
      render: (h, params) => {
        let res = ""
        if (params.row.appVersionType === 1) res = "全部版本"
        else if (params.row.appVersionType === 2) res = params.row.appVersionArray.replace(/,/ig, "/")
        else if (params.row.appVersionType === 3) res = `${params.row.appVersionArray}之前`
        else if (params.row.appVersionType === 4) res = `${params.row.appVersionArray}之后`

        return h("Tooltip", {
          props: {
            content: res,
            "max-width": "150",
            placement: "top",
            transfer: true
          },
          class: {
            "lang-val": true
          }
        }, [h("span", res)])
      }
    },
    {
      title: "用户群",
      key: "userGroupArray",
      minWidth: 200,
      render: (h, params) => {
        let res = ""
        if (params.row.userGroupType === 1) res = "全部用户群"
        else res = params.row.userGroupArray.map(item => item.userGroupName).join(",")
        return h("Tooltip", {
          props: {
            content: res,
            "max-width": "500",
            placement: "top",
            transfer: true
          },
          class: {
            "lang-val": true
          }
        }, [h("span", res)])
      }
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      width: 240,
      slot: "action",
    }
  ]; // 用户群标题
};

/**
 * 选择商品列表
 */
export const goodColumns = (_this) => {
  return [
    {
      type: "selection",
      align: "center",
      width: 50
    },
    {
      title: "缩略图",
      key: "spuIconUrl",
      align: "center",
      width: 80,
      render(h, params) {
        return h("img", {
          attrs: {
            "src": params.row.spuIconUrl
          },
          style: {
            "width": "60px"
          }
        }, "");
      }
    },
    {
      title: "状态",
      minWidth: 120, align: "center",
      key: "skuStatus",
      render(h, params) {
        return h("span", {}, skuStatusMap[params.row.skuStatus] || "");
      }
    },
    {
      title: "商品名称",
      key: "spuName", align: "center",
      minWidth: 100
    },
    {
      title: "销售价格",
      key: "skuSellCash",
      minWidth: 100,
      render(h, params) {
        let skuSellIntegral = params.row.skuSellIntegral;
        let skuSellCash = params.row.skuSellCash;
        return h("span", {}, `${skuSellIntegral}T币+${skuSellCash}元`);
      }
    },
  ]
}
/**
 * 商品上下架状态
 */
export const skuStatusMap = {
  "0": "待上架", "1": "已上架", "2": "已下架"
}
// 校验结束时间大于当前时间
const validNowTime = (rule, value, callback) => {
  if (!value[0] || !value[1]) callback(new Error("请选择有效时间"));
  let now = new Date();
  let dataTime = new Date(value[1]);
  if (dataTime < now) {
    callback(new Error("结束时间不能小于当前时间"));
  } else {
    callback();
  }
};
// 校验结束时间大于当前时间
const validValue = (rule, value, callback) => {
  if (!value[0] || !value[1]) callback(new Error("请选择限定时段"));
  callback();
};

export const ruleValidate = (that) => {
  const validProductLineArray = (rule, value, callback) => {
    // 顺风车
    if (that.addData.businessLine === 4) {
      callback();
    } else if (!that.addData.productLineArray.length) {
      callback("请选择产品线");
    } else {
      callback();
    }
  }
  return {
    position: [
      { required: true, type: "number", message: "请选择所属位置", trigger: "change" }
    ],
    type: [
      { required: true, type: "number", message: "请选择广告类型", trigger: "blur" }
    ],
    priority: [
      { required: true, type: "number", message: "请填写优先级", trigger: "blur" }
    ],
    name: [
      { required: true, message: "请填写广告名称", trigger: "blur" }
    ],
    effectTime: [
      { required: true, type: "array", min: 2, message: "请选择有效时间", trigger: "change" },
      { trigger: "change", validator: validNowTime }
    ],
    adEffectTimeList: [
      { required: true, type: "array", min: 1, message: "请选限定时段", trigger: "blur" }
    ],
    effectPeriodType: [
      { required: true, type: "number", message: "请选限定时段", trigger: "blur" }
    ],
    businessType: [
      { required: true, type: "array", min: 1, message: "请选择产品线", trigger: "blur" }
    ],
    // productLineArray: [
    //   // { required: true, type: "array", min: 1, message: "请选择产品线", trigger: "blur" }
    //   { trigger: "blur", validator: validProductLineArray }
    // ],
    businessLineArray: [
      { required: true, type: "array", min: 1, message: "请选择业务线", trigger: "change" }
    ],
    cityArray: [
      { required: true, type: "array", min: 1, message: "请选择城市", trigger: "blur" }
    ],
    appVersionType: [
      { required: true, type: "number", message: "请选择APP版本", trigger: "blur" }
    ],
    appVersionArray: [
      { required: true, message: "请输入APP版本号", trigger: "blur" }
    ],
    h5Url: [
      { required: true, message: "请输入H5链接", trigger: "blur" }
    ],
    title: [
      { required: true, message: "请输入标题文案", trigger: "blur" }
    ],
    moreUrl: [
      { required: true, message: "请输入链接", trigger: "blur" }
    ],
    adName: [
      { required: true, message: "请输入广告展示", trigger: "blur" }
    ],
    shopMaxNum: [
      { required: true, type: "number", message: "请输入数量", trigger: "blur" }
    ],
    productTypeArray: [
      { required: true, type: "array", message: "请选择商品类型", trigger: "blur" }
    ],
    productSelectType: [
      { required: true, type: "number", message: "请选择选品方式", trigger: "blur" }
    ],
    userGroupType: [
      { required: true, type: "number", message: "请选择用户群", trigger: "blur" }
    ],
    userGroupArray: [
      { required: true, type: "array", min: 1, message: "请选择用户群", trigger: "blur" }
    ],
    imageUrl: [
      { required: true, message: "请填选择图片", trigger: "blur" }
    ],
    imageBangUrl: [
      { required: true, message: "请填选择刘海屏广告图片", trigger: "blur" }
    ],
    frequencyType: [
      { required: true, type: "number", message: "请选择弹出频率", trigger: "blur" }
    ],
    frequencyVal: [
      { required: true, type: "number", message: "请输入次数", trigger: "change" }
    ],
    logoFlag: [
      { required: true, type: "number", message: "请选择是否展示", trigger: "change" }
    ],
    carouselList: [
      { required: true, type: "array", min: 1, message: "请至少添加一个轮播", trigger: "blur" }
    ],
    checkedRoles: [
      { required: true, type: "array", message: "请选择顺风车角色", trigger: "change" }
    ],
    checkedTypes: [
      { required: true, type: "array", message: "请选择出租车订单类型", trigger: "change" }
    ],
    timeItem: [
      { required: true, type: "array", min: 2, message: "请选择限定时段", trigger: "change" },
      { trigger: "change", validator: validValue }
    ],
    unitId: [
      { required: true, message: "请填写广告编码", trigger: "blur" }
    ],
    userType: [
      { required: true, type: "number", message: "请选择用户类型", trigger: "blur" },
    ],
    openScreenType: [
      { required: true, type: "number", message: "请选择开屏广告类型", trigger: "change" },
    ],
    popupAdType: [
      { required: true, type: "number", message: "请选择弹窗类型", trigger: "change" },
    ],
    grantRewardReqList: [
      { required: true, type: "array", message: "请选择关联奖励", trigger: "change" },
    ]
  }
}
let pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
};
let rewardTypeList =
{
  coupon: "优惠券",
  cash: "现金",
  score: "T币",
  giftCard: "礼品卡",
  giveCoin: "运营金",
  charSub: "充电补贴",
  opeCharge: "运营商充值",
  othEleComp: "其他电补",
  noReward: "无奖励",
  externalReward: "第三方API发券"
}
export const cacheData = {
  pageObj,
  parColumns: [],
  childParColumns: [],
  tableData: [],
  childTableData: [],
  rewardTypeList
}
let rewardPatternList = {
  1: "指定奖励",
  2: "随机奖励"
}

let rewardTypeObj = {
  coupon: "rewardCouponDto",
  cash: "rewardCashDto",
  score: "rewardScoreDto",
  giftCard: "rewardGiftCardDto"
}
export const returnFields = that => {
  return {
    index: {
      title: "序号",
      type: "index",
      width: 60,
      align: "center"
    },
    rewardName: {
      title: "奖励名称",
      key: "rewardName",
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
    },
    eventTargetType: {
      title: "奖励对象",
      key: "eventTargetType",
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h("span", params.row.eventTargetType === 0 ? "乘客" : "司机")
      }
    },
    rewardCode: {
      title: "奖励编码",
      key: "rewardCode",
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
    },
    beginTime: {
      title: "有效期",
      key: "beginTime",
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        let time = "";
        if (params.row.changeTimeFlag === 1) {
          time = "跟随活动有效期";
        } else {
          time = params.row.beginTime + "-" + params.row.endTime;
        }
        return h("span", {
          style: {
            "white-space": "nowrap",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "min-width": "120px"
          }
        }, time);
      }
    },
    action: {
      title: "操作",
      key: "action",
      tooltip: true,
      minWidth: 50,
      slot: "action",
      fixed: "right"
    }
  }
}
export const returnChildFields = that => {
  return {
    rewardName: {
      title: "子奖励名称",
      key: "subRewardName",
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
    },
    rewardCode: {
      title: "子奖励编码",
      key: "subRewardCode",
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
    },
    rewardPattern: {
      title: "奖励方式",
      key: "rewardPattern",
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        return h("span", rewardPatternList[params.row.rewardPattern]) || "-";
      }
    },
    rewardTypeCode: {
      title: "奖励类型",
      key: "rewardTypeCode",
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        let row = params.row;
        let rewardName = "";// 奖励类型
        if (row.rewardPattern === 1 || row.rewardPattern === 3) {
          rewardName = rewardTypeList[params.row.rewardTypeCode] || "-"
        } else if (row.rewardPattern === 2) {
          let randomGrantRewardSubDetailDtoList = row.randomGrantRewardSubDetailDtoList || [];
          let arr = [];
          let arrHash = {};
          randomGrantRewardSubDetailDtoList.forEach(item => {
            if (!arrHash[item.rewardTypeCode]) {
              arr.push(rewardTypeList[item.rewardTypeCode]);
              arrHash[item.rewardTypeCode] = true;
            }
          });
          rewardName = arr.join();
        }
        return h("span", rewardName);
      }
    },
    totalAmount: {
      title: "子奖励总金额",
      key: "totalAmount",
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        return h("span", params.row[rewardTypeObj[params.row.rewardTypeCode]] ? params.row[rewardTypeObj[params.row.rewardTypeCode]]["totalAmount"] : "-");
      }
    },
    perAmount: {
      title: "每人每次奖励",
      key: "perAmount",
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        return h(
          "span",
          params.row[rewardTypeObj[params.row.rewardTypeCode]] ?
            (params.row.rewardTypeCode === "giftCard" ?
              params.row[rewardTypeObj[params.row.rewardTypeCode]]["provideNum"] : params.row[rewardTypeObj[params.row.rewardTypeCode]]["perAmount"])
            : "-"
        );
      }
    },
    action: {
      title: "操作",
      key: "action",
      tooltip: true,
      minWidth: 150,
      slot: "action",
      fixed: "right"
    }
  }
}
