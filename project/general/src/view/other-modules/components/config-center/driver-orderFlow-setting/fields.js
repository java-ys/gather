import { mapToList } from "@/libs/util.js";

export const operationMap = {
  2: "UP司机"
}
export const operationList = mapToList(operationMap);

export const productMap = {
  1: "出租车",
  2: "专享",
  4: "快享"
}

export const productList = mapToList(productMap);

export const statusMap = {
  0: "初始",
  1: "启用",
  2: "停用"
}

export const statusList = mapToList(statusMap);

export const handleTypeMap = {
  1: {
    title: "新增规则"
  },
  2: {
    title: "编辑规则"
  },
  3: {
    title: "规则详情"
  }
};

export const inputList = [
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceCode", "cityCode"], // 返回数据的key名
    placeholder: "请选择",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "城市：",
    changeOnSelect: false,
    clearable: false
  },
  {
    name: 'drop-input',
    bind_key: 'agentUuid',
    placeholder: '请选择',
    value: '',
    dropList: [],
    filterable: true,
    clearable: true,
    multiple: true,
    title: '运营商：'
  },
  {
    name: 'drop-input',
    title: '司机类型：',
    value: '',
    bind_key: 'operationType',
    filterable: true,
    clearable: true,
    multiple: true,
    dropList: operationList
  },
  {
    name: 'drop-input',
    title: '产品线：',
    value: '',
    bind_key: 'driverType',
    placeholder: '请选择',
    filterable: true,
    clearable: true,
    multiple: true,
    dropList: []
  },
  {
    name: 'drop-input',
    title: '司机工资类别：',
    titleWidth: 100,
    value: '',
    bind_key: 'salaryTypeCode',
    placeholder: '请选择',
    filterable: true,
    clearable: true,
    multiple: true,
    dropList: []
  },
  {
    name: 'drop-input',
    title: '状态：',
    value: '',
    bind_key: 'confStatus',
    placeholder: '请选择',
    dropList: statusList
  }
]

export const tableColumns = that => {  
  return [
    {
      title: "序号",
      key: "seqNum",
      tooltip: true,
      minWidth: 150
    },  
    {
      title: "城市",
      key: "cityName",
      tooltip: true,
      minWidth: 150
    },
    {
      title: "运营商",
      key: "agentNameStr",
      tooltip: true,
      minWidth: 150
    },
    {
      title: "产品线",
      key: "driverType",
      tooltip: true,
      minWidth: 150,
      render: (h, params) => {
        let res = params.row.driverType.split(",");
        let driverTypeName = "";
        res.forEach(e => {
          driverTypeName += (that.bizTypeList.find(it => it.value === Number(e)) || {}).label+ " ";
        });
        return h("div", driverTypeName);
      }
    },  
    {
      title: "司机类型",
      key: "operationType",
      tooltip: true,
      minWidth: 150,
      render: (h, params) => {
        return h("div", operationMap[params.row.operationType])
      }
    },
    {
      title: "司机工资类别",
      key: "salaryTypeName",
      tooltip: true,
      minWidth: 150
    },
    {
      title: "是否展示预估收入",
      key: "isShowEstimate",
      tooltip: true,
      minWidth: 150,
      render: (h, params) => {
        let estimate = params.row.isShowEstimate == 0 ? "否" : "是";
        return h("div", estimate)
      }
    },
    {
      title: "说明",
      key: "confDesc",
      tooltip: true,
      minWidth: 150,
    },  
    {
      title: "状态",
      key: "confStatus",
      tooltip: true,
      minWidth: 150,
      render: (h, params) => {
        return h("div", statusMap[params.row.confStatus])
      }
    },
    {
      title: '操作',
      key: 'action',
      tooltip: true,
      minWidth: 300,
      slot:'action'
    }
  ]
}