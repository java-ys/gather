<template>
  <div>
    <Modal
      v-model="isShow"
      :width="800"
      title="添加事故类别"
      class="new-ue accident-modal"
      :mask-closable="false"
      @on-cancel="cancel"
    >
      <Tree 
        :data="treeList" 
        v-model="treeValue" 
        show-checkbox multiple  
        :load-data="loadData"
        @on-check-change="changeTree"></Tree>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button
          type="primary"
          @click="addSubmit()"
        >确定
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  axiosSafeScoreEachLevelList,
} from "_o/api/driver.js";

export default {
  name: "accident-modal",
  props: {
    show: {
      type: Boolean
    },
    list:{
      default:()=>[]
    }
  },
  data () {
    return {
      isShow: this.show,
      treeList: [],
      treeValue:[],
      beforeList:[],
      sumItem: []
    }
  },
  methods: {
    // 打开弹窗，根据list判断是否勾选
    async computedTreeSelect(isReload){
      if(!this.list.length){
        if( isReload){
          return false
          this.treeValue = []
        }else{
          // 将this.treeList全部变为非选中状态
          await this.clearSelectTree(this.treeList)
          this.beforeList = JSON.parse(JSON.stringify(this.treeList))
          this.treeValue = []
        }
      }else{
        this.treeValue = []
        // 先清空选中状态
        await this.clearSelectTree(this.treeList)
        // 按照list，给this.treeList对应的选中状态
        await this.changeSelectTree(this.treeList)
        this.beforeList = JSON.parse(JSON.stringify(this.treeList))
      }
    },
    // 将this.treeList全部变为非选中状态
    clearSelectTree(list){
      list.forEach(item=>{
        this.$set(item,'checked',false)
        this.$set(item,'indeterminate',false)
        if(item.children.length) this.clearSelectTree(item.children)
      })
    },
    // 按照list，给this.treeList对应的选中状态
    changeSelectTree(list){
      this.list.forEach(item=>{
        list.forEach(s=>{
          if( item.desc === s.desc || this.isInclude(s.desc,item.desc) ){
            // 勾选状态
            this.$set(s,'checked',true)
            this.treeValue.push(s)
          }else if(this.isInclude(item.desc,s.desc)){
            // 半选状态
            this.$set(s,'indeterminate',true)
          }
          if(s.children.length){
            this.changeSelectTree(s.children)
          }
        })
      })
    },
    // str1是否完全包含str2
    isInclude(str1,str2){
      let arr1 = str1.split(' > ')
      let arr2 = str2.split(' > ')
      let result = true
      for(let i=0,l=arr2.length;i<l;i++){
        arr2[i]!==arr1[i] && (result = false)
      }
      return result
    },
    // 动态获取
    async loadData(item, callback) {
      item.loading = true;
      let params = {
        levelType: item.level+1,
        levelName: item.title
      }
      let res = await axiosSafeScoreEachLevelList(params)
      let data = res.data.data || []
      if(data.length>0){
        
        let sonList = await this.formatCascader(data,true,item.level+1,item)
        // 父元素是半选状态
        if(item.indeterminate){
          await this.changeSelectTree(sonList)
        }
        callback(sonList);
      }else{
        callback([]);
        delete item.loading
      }
    },
    // 获取详情
    async getDetail () {
      if(this.treeList.length){
        this.computedTreeSelect()
        return false
      }
      let res = await axiosSafeScoreEachLevelList({levelType: 1})
      let data = res.data.data;
      this.treeList = await this.formatCascader(data, false);
      this.beforeList = JSON.parse(JSON.stringify(this.treeList))
      this.computedTreeSelect(true)
    },
    formatCascader(list, isAll = true, level=1, parent) {
      let resData = []
      list.forEach((item,i) => {
        let obj = {
          title: item,
          level: level,
          children: [],
          desc: level===1?`${item}`:`${parent.desc} > ${item}`
        }
        if(parent){
          obj.parent = parent.title
          // 父如果被选中，子也要被选中
          parent.checked && (obj.checked = true)
        }
        level<5 && ( obj.loading = false )

        resData.push(obj)
      });
      return resData
    },
    changeTree(list,item){
      this.treeValue = list
    },
    cancel(){
      this.treeList = JSON.parse(JSON.stringify(this.beforeList))
      this.$emit('close')
    },
    // 保存
    async addSubmit () {
      let list = JSON.parse(JSON.stringify(this.treeValue))
      let i = list.length
      let result = []
      // 现将所有level1的分类存起来
      while(i--){
        let it = list[i]
        if(it.level===1){
          result.push(it)
          list.splice(i,1)
        }
      }
      // level2之后的逐层判断
      for(let level=2;level<6;level++){
        let k = list.length
        while(k--){
          let item = list[k]
          let isInResult = result.filter(s=>this.isInclude(item.desc,s.desc)).length>0
          if(isInResult){
            list.splice(k,1)
          }else if(item.level===level){
            result.push(item)
          }
        }
      }
      result = result.map(v=>{
        return {desc: v.desc}
      })
      this.sumItem = []
      await this.editValueSum(this.treeList)
      this.sumItem = Array.from(new Set(this.sumItem)).map(s=>({desc:s}))
      result = [
        ...result,
        ...this.sumItem
      ]
      this.$emit('getAccident',result)
      this.$emit('close')
      this.beforeList = JSON.parse(JSON.stringify(this.treeList))

    },
    //多级编辑回显
    editValueSum(list){
      this.list.forEach(item=>{
        list.forEach(s=>{
           // 半选状态
          if(s.indeterminate){
            if( s.children && s.children.length){
              this.editValueSum(s.children)
            }else{
              if(this.isInclude(item.desc,s.desc)){
                this.sumItem.push(item.desc)
              }
            }
          }
        })
      })
    }
  },
  watch: {
    show () {
      this.isShow = this.show;
      this.isShow && this.getDetail();
    }
  }
};
</script>
<style lang="less">
.accident-modal{
  & .ivu-modal-body{
    min-height:400px;
    max-height:700px;
    overflow: auto;
  }
  .ivu-modal{
    top:20px;
  }
}
</style>
