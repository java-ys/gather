<template>
  <div>
    <div class="flex-box">
      <div class="card-tit" :style="{background:color}">{{title}}</div>
      <div class="msg" v-if="msg">{{msg}}</div>
    </div>
    <Card class="my-card">
      <ul slot="title" class="card-head line-flex">
        <li>标签名称</li>
        <li>标签类型</li>
        <li class="short-line">标签属性</li>
      </ul>
      <div class="inner-box">
        <ul class="line-flex list-item" :class="{clicked:item.clicked||false}" v-for="item in list"   :key="item.uuid" @click="handleClick(item)">
          <li>{{item.labelName}}</li>
          <li>{{item.labelType}}</li>
          <li class="short-line">{{item.evaluationQuality==1?'正面':'负面'}}</li>
        </ul>
        <div class="text-center top15" v-if="list.length==0">暂无数据</div>
      </div>
      
    </Card>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type:Array,
      default: ()=>[]
    },
    title: {
      type:String,
      default:''
    },
    msg: {
      type:String,
      default:''
    },
    color: {
      type: String,
      default:'#fff'
    }
  },
  methods:{
    handleClick(item){
      this.$emit('on-click',item)
    }
  }
}
</script>
<style lang="less" scoped>
.my-card{
  width:380px;
  height:350px;
  border:1px solid #ddd;
  /deep/ .ivu-card-head{
    padding:0;
  }
  /deep/ .ivu-card-body{
    padding:0;
  }
  line-height:30px;
}
.inner-box{
  padding-top:8px;
  height:312px;
  overflow: auto;
}
.card-head{
  height:34px;
  line-height:34px;
  margin:0;
  background: #efefef;
  li{
    &:not(:last-child){
      border-right: 1px solid #ddd;
    }
  }
}
.line-flex{
  display: flex;
  margin:0;
  li{
    width:130px;
    line-height: 18px;
    margin: 7px 0;
    padding:0 16px;
    &.short-line{
      width:90px;
    }
    // &:first-child{
    //   flex-grow: 2;
    // }
  }
}
.list-item{
  cursor: pointer;
  &:hover{
    background: #d9e8f9;
  }
  &.clicked{
    background: #b1d7ff;
  }
  transition: all .3s linear;
}
.card-tit{
  padding:5px 0;
  width:70px;
  text-align: center;
}
.msg{
  color:#222;
  line-height: 30px;
  font-size: 13px;
  margin-left: 10px;
  font-weight: 600;
}
</style>
