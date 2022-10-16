import { mapToList } from "@/libs/util.js";
import { getBusinessLine, getCarLevelList, orderTypeMap } from "_g/config/status-map";

// 涉及产品线枚举值-快享/专
export const BusinessArr = [4, 2];
export const businessInfo = getBusinessLine(BusinessArr);
businessInfo.list.forEach(item => {
  item.value = Number(item.value)
})

export const orderTypeList = mapToList(orderTypeMap);
export const statusMap = {
  "-2": "停用",
  0: "初始",
  1: "启用",
};
export const statusList = mapToList(statusMap);

export const sceneMap = {
  0: "不限场景",
  4: "接机",
  5: "送机",
  6: "接站",
  7: "送站"
}
export const sceneList = mapToList(sceneMap);
export const sceneAddList = JSON.parse(JSON.stringify(sceneList))
sceneAddList.shift()
// 渠道
export const channelMap = {
  7: "高德运营",
  9: "首约运营",
  10: "苏宁运营",
  11: "招商运营",
  12: "车巴达用车",
  13: "易企用车",
  15: "平安",
  16: "旗妙",
  17: "同程",
  18: "凤凰有车",
  20: "阿里",
  21: "美团",
  22: "租租车",
  23: "东航",
  24: "分贝通",
  25: "广州悦行",
  26: "胜意科技",
  27: "掌上高铁",
  28: "销巴科技",
  29: "差旅壹号",
  30: "车城智行",
  31: "招行总部",
  32: "携程",
  33: "航旅纵横",
  36: "德邦欢行",
  37: "华为",
  39: "携程接送机",
  43: "招行云创",
  44: "丰享",
  45: "招商金融科技（原车贴宝）",
  46: "唯品会",
  47: "空港嘉华",
  48: "三和",
  49: "问号",
  50: "易快报"
}
export const channelList = mapToList(channelMap);
// 产品线-车型等级
export const businessLevelMap = {
  4: getCarLevelList(4),
  2: getCarLevelList(2),
}

export const inputList = [
  {
    name: "drop-input",
    bind_key: "cityCode",
    value: "",
    dropList: [],
    title: "城市",
    titleWidth: 40,
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: "areaCode",
    value: "",
    dropList: [],
    title: "区县",
    titleWidth: 40,
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: "channelSource",
    value: "",
    dropList: [],
    title: "渠道",
    titleWidth: 40
  },
  {
    name: "drop-input",
    title: "司机类型：",
    titleWidth: 100,
    value: "",
    bind_key: "driverType",
    placeholder: "请选择",
    filterable: true,
    clearable: true,
    dropList: []
  },
  {
    name: "text-input",
    bind_key: "ruleName",
    value: "",
    title: "策略名称"
  },
  {
    name: "drop-input",
    title: "状态：",
    value: "",
    bind_key: "status",
    placeholder: "请选择",
    dropList: statusList
  },
  {
    name: "text-input",
    bind_key: "updater",
    value: "",
    title: "更新人"
  }
];
export const parColumns = that => [
  {
    title: "策略id",
    key: "uuid",
    tooltip: true,
    ellipsis: true,
    minWidth: 120
  },
  {
    title: "策略名称",
    key: "ruleName",
    tooltip: true,
    ellipsis: true,
    minWidth: 120
  },
  {
    title: "渠道",
    key: "channelSourceName",
    tooltip: true,
    ellipsis: true,
    minWidth: 120,
  },
  {
    title: "城市",
    key: "cityName",
    minWidth: 120
  },
  {
    title: "司机类型",
    key: "driverTypeNames",
    tooltip: true,
    ellipsis: true,
    minWidth: 120,
  },
  {
    title: "生效时间",
    key: "effectiveTime",
    minWidth: 160,
  },
  {
    title: "状态",
    key: "status",
    tooltip: true,
    ellipsis: true,
    minWidth: 90,
    render: (h, params) => {
      return h("div", statusMap[params.row.status]);
    }
  },
  {
    title: "更新时间",
    key: "updateTime",
    tooltip: true,
    ellipsis: true,
    minWidth: 160
  },
  {
    title: "更新人",
    key: "updater",
    tooltip: true,
    ellipsis: true,
    minWidth: 120
  },
  {
    title: "操作",
    key: "action",
    tooltip: true,
    fixed: "right",
    width: 260,
    slot: "action"
  }
];