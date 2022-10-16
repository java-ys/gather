/*
 * @Author: NapierPLUS
 * @Date: 2021-08-24 15:01:38
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-08-26 18:05:59
 * @Description: 
 */
const auditOptionList = [
    // 1-待审核; 2-审核通过; 3-审核驳回;
    { 0: "待审核" },
    { 1: "审核通过" },
    { 2: "审核驳回" },
  ]
export const tableTitle = that => {
  return [
    // {
    //   title: "提交报名时间",
    //   key: "operateTime",
    //   ellipsis: true,
    //   width: 200
    // },
    {
      title: "操作",
      key: "bizStatus",
      ellipsis: true,
      width: 140,
      render: (h, params) => {
        let k = {};
        auditOptionList.forEach(it => {
          k = { ...k, ...it };
        });
        return h("span", k[Number(params.row.bizStatus)]);
      }
    },
    {
      title: "车牌号",
      key: "plateNum",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "操作时间",
      key: "operateTime",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "操作人",
      key: "auditUser",
      tooltip: true,
      minWidth: 120
    },
    {
      title: "备注",
      key: "remark",
      tooltip: true,
      minWidth: 120
    },
  ];
};
