import { axiosRecomdStatus } from "_o/api/operator-carrier.js";
let statusList = [
  {
    value: 1,
    label: '启用'
  },
  {
    value: 2,
    label: '停用'
  }
]
// table数据
export const returnFields = (that) => {
  return {
    xuhao: {
      title: '序号',
      key: 'xuhao',
      minWidth: 60,
      render: (h, params) => {
        let index = params.index+1
        let before = that.pageSize*(that.current-1)
        return h('div', before+index)
      }
    },
    cityName: {
      title: '城市',
      key: 'cityName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    rewardAmount: {
      title: '奖励金额（元）',
      key: 'rewardAmount',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    ruleStatus: {
      title: '状态',
      key: 'ruleStatus',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        switch (Number(params.row.ruleStatus)) {
          case 2:
            return h('div', '停用')
          case 1:
            return h('div', '启用')
          default:
            return false
        }
      }
    },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 190,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: 'warning',
              ghost: true,
              size: "small"
            },
            class: {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'recomd-driver-manage-edit'
            }],
            on: {
              click: () => {
                that.modalStatus.newMobel = true
                that.modalStatus.isEdit = true
                that.addCityParams.city = [params.row.provinceCode,params.row.cityCode]
                that.addCityParams.rewardAmount = params.row.rewardAmount
                that.addCityParams.ruleId = params.row.ruleId
              }
            }
          }, '编辑'),
          h('Button', {
            props: {
              type: params.row.ruleStatus == 1 ? 'error' : 'success',
              ghost: true,
              size: "small"
            },
            directives: [{
              name: 'hasAuth',
              value: 'recomd-driver-manage-switch'
            }],
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: params.row.ruleStatus == 1 ? '确认停用此推荐配置' : '确认启用此推荐配置',
                  content: `<div>城市：${params.row.cityName}</div><div>奖励金额：${params.row.rewardAmount}元</div>`,
                  onOk: () => {
                    let param = {
                      ruleId: params.row.ruleId,
                      ruleStatus: params.row.ruleStatus == 1 ? 2 : 1
                    }
                    axiosRecomdStatus(param).then(res => {
                      if (res.data.success) {
                        that.$Message.success(res.data.msg);
                        that.getList()
                      } else {
                        that.$Message.error(res.data.msg);
                      }
                    })
                  }
                })
              }
            }
          }, params.row.ruleStatus == 1 ? '停用' : '启用')
        ])
      }
    }
  }
}

// 搜索列表数据
export const inputList = [
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceCode", "cityCode"], // 返回数据的key名
    placeholder: "请选择省/市",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    filterable:true,
    title: "省 / 市："
  },
  {
    name: "drop-input",
    bind_key: "ruleStatus",
    placeholder: "请选择状态",
    dropList: statusList,
    value: 1,
    title: "状态：",
    clearable:true
  }
] //搜索列表

// 表单校验
export const addCityParamsRule = {
  city: [
    {
      required: true,
      type: "array",
      min: 2,
      message: "城市不能为空",
      trigger: "change"
    }
  ], //城市
  rewardAmount: [
    { required: true,type:'number', message: "奖励金额不能为空", trigger: "blur" }
  ] //品牌
}
