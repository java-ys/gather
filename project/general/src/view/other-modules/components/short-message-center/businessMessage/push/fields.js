/*
 * @Author: NapierPLUS
 * @Date: 2021-10-17 11:21:20
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-10-26 15:01:22
 * @Description: 
 */
export const targetMap = {
  0: '乘客',
  1: '司机'
}
export const nodeMap = {
  0: '派单成功',
  1: '行程结束'
}

export const businesstMap = {
  0: '全局',
  2: '专享',
  4: '快享',
  5: '顺风车',
  10: '包车',
  11: '企业用车'
}

export const stateMap = {
  0: '启用',
  1: '停用'
}
export const parmMap = {
  0: '无参数',
  1: '订单id',
  2: '司机id'
}
export const Columns = (that) => {
  return {
    titile: {
      title: '主标题',
      key: 'titile',
      minWidth: 120
    },
    content: {
      title: '副标题',
      key: 'content',
      minWidth: 120
    },
    sendTarget: {
      title: '发送对象',
      key: 'sendTarget',
      minWidth: 80,
      render: (h, params) => {
        return h('span', targetMap[params.row.sendTarget])
      }
    },
    linkUrl: {
      title: '跳转链接',
      key: 'linkUrl',
      minWidth: 200
    },
    routeNode: {
      title: '发送节点',
      key: 'routeNode',
      minWidth: 120,
      render: (h, params) => {
        return h('span', nodeMap[params.row.routeNode])
      }
    },
    businessId: {
      title: '适用业务',
      key: 'businessId',
      minWidth: 120,
      render: (h, params) => {
        let row = JSON.parse(JSON.stringify(params.row))
        let text = row.businessId === 0 ?"全局":((that.bizTypeList.find(it => it.value === Number(row.businessId))||{}).label || "" )
        return h('span', text)
      }
    },
    status: {
      title: '状态',
      key: 'status',
      minWidth: 80,
      render: (h, params) => {
        return h('span', stateMap[params.row.status])
      }
    },
    updateTime: {
      title: '更新时间',
      key: 'updateTime',
      minWidth: 120
    }
  }
}
