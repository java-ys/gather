<template>
  <div class="column-fixed">
    <Dropdown trigger="click" placement="bottom-start" @on-visible-change="visibleChange">
      <div class="choose-lie right30">
        <Icon type="md-apps"/>
        {{btnText}}
      </div>
      <DropdownMenu slot="list">
        <div class="flex-box head-box">
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll"
          >12项</Checkbox>
          <div class="text-btn" @click="checkReverse">反选</div>
        </div>
        <div>
        </div>
        <CheckboxGroup
          v-model="checkAllGroup"
          @on-change="checkAllGroupChange"
          class="check-box">
          <Checkbox
            v-for="item in totalColumnNew"
            :label="item.key"
            :key="item.key"
            :disabled="item.fixDisabled || false"
            >{{item.title}}</Checkbox>
        </CheckboxGroup>
      </DropdownMenu>
    </Dropdown>

  </div>
</template>
<script>
// 组件使用，结合 columnFixedMix 混入方法
// 1.父组件引入本组件和mix方法组件
//   import columnFixedBtn from "_a/m2-column-fixed/index.vue";
//   import columnFixedMix from "_a/m2-column-fixed/mixin";

// 2.data中定义组件需要的变量
//   columnType: 'api定义的查询保存type类型',
//   parColumns: [],                      //table绑定的parColumns值
//   totalColumn: parColumns(this),
//   或者：totalColumn: parColumns

// 3.html部分组件使用
//   <column-fixed-btn
//     :type="columnType"
//     :localColumnList="localColumnList"
//     :totalColumn="totalColumn"
//     @reload="reloadColumn">
//   </column-fixed-btn>

// 4.js声明组件columnFixedBtn
//   components: {
//     columnFixedBtn
//   },

// 5.js部分混入mixin
//   mixins: [columnFixedMix],
import { saveDefiendColumn } from '_g/api/common'
export default {
  name: "m2-column-fixed",
  props: {
    btnText: {
      type: String,
      default: "固定列"
    },
    // 所有的列
    totalColumn:{},
    // fix的列map
    localColumnList:{},
    // 默认固定，不可编辑的
    defaultFixed:{},
    // 页面type
    type:{}
  },
  data() {
    return {
      indeterminate: true,
      checkAll: false,
      checkAllGroup: []
    };
  },
  computed: {
    totalColumnNew() {
      let arr = [];
      this.totalColumn.map(i => {
        if (
          i.key &&
          i.type !== "selection" &&
          i.key !== "action"
        ) {
          arr.push(i);
        }
      });
      return arr;
    },
    allColumnKeyList(){
      let res = this.totalColumnNew.map(i=>i.key)
      return res
    },
    allLen(){
      return this.allColumnKeyList.length
    },
  },
  methods: {
    // 开启关闭下拉框
    visibleChange(isShow){
      if(isShow){
        // 展开下拉框
        this.checkAllGroup = this.localColumnList
      }else{
        // 关闭下拉框
        this.addSubmit()
      }
    },
    // 反选
    checkReverse(){
      let arr = this.allColumnKeyList.filter(i=>{
        return !this.checkAllGroup.includes(i)
      })
      this.checkAllGroup = [...arr,...this.defaultFixed]
      this.checkAllGroupChange(this.checkAllGroup)
    },
    // 全选
    handleCheckAll() {
      if(this.checkAll){
        this.indeterminate = this.defaultFixed.length>0?true:false
        this.checkAll = !this.checkAll;
      }else{
        this.checkAll = !this.checkAll;
        this.indeterminate = false;
      }

      if (this.checkAll) {
        this.checkAllGroup = this.allColumnKeyList;
      } else {
        this.checkAllGroup = [...this.defaultFixed];
      }
    },
    // 单选
    checkAllGroupChange(data) {
      if (data.length >= this.allLen) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    addSubmit() {
      let params = {
        type: this.type,
        excelHeaderListStr: this.checkAllGroup.join(',')
      }
      saveDefiendColumn(params).then(res => {
        this.$emit("reload");
      }).catch(err=>{
        this.checkAllGroup = this.localColumnList
      })

    }
  }
};
</script>
<style scoped lang='less'>
.choose-lie{
  line-height: 32px;
  cursor: pointer;
}
.choose-lie .ivu-icon{
  font-size: 20px;
  position: relative;
  top:-2px;
  color:#2d8cf0;
}
.head-box{
  min-width:220px;
  padding: 8px 16px;
  justify-content: space-between;
  border-bottom:1px solid rgba(210,210,230,.3)
}
.check-box{
  padding: 14px 16px 10px 16px;
  max-height: 200px;
  overflow: auto;
}
.column-fixed{
  /deep/ .ivu-checkbox-wrapper{
    font-size: 13px;
    &.ivu-checkbox-group-item{
      display: block;
      font-size: 14px;
      margin-bottom:12px;
    }
  }
  /deep/ .ivu-dropdown-menu{
    margin-bottom:0;
  }
  /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar{
      width: 8px;
      height: 10px;
      background-color: #eee;
  }
  /*定义滑块，内阴影及圆角*/
  ::-webkit-scrollbar-thumb{
      height: 50px;
      border-radius: 10px;
      background-color: #ccc;
  }
}
.text-btn{
  color:#2d8cf0;
  cursor: pointer;
  font-size: 13px;
}
</style>