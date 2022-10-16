
// 百分比数字校验
function validNumber(rule, val, callback) {
  let reg = /^\d\.([0-9]{1,2}|[0-9][1-9])$|^[0-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/;
  if (!reg.test(val)) {
    callback(new Error("请输入大于等于0的数,最大三位整数,可保留2位小数"));
  } else if (!val || val > 9999999.99) {
    callback(new Error("请输入大于等于0的数,最大三位整数,可保留2位小数"));
  } else {
    callback();
  }
}

export const addRules = {
  cityCode: [{ required: true, message: "请选择城市", trigger: "blur" }],
  operationType: [{ required: true, message: "请选择运营商", trigger: "change" }],
  driverSalaryType: [{ required: true, message: "请选择司机类型", trigger: "change" }],
  taxProportion: [{ required: true, message: "请输入个税比例", trigger: "blur" }, { validator: validNumber, trigger: "blur" }],
  effectiveStartTime: [{ required: true, message: "请选择生效起始周", trigger: "blur" }],
  effectiveEndTime: [{ required: true, message: "请选择生效结束周", trigger: "blur" }]
};

const PAGE_SIZE = 20;
export const PAGE_PARAMS = {
  currPage: 1,
  pageSize: PAGE_SIZE,
  totalCount: 0
}
