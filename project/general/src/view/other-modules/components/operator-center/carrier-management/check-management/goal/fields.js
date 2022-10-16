import {operateTypeEnum, productLineEnum} from "@/config";
import { getDirectives } from "@/mixins/base";

export const inputList = [

  {
    name: "drop-input",
    bind_key: "cityCodeList",
    placeholder: "请选择城市",
    value: "",
    dropList: [],
    multiple: true,
    filterable: true,
    title: "城市：",
    titleWidth: 100,
  },
  {
    name: "drop-input",
    title: "运营商：",
    dropList: [],
    bind_key: "agentUuidList",
    value: "",
    multiple: true,
    filterable: true,
    titleWidth: 100,
  },
  {
    name: "drop-input",
    title: "考核指标：",
    titleWidth: 100,
    filterable: true,
    multiple: true,
    value: "",
    bind_key: "indexUuidList",
    dropList: []
  },
  {
    name: "month-input",
    bind_key: "assessTimeList",
    placeholder: "请选择月份",
    multiple: true,
    value: [],
    title: "考核月份：",
    titleWidth: 100,
    // options: {
    //   // 只能选择小于当前月
    //   disabledDate: date => {
    //     const [, , nowDay] = timeFormat(+new Date(), "yyyy-MM-dd").split("-");
    //     return date && date.valueOf() > Date.now() - nowDay * 24 * 3600 * 1000;
    //   }
    // }
  },
  {
    name: "drop-input",
    title: "运营模式：",
    titleWidth: 100,
    filterable: true,
    multiple: true,
    value: "",
    bind_key: "operateTypeList",
    dropList: operateTypeEnum
  },
  {
    name: "drop-input",
    title: "产品线：",
    titleWidth: 100,
    filterable: true,
    multiple: true,
    value: "",
    bind_key: "businessTypeList",
    dropList: productLineEnum
  },
];

export const tableColumns = _this => {
  return [
    // {
    //   title: '序号',
    //   key: 'index',
    //   width: 70,
    //   render(h, params) {
    //     return h('span', {}, (_this.tableConfig.current - 1) * _this.tableConfig.pageSize + params.index + 1);
    //   }
    // },
    // {
    //   type: "selection",
    //   align: "center",
    //   width: 80
    // },
    // {
    //   title: "申请单编号",
    //   key: "bizCode",
    //   tooltip: true,
    //   minWidth: 220,
    //   render(h, { row }) {
    //     return (<span style={"color: #2d8cf0; cursor: pointer"} onClick={() => _this.rowClickHandle(row)}>{row.bizCode}</span>)
    //   }
    //   },
    {
      title: "城市",
      key: "cityName",
      minWidth: 160
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 160
    },
    {
      title: "考核月份",
      key: "assessTime",
      minWidth: 200
    },
    {
      title: "运营模式",
      key: "operateType",
      minWidth: 160,
      render: (h, {row}) => {
        let tList = row.operateType.split(",");
        return (<span>{tList.map(v=> {
          let f = operateTypeEnum.find(t => `${t.value}` === `${v}`)
          return f ? f.label : ''
        }).filter(Boolean).join(", ")}</span>)
      }
    },
    {
      title: "产品线",
      key: "businessType",
      minWidth: 160,
      render: (h, {row}) => {
        let tList = (`${row.businessType}`).split(",");
        return (<span>{tList.map(v => {
          let f = productLineEnum.find(t => `${t.value}` === `${v}`)
          return f ? f.label : ''
        }).filter(Boolean).join(", ")}</span>)
      }
    },
    {
      title: "目标值",
      key: "assessTarget",
      minWidth: 120
    },
    {
      title: "操作",
      key: "action",
      minWidth: 120,
      fixed: "right",
      render: (h, {row}) => {
        let types = row.taskStatus - 1 === 0 ? "error" : "success"
        let t = {props: {type: types}};
        return (
          <Row type="flex">

            <Col>
              <Button
                type="info"
                ghost
                size="small"
                {...getDirectives('check-goal-edit')}
                onClick={() => _this.openEdit (row)}
              >
                编辑
              </Button>
            </Col>
            <Col offset="1">
              <Button
                type="error"
                ghost
                size="small"
                {...getDirectives('check-goal-delete')}
                onClick={() => _this.deleteRow (row)}
              >
                删除
              </Button>
            </Col>
          </Row>
        );
      },
    }
  ];
};

export const addFormRule = {
  cityCodeList: [{required: true, message: '请选择城市', type: 'array'}],
  operateType: [{required: true, message: '请选择运营模式'}],
  agentUuid: [{required: true, message: '请选择运营商'}],
  businessType: [{required: true, message: '请选择产品线'}],
  indexUuid: [{required: true, message: '请选择指标名称'}],
  assessTime: [{required: true, message: '请选择考核月份'}],
  assessTarget: [{required: true, message: '请输入目标设定'}],
}

export const importFormRule = {
  indexUuid: [{required: true, message: '请选择指标名称'}],
  assessTime: [{required: true, message: '请选择考核月份'}],
  operateType: [{required: true, message: '请选择运营模式'}],
  businessType: [{required: true, message: '请选择产品线'}],
}


export const importColumn = [
  {
    title: "序号",
    key: "rowNum",
    width: 80
  },
  {
    title: "运营商名称",
    key: "agentName",
    minWidth: 160
  },
  {
    title: "目标值",
    key: "assessTarget",
    minWidth: 160
  }
]
