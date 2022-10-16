import { mapToList, listToMap } from "@/libs/util.js";
import { getGradeMap, getGradeListByType } from "@/libs/tools";
import store from "@/store/index"
import { getAreaInfoByCityCode } from "_o/api/configData.js";;
import { isFunc } from "_o/api/baseMixin.js";
// 是否申请发票
export const drawBillMap = {
  0: "待开票",
  1: "已开票",
};

// 发票类型
export const invoiceTypeMap = {
  1: "电子发票",
  2: "纸质发票",
};

// 订单类型
export const typeTimeMap = {
  1: "实时",
  2: "预约",
  4: "接机",
  5: "送机",
};

export const typeTimeMap2 = {
  1: "即时",
  2: "预约",
};

export const orderTypeMap = {
  1: "实时",
  2: "预约",
};

// 取消方
export const creatorTypeMap = {
  1: "乘客APP",
  2: "司机APP",
  3: "呼叫中心",
};

// 取消类型
export const cancelTypeMap = {
  0: "乘客无责取消",
  1: "乘客政策免费取消",
  2: "乘客使用免费次数取消",
  3: "乘客付费取消",
  4: "超时自动取消",
};

// 支付方式
export const payTypeMap = {
  1: "支付宝",
  2: "微信",
  3: "一网通",
  4: "余额",
  5: "优惠券",
  6: "线下支付",
  7: "营销或者客服操作",
  8: "银联支付",
  9: "企业支付",
  12: "企业线下",
  29: "一网通",
  34: "礼品卡",
  37: "积分",
  66: "企业混合支付",
  99: "他人代扣",
};

// 订单状态
export const orderMainStatusMap = {
  0: "约车中",
  1: "预约中",
  2: "接乘中",
  3: "已抵达接乘地",
  4: "载乘中",
  5: "已抵达目的地",
  6: "待支付",
  7: "待评价",
  8: "行程结束",
  9: "行程取消",
  10: "未叫到车",
};

// 订单来源
export const sourceList = [
  {
    value: "1",
    label: "自有App",
  },
  {
    value: "8",
    label: "微信小程序",
  },
  {
    value: "14",
    label: "支付宝小程序",
  },
  {
    value: "6",
    label: "扬招",
  },
  {
    value: "19",
    label: "H5",
  },
  {
    value: "7",
    label: "高德",
  },
  {
    value: "9",
    label: "首约",
  },
  {
    value: "10",
    label: "苏宁",
  },
  {
    value: "11",
    label: "招行",
  },
  {
    value: "12",
    label: "车巴达",
  },
  {
    value: "13",
    label: "易企",
  },
  {
    value: "15",
    label: "平安",
  },
  {
    value: "16",
    label: "旗妙",
  },
  {
    value: "17",
    label: "同程",
  },
  {
    value: "18",
    label: "凤凰有车",
  },
];

// reducer
const mapReducer = (accumulator = {}, currentValue) => {
  return {
    ...accumulator,
    [currentValue.value]: currentValue.label,
  };
};

// 订单来源map
export const orderInfoSourceMap = sourceList.reduce(mapReducer, {});

// 业务类型
export const typeModuleMap = {
  1: "出租车",
  2: "专享",
  3: "拼车",
  4: "快享",
  5: "顺风车",
  8: "包车",
};
// 业务类型
export const businessTypeMap = {
  1: "出租车",
  2: "专享",
  3: "拼车",
  4: "快享",
  8: "包车",
};

// 性别
export const sexMap = {
  1: "男",
  2: "女",
};

// 实名状态
export const dautoynmStatusMap = {
  0: "待实名",
  1: "已实名",
};

// 用户账号状态
export const accountStatusMap = {
  0: "正常",
  1: "黑名单",
  2: "临时冻结",
  9: "已注销",
};

// 消费类型
export const consumeTypeMap = {
  1: "行程车费支付-线上",
  2: "充值",
  3: "购卡",
  4: "行程车费支付-线下",
  5: "行程车费支付-自动扣款",
  6: "电费支付",
  7: "充电账户充值",
  8: "客服直接赠送",
  9: "营销直接赠送",
};

// 分享类型
export const shareTypeMap = {
  1: "自动",
  2: "手动",
};

// 优惠券类型
export const couponTypeMap = {
  1: "折扣券",
  2: "抵扣券",
};

// 优惠券状态
export const couponStatusMap = {
  1: "未使用",
  2: "已使用",
};

// 充值类型
export const rechargeTypeMap = {
  2: "个人充值",
  3: "客户充值",
  4: "活动奖励",
};

// 封号类型
export const freezeTypeMap = {
  1: "封号",
  2: "解封",
  3: "拉黑",
  4: "移除黑名单",
  5: "离职",
  6: "复职",
  7: "冻结",
  8: "解冻",
  9: "入职",
  10: "强制下线",
  11: "允许上线",
};

// 注册来源
export const registerSourceMap = {
  1: "营销",
  2: "分享",
};

// 广告状态
export const adStatusMap = {
  1: "未开始",
  2: "在线中",
  3: "已结束",
  4: "已关闭",
  5: "已失效",
};
// 广告审核状态
export const adAuditStatusMap = {
  0: "待审核",
  1: "已通过",
  2: "已驳回",
};

// 活动状态
export const activeStatusMap = {
  1: "未开始",
  2: "在线中",
  3: "已结束",
  4: "已关闭",
};

// 司机/乘客
export const roleMap = {
  1: "司机",
  2: "乘客",
};
// 申请单状态
export const applyStatus = {
  0: "待审批",
  1: "审批驳回",
  2: "超时未审批",
  3: "已完成",
  4: "取消",
  5: "派单中",
  6: "派单成功",
  7: "派单失败",
  100: "订单创建失败",
};
// 审批状态 0审批中；1不通过；2通过；3超时
export const approveStatus = {
  0: "审批中",
  1: "不通过",
  2: "通过",
  3: "超时",
};
// 订单来源
export const orderSourceMap = {
  1: "APP移动端",
  2: "微信公众号",
  3: "客服",
  4: "pc网站",
  5: "后台下单",
};

// 车型等级
export const carTypeMap = {
  1: "快享",
  2: "舒适型",
  3: "行政型",
  4: "商务型",
  9: "豪华型",
  8: "自动驾驶",
  10: "惠享",
};

// 顺风车行程类型
export const tripTypeMap = {
  1: "市内行程",
  2: "城际行程",
};

// 业务线
const businessMap = {
  1: { label: "出租车", value: "1" },
  2: { label: "专享", value: "2" },
  3: { label: "拼车", value: "3" },
  4: { label: "快享", value: "4" },
  5: { label: "顺风车", value: "5" },
  6: { label: "包车", value: "8" },
  11: { label: "企业用车", value: "11" },
};
// 返回业务线map和业务线列表
// 入参：arr，为上面businessMap中需要的业务线的 ( key| Number ) 组成的数组，为空默认返回全部
export const getBusinessLine = (arr = Object.keys(businessMap)) => {
  let obj = {};
  let list = [];

  for (let key of arr) {
    let item = businessMap[key];
    obj[item.value] = item.label;
    list.push(item);
  }
  return { map: obj, list: list };
};
const addItemToResult = (item, obj, list) => {
  list.push({
    label: item.bizTypeName,
    value: String(item.bizType),
    levels: item.levels
  })
  obj[item.bizType] = item.bizTypeName;
}
export const getNewBusinessLine = (arr = []) => {
  let obj = {};
  let list = [];
  store.state.common.bizTypeMap.forEach(item => {
    if (arr && arr.length && !arr.find(code => String(code) === String(item.bizType))) {
      return;
    }
    addItemToResult(item, obj, list)
  });
  return { map: obj, list: list };
}

// 获取车型，如果不传值，则默认获取快享的车型
export const getNewCarLevelList = (bizType = 4) => {
  let obj = {};
  let list = [];
  store.state.common.bizTypeMap.forEach(item => {
    if (Number(item.bizType) === Number(bizType)) {
      if (item.levels && item.levels.length) {
        item.levels.forEach(level => {
          obj[level.vehicleLevel] = level.vehicleName;
          list.push({
            label: level.vehicleName,
            value: level.vehicleLevel
          })
        })
      }
    }
  })
  return { map: obj, list: list };
}
// 套餐类型
export const packageTypeMap = {
  0: "起步价套餐",
  1: "一口价套餐",
};

// 顺风车策略行程类型
export const hitchRouteTypeMap = {
  1: "市内行程",
  2: "城际行程",
};

/** 上传健康码围栏 */
export const RAIL_TYPE__UPLOAD_HEALTH_CODE = 27

// 人车证过滤围栏
const RAIL_TYPE__PENSON_CAR_CARD = 28
/** 围栏类型 —— 限停围栏 */
export const RAIL_TYPE__LIMIT_STOP = 25

export const railList = [
  {
    value: 1,
    label: "运营围栏",
  },
  {
    value: 2,
    label: "流水奖励围栏",
  },
  // {
  //   value: 3,
  //   label: "营销活动围栏"
  // },
  {
    value: 4,
    label: "T3上车点围栏",
  },
  {
    value: 5,
    label: "派单围栏",
  },
  {
    value: 6,
    label: "交通枢纽围栏",
  },
  // 新增T3自定义下车点围栏类型
  {
    value: 7,
    label: "T3自定义下车点",
  },
  {
    value: 8,
    label: "禁行围栏",
  },
  {
    value: 12,
    label: "乘客饮酒管理围栏",
  },
  {
    value: 14,
    label: "异常停留围栏",
  },
  {
    value: 15,
    label: "调度类型围栏",
  },
  {
    // 异地车辆派单策略
    value: 17,
    label: "异地车辆派单围栏",
  },
  {
    value: 18,
    label: "限号限行围栏",
  },
  {
    value: 19,
    label: "行N限N围栏",
  },
  {
    value: 20,
    label: "会员绝对优先派单围栏",
  },
  {
    value: 21,
    label: "涉性围栏",
  },
  {
    value: 22,
    label: "防疫围栏",
  },
  {
    value: 23,
    label: "禁止接单围栏",
  },
  {
    value: 24,
    label: "高危路段围栏",
  },
  {
    value: RAIL_TYPE__LIMIT_STOP,
    label: "限停围栏",
  },
  {
    value: 26,
    label: "地址类型围栏",
  },
  {
    value: RAIL_TYPE__UPLOAD_HEALTH_CODE,
    label: "上传乘客健康码围栏",
  },
  {
    value: RAIL_TYPE__PENSON_CAR_CARD,
    label: "人车证过滤围栏",
  }
];
export const railMap = listToMap(railList);

// 注销验证方式
export const cancellationIdentifyList = {
  0: "短信验证",
  1: "人脸验证",
};
// 司机类型
export const driverTypeMap = {
  1: "自营司机",
  2: "UP司机",
  3: "P司机",
};

export const driverTypeList = mapToList(driverTypeMap, "string");

// 全部车型等级 {"1#1" : "xxx", "2#1": "xxxx"}
export const carTypeMapAll = getGradeMap()

/**
 * @description 根据传入的 businessType 产品线/业务线，返回label/value形式的list
 * @param { String/Number } businessType
 * @return { Array } 如 [{label:"xx", value: 2}]
 */
export const getCarLevelList = (businessType) => {
  return getGradeListByType(Number(businessType)).map((m) => {
    return {
      label: m.gradeDesc,
      value: m.gradeCode,
    };
  });
};

// 根据城市返回区县列表
// 入参：cityCode，回调函数callback，用来填充区县列表数据
export const callAreaInfoByCityCode = (cityCode, callback) => {
  getAreaInfoByCityCode({ cityCode: cityCode }).then(res => {
    if (res.data.success) {
      const list = res.data.data.map(it => {
        return {
          label: it.orgName,
          value: it.orgCode
        }
      })
      let listCopy = JSON.parse(JSON.stringify(list))
      listCopy.unshift({label:'全部',value:'0'})
      isFunc(callback) && callback(listCopy)
    }
  })
};
