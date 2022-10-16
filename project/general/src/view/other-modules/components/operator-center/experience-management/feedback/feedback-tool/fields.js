import { delFeedbackType } from '_o/api/experience.js';
export const tableTitle = (that) => {
  return [
    {
      title: '提报单类型',
      key: 'name',
      tooltip: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            style: {
              marginRight: '15px'
            },
            directives: [{
              name: 'hasAuth',
              value: 'feedback-type-update'
            }],
            on: {
              click: () => {
                that.newMobel = true;
                that.title='编辑提报单类型';
                that.toolData={
                  uuid: params.row.uuid,
                  name: params.row.name,
                };
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
              value: 'feedback-type-del'
            }],
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: '提示',
                  content: '<p>确认删除该类型？</p>',
                  cancelText: '取消',
                  onOk: () => {
                    delFeedbackType({ uuid: params.row.uuid }).then(res => {
                      that.$Message.success('删除成功')
                      that.getList()
                    })
                  }
                })
              }
            }
          }, '删除')
        ]);
      }
    }
  ]
}

export const toolPageData = {
  newMobel: false,
  ispageShow:false,
  toolData:{},
  title:'',
  isLoading: false,
  tableColumns: [],
  tableData: [],
  maxlength:30
}
