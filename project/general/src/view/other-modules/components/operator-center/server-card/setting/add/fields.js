import { validEmptyArray } from '@/libs/validate'
export const handleTypeMap = {
  1: {
    title: "新增深夜服务卡",
    type: "新增",
    closeAlert: true
  },
  2: {
    title: "编辑深夜服务卡",
    type: "编辑",
    closeAlert: true
  },
  3: {
    title: "深夜服务卡详情",
    type: "详情",
    closeAlert: false
  }
};
export const ruleValidate = {
  scName: [
    { required: true, message: "请填写服务卡名称", trigger: "blur" }
  ],
  cityCodeList: [
    { required: true, type: "array", min: 1, message: "请选择城市", trigger: "change" }
  ],
  startTimeNep: [
    { required: true, message: "请选择", trigger: "blur" }
  ],
  endTimeNep: [
    { required: true, message: "请选择", trigger: "blur" }
  ],
  effectDate: [
    { required: true, type: "array", min: 2, message: "请选择生效日期", trigger: "change" },
    { trigger: "change", msg: "请选择生效日期", validator: validEmptyArray }
  ],
  onlineStatus: [
    { required: true, type: "number", message: "请选择", trigger: "change" }
  ],
  entryDays: [
    { required: true, type: "number", message: "请输入", trigger: "change" }
  ],
  safetyComplaints: [
    { required: true, type: "number", message: "请输入", trigger: "change" }
  ],
  monthCount: [
    { required: true, type: "number", message: "请输入", trigger: "change" }
  ],
  accidentCount: [
    { required: true, type: "number", message: "请输入", trigger: "change" }
  ],
  accidentCategory: [
    { required: true, type: "array", min: 1, message: "请添加事故类别", trigger: "change" },
  ]
}