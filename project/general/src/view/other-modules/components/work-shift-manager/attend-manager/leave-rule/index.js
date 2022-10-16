import { delLeaveRule } from "_o/api/rest.js";

export const inputList = [
  {
    name: 'cascader-input', // 文本输入框名
    bind_key: ['cityCode', 'cityCode'], // 返回数据的key名
    placeholder: '请选择省/市',
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: '城市：', // 展示的字段名
    changeOnSelect: false,
    titleWidth: 40,
  }
]

export const tableColumns = (that) => {
  return [
		{
      title: '城市',
      key: 'cityName',
      tooltip: true,
      minWidth: 100
    },
		{
      title: '允许请假类型',
      key: 'shiftName',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let type=""
        params.row.leaveTypes.forEach((i, index) => {
          if(index<params.row.leaveTypes.length-1){
            type += leaveTypeList(i) + "，"
          } else {
            type += leaveTypeList(i)
          }
        })
        return h(
          'div', type
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (h, params) => {
        return h(
          'div', [
            h('a', {
              on: {
                click() {
                  that.leaveType = "X"
                  that.title = '查看详情'
                  that.code = params.row.cityCode
                  that.modalShow = true;
                }
              }
            }, '详情'),
            h('a', {
              style: {
                marginLeft: '10px',
              },
              on: {
                click(){
                  that.leaveType = "E"
                  that.title = '编辑请假规则'
                  that.code = params.row.cityCode
                  that.modalShow = true;
                }
              }
						}, '编辑'),
						h('a', {
              style: {
                marginLeft: '10px',
              },

              on: {
                click(){
                  that.$Modal.confirm({
                    title: "确认删除？",
                    onOk: () => {
                      delLeaveRule({cityCode: params.row.cityCode}).then((res) => {
                        that.getList()
                      })
                    }
                  });
                }
              }
            }, '删除'),
          ]
        )
      }
    }
  ]
}

// 日志表格
export const initTableColumns = that => {
  return [
    {
      type: "index",
      title: "序号",
      align: "left"
    },
    {
      title: "操作人",
      key: "operatorName",
      tooltip: true,
      align: "left"
    },
    {
      title: "UUID",
      key: "operatorUuid",
      tooltip: true,
      align: "left"
    },
    {
      title: "所属部门",
      key: "deptName",
      tooltip: true,
      align: "left"
    },
    {
      title: "IP",
      key: "operatorIp",
      tooltip: true,
      align: "left"
    },
    {
      title: "操作类型",
      key: "operateTypeDesc",
      tooltip: true,
      align: "left",
    },
    {
      title: "操作项",
      key: "operationItem",
      tooltip: true,
      align: "left",
    },
    {
      title: "操作后值",
      key: "operateResult",
      tooltip: true,
      align: "left",
      render(h, params) {
        let text = params.row.operateResult == true ? '成功' : '失败'
        return h('div', text)
      }
    },
    {
      title: "操作时间",
      key: "operateTime",
      tooltip: true,
      align: "left"
    }
  ];
};



export const pageData = {
  isShowAudit: false,
  pageData: {
    total: 0,
    currPage: 1,
    pageSize: 20
  },
  pageSizeOpts: [20, 50, 100],
  tableColumns: [],
  tableData: []
}

    // 请假类型匹配
export const leaveTypeList = i => {
  switch(i){
    case 1:
      return "事假"
      break
    case 2:
      return "病假"
      break
    case 3:
      return "婚假"
      break
    case 4:
      return "丧假"
      break
    case 5:
      return "产假"
      break
    case 6:
      return "陪产假"
      break
    case 7:
      return "年休假"
      break
    case 8:
      return "事故假"
      break
  }
}