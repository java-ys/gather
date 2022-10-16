// 用户群类型
export const personGroupMap = {
  1: "乘客",
  2: "司机"
}
export const getPersonGroup = (i) => {
  return personGroupMap[i];
}

// / 题型标签
export const subjectTagMap = {
  1: "1年级",
  2: "2年级",
  3: "3年级",
  4: "4年级",
  5: "5年级",
  6: "6年级"
}
export const getSubjectTag = (i) => {
  return subjectTagMap[i];
}

// 发送状态 状态 0 未生效 1 已上线 2 已下线
export const sendStatusMap = {
  0: "未生效",
  1: "已上线",
  2: "已下线",
}
export const getTaskStatusName = (i) => {
  return sendStatusMap[i];
}

// 发送周期
export const sendModeMap = {
  1: "单次",
  2: "每天",
}
export const getSendModeName = (i) => {
  return sendModeMap[i];
}

// 司机状态
export const driverStatusMap = {
  1: "投入运营",
  2: "已入职"
}

// 发送渠道
export const pushChannelMap = {
  1: "短信",
  // 2: "信鸽",
  4: "乘客端push推送",
  3: "司机公告",
}

// 题型分层
export const titleTagMap = {
  1: {
    0: "NPS",
    1: "期望符合程度",
    2: "品牌感知",
    3: "安全感知",
    4: "资费感知",
    5: "APP感知",
    6: "叫车感知",
    7: "车辆感知",
    8: "乘车感知",
    9: "司机服务感知",
    10: "支付感知",
    11: "客服感知"
  },

  2: {
    0: "NPS",
    1: "期望符合程度",
    2: "品牌感知",
    3: "安全感知",
    4: "车机感知",
    5: "司机APP感知",
    6: "车辆感知",
    7: "导航感知",
    8: "派单感知",
    9: "乘客感知",
    10: "客服感知",
    11: "运营商感知",
    12: "收入感知"
  }
}