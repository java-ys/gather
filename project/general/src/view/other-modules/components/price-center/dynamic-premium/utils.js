import moment from "moment";
import { Modal, message } from "ant-design-vue"

/** 日期格式化: "1911-11-11 11:11:11" */
export const DATE_FORMAT__YYYYMMMDD_HHMMSS = "YYYY-MM-DD HH:mm:ss"
export const formatDateToString = (date, format) => moment(date).format(format)
export const yyyyMMDDHHmmss = date => formatDateToString(date, DATE_FORMAT__YYYYMMMDD_HHMMSS)
export const callConfirm = Modal.confirm
export const callErrorMsg = message.error
