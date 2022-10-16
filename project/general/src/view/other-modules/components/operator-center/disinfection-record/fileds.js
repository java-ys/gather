/**
 * @author roy
 * @date 2021-01-25 16:42:20
 * @description: 消毒记录管理配置-司机侧新增单单消毒功能
*/

import moment from "moment";
import { DisinfectionRecordKeyMap } from "_o/components/operator-center/disinfection-record/mapping";

// 搜索条件数据
export const inputList = [
  {
    name: "drop-input",
    bind_key: "cityCode",
    placeholder: "请选择城市",
    dropList: [],
    title: "城市",
    titleWidth: 90,
  },
  {
    name: "text-input",
    title: "运营商",
    bind_key: DisinfectionRecordKeyMap.operator,
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "司机Code",
    bind_key: DisinfectionRecordKeyMap.driverCode,
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "司机姓名",
    bind_key: DisinfectionRecordKeyMap.driverName,
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "司机手机号",
    bind_key: DisinfectionRecordKeyMap.driverMobile,
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "车牌号",
    bind_key: DisinfectionRecordKeyMap.numberPlate,
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "关联订单编号",
    bind_key: DisinfectionRecordKeyMap.orderNumber,
    titleWidth: 90,
    value: "",
  },
  { name: "extendInput", title: "" },
]

// 表格列数据
export const tableColumns = (_this) => {
  return [
    {
      title: "城市",
      key: DisinfectionRecordKeyMap.cityName,
      minWidth: 180,
      // type: "selection"
    },
    {
      title: "运营商",
      key: DisinfectionRecordKeyMap.operator,
      minWidth: 180,
    },
    {
      title: "司机Code",
      key: DisinfectionRecordKeyMap.driverCode,
      minWidth: 200,
    },
    {
      title: "司机姓名",
      key: DisinfectionRecordKeyMap.driverName,
      minWidth: 150,
    },
    {
      title: "司机手机号",
      key: DisinfectionRecordKeyMap.driverMobile,
      width: 150,
    },
    {
      title: "车牌号",
      key: DisinfectionRecordKeyMap.numberPlate,
      minWidth: 120,
    },
    {
      title: "关联订单编号",
      key: DisinfectionRecordKeyMap.orderNumber,
      minWidth: 200,
    },
    {
      title: "消毒时间",
      key: DisinfectionRecordKeyMap.disinfectionTime,
      minWidth: 180,
      render: (h, params) => {
        return h("span", formatTime(params.row[DisinfectionRecordKeyMap.disinfectionTime]));
      }
    },
  ]
}
export const formatTime = (v, str = "YYYY-MM-DD HH:mm:ss") => {
  if (!v) return "";
  let time = moment(v).format(str);
  return time === "Invalid date" ? "" : time;
}
