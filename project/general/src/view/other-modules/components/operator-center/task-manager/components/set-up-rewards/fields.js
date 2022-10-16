export const rewardTypeMap = {
  'coupon': '优惠券',
  'couponMany': '优惠券',
  'cash': '现金',
  'noReward': '无奖励',
  'score': 'T币',
  "giveCoin": "运营金",
  "giftCard": "礼品卡",
  "charSub": "充电补贴",
  "opeCharge": "运营商充值",
  "othEleComp": "其他电补",
  "rewardCentres": "奖励中心"
}

export const rewardPatternMap = {
  1: '指定奖励',
  2: '随机奖励',
  3: '智能奖励'
}

export const parentColumns = [{
    title: "序号",
    type: "index",
    width: 60,
    align: "center"
  },
  {
    title: "奖励名称",
    key: "rewardName"
  },
  {
    title: "奖励编码",
    key: "rewardCode"
  },
  {
    title: "有效期",
    key: "startTime",
    width: 310,
    render(h, {
      row
    }) {
      return +row.changeTimeFlag === 1 ? h('span', {}, '跟随活动有效') : h('span', `${row.beginTime} - ${row.endTime}`)
    }
  },
  {
    title: "操作",
    key: "action",
    width: 120,
    slot: "action",
  }
]
export const sonColumns = [{
    title: "子奖励名称",
    key: "subRewardName"
  },
  {
    title: "子奖励编码",
    key: "subRewardCode"
  },
  {
    title: "奖励方式",
    key: "rewardPattern",
    render(h, {
      row
    }) {
      return h('span', rewardPatternMap[row.rewardPattern])
    }
  },
  {
    title: "奖励类型",
    key: "rewardTypeCode",
    render(h, {
      row
    }) {
      return h('span', rewardTypeMap[row.rewardTypeCode])
    }
  },
  {
    title: "子奖励总金额",
    key: "totalReward",
    render(h, {
      row
    }) {
      return h('span', row.extentMap && JSON.parse(row.extentMap).totalAmount)
    }
  },
  {
    title: "操作",
    key: "action",
    width: 120,
    slot: "action",
  }
]
