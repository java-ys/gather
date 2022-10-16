import { businessInfo } from "../../short-message-center/vechile-voice/timing-config/fields";
import store from "@/store"

// 司机类型
export const driverTypeMap = {
  "10": "自营司机",
  "20": "自营-主司机",
  "30": "自营-副司机",
  "40": "自营-顶班司机",
  "50": "UP司机",
  "60": "UP-主司机",
  "70": "UP-副司机",
  "80": "UP-顶班司机",
  "90": "UP-带车加盟"
};

// select结构
const driverTypeList = Object.entries(driverTypeMap).map(([key,value])=>{
  return {
    value: key,
    label: value
  }
});

export const inputListStay = (_this) => [
  {
    name: "text-input",
    bind_key: "woCode",
    title: "工单编号",
    titleWidth: 90,
    value: ""
  },
  {
    name: 'drop-input',
    bind_key: 'cityCode',
    value: '',
    dropList: [],
    title: '城市',
    placeholder: '请选择',
    titleWidth: 90,
  },
  {
    name: "date-time-input",
    title: "创建时间",
    bind_key: ["createdTimeStart", "createdTimeEnd"],
    placeholder: "请选择创建时间",
    titleWidth: 90,
    value: ""
  },
  {
    name: "date-time-input",
    title: "任务指派时间",
    bind_key: ["assignTimeStart", "assignTimeEnd"],
    placeholder: "请选择任务指派时间",
    titleWidth: 90,
    value: ""
  },
  {
    name: "text-input",
    bind_key: "orderNo",
    title: "关联订单编号",
    titleWidth: 90,
    value: ""
  },
  {
    name: "text-input",
    bind_key: "driverId",
    title: "司机ID",
    titleWidth: 90,
    value: ""
  },
  {
    name: "text-input",
    bind_key: "driverName",
    title: "司机姓名",
    titleWidth: 90,
    value: ""
  },
  {
    name: "text-input",
    bind_key: "driverPhone",
    title: "司机手机号",
    titleWidth: 90,
    value: ""
  },
  {
    name: "text-input",
    bind_key: "carNo",
    title: "车牌号",
    titleWidth: 90,
    value: ""
  },
  {
    name: "cascader-input",
    bind_key: ["categoryFirst", "categorySecond","categoryThird","categoryFourth"], // 返回数据的key名
    value: [],
    cascaderList: [],
    title: '工单类型',
    placeholder: '请选择',
    changeOnSelect: true,
    titleWidth: 90,
    filterable: true
  },
  {
    name: 'drop-input',
    bind_key: 'dealStatus',
    value: '',
    // dropList: bizMap,
    dropList: [],
    title: '处理状态',
    placeholder: '请选择',
    titleWidth: 90,
  },
  {
    name: 'drop-input',
    bind_key: 'driverType',
    value: '',
    dropList: [],
    title: '司机类型',
    placeholder: '请选择',
    titleWidth: 90,
  },
  {
    name: "drop-input",
    title: "业务线",
    bind_key: "expandBizLine",
    // 1出租车 2专车 4快享 6惠享 7自动驾驶
    dropList: store.state.common.businessGradeList,
    titleWidth: 90,
    value: ""
  },
  {
    name: "drop-input",
    title: "产品线",
    bind_key: "typeModule",
    dropList:store.state.common.bizTypeList,
    titleWidth: 90,
    value: ""
  },

]

export const inputListAlready = (_this) => [
  {
    name: "text-input",
    bind_key: "woCode",
    title: "工单编号",
    titleWidth: 90,
    value: ""
  },
  {
    name: "drop-input",
    title: "司机类型",
    bind_key: "driverType",
    placeholder: "请选择司机类型",
    filterable: true,
    titleWidth: 90,
    dropList: driverTypeList,
    value: ""
  },
]

// 工单分类
export const woCategoryList = [
  // 级联列表
  {
    label: "司机管理",
    value: "SJGL",
    type: "",
    children: [
      {
        label: "风控工单",
        value: "FKGD",
        type: "FK"
      },
      {
        label: "违规工单",
        value: "WGGD",
        type: "DP"
      },
      {
        label: "客诉工单",
        value: "KSGD",
        type: "KS"
      }
    ]
  }
];

// 处理状态
export const bizMap = [
  {
    label: "新建",
    value: "XJ"
  },
  {
    label: "初审",
    value: "CS"
  },
  {
    label: "终审",
    value: "ZS"
  },
  {
    label: "终审无责-结束",
    value: "ZS_WZ_END"
  },
  {
    label: "司机确认-申诉",
    value: "SJ"
  },
  {
    label: "司机确认-结束",
    value: "SJ_QR_END"
  },
  {
    label: "司机超时自动确认-结束",
    value: "SJ_QR_AUTO_END"
  },
  {
    label: "司机申诉",
    value: "SJ_SS"
  },
  {
    label: "初审申诉处理",
    value: "SJ_CS_SS"
  },
  {
    label: "终审申诉处理",
    value: "SJ_ZS_SS"
  },
  {
    label: "司机终审申诉-结束",
    value: "SJ_ZS_SS_END"
  },
  {
    label: "更改判责",
    value: "APPEAL_ONCE_MORE"
  }
];
