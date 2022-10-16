export const statusMap = {
  0: "关闭",
  1: "开启"
}
export const statusList = [
  {
    value: 1,
    label: "开启"
  },
  {
    value: 0,
    label: "关闭"
  }
]

export const inputList = [
  {
    name: "text-input",
    bind_key: "menuName",
    value: "",
    placeholder: "请输入菜单名称",
    title: "菜单名称"
  },
  {
    name: "drop-input", // 下拉
    bind_key: "status",
    value: "",
    dropList: statusList,
    title: "菜单状态",
    placeholder: "请选择菜单状态",
    clearable: true,
    inputWidth:150,
    isHide: false
  }
]
export const parColumns = (that) => {
  return [
    {
      title: "菜单名称",
      key: "menuName",
      fixed: "left",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "链接地址",
      key: "menuUrl",
      tooltip: true,
      ellipsis: true,
      minWidth: 170
    },
    {
      title: "菜单状态",
      key: "status",
      minWidth: 100,
      render: (h, params) => {
        return h("div", statusMap[params.row.status])
      }
    },
    {
      title: "权重",
      key: "priority",
      tooltip: true,
      ellipsis: true,
      minWidth: 90
    },
    {
      title: '图标',
      key: 'menuIcon',
      tooltip: true,
      ellipsis: true,
      minWidth: 80,
      align: 'center',
      render: (h, params) => {
        if(params.row.menuIcon){
          return h('img', {
            attrs: {
              src: params.row.menuIcon
            },
            class: {
              tableImg: true
            }
          })
        } else {
          return h('p','无')
        }
        
      }
    },
    {
      title: "更新时间",
      key: "updateTime",
      tooltip: true,
      ellipsis: true,
      sortable: true,
      minWidth: 160
    },
    {
      title: "操作人",
      key: "updater",
      tooltip: true,
      ellipsis: true,
      minWidth: 90
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      width: 140,
      slot: "action",
    }
  ]
}
export const ruleValidate = {
  menuName: [
    { required: true, message: "请输入菜单名称", trigger: "blur" },
  ],
  menuUrl: [
    { required: true, message: "请输入链接地址", trigger: "blur" },
  ],
  priority: [
    { required: true, type: "number", message: "请填写权重", trigger: "blur" }
  ],
  menuIcon: [
    { required: true, message: "请上传图片", trigger: "blur" }
  ],
  cityType: [
    { required: true, type: "number", message: "请选择开放城市", trigger: "blur" }
  ],
  cityList: [
    { required: true, type: "array", min: 1, message: "请选择开放城市", trigger: "blur" }
  ]
}