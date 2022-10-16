export const pageData = {
  total:0,
  current:1,
  pageSize:20,
  tableData:[]
}

export const inputList = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "userName", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "姓名：",
    titleWidth: "100"
  }
];

export const tableColumns = _this => {
  return [
    {
      title: '姓名',
      key: 'userName',
      minWidth: 140,
    },
    {
      title: '手机号',
      key: 'userPhone',
      minWidth: 150,
    },
    {
      title: '角色组',
      key: 'groupName',
      minWidth: 140,
    },
    {
      title: '城市',
      key: 'cityNames',
      minWidth: 150,
    },
    {
      title: '操作人',
      key: 'updater',
      minWidth: 150,
    },
    {
      title: '操作时间',
      key: 'updateTime',
      minWidth: 150,
    },
    {
      key: 'action',
      title: '操作',
      ellipsis: true,
      fixed: 'right',
      width: 160,
      render: (h, params) => {
        let row = params.row
        return h('div', {
          style: {
            display: 'flex',
            justifyContent: 'flex-start'
          }
        }, [
          h(
            'span',
            {
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '5px',
                cursor: 'pointer',
                color: '#ff8533',
                paddingRight: '30px'
              },
              // directives: [
              //   {
              //     name: 'hasAuth',
              //     value: 'role-config-edit'
              //   }
              // ],
              on: {
                click: () => {
                  _this.edit(row)
                }
              }
            },
            '编辑'
          ),
          h(
            'span',
            {
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '5px',
                cursor: 'pointer',
                color: '#ff8533',
                paddingRight: '30px'
              },
              // directives: [
              //   {
              //     name: 'hasAuth',
              //     value: 'role-config-delete'
              //   }
              // ],
              on: {
                click: () => {
                  _this.delete(row)
                }
              }
            },
            '删除'
          ),
        ])
      }
    }
  ]
}