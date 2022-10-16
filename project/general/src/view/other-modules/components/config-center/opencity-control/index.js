/*
 * @Author: NapierPLUS
 * @Date: 2021-10-19 14:41:15
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-10-20 17:04:03
 * @Description:
 */
export const addRules =  {
  levelType: [
    { required: true, message: "请选择行政区类型" }
  ],
  selectedCityL: [
    { required: true, message: "请选择城市" }
  ],
  areaCode: [
    { required: true, message: "请选择区县" }
  ],
  expandBizLine: [
    { required: true, message: "请选择业务线" }
  ]
}