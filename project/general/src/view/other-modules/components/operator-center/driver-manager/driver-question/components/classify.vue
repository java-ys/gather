<template>
  <div>
    <Modal
      v-model="isShow"
      :width="720"
      title="问题分类管理"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="$emit('close')"
    >
      <div class="question-page modal-page">
        <Row class="height100">
            <Col span="7" class="height100">
              <Card class="tree-box">
                <Tree :data="treeList" :render="renderContent" @on-select-change="treeSelectChange"></Tree>
              </Card>
            </Col>
            <Col span="17" class="height100">
              <div class="right-box" v-if="selectedType===0">
                <Button type="primary" @click="addSon">新建分类</Button>
              </div>
              <div class="right-box flex-right" v-else>
                <div style="min-height:80px">
                  <Button type="warning" class="right30" @click="editSon">编辑名称</Button>
                  <Button type="info" class="right30" :disabled="!isDown" @click="moveSon(2,'下移')">下移</Button>
                  <Button type="info" class="right30" :disabled="!isUp" @click="moveSon(1,'上移')">上移</Button>
                  <Button type="error" class="right30" v-if="infoData.catalogStatus===1" @click="switchSon(0,'停用')">停用</Button>
                  <Button type="primary" class="right30" v-else @click="switchSon(1,'启用')">启用</Button>
                  <Button type="success" class="top15" v-if="selectedType===1"  @click="addSecond">新建二级分类</Button>
                </div>
                <div class="top15 detail-info">
                  <div>
                    <span>
                      <span class="item-label">分类名称：</span>
                      <span class="item-value">{{infoData.catalogName}}</span>
                    </span>
                    <span>
                      <span class="item-label">分类级别：</span>
                      <span class="item-value">{{typeMap[infoData.catalogLevel]}}</span>
                    </span>
                  </div>
                  <div>
                    <span class="item-label">当前状态：</span>
                    <span class="item-value">{{statusMap[infoData.catalogStatus]}}</span>
                  </div>
                  <div>
                    <span class="item-label">创建时间：</span>
                    <span class="item-value">{{infoData.createTime}}</span>
                  </div>
                  <div>
                    <span class="item-label">创建人：</span>
                    <span class="item-value">{{infoData.creatorName}}</span>
                  </div>
                </div>
              </div>
            </Col>
        </Row>
        <Modal
          v-model="addModal"
          :width="400"
          :title="`${modalTitle}分类名称`"
          :mask-closable="false"
          @on-cancel="formReset('addSonForm')">
          <Form ref="addSonForm" :model="addData" :rules="ruleValidate" :label-width="90">
            <FormItem label="分类名称：" prop="catalogName">
              <Input
                v-model="addData.catalogName"
                :maxlength="6"
                style="width:200px"
                placeholder="请输入分类名称"
              />
              <span class="counter">( {{ addData.catalogName ? addData.catalogName.length:0 }}/6 )</span>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="formReset('addSonForm')">取消</Button>
            <Button type="primary" @click="addSubmit('addSonForm')">确认</Button>
          </div>
        </Modal>
      </div>
    </Modal>
  </div>
</template>
<script>
import { ruleValidate,statusMap } from '../../common-question/fields'
import {
  axiosDriverQuestionCatalogList,
  axiosCatalogDetail,
  axiosCatalogMove,
  axiosCatalogShift,
  axiosCatalogAdd,
  axiosCatalogEdit
} from "_o/api/operator-carrier";
export default {
  name: "driver-classify",
  props: {
    show: {
      type: Boolean
    }
  },
  data() {
    return {
      isShow: this.show,
      ruleValidate,
      statusMap,
      addModal: false,
      isNew: true,
      treeList: [
        {
          title: "根目录",
          expand: true,
          selected: true,
          type:0,
          children: []
        }
      ],
      addData: {
        catalogName:''
      },
      selectedKey: 0,//当前选中
      selectedId: 0,//当前选中目录id
      selectedType: 0,//当前选中目录级别，0根目录，1一级，2二级
      isUp: true,
      isDown: true,
      isSecondNew: false,
      infoData: {},
      typeMap: {
        1: '一级目录',
        2: '二级目录'
      },
      addDefaultData:{
        serviceObj: 1,//服务对象，1：司机，2：乘客，3：运营商
        parentId: 0,//父目录id，默认为0
        catalogType: 2//目录类型，1：司机常见问题，2：司机反馈问题，3：乘客常见问题，4：乘客反馈问题
      }
    };
  },
  computed: {
    modalTitle() {
      return this.isNew ? "新建" : "编辑";
    }
  },
  methods: {
    renderContent(h, { root, node, data }){
      let that = this
      // iview更新到4.+版本可删除class和on-click
      return h('span', {
        class: {
          'ivu-tree-title':true,
          'ivu-tree-title-selected': data.selected===true
        },
        style: {
          color:data.catalogStatus === 0?'#aaa':'#333'
        },
        on: {
          click: () => {
            that.treeSelectChange(node,data)
          }
        }
      }, data.title);
    },
    formReset(name) {
      this.addModal = false
      this.isSecondNew = false
      this.$refs[name].resetFields();
    },
    treeSelectChange(node,item){
      // return false
      // iview更新到4.+版本可删除1,2逻辑
      // 1.取消原来的选中
      if(this.selectedType===0){
        // 根目录
        this.treeList[0].selected = false
      }else if(this.selectedType===1){
        // 一级目录
        this.treeList[0].children.forEach(fSon=>{
          fSon.selected = false
        })
      }else{
        // 二级目录
        this.treeList[0].children.forEach(fSon=>{
          fSon.children.forEach(sSon=>{
            sSon.selected = false
          })
        })
      }
      
      // 2.点击的修改成选中
      let len = 0
      if(item.type===0){
        // 根目录
        this.treeList[0].selected = true
        this.selectedId = 0
      }else if(item.type===1){
        // 一级目录
        let children = this.treeList[0].children
        children[item.sort].selected = true
        this.treeList[0].children = children
        len = children.length
        this.selectedId = item.firstCatalogId
      }else{
        // 二级目录
        let children = this.treeList[0].children
        children[item.parentSort].children[item.sort].selected = true
        this.treeList[0].children = children
        len = children[item.parentSort].children.length
        this.selectedId = item.secondCatalogId
      }
      // 上移下移
      this.isUp = item.sort===0 ? false : true
      this.isDown = item.sort===len-1 ? false : true
      // 切换key
      this.selectedType = item.type
      if(item.type!==0){
        this.getDetail()
      }
    },
    getDetail(){
      if(this.selectedId === 0){
        return false
      }
      let params = {
        id: this.selectedId
      }
      axiosCatalogDetail(params).then(res => {
        this.infoData = res.data.data||{}
      })
    },
    getTreeData(isStill) {
      axiosDriverQuestionCatalogList({}).then(res => {
        let list = res.data.data || []
        if (list.length === 0) {
          this.treeList[0].selected = true;
          this.treeList[0].children = [];
          this.selectedType=0
          this.selectedId=0
        } else {
          // 展开折叠处理
          let copyList = JSON.parse(JSON.stringify(this.treeList[0].children))
          let closedHash = {}
          copyList.forEach(item=>{
            if(item.expand === false){
              closedHash[item.firstCatalogId] = true
            }
          })
          // 
          this.treeList[0].selected = false;
          list.forEach((item,i)=>{
            item.title = item.firstCatalogName
            item.selected = false
            item.children = item.secondCatalogList||[]
            item.sort = i 
            item.type = 1
            // 展开折叠判断，默认展开
            item.expand = closedHash[item.firstCatalogId]?false:true
            item.children.forEach((son,j)=>{
              son.selected = false
              son.title = son.secondCatalogName||[]
              son.sort = j
              son.parentSort = i
              son.type = 2
            })
          })
          // 还原原来的选中
          if(isStill){
            let isHave = false
            let len = 0
            let sort = 0
            // 选中一级
            if(this.selectedType===0){
              isHave = true
              this.treeList[0].selected = true;
            }else if(this.selectedType===1){
              list.forEach(first => {
                if(first.firstCatalogId===this.selectedId){
                  isHave = true
                  first.selected = true
                  len = list.length
                  sort = first.sort
                }
              })
            }else if (this.selectedType===2){
              // 选中二级
              list.forEach(first => {
                first.children.forEach(second => {
                  if(second.secondCatalogId===this.selectedId){
                    isHave = true
                    second.selected = true
                    len = first.children.length
                    sort = second.sort
                  }
                })
              })
            }
            this.isUp = sort === 0 ? false : true
            this.isDown = sort === len-1 ? false : true
            // 不是一级也不是不是二级，或者一级二级没找到
            if(!isHave){
              this.selectedType=1
              this.selectedId = list[0].firstCatalogId
              list[0].selected = true;
              this.isUp = false
              this.isDown = list.length===1?false:true
            }
          }else{
            this.selectedType=1
            this.selectedId = list[0].firstCatalogId
            list[0].selected = true;
            this.isUp = false
            this.isDown = list.length===1?false:true

          }
          
          this.treeList[0].children = list;
          this.getDetail()
        }
      })
    },
    addSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let that = this;
          let params = {
            ...this.addData
          }
          let submitFun = axiosCatalogAdd
          if(this.isNew){
            params = {
              ...params,
              ...this.addDefaultData,
              parentId: this.selectedId
            }
          } else {
            params.id = this.selectedId
            submitFun = axiosCatalogEdit
          }
          submitFun(params).then(res => {
            that.getTreeData(true);
            that.addModal = false;
            that.$Message.success(that.modalTitle+'成功！');
            that.formReset(name);
            that.isSecondNew = false
          }).catch(err=>{
            that.isSecondNew = false
          });
        }
      });
    },
    addSon(){
      this.addData={
        catalogName: ''
      }
      this.isNew = true
      this.addModal = true
    },
    addSecond(){
      this.isNew = true
      this.addModal = true
      this.isSecondNew = true
    },
    editSon(){
      this.addData={
        catalogName: this.infoData.catalogName
      }
      this.isNew = false
      this.addModal = true
    },
    // 上下移动
    moveSon(value,mes){
      let that = this
      let params = {
        moveFlag: value,
        catalogId: this.selectedId
      }
      axiosCatalogMove(params).then(res => {
        that.getTreeData(true);
        that.$Message.success(mes+'成功！');
      });
    },
    // 停用启用
    switchSon(status,mes){
      let that = this
      let params = {
        catalogStatus: status,
        id: this.selectedId
      }
      axiosCatalogShift(params).then(res => {
        that.getTreeData(true);
        that.$Message.success(mes+'成功！');
      });
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
      if(this.isShow){
        this.getTreeData()
      }
    }
  }
};
</script>
<style lang='less' src="../../style.less"></style>