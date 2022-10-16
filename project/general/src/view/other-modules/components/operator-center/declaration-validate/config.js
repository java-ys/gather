/*
 * @Author: NapierPLUS
 * @Date: 2021-06-24 11:03:06
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-06-25 13:37:03
 * @Description:config
 */
export const parColumns = _this => [
  {
    title: "表名称",
    key: "excelName",
    ellipsis: true,
    tooltip: true,
    minWidth: 140
  },
  {
    title: "行数",
    key: "errorLineCount",
    ellipsis: true,
    tooltip: true,
    minWidth: 140
  },
  {
    title: "错误描述",
    key: "message",
    ellipsis: true,
    tooltip: true,
    minWidth: 500
  }
];