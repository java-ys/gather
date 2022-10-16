export const businessTypeData = {
  4: '快享',
  2: '专享',
  6: '企业用车',
  1: '出租车'
}

export const returnFields = that => {
  return {
    current: 1,
    pageSize: 10,
    total: 0,
    parColumns: [{
        title: '手机号',
        key: 'phoneNo',
        tooltip: true
      }, {
        title: '导入时间',
        key: 'optTime',
        tooltip: true

      }, {
        title: '操作人',
        key: 'optName',
        tooltip: true

      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 300,
        render: (h, params) => {
          const paramData = params.row

          return h('div', [

            h(
              'Button', {
                class: {
                  tableBtn: true
                },
                props: {
                  type: 'success',
                  ghost: true,
                  size: 'small'
                },
                // TODO
                // directives: [
                //   {
                //     name: 'hasAuth',
                //     value: 'product_whitelist-removeUser'
                //   }
                // ],
                on: {
                  click: () => {
                    that.removeUser(paramData)
                  }
                }
              },
              '移除'
            )
          ])
        }
      }
    ]
  }
}

export const inputList = [{
  name: 'text-input', // 文本输入框名
  bind_key: 'phoneNo', // 返回数据的key名
  placeholder: '请输入手机号',
  value: '', // 用于数据绑定
  title: '手机号：', // 展示的字段名
  titleWidth: 60
}]
