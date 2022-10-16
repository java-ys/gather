import { Button } from "ant-design-vue";

export const assignTypeMap = [
  {
    label: "系统指派",
    value: 1
  },
  {
    label: "人工指派",
    value: 2
  }
];

export const assignResultMap = [
  {
    label: "成功",
    value: 1
  },
  {
    label: "失败",
    value: 0
  }
];

export const inputList = _this => [
  {
    name: "drop-input",
    bind_key: "assignType",
    value: "",
    dropList: assignTypeMap,
    title: "指派类型",
    titleWidth: 90
  },
  {
    name: "drop-input",
    title: "工单类型",
    bind_key: "woType",
    dropList: [],
    titleWidth: 90,
    value: "",
    filterable: true
  },
  {
    name: "text-input",
    bind_key: "woCode",
    title: "工单编号",
    placeholder: "请输入",
    titleWidth: 90,
    value: ""
  },
  {
    name: "drop-input",
    bind_key: "optResult",
    value: "",
    dropList: assignResultMap,
    title: "指派状态",
    titleWidth: 90
  },
  {
    name: "date-time-input",
    title: "指派时间",
    bind_key: ["startTime", "endTime"],
    placeholder: "请选择",
    titleWidth: 90,
    inputWidth: 260,
    value: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 10);
      return [d, new Date()];
    })(),
  }
];

export const tableColumn = _this => [
  {
    title: "指派类型",
    key: "woType",
    minWidth: 86,
    render: (h, { row: { assignType } }) => {
      const text = assignTypeMap.find(item => item.value === assignType).label;
      return <span>{text}</span>;
    }
  },
  {
    title: "工单类型",
    key: "woType",
    minWidth: 86,
    render: (h, { row: { woType } }) => {
      const text = _this.categoryMap.find(item => item.value === woType).label;
      return <span>{text}</span>;
    }
  },
  {
    title: "工单编号",
    key: "woCode",
    minWidth: 250,
    render: (h, { row }) => {
      return (
        <span style="color: #2d8cf0; cursor: pointer;" onClick={() => _this.onNavOrderDetail(row)}>
          {row.woCode}
        </span>
      );
    }
  },
  {
    title: "操作时间",
    key: "updateTime",
    minWidth: 160
  },
  {
    title: "指派对象",
    key: "userName",
    minWidth: 86
  },
  {
    title: "指派状态",
    key: "optResult",
    minWidth: 86,
    render: (h, { row: { optResult } }) => {
      const text = assignResultMap.find(item => item.value === optResult).label;
      return <span>{text}</span>;
    }
  },
  {
    title: "操作人",
    key: "optUserName",
    minWidth: 74
  }
];
