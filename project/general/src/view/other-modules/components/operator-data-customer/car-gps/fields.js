/*
 * @Author: NapierPLUS
 * @Date: 2021-09-22 16:49:32
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-09-22 17:16:20
 * @Description: 
 */
// 搜索配置
export const inputList = [
  // {
  //   name: "drop-input",
  //   bind_key: "flag",
  //   value: 0,
  //   dropList: [{ label: "手机", value: 0 }, { label: "车机", value: 1 }],
  //   title: "设备类型"
  // },
  // {
  //   name: "text-input",
  //   bind_key: "vin",
  //   placeholder: "请输入VIN",
  //   value: "",
  //   title: "VIN：",
  //   titleWidth: 40
  // },
  {
    name: "text-input",
    bind_key: "plateNum",
    placeholder: "请输入车牌号",
    value: "",
    title: "车牌号：",
    disabled: true,
  },
  {
    name: "date-time-input", // 文本输入框名
    bind_key: ['startTime','endTime'], // 返回数据的key名
    placeholder: "请选择时间范围",
    value: "", // 用于数据绑定
    title: "时间段：", // 展示的字段名
    inputWidth: 300, // input框的宽度
    options: {}
  },
]
