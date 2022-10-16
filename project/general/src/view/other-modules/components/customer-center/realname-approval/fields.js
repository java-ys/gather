import { mapToList } from "@/libs/util.js";

export const auditsMap = {
  1: "待审核",
  2: "审核通过",
  3: "审核不通过"
};
export const auditList = mapToList(auditsMap);

export const cardMap = {
  0: '其他',
  3: '港澳居民来往内地通行证',
  4: '台湾居民来往大陆通行证',
  5: '护照',
  6: '外国人永久居留身份证'
}
export const cardList = mapToList(cardMap);

export const reasonMap = {
  1: '证件模糊',
  2: '证件无效',
  3: '非证件信息',
  4: '手持证件微露脸',
  5: '证件关键信息不全',
  6: '证件信息与账户信息不符',
  7: '其他原因'
}
export const reasonList = mapToList(reasonMap);
export const inputList = [
  {
    name: "text-input",
    bind_key: "passengerMobile",
    value: "",
    maxlength: 40,
    titleWidth: 80,
    title: "乘客手机号"
  },
  {
    name: "text-input",
    bind_key: "certifiedName",
    value: "",
    maxlength: 60,
    titleWidth: 80,
    title: "乘客姓名"
  },
  {
    name: 'date-time-input',
    bind_key: ['submitStartTime' ,'submitEndTime'],
    placeholder: '请选择提交认证时间',
    value: [],
    title: '提交认证时间: ',
    titleWidth: 80,
    inputWidth: 260,
    titleWidth: 90
  },
  {
    name: "drop-input",
    bind_key: "certificateType",
    placeholder: '请选择证件类型',
    value: "",
    dropList: cardList,
    title: "证件类型",
    titleWidth: 80,
  },
  {
    name: "text-input",
    bind_key: "certifiedNumber",
    value: "",
    maxlength: 30,
    titleWidth: 80,
    title: "证件号码"
  },
  {
    name: "drop-input",
    bind_key: "reviewStatus",
    placeholder: '请选择审核状态',
    value: 1,
    dropList: auditList,
    titleWidth: 80,
    title: "审核状态",
  }
];
export const parColumns = that => {
  return [
    {
      title: "乘客手机号",
      key: "passengerMobile",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "乘客姓名",
      key: "certifiedName",
      tooltip: true,
      minWidth: 140,
    },
    {
      title: "证件类型",
      key: "certificateType",
      tooltip: true,
      minWidth: 160,
      render: (h, params) => {
        return h("div", cardMap[params.row.certificateType]);
      }
    },
    {
      title: "证件号码",
      key: "certifiedNumber",
      tooltip: true,
      ellipsis: true,
      minWidth: 140
    },
    {
      title: "审核状态",
      key: "reviewStatus",
      tooltip: true,
      minWidth: 90,
      render: (h, params) => {
        return h("div", auditsMap[params.row.reviewStatus]);
      }
    },
    {
      title: "审核不通过原因",
      key: "reason",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "提交认证时间",
      key: "submitTime",
      tooltip: true,
      minWidth: 170
    },
    {
      title: "审核人",
      key: "reviewPerson",
      tooltip: true,
      minWidth: 120
    },
    {
      title: "审核时间",
      key: "reviewTime",
      tooltip: true,
      minWidth: 170
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      width: 260,
      slot: "action"
    }
  ];
};
