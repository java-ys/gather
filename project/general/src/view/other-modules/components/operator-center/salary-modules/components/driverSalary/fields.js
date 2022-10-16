// A模式周收入查询 - 税前补发补扣导入
// UP模式周收入查询 - 税前补发补扣导入
// 月工资查询 - 税前补发补扣导入
export const modeApreTaxColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机ID", prop: "driverCode", minWidth: 60 },
  { label: "身份证号", prop: "driverIdentityCard", minWidth: 60 },
  { label: "城市", prop: "cityName", minWidth: 60 },
  { label: "奖励周/月", prop: "weekOrMonth", minWidth: 60 },
  { label: "年份", prop: "year", minWidth: 60 },
  // { label: "税前补发补扣金额(元)", prop: "repairAmount", minWidth: 60 },
  { label: "事项说明", prop: "itemName", minWidth: 80 },
  { label: "失败原因", prop: "remark", minWidth: 80 },
  { slot: "action", minWidth: 80 }
];

// A模式周收入查询 - 税后补发补扣
// UP模式周收入查询 - 税后补发补扣
// 月工资查询 - 税后补发补扣导入
export const modeAafterTaxColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机ID", prop: "driverCode", minWidth: 60 },
  { label: "身份证号", prop: "driverIdentityCard", minWidth: 60 },
  { label: "城市", prop: "cityName", minWidth: 60 },
  { label: "奖励周/月", prop: "weekOrMonth", minWidth: 60 },
  { label: "年份", prop: "year", minWidth: 60 },
  { label: "税后补发补扣金额(元)", prop: "repairAmount", minWidth: 60 },
  { label: "事项说明", prop: "itemName", minWidth: 80 },
  { label: "失败原因", prop: "remark", minWidth: 80 },
  { slot: "action", minWidth: 80 }
];

// A模式周收入查询 - 个税社保导入
export const modeAperTaxColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机ID", prop: "driverCode", minWidth: 60 },
  { label: "身份证号", prop: "driverIdentityCard", minWidth: 60 },
  { label: "城市", prop: "cityName", minWidth: 60 },
  { label: "奖励周/月", prop: "weekOrMonth", minWidth: 60 },
  { label: "年份", prop: "year", minWidth: 60 },
  { label: "代扣个税(元)", prop: "taxAmount", minWidth: 60 },
  { label: "社保扣款(元)", prop: "socialInsuranceAmount", minWidth: 80 },
  { label: "社保所属期", prop: "periodOfSocialSecurity", minWidth: 80 },
  { label: "失败原因", prop: "remark", minWidth: 80 },
  { slot: "action", minWidth: 80 }
];

// A模式周收入查询 - 周收入是否导入核算
// 月工资查询 - 周收入是否导入核算
export const modeAAccountTaxColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机ID", prop: "driverCode", minWidth: 60 },
  { label: "身份证号", prop: "driverIdentityCard", minWidth: 60 },
  { label: "城市", prop: "cityName", minWidth: 60 },
  { label: "奖励周/月", prop: "weekOrMonth", minWidth: 60 },
  { label: "年份", prop: "year", minWidth: 60 },
  { label: "是否核算", prop: "salaryAuditFlag", minWidth: 80, slot: "salaryAuditFlag" },
  { label: "失败原因", prop: "remark", minWidth: 80 },
  { slot: "action", minWidth: 80 }
];

// UP模式周收入查询 - 周收入发放结果导入
export const modeUPperTaxColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机ID", prop: "driverCode", minWidth: 60 },
  { label: "身份证号", prop: "driverIdentityCard", minWidth: 60 },
  { label: "城市", prop: "cityName", minWidth: 60 },
  { label: "奖励周/月", prop: "weekOrMonth", minWidth: 60 },
  { label: "年份", prop: "year", minWidth: 60 },
  { label: "发放结果", prop: "salaryStatus", minWidth: 80, slot: "salaryStatus" },
  { label: "失败原因", prop: "remark", minWidth: 80 },
  { slot: "action", minWidth: 80 }
];

// // 月工资查询 - 个税社保导入
export const monthPerTaxColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机ID", prop: "driverCode", minWidth: 60 },
  { label: "身份证号", prop: "driverCardId", minWidth: 60 },
  { label: "城市", prop: "cityName", minWidth: 60 },
  { label: "薪酬月份", prop: "weekOrMonth", minWidth: 60 },
  { label: "年份", prop: "year", minWidth: 60 },
  { label: "代扣个税(元)", prop: "", minWidth: 80 },
  { label: "社保扣款(元)", prop: "", minWidth: 80 },
  { label: "社保所属期", prop: "", minWidth: 80 },
  { slot: "action", minWidth: 80 }
];
