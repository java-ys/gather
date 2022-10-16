// 列表数据
export const listColumns = {
    columns: (_this) => {
      return [
        {
          title: '工单编号',
          minWidth: 200,
          key: 'woCode'
        },
        {
          title: '一级工单分类',
          minWidth: 200,
          key: 'categoryFirst'
        },
        {
          title: '二级工单分类',
          minWidth: 200,
          key: 'categorySecond',
          render: (h, { row }) => {
             // eslint-disable-next-line eqeqeq
            return <span>{row.categorySecond == "GDGD" ? "高德工单" : row.categorySecond}</span>
          }
        },
        {
            title: '三级工单分类',
            minWidth: 200,
            key: 'categoryThird'
        },
        {
            title: '四级工单分类',
            minWidth: 200,
            key: 'categoryFourth'
        },
        {
            title: '申请人',
            minWidth: 200,
            key: 'creatorName'
        },
        {
          title: '创建时间',
          minWidth: 200,
          render: (h, params) => {
            return h('div', `${_this.$moment(params.row.createTime).format("YYYY-MM-DD HH:mm:ss")}`)
          }
        },
        {
            title: '结束时间',
            minWidth: 200,
            render: (h, params) => {
              return h('div', `${_this.$moment(params.row.endTime).format("YYYY-MM-DD HH:mm:ss")}`)
            }
        },
        {
          title: '工单状态',
          minWidth: 150,
          key: 'runState'
        },
        {
            title: '一级判责类型',
            minWidth: 150,
            key: 'judgeTypeLevelFirst'
        },
        {
            title: '二级判责类型',
            minWidth: 150,
            key: 'judgeTypeLevelSecond'
        },
        {
            title: '三级判责类型',
            minWidth: 150,
            key: 'judgeTypeLevelThird'
        },
        {
            title: '判责结果',
            minWidth: 150,
            key: 'judgeResult'
        },
        {
            title: '处罚金额',
            minWidth: 150,
            key: 'forfeit'
        },
      ]
    }
  }
