// tableb表头信息
let Base64 = require( 'js-base64' ).Base64
export const returnFields = (that) => {
  return {
    sortNumber: {
      title: '序号',
      key: 'sortNumber',
      ellipsis: true,
      tooltip: true,
      minWidth: 60
    },
    question: {
      title: '问题',
      key: 'question',
      ellipsis: true,
      tooltip: true,
      minWidth: 200
    },
    answer: {
      title: '回答',
      key: 'answer',
      ellipsis: false,
      tooltip: false,
      minWidth: 400,
      render: (h, params) => {
        let content = Base64.decode( params.row.answer )

        content = content.replace( /<.*?>/ig, '' )
        content = content.replace( /&nbsp;/ig, '' )
        if (content.length > 80){
          content = content.slice( 0, 58 )+'...'
        }
        return h('div',content)
      }
    },
    action: {
      title: '操作',
      key: 'action',
      width: 270,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "warning",
              ghost: true,
              size: "small"
            },
            'class': {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'payment-questions-edit'
            }],
            on: {
              click: () => {
                that.modalTitle = '编辑问题'
                that.editData = params.row
                that.isModal = true
                
              }
            }
          }, '编辑'),
          h('Button', {
            props: {
              type: "error",
              ghost: true,
              size: "small"
            },
            'class': {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'payment-questions-delete'
            }],
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: '确认删除此问题？',
                  onOk: () => {
                    that.deleteItem(params.row.uuid,params.row.sortNumber)
                  }
                });
              }
            }
          }, '删除'),
          h('Button', {
            props: {
              type: "success",
              ghost: true,
              size: "small"
            },
            style: {
              display: params.row.sortNumber == 1 ? 'none' : 'inline-block'
            },
            'class': {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'payment-questions-up'
            }],
            on: {
              click: () => {
                that.switchSort(params.row.uuid,params.row.sortNumber,'1')
              }
            }
          }, '上移'),
          h('Button', {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            style: {
              display: params.row.sortNumber === that.pageObj.total ? 'none' : 'inline-block'
            },
            directives: [{
              name: 'hasAuth',
              value: 'payment-questions-down'
            }],
            on: {
              click: () => {
                that.switchSort(params.row.uuid,params.row.sortNumber,'2')
              }
            }
          }, '下移')
        ])
      }
    }
  }
}

export const cacheData = {
  pageObj: {
    total: 0,
    current: 1,
    pageSize: 10
  },
  tableData: [],
  parColumns:[]
}