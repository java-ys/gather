// 校验开始时间大于当前时间
const validNowTime = (rule, value, callback) => {
  if(!value) callback(new Error("请选择生效时间"));
  let now = new Date();
  let dataTime = new Date(value);
  if (dataTime < now) {
    callback(new Error("生效时间不能小于当前时间"));
  } else {
    callback();
  }
};

export const ruleValidate = {
  strategyName: [
    { required: true, message: '请填写策略名称', trigger: 'blur' }
  ],
  businessTypeList: [
    { required: true, type: "array", min: 1, message: '请选择产品线', trigger: 'blur' }
  ],
  cityCodeList: [
    { required: true, type: "array", min: 1, message: "请选择城市", trigger: "blur" }
  ],
  effectiveTime: [
    { required: true, type: "date",message: '请选择生效时间', trigger: 'change' },
    { trigger: "change", validator: validNowTime }
  ],
  sendTimes: [
    { required: true, type: 'number', message: '请选择发送频次', trigger: 'change' }
  ],
  appStartContent: [
    { required: true, message: '请输入播报内容', trigger: 'blur' }
  ],
  driverOnlineContent:  [
    { required: true, message: '请输入播报内容', trigger: 'blur' }
  ],
  amPassengerBoardedContent : [
    { required: true, message: '请输入播报内容', trigger: 'blur' }
  ],
  pmPassengerBoardedContent : [
    { required: true, message: '请输入播报内容', trigger: 'blur' }
  ],
  routeEndContent:  [
    { required: true, message: '请输入播报内容', trigger: 'blur' }
  ],
  travelSurchargeStatus: [
    { required: true, type: 'number', message: '请选择是否开启行程附加费提醒', trigger: 'change' }
  ],  
  appStartType: [
    { required: true, type: 'number', message: '请选择APP开机播报内容', trigger: 'change' }
  ] ,
  driverOnlineType: [
    { required: true, type: 'number', message: '请选择司机上线播报内容', trigger: 'change' }
  ], 
  passengerBoardedType: [
    { required: true, type: 'number', message: '请选择白天播报内容', trigger: 'change' }
  ],
  pmPassengerBoardedType: [
    { required: true, type: 'number', message: '请选择夜间播报内容', trigger: 'change' }
  ] ,
  arriveDestination: [
    { required: true, type: 'number', message: '请选择即将到达目的地播报内容', trigger: 'change' }
  ] ,
  routeEndType: [
    { required: true, type: 'number', message: '请选择行程结束播报内容', trigger: 'change' }
  ]
}
