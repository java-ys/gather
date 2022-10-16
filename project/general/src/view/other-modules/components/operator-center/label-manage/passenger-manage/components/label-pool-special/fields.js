import { mapToList } from "@/libs/util.js";
// 评价对象
export const targetList=[
  {
    label: '司机',
    value: 1
  },
  {
    label: '平台',
    value: 2
  },
  {
    label: '车辆',
    value: 3
  }
]
export const targetMap= {}
targetList.forEach(item=>{
  targetMap[item.value] = item.label
})
// 评价属性
export const qualityList=[
  {
    label: '正面',
    value: 1
  },
  {
    label: '负面',
    value: 2
  }
]
let qualityMap= {}
qualityList.forEach(item=>{
  qualityMap[item.value] = item.label
})

const statusMap = {
  0: '停用',
  1: '启用'
}
const statusList = mapToList(statusMap)

// table配置
export const returnFields = (that) => {
  return {
    index: {
      title: '序号',
      type: 'index',
      width: 60,
      align: 'center'
    },
    labelName: {
      title: '标签名称',
      key: 'labelName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    evaluationTarget: {
      title: '评价对象',
      key: 'evaluationTarget',
      ellipsis: true,
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        return h('div', targetMap[params.row.evaluationTarget])
      }
    },
    labelType: {
      title: '标签类型',
      key: 'labelType',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    evaluationQuality: {
      title: '评价属性',
      key: 'evaluationQuality',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h('div', qualityMap[params.row.evaluationQuality])
      }
    },
    labelStatus: {
      title: '标签状态',
      key: 'labelStatus',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h('div', statusMap[params.row.labelStatus])
      }
    },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            class: {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'special-passenger-manage-edit'
            }],
            on: {
              click: () => {
                that.labelModalData = { ...params.row }
                that.modalTitle = '编辑标签'
                that.labelModal = true
              }
            }
          }, '编辑'),
          h('Button', {
            props: {
              type: "error",
              ghost: true,
              size: "small"
            },
            directives: [{
              name: 'hasAuth',
              value: 'special-passenger-manage-stop'
            }],
            style: {
              display: params.row.labelStatus === 1? 'inline-block' : 'none'
            },
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: '提示',
                  content: '<p>是否停用此标签，停用后此标签将无法在APP端展示。</p>',
                  onOk: () => {
                    that.changeStatus(params.row)
                  }
                });
              }
            }
          }, '停用'),
          h('Button', {
            props: {
              type: "success",
              ghost: true,
              size: "small"
            },
            directives: [{
              name: 'hasAuth',
              value: 'special-passenger-manage-start'
            }],
            style: {
              display: params.row.labelStatus === 0? 'inline-block' : 'none'
            },
            on: {
              click: () => {
                that.changeStatus(params.row)
              }
            }
          }, '启用')
        ])
      }
    }
  }
}
// 搜索配置
export const inputList = [
  {
    name: "text-input",
    bind_key: "labelName",
    placeholder: "请输入标签名称",
    value: "",
    title: "标签名称："
  },
  {
    name: "drop-input",
    bind_key: "evaluationTarget",
    placeholder: "请选择评价对象",
    dropList: targetList,
    value: "",
    title: "评价对象：",
    inputWidth:150,
    clearable:true
  },
  {
    name: "drop-input",
    bind_key: "labelTypeUuid",
    placeholder: "请选择标签类型",
    clearable:true,
    dropList: [],
    value: "",
    title: "标签类型："
  },
  {
    name: "drop-input",
    bind_key: "evaluationQuality",
    placeholder: "请选择评价属性",
    clearable:true,
    dropList: qualityList,
    value: "",
    inputWidth:150,
    title: "评价属性："
  },
  {
    name: "drop-input",
    bind_key: "labelStatus",
    placeholder: "请选择标签状态",
    dropList: statusList,
    value: "",
    title: "标签状态：",
    inputWidth:150,
    clearable:true
  }
]
export const searchData = {}
export const pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
}
let labelValidate = (rule, value, callback) => {
  if(value==='新建标签')  callback(new Error("请填写正确的标签类型名称"));
  inputList[2].dropList.forEach(item=>{
    if(value===item.label) callback(new Error("该标签类型已存在"));
  })
  callback();
}
export const ruleValidate = {
  evaluationTarget:[
    { required: true, type:'number', message: '请选择评价对象', trigger: 'blur' }
  ],
  newLabelType:[
    { required: true, message: '请填写新建标签类型名称', trigger: 'blur' },
    { trigger: 'blur',validator: labelValidate}
  ],
  labelTypeUuid:[
    { required: true, message: '请选择标签类型', trigger: 'blur' }
  ],
  labelName:[
    { required: true, message: '请填写标签名称', trigger: 'blur' }
  ],
  evaluationQuality:[
    { required: true, type:'number', message: '请选择标签属性', trigger: 'blur' }
  ]
}
export const cacheData = {
  searchData,
  pageObj,
  ruleValidate,
  inputList,
  targetList,
  qualityList
}
