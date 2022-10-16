import {
  moreThanCurrentTime,
  mustAward,
  mustTwo,
  mustLimitTime,
  validNowTime,
  validTime,
  noEmpty,
  integerValidate
} from "./validate";
import { getBusinessLine } from "_g/config/status-map"

export const userGroupColumns = (that, isDriver) => {
  return [
    {
      title: "用户群名称",
      key: "userGroupName"
    },
    {
      title: "用户群编码",
      key: "userGroupCode"
    },
    {
      title: "用户群类型",
      key: "userGroupType",
      render: (h, params) => {
        return h("div", params.row.userGroupType === 1 ? "导入类" : "条件类");
      }
    },
    {
      title: "用户群人数",
      key: "userGroupCount"
    },
    {
      title: "操作",
      key: "action",
      width: 100,
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
                  if (isDriver) {
                    that.recommendData.selectUserGroup.splice(params.index, 1);
                  } else {
                    that.ruleData.selectUserGroup.splice(params.index, 1);
                  }

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

export const enterpriseCouponColumns = (that, isDriver) => {
  return [
    {
      title: "企业名称",
      key: "name"
    },
    {
      title: "企业编码",
      key: "orgCode"
    },
    {
      title: "操作",
      key: "action",
      width: 100,
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
                  that.ruleData.selectedEnterprise.splice(params.index, 1);
                  // if(isDriver){
                  //   that.recommendData.selectedEnterprise.splice(params.index, 1);
                  // }else{
                  //   that.ruleData.selectedEnterprise.splice(params.index, 1);
                  // }

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
// 选择新用户群
export const userGroupColumnsNew = (that,isDriver) => {
  return [
    {
      title: "用户群名称",
      key: "userGroupName"
    },
    {
      title: "用户群编码",
      key: "userGroupCode"
    },
    {
      title: "是否动态更新",
      key: "dynamicUpdate",
      render: (h, params) => {
        return h("div", params.row.dynamicUpdate === 1 ? "是" : "否");
      }
    },
    {
      title: "用户群人数",
      key: "userGroupCount"
    },
    {
      title: "操作",
      key: "action",
      width: 100,
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
                  if(isDriver){
                    that.recommendData.selectUserGroup.splice(params.index, 1);
                  }else{
                    that.ruleData.selectUserGroup.splice(params.index, 1);
                  }
                  
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

export const awardTypeLabel1 = {
  onlyStart: "每推荐成功注册",
  helpStart: "推荐成功注册",
  onlyMiddle: "名用户，奖励",
  onlyEnd: "次",
  tableFirst: "成功推荐用户注册人数",
  tableSecond: "本阶梯优惠券奖励次数"
};
export const awardTypeLabel2 = {
  onlyStart: "每",
  helpStart: "有",
  onlyMiddle: "名用户完成首单，奖励",
  onlyEnd: "次",
  tableFirst: "成功完成首单用户数",
  tableSecond: "本阶梯优惠券奖励次数"
};
export const awardTypeLabel3 = {
  onlyStart: "每加入助力团",
  helpStart: "加入助力团",
  onlyMiddle: "名用户，奖励",
  onlyEnd: "次",
  tableFirst: "成功加入助力团用户数",
  tableSecond: "本阶梯优惠券奖励次数"
};
export const cacheData = {
  cityList: [], // 城市列表
  infoDataRules: {
    activityName: [
      { required: true, message: "请输入活动名称", trigger: "blur" }
    ],
    activityType: [
      { required: true, message: "请选择活动类型", trigger: "change" }
    ]
  },
  ruleDataRules: {
    cityArray: [
      {
        required: true,
        type: "array",
        min: 1,
        message: "请选择城市",
        trigger: "blur"
      }
    ],
    businessTypeList: [
      {
        required: true,
        type: "array",
        min: 1,
        message: "请选择业务线",
        trigger: "blur"
      }
    ],
    userLimitList: [
      {
        required: true,
        type: "array",
        min: 1,
        message: "请选择订单类型",
        trigger: "blur"
      }
    ],
    selectUserGroup: [
      {
        required: true,
        type: "array",
        min: 1,
        message: "请选择用户群",
        trigger: "blur"
      }
    ],
    selectedEnterprise: [
      {
        required: true,
        type: "array",
        min: 1,
        message: "请选择企业",
        trigger: "blur"
      }
    ],
    psword: [{ required: true, message: "领取口令不可为空", trigger: "blur" }],
    activityFreeShareEnum: [
      { required: true, message: "请选择活动场景", trigger: "blur" }
    ],
    isGrantImmediately: [
      {
        required: true,
        type: "number",
        message: "请选择发放时间",
        trigger: "blur"
      }
    ],
    pushContent: [
      { required: true, message: "通知内容不可为空", trigger: "blur" }
    ],
    needUserGroup: [
      {
        required: true,
        type: "number",
        message: "请选择用户群",
        trigger: "blur"
      }
    ],
    startGrantTime: [
      {
        required: true,
        type: "date",
        message: "请选择发放开始时间",
        trigger: "blur"
      },
      { trigger: "change", validator: moreThanCurrentTime }
    ],
    time: [
      { required: true, trigger: "change", validator: validTime },
      { trigger: "change", validator: validNowTime }
    ],
    activityQuotaType: [
      { required: true, type: "number", message: "请选择额度", trigger: "blur" }
    ],
    activityTotal: [
      {
        required: true,
        type: "number",
        message: "请输入总额度",
        trigger: "blur"
      },
      { trigger: "change", validator: integerValidate }
    ],
    amountReward: [
      {
        required: true,
        type: "number",
        message: "请输入奖励金额",
        trigger: "blur"
      },
      { trigger: "change", validator: integerValidate }
    ],
    completionDeadline: [
      {
        required: true,
        type: "number",
        message: "请输入助力达成期限",
        trigger: "blur"
      },
      { trigger: "change", validator: integerValidate }
    ],
    maxRewardCount: [
      {
        required: true,
        type: "number",
        message: "请输入上限",
        trigger: "blur"
      },
      { trigger: "change", validator: integerValidate }
    ],
    maxDayRewardCount: [
      {
        required: true,
        type: "number",
        message: "请输入上限",
        trigger: "blur"
      },
      { trigger: "change", validator: integerValidate }
    ],
    assistantMaxRewardCount: [
      {
        required: true,
        type: "number",
        message: "请输入上限",
        trigger: "blur"
      },
      { trigger: "change", validator: integerValidate }
    ],
    assistantMaxDayRewardCount: [
      {
        required: true,
        type: "number",
        message: "请输入上限",
        trigger: "blur"
      },
      { trigger: "change", validator: integerValidate }
    ],
    routemaxRewardCount: [
      {
        required: true,
        type: "number",
        message: "请输入上限",
        trigger: "blur"
      },
      { trigger: "change", validator: integerValidate }
    ],
    ladder: [
      {
        required: true,
        type: "array",
        min: 1,
        message: "请填写完整",
        trigger: "blur"
      },
      { trigger: "blur", validator: mustAward }
    ],
    rewardLadder: [
      {
        required: true,
        type: "array",
        min: 1,
        message: "请填写完整",
        trigger: "blur"
      },
      { trigger: "change", validator: mustTwo }
    ],
    redPacketRewardType: [
      {
        required: true,
        type: "number",
        message: "请选择奖励方式",
        trigger: "blur"
      }
    ],
    driverReceiveTimes: [
      {
        required: true,
        type: "array",
        min: 1,
        message: "请填写限定时段",
        trigger: "blur"
      },
      { trigger: "blur", validator: mustLimitTime }
    ],
    template: [
      {
        required: true,
        type: "array",
        min: 1,
        message: "请选择优惠券模板",
        trigger: "blur"
      },
      { trigger: "change", validator: noEmpty }
    ],
    freeShardLimitTime: [
      { required: true, type: "number", message: "请选择", trigger: "blur" }
    ]
  },
  landPageDataRules: {
    shareTitle: [{ required: true, message: "请输入标题", trigger: "blur" }],
    beforeLandingPageRule: [
      { required: true, message: "请输入活动规则", trigger: "blur" }
    ],
    beforeLandingPageBanner: [
      { required: true, message: "请添加banner图", trigger: "blur" }
    ],
    beforeLandingPageBgcolor: [
      { required: true, message: "请选择背景颜色", trigger: "blur" }
    ],
    afterLandingPageBanner: [
      { required: true, message: "请添加banner图", trigger: "blur" }
    ],
    afterLandingPageBgcolor: [
      { required: true, message: "请选择背景颜色", trigger: "blur" }
    ],
    beforeLandingPageTitle: [
      { required: true, message: "请输入标题", trigger: "blur" }
    ],
    afterLandingPageTitle: [
      { required: true, message: "请输入标题", trigger: "blur" }
    ],
    shareSubTitle: [
      { required: true, message: "请输入副标题", trigger: "blur" }
    ],
    shareFriendsTitle: [
      { required: true, message: "请输入标题", trigger: "blur" }
    ],
    shareIcon: [{ required: true, message: "请添加分享图标", trigger: "blur" }],
    shareFriendsIcon: [
      { required: true, message: "请添加分享图标", trigger: "blur" }
    ],
    shareBanner: [
      { required: true, message: "请添加banner图标", trigger: "blur" }
    ]
  },
  editLandRules: {
    beforeLandingPageRule: [
      { required: true, message: "请输入活动规则", trigger: "blur" }
    ]
  },
  awardTypeLabel1,
  awardTypeLabel2,
  awardTypeLabel3
};
export const orderMap = {
  "1": "实时",
  "2": "预约"
};

export const businessLineMap = getBusinessLine([1, 4, 2, 5, 6, 11]).map