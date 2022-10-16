let inputList = [
  {
    name: "text-input",
    bind_key: "userSubgroupName",
    placeholder: "请输入分组名称",
    value: "",
    title: "分组名称：",
    maxlength:50,
    titleWidth: 90,
    inputWidth: 180
  },
  {
    name: "text-input",
    bind_key: "sceneGroupName",
    placeholder: "请输入场景名称",
    value: "",
    title: "分组场景名称",
    maxlength:50,
    titleWidth: 90,
    inputWidth: 180
  },
  {
    name: "text-input",
    bind_key: "userGroupName",
    placeholder: "请输入用户群名称",
    value: "",
    title: "用户群名称：",
    titleWidth: 90,
    maxlength:50,
    inputWidth: 180
  },
  {
    name: "text-input",
    bind_key: "createName",
    placeholder: "请输入创建人",
    value: "",
    title: "创建人：",
    maxlength:50,
    titleWidth: 90,
    inputWidth: 180
  },
  {
    name: "text-input",
    bind_key: "userSubgroupFlag",
    placeholder: "请输入分组标识",
    value: "",
    title: "分组标识",
    maxlength:50,
    titleWidth: 90,
    inputWidth: 180
  },
  {
    name: "text-input",
    bind_key: "sceneGroupCode",
    placeholder: "请输入场景编码",
    value: "",
    title: "分组场景编码：",
    titleWidth: 90,
    maxlength:50,
    inputWidth: 180
  },
  {
    name: "text-input",
    bind_key: "userGroupCode",
    placeholder: "请输入用户群编码",
    value: "",
    title: "用户群编码：",
    maxlength:50,
    titleWidth: 90,
    inputWidth: 180
  },
  // {
  //   name: "drop-input", // 文本输入框名
  //   bind_key: "userGroupType", // 返回数据的key名
  //   placeholder: "请选择",
  //   value: "", // 用于数据绑定
  //   title: "用户群类型：", // 展示的字段名
  //   dropList: typeList,
  //   titleWidth: 80, // 展示的字段名的宽度
  //   inputWidth: 120
  // },
];

// tableb表头信息
let parColumns = [
  {
    type: "selection",
    width: 50,
    align: "center"
  },
  {
    title: "分组标识",
    key: "userSubgroupFlag",
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
  {
    title: "分组名称",
    key: "userSubgroupName",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "分组比例",
    key: "userSubgroupRatio",
    ellipsis: true,
    tooltip: true,
    minWidth: 80,
  },
  {
    title: "分组场景名称",
    key: "sceneGroupName",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "分组场景编码",
    key: "sceneGroupCode",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "用户群名称",
    key: "userGroupName",
    ellipsis: true,
    tooltip: true,
    minWidth: 100,
  },
  {
    title: "用户群编码",
    key: "userGroupCode",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "创建人",
    key: "createName",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "创建时间",
    key: "createTime",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  
];

export const cacheData = {
  inputList,
  pageObj: {
    total: 100,
    current: 1,
    pageSize: 10
  },
  searchData: {},
  parColumns,
  tableData: [],
  selectedList: []
};


// 选择新用户群
export const userGroupColumns = (that, formDisable) => {
  return [
    {
      title: "用户群名称",
      key: "userGroupName"
    },
    {
      title: "用户群编码",
      key: "userGroupCode"
    },
    {
      title: "是否动态更新",
      key: "dynamicUpdate",
      render: (h, params) => {
        return h("div", params.row.dynamicUpdate === 1 ? "是" : "否");
      }
    },
    {
      title: "用户群人数",
      key: "userGroupCount"
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (h, params) => {
        if (formDisable) return null
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "text",
                size: "small",
              },
              style: {
                color: "#57a3f3"
              },
              on: {
                click: () => {
                    that.deleteTableUserGroup(params.index)
                }
              }
            },
            "删除"
          )
        ]);
      }
    }
  ];
};


// 选择任务
export const taskColumns = (_this) => {
  return [
    {
      title: "ID",
      key: "taskId",
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    {
      title: "任务名称",
      key: "taskName",
      ellipsis: true,
      tooltip: true,
      minWidth: 100
    },
    {
      title: "任务简介",
      key: "taskDes",
      ellipsis: true,
      tooltip: true,
      minWidth: 100
    },
    {
      title: "适用城市",
      key: "city",
      ellipsis: true,
      tooltip: true,
      minWidth: 100
    },
    {
      title: "开始时间",
      key: "startTime",
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      render(h, { row }) {
        return <span>{_this.$moment(row.startTime).format("YYYY-MM-DD HH:mm:ss")}</span>
      }
    },
    {
      title: "结束时间",
      key: "endTime",
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      render(h, { row }) {
        return <span>{_this.$moment(row.endTime).format("YYYY-MM-DD HH:mm:ss")}</span>
      }
    },
  ]; // 用户群标题
};
