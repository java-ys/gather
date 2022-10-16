// 父组件应定义：
// totalColumn：Array，所有列组成的数组
export default {
  created(){
    this.reloadColumn()
  },
  methods: {
    reloadColumn(){
      let localColumn = localStorage.getItem(this.localColumnName)
      if(localColumn){
        let localColumnHash = JSON.parse(localColumn)
        if(Object.keys(localColumnHash).length>0){
          let columns = []
          this.totalColumn.forEach(item=>{
            console.log(item.type)
            if(item.type === 'index' || item.type === 'selection' || item.key === 'action' || localColumnHash[item.key]===true){
              columns.push(item)
            }
          })
          this.parColumns = columns
        } else {
          this.parColumns = this.totalColumn
        }
      }else{
        this.parColumns = this.totalColumn
      }
    },
  }
}