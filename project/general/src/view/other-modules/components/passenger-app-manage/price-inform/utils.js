/*
 * @Author: NapierPLUS
 * @Date: 2022-02-25 09:45:01
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-02-25 10:54:44
 * @Description:
 */
import moment from "moment";
import { Modal, message } from "ant-design-vue"

/** 日期格式化: "1911-11-11 11:11:11" */
export const DATE_FORMAT__YYYYMMMDD_HHMMSS = "YYYY-MM-DD HH:mm:ss"
export const formatDateToString = (date, format) => moment(date).format(format)
export const yyyyMMDDHHmmss = date => formatDateToString(date, DATE_FORMAT__YYYYMMMDD_HHMMSS)
export const callConfirm = Modal.confirm
export const callErrorMsg = message.error


export const getBLen = (s) => {
  // 把双字节的替换成两个单字节的然后再获得长度
  let str = s
  if (str == null) return 0;
  if (typeof str !== "string") {
    str = String(str);
  }
  return str.replace(/[^\x00-\xff]/g, "01").length;
};