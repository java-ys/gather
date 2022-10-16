// 列表数据
import choosedImg from '@/view/other-modules/assets/choosed.png'
import noChoosedImg from '@/view/other-modules/assets/noChoosed.png'
export const listColumns = {
  columns(_this) {
    return [{
        title: '选择',
        render: (h, params) => {
          // console.log(params.row.chooseStatus)
          if(params.row.chooseStatus){
            return h('img', {
              style: {
                "width": "20px"
              },
              attrs: {
                src: choosedImg
              }
            })
          } else {
            return h('img', {
              style: {
                "width": "20px"
              },
              attrs: {
                src: noChoosedImg
              }
            })
          }
        }
      },
      {
        title: '开票主体名称',
        key: 'invoiceSubjectName'
      },
      {
        title: '税号',
        key: 'taxNum'
      }
    ];
  }
}
