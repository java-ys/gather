// 父组件应定义：
// totalColumn：Array，所有列组成的数组
import { getDefiendColumn } from '_g/api/common'
export default {
  data(){
    return {
      localColumnList: [],
      defaultFixed: []
    }
  },
  created() {
    let defaultObj = this.totalColumn.filter(item=>item.fixDisabled)
    this.defaultFixed = defaultObj.length ? defaultObj.map(i=>i.key) : []
    this.reloadColumn()
  },
  methods: {
    reloadColumn() {
      getDefiendColumn({type:this.columnType}).then(res => {
        let data = res.data.data || {}
        let localColumn = data.excelHeaderListStr || ''
        if (!localColumn) {
          this.parColumns = this.totalColumn
          this.localColumnList = this.defaultFixed
        } else {
          let localColumnHash = {}
          this.localColumnList = [...localColumn.split(','), ...this.defaultFixed]
          // 去重
          this.localColumnList = [...new Set(Array.from(this.localColumnList))]
          this.localColumnList.forEach(item => {
            localColumnHash[item] = true
          })
          if (this.localColumnList.length > 0) {
            let fixedColumns = []
            let otherColumns = []
            this.totalColumn.forEach(item => {
              if ( item.type === 'selection' || localColumnHash[item.key] === true) {
                item.fixed = 'left'
                fixedColumns.push(item)
              }else{
                item.fixed==='left' && (item.fixed = '')
                otherColumns.push(item)
              }
            })
            this.parColumns = [...fixedColumns,...otherColumns]
          } else {
            this.parColumns = this.totalColumn
          }
        }
      })
      
    },
  }
}