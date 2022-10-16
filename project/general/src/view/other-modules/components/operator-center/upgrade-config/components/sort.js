export default {
  data() {
    return {
      currMoveItem : false,
      currMoveIndex : false,
    }
  },
  methods: {
    start(item,index){
      this.currMoveItem = item; // 当前移动元素
      this.currMoveIndex = index; // 当前移动数组下标
      // console.log('开始移动',item,index);
    },
    over(ev){
      ev.preventDefault();
    },
    drop(index){
      // console.log('放下',index);
      if(index - this.currMoveIndex === 0) return false; // 原地移动

      // console.log('从'+this.currMoveIndex+'移动到'+index);
      this.inOrderTypeNameList.splice(this.currMoveIndex,1); // 删除元素之前所在位置
      this.inOrderTypeNameList.splice(index,0,this.currMoveItem); // 在需要放下元素的位置前插入移动元素
      this.currMoveIndex = false;
      this.currMoveItem = false;
      this.sortNewCar()
    },
    // 设置下单车型 多选框
    sortNewCar() {
      this.form.oldCarLevel = this.inOrderTypeNameList.map(it => (it.value))
    }
  }
}
