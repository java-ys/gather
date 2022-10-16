import { mapToList } from "@/libs/util.js";
import { getBusinessLine } from "_g/config/status-map";

export const PICKRIDE = "pickride" // 顺风车app广告标识
export const TAXISIGN = "taxisign" // 出租车广告标识
export const PASSENGER_VALUE = "PASSENGER_VALUE"
export const OWNER_VALUE = "OWNER_VALUE"
export const TAXI_ONLINE_VALUE = "TAXI_ONLINE_VALUE"
export const TAXI_YZ_VALUE = "TAXI_YZ_VALUE"
// 涉及产品线枚举值-快享/专/包/顺/企业用车-业务线
const BusinessArr = [4, 2, 6, 5, 11];
// 需要包含出租车的广告位置
export const needTaxiPositionArr = [2, 3, 4, 5, 9, 10, 13];
// 出租车产品线list
export const taxiProductLine = {
  label: "出租车",
  value: TAXISIGN
}

// 顺风车角色
export const pickrideRoles = [
  {
    label: "乘客",
    value: PASSENGER_VALUE
  },
  {
    label: "车主",
    value: OWNER_VALUE
  }
]
// 出租车类型
export const taxisignType = [
  {
    label: "网约",
    value: TAXI_ONLINE_VALUE
  },
  {
    label: "扬招",
    value: TAXI_YZ_VALUE
  }
]
export const businessInfo = getBusinessLine(BusinessArr);


const newDropList = [
  { label: "顺风车-乘客", value: PASSENGER_VALUE },
  { label: "顺风车-车主", value: OWNER_VALUE }
]
const newTaxiDropList = [
  { label: "出租车-网约", value: TAXI_ONLINE_VALUE },
  { label: "出租车-扬招", value: TAXI_YZ_VALUE }
]
// 产品线增加 乘客&车主区分
export const dropList = businessInfo.list.filter(item => item.value !== "5" && item.value !== "1").concat(newDropList).concat(newTaxiDropList)

/** 广告位置 -- 司机App服务页banner */
export const POSITION_VALUE__DRIVER_APP_BANNER = 21
export const POSITION_LABEL__DRIVER_APP_BANNER = '司机App服务页banner'

// 广告位置
export const positionMap = {
  1: "开屏",
  2: "弹窗",
  3: "首页顶栏",
  4: "首页负屏幕",
  5: "小程序首页banner",
  6: "我的发票banner",
  7: "领券中心更多福利",
  8: "行程结束页",
  9: "小程序弹窗",
  10: "出租车app首页配图banner",
  11: "小程序负屏幕",
  12: "小程序流量主",
  13: "出租车司机APP首页banner",
  14: "出租车开屏",
  15: "小程序登录页",
  16: "我的优惠券banner",
  17: "支付成功进入行程结束页",
  [POSITION_VALUE__DRIVER_APP_BANNER]: POSITION_LABEL__DRIVER_APP_BANNER,
};
export const positionList = mapToList(positionMap, "number", true);
// 广告类型
export const typeMap = {
  1: "开屏",
  2: "广告",
  3: "会员",
  4: "轮播",
  5: "任务",
  6: "商城",
  7: "自定义H5",
  8: "小程序流量主",
  9: "优惠券",
  10: "登录引导",
  11: "背景图",
  12: "领券弹窗",
  13: "任务",
  14: "行程分享活动",
  15: "广告提醒"
};
export const typeList = mapToList(typeMap);
// 广告位置可选的广告类型列表
export const positionToTypeMap = {
  1: [{ label: "开屏", value: 1 }],
  2: [
    { label: "优惠券", value: 9 },
    { label: "广告", value: 2 },
    { label: "登录引导", value: 10 },
  ],
  3: [{ label: "轮播", value: 4 }],
  4: [
    { label: "自定义H5", value: 7 },
    { label: "商城", value: 6 },
    { label: "任务", value: 5 },
    { label: "轮播", value: 4 },
    { label: "会员", value: 3 }
  ],
  5: [{ label: "轮播", value: 4 }],
  6: [{ label: "轮播", value: 4 }],
  7: [{ label: "轮播", value: 4 }],
  8: [{ label: "轮播", value: 4 }],
  9: [
    { label: "优惠券", value: 9 },
    { label: "广告", value: 2 },
    { label: "登录引导", value: 10 },
  ],
  10: [{ label: "轮播", value: 4 }],
  11: [
    { label: "商城", value: 6 },
    { label: "任务", value: 5 },
    { label: "轮播", value: 4 },
    { label: "会员", value: 3 }
  ],
  12: [{ label: "小程序流量主", value: 8 }],
  13: [{ label: "轮播", value: 4 }],
  14: [{ label: "开屏", value: 1 }],
  15: [{ label: "背景图", value: 11 }],
  16: [{ label: "轮播", value: 4 }],
  17: [
    { label: "领券弹窗", value: 12 },
    { label: "任务", value: 13 },
    { label: "行程分享活动", value: 14 },
    { label: "广告提醒", value: 15 }
  ]
};
// 广告状态
let statusMap = {
  1: "未开始",
  2: "在线中",
  3: "已结束",
  4: "已关闭",
  5: "已失效"
};
export const statusList = mapToList(statusMap);
// 广告审核状态
export const auditsMap = {
  0: "待审核",
  1: "已通过",
  2: "已驳回"
};
export const auditList = mapToList(auditsMap);

export const inputList = [
  {
    name: "drop-input",
    bind_key: "position",
    value: "",
    dropList: positionList,
    filterable: true,
    title: "所属位置",
    inputWidth: 150
  },
  {
    name: "drop-input",
    bind_key: "type",
    value: "",
    filterable: true,
    dropList: typeList,
    title: "广告类型",
    inputWidth: 150
  },
  {
    name: "text-input",
    bind_key: "name",
    value: "",
    maxlength: 50,
    title: "广告名称"
  },
  {
    name: "drop-input",
    bind_key: "status",
    value: "",
    dropList: statusList,
    title: "广告状态",
    inputWidth: 150
  },
  {
    name: "drop-input",
    bind_key: "cityCode",
    value: "",
    dropList: [],
    title: "城市",
    inputWidth: 150,
    titleWidth: 40,
    filterable: true
  },
  {
    name: "cascader-input",
    bind_key: ["bizLine", "businessType"],
    value: [],
    cascaderList: [] || dropList,
    changeOnSelect: true,
    title: "业务产品线",
    titleWidth: 76,
    inputWidth: 150,
    trigger: "click"
  },
  {
    name: "drop-input",
    bind_key: "auditStatus",
    value: "",
    dropList: auditList,
    title: "审核状态",
    inputWidth: 150
  },
  {
    name: "text-input",
    bind_key: "creator",
    value: "",
    title: "创建人"
  }
];
export const parColumns = that => {
  return [
    {
      title: "广告名称",
      key: "name",
      tooltip: true,
      ellipsis: true,
      minWidth: 240
    },
    {
      title: "所属位置",
      key: "position",
      tooltip: true,
      ellipsis: true,
      minWidth: 130,
      render: (h, params) => {
        return h("div", positionMap[params.row.position]);
      }
    },
    {
      title: "广告类型",
      key: "type",
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render: (h, params) => {
        return h("div", typeMap[params.row.type]);
      }
    },
    {
      title: "优先级",
      key: "priority",
      tooltip: true,
      ellipsis: true,
      minWidth: 80,
      render: (h, params) => {
        return h("div", params.row.type == 10 ? null : params.row.priority);
      }
    },
    {
      title: "在线时间",
      key: "startTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 280,
      render: (h, params) => {
        let res = params.row.startTime + "至" + params.row.endTime;
        return h("div", res);
      }
    },
    {
      title: "广告状态",
      key: "status",
      tooltip: true,
      ellipsis: true,
      minWidth: 90,
      render: (h, params) => {
        return h("div", statusMap[params.row.status]);
      }
    },
    {
      title: "审核状态",
      key: "auditStatus",
      tooltip: true,
      ellipsis: true,
      minWidth: 90,
      render: (h, params) => {
        return h("div", auditsMap[params.row.auditStatus]);
      }
    },
    {
      title: "创建人",
      key: "creator",
      tooltip: true,
      ellipsis: true,
      minWidth: 90
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      width: 200,
      slot: "action"
    }
  ];
};
