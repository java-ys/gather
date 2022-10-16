/** 账户状态：正常（如果未开户为nul；其他值为冻结） */
export const ACCOUNT_STATE__NORMAL = 1;

export const isFreezeAccountVisible = row => row.acctStatus === ACCOUNT_STATE__NORMAL;
export const isUnfreezeAccountVisible = row => row.acctStatus != null && row.acctStatus !== ACCOUNT_STATE__NORMAL;

const getAccountStateText = val => {
  if (val == null) return "";
  if (val === ACCOUNT_STATE__NORMAL) return "正常";
  return "冻结";
};

/** 冻结账户权限 */
export const PERMISSION__FREEZE_ACCOUNT = "wallet-manage-freezeAccount";
/** 解冻账户权限 */
export const PERMISSION__UNFREEZE_ACCOUNT = "wallet-manage-unfreezeAccount";

/** 巡网出租车 */
export const PATROL_CONSTANT = '巡网出租车';

export const tHead = [
  {
    prop: "driverId",
    type: "",
    label: "司机Id",
    minWidth: 120,
  },
  {
    prop: "driverName",
    type: "",
    label: "司机姓名",
    minWidth: 80,
  },
  {
    prop: "driverMobile",
    type: "",
    label: "司机手机号",
    minWidth: 120,
  },
  {
    prop: "driverIdentityCard",
    type: "",
    label: "司机身份证号",
    minWidth: 160,
  },
  {
    prop: "driverType",
    type: "",
    label: "司机类型",
    minWidth: 160,
  },
  {
    prop: "cityName",
    type: "",
    label: "城市",
    minWidth: 80,
  },
  {
    prop: "agentName",
    type: "",
    label: "所属运营商",
    minWidth: 120,
  },
  {
    prop: "acctStatus",
    type: "",
    label: "账户状态",
    minWidth: 120,
    formatter: row => getAccountStateText(row.acctStatus),
  },
  {
    prop: "balance",
    type: "",
    label: "账户余额(元)",
    minWidth: 100,
  },
  {
    prop: "availableBalance",
    type: "",
    label: "账户可用余额(元)",
    minWidth: 120,
  },
  {
    prop: "freezeBalance",
    type: "",
    label: "账户冻结金额(元)",
    minWidth: 120,
  },
  {
    prop: "withdrawalMode",
    type: "",
    label: "提现方式",
    minWidth: 100,
    formatterName: "checkMode",
  },
  {
    prop: "pan",
    type: "",
    label: "银行卡号",
    minWidth: 120,
  },
  {
    prop: "bankName",
    type: "",
    label: "开户行",
    minWidth: 120,
  },
  // {
  //   prop: "bankBranchName",
  //   type: "",
  //   label: "开户分行",
  //   minWidth: 120
  // },
  {
    prop: "driverStatus",
    type: "",
    label: "状态",
    minWidth: 80,
    formatterName: "checkStatus",
  },
];

export const validNumber = (rule, val, callback) => {
  const reg = /(^[0-9]+$)|(^[0-9]*\.[0-9]{1,2}$)/;
  if (!reg.test(val)) {
    callback(new Error("请输入正确得数字,并最多保留两位小数"));
  } else if (!val || val >= 1000000) {
    callback(new Error("只能输入100万以内的金额数"));
  } else {
    callback();
  }
};

export const validRemark = (rule, val, callback) => {
  const reg = /^[\u4e00-\u9fa5]{0,20}$/;
  if (!reg.test(val)) {
    callback(new Error("请输入中文"));
  } else {
    callback();
  }
};

export const rules = {
  freezeAmt: [{ required: true, message: "请输入冻结金额", trigger: "blur" }, { validator: validNumber, trigger: "blur" }],
  remark: [{ validator: validRemark, trigger: "blur" }],
  pan: [{ required: true, message: "请输入银行卡号", trigger: "blur" }],
  bankName: [{ required: true, message: "请输入开户行", trigger: "blur" }],
  driverMobile: [{ required: true, message: "请输入银行预留手机号", trigger: "blur" }],
  offlineFreezeAmt: [{ required: true, message: "请输入冻结金额", trigger: "blur" }, { validator: validNumber, trigger: "blur" }],
};

export const driverTypeList = [
  { label: "在职", value: "1" },
  { label: "离职", value: "0" },
];

export const withdrawalMode = [
  { label: "银行卡", value: 0 },
];

export const typeList = [
  {
    label: "出租车收入", value: 62,
  },
  {
    label: "取消费", value: 64,
  },  
  {
    label: "退款", value: 66,
  },
  {
    label: "提现", value: 67,
  },
  {
    label: "聚合支付", value: 70,
  },    
  {
    label: "出租车收入", value: 86,
  },
  {
    label: "线下收现扣减", value: 123
  },
  {
    label: "司机权益奖励增加", value: 125
  },
  {
    label: "司机权益奖励扣减", value: 126
  },  
  {
    label: "提现", value: 128
  },   
  {
    label: "网约车收入", value: 129
  },
  {
    label: "司机抽佣调整", value: 167
  },  
  {
    label: "出租车奖励", value: 87
  }
];

export const withdrawalStatus = {
  1: "初始化",
  2: "审核中",
  3: "审核通过",
  4: "审核不通过",
  5: "付款中",
  6: "付款成功",
  7: "付款失败",
  8: "提现成功(已对账)",
  9: "提现失败(已对账)",
};

const PAGE_SIZE = 20;
export const PAGE_PARAMS = {
  currPage: 1,
  pageSize: PAGE_SIZE,
  totalCount: 0,
};
