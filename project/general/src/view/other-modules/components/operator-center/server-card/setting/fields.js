import { mapToList } from "@/libs/util.js";
import { orderTypeMap,getBusinessLine } from "_g/config/status-map";

export const orderTypeList = mapToList(orderTypeMap);
export const businessLine = [4,2,1]
export const statusMap = {
  1: "生效中",
  2: "已失效",
  0: "未生效"
};
export const statusList = mapToList(statusMap);

export const businessLineInfo = getBusinessLine(businessLine)

export const inputList = [
  {
    name: "text-input",
    bind_key: "scName",
    placeholder: "请输入",
    value: "",
    title: "服务卡名称：",
    titleWidth: 80,
    maxlength:20
  },
  {
    name: "drop-input",
    bind_key: "cityCode",
    value: [],
    dropList: [],
    title: "城市",
    placeholder: "请选择",
    multiple: true,
    titleWidth: 40,
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: "plType",
    value: [],
    dropList: [
      {
        value: '111111',
        label: '全部'
      },
      ...businessLineInfo.list
    ],
    title: "产品线",
    placeholder: "请选择",
    multiple: true,
    titleWidth: 50,
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: "scStatus",
    value: "",
    dropList: statusList,
    title: "状态",
    placeholder: "请选择",
    titleWidth: 40
  }
];
export const parColumns = that => {
  return [
    {
      title: "序号",
      type: "index",
      width: 80,
      align: "center"
    },
    {
      title: "生效时间",
      key: "effectiveTime",
      minWidth: 180,
      render: (h, { row }) => {
        return h("div", `${row.startTimeEtsc}——${row.endTimeEtsc}`);
      }
    },
    {
      title: "服务卡名称",
      key: "scName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "城市",
      key: "cityName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    
    {
      title: "产品线",
      key: "plType",
      minWidth: 90,
      render: (h, { row }) => {
        let res = ''
        let plTypeArr = row.plType.split(',')
        if(plTypeArr[0]==='111111'){
          res = '全部'
        }else{
          res = plTypeArr.map(item=>businessLineInfo.map[item]).join(',')
        }
        return h("div", res);
      }
    },
    {
      title: "状态",
      key: "scStatus",
      minWidth: 90,
      render: (h, { row }) => {
        return h("div", statusMap[row.scStatus]);
      }
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      width: 210,
      slot: "action"
    }
  ];
};
