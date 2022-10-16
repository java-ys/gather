<template>
  <div class="transfer-box">
    <my-card :list="unLabelList" @on-click="clickBefore" title="未选择：" color="#fde3dd"></my-card>
    <div class="btn-box">
      <Button type="primary" @click="addItem" :disabled="!isAddItem">添加 &gt;</Button>
      <Button class="top15" type="primary" @click="addAll" :disabled="!isAddAll">全部添加 &gt;</Button>
      <Button class="top15" type="error" ghost @click="removeItem" :disabled="!isRemoveItem">&lt; 移除</Button>
      <Button class="top15" type="error" ghost @click="removeAll" :disabled="!isRemoveAll">&lt; 全部移除</Button>
    </div>
    <my-card :list="selectedList" @on-click="clickAfter" title="已选择：" color="#d4eaff" msg="乘客端标签展示按照列表中添加顺序排列"></my-card>
  </div>
</template>
<script>
import myCard from './card.vue'
import {
  axiosListUnselectedLabel
} from "_o/api/operator-carrier";
export default {
  props: {
    params: {
      type: Object,
      default: ()=>{},
    },
    evaluationQuality: {
      type: Number,
      default: 2
    },
    isShow: {
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      allLabelList: [],
      selectedList: [],
      unLabelList: []
    }
  },
  components:{
    myCard
  },
  computed:{
    isAddItem(){
      let result = this.unLabelList.some(item=>{
        return item.clicked === true
      })
      return result
    },
    isAddAll(){
      return this.unLabelList.length>0
    },
    isRemoveItem(){
      let result = this.selectedList.some(item=>{
        return item.clicked === true
      })
      return result
    },
    isRemoveAll(){
      return this.selectedList.length>0
    },
  },
  methods:{
    clickBefore(obj){
      this.unLabelList.forEach(item=>{
        if(item.uuid===obj.uuid){
          item.clicked = !item.clicked
        }
      })
    },
    clickAfter(obj){
      this.selectedList.forEach(item=>{
        if(item.uuid===obj.uuid){
          item.clicked = !item.clicked
        }
      })
    },
    addItem(){
      let list = []
      this.unLabelList.forEach((item,i)=>{
        if(item.clicked){
          item.clicked = false
          this.selectedList.unshift(item)
          this.allLabelList.forEach(obj=>{
            if(item.uuid===obj.uuid){
              obj.status = 1
            }
          })
        }else{
          list.push(item)
        }
      })
      this.unLabelList = list
      this.$emit('chooseLabel',this.selectedList)
    },
    addAll(){
      this.unLabelList.forEach((item,i)=>{
        item.clicked = false
        this.selectedList.unshift(item)
        this.allLabelList.forEach(obj=>{
          if(item.uuid===obj.uuid){
            obj.status = 1
          }
        })
      })
      this.unLabelList.splice(0,this.unLabelList.length)
      this.$emit('chooseLabel',this.selectedList)
    },
    removeItem(){
      let list = []
      this.selectedList.forEach((item,i)=>{
        if(item.clicked){
          item.clicked = false
          if(item.evaluationQuality==this.evaluationQuality){
            this.unLabelList.unshift(item)
          }
          this.allLabelList.forEach(obj=>{
            if(item.uuid===obj.uuid){
              obj.status = 0
            }
          })
        }else{
          list.push(item)
        }
      })
      this.selectedList = list
      this.$emit('chooseLabel',this.selectedList)
    },
    removeAll(){
      this.selectedList.forEach((item,i)=>{
        item.clicked = false
        if(item.evaluationQuality==this.evaluationQuality){
          this.unLabelList.unshift(item)
        }
        this.allLabelList.forEach(obj=>{
          if(item.uuid===obj.uuid){
            obj.status = 0
          }
        })
      })
      this.selectedList.splice(0,this.selectedList.length)
      this.$emit('chooseLabel',this.selectedList)
    },
    computedList(isAll){
      if(isAll){
        axiosListUnselectedLabel(this.params).then(res=>{
          let list = res.data.data||[]
          list.forEach(item=>{
            item.clicked = false
          })
          this.allLabelList = list
          this.selectedList = this.allLabelList.filter(item=>{
            return item.status==1
          })
          let unlist = this.allLabelList.filter(item=>{
            return item.evaluationQuality == this.evaluationQuality && item.status==0
          })
          this.unLabelList = JSON.parse(JSON.stringify(unlist))
        })
      } else{
        let unlist = this.allLabelList.filter(item=>{
          return item.evaluationQuality == this.evaluationQuality && item.status==0
        })
        this.unLabelList = JSON.parse(JSON.stringify(unlist))
      }
    }
  },
  watch: {
    isShow(newVal){
      if(newVal){
        this.computedList(true)
      }
    },
    evaluationQuality(){
      this.computedList()
    }
  }
}
</script>
<style lang="less" scoped>
.transfer-box{
  display: flex;
  justify-content: space-around;
}
.btn-box{
  padding-top:100px;
  width:100px;
  text-align: center;
}
</style>

