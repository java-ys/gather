<template>
  <div class="common-question question-page">
    <Row class="height100">
        <Col span="3" class="height100">
          <Card class="tree-box">
            <Tree :data="treeList" :render="renderContent" @on-select-change="treeSelectChange"></Tree>
          </Card>
        </Col>
        <Col span="21" class="height100">
          <div class="right-box" v-if="selectedKey===0">
            <Button type="primary" @click="addSon" v-hasAuth="'common-question-addCatalog'">新建分类</Button>
          </div>
          <div class="right-box flex-right" v-else>
            <div>
              <Button type="warning" class="right30" v-hasAuth="'common-question-editCatalog'" @click="editSon">编辑名称</Button>
              <Button type="info" class="right30" v-hasAuth="'common-question-downCatalog'" :disabled="selectedKey===treeList[0].children.length" @click="moveSon(2,'下移')">下移</Button>
              <Button type="info" class="right30" v-hasAuth="'common-question-upCatalog'" :disabled="selectedKey===1" @click="moveSon(1,'上移')">上移</Button>
              <Button type="error" class="right30" v-hasAuth="'common-question-stopCatalog'" v-if="infoData.catalogStatus===1" @click="switchSon(0,'停用')">停用</Button>
              <Button type="success" class="right30" v-hasAuth="'common-question-startCatalog'" v-else @click="switchSon(1,'启用')">启用</Button>
            </div>
            <div class="top15 detail-info">
              <div>
                <span>
                  <span class="item-label">分类名称：</span>
                  <span class="item-value">{{infoData.catalogName}}</span>
                </span>
                <span>
                  <span class="item-label">当前状态：</span>
                  <span class="item-value">{{statusMap[infoData.catalogStatus]}}</span>
                </span>
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
            <question-list class="table-box" :catalogId="selectedId"></question-list>  
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
</template>
<script>
import { ruleValidate,statusMap } from './fields'
import questionList from './question-list'
import {
  axiosCatalogList,
  axiosCatalogAdd,
  axiosCatalogEdit,
  axiosCatalogMove,
  axiosCatalogShift,
  axiosCatalogDetail
} from "_o/api/operator-carrier";

export default {
  name: "",
  data() {
    return {
      statusMap,
      ruleValidate,
      addModal: false,
      isNew: true,
      treeList: [
        {
          title: "根目录",
          expand: true,
          selected: true,
          children: []
        }
      ],
      addData: {
        catalogName:''
      },
      selectedKey: 0,
      selectedId: 0,
      infoData: {},
      addDefaultData:{
        serviceObj: 1,//服务对象，1：司机，2：乘客，3：运营商
        parentId: 0,//父目录id，默认为0
        catalogType: 1//目录类型，1：司机常见问题，2：司机反馈问题，3：乘客常见问题，4：乘客反馈问题
      }
    };
  },
  computed: {
    modalTitle() {
      return this.isNew ? "新建" : "编辑";
    }
  },
  components: {
    questionList
  },
  mounted() {
    this.getTreeData();
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
    // 获取树
    // isStill,是否选中selectedKey和selectedId
    getTreeData(isStill) {
      let params = {
        serviceObjArray: [1],//固定传参-服务对象-司机
        catalogTypeArray: [1]//固定传参-目录类型-司机常见问题
      }
      axiosCatalogList(params).then(res => {
        let list = res.data.data||[]
        // 默认选中树
        if (list.length === 0) {
          this.treeList[0].selected = true;
          this.treeList[0].children = [];
          this.selectedKey=0
          this.selectedId=0
        } else {
          list.forEach(item=>{
            item.selected = false
            item.title = item.catalogName
          })
          if(isStill){
            let isHave = false
            list.forEach((son,i)=>{
              if(son.id===this.selectedId){
                isHave = true
                son.selected = true;
                this.selectedKey = i+1
              }
            })
            if(!isHave){
              if(this.selectedKey===0){
                this.treeList[0].selected = true;
              }else{
                this.selectedKey = 1
                this.selectedId = list[0].id
                this.treeList[0].selected = false;
                list[0].selected = true;
              }
            }
          }else{
            this.selectedKey = 1
            this.selectedId = list[0].id
            this.treeList[0].selected = false;
            list[0].selected = true;
          }
          
          this.treeList[0].children = list;
          this.getDetail()
        }
      });
    },
    treeSelectChange(arr,item){
      // iview更新到4.+版本可删除1,2逻辑
      // 1.取消原来的选中
      if(this.selectedKey===0){
        this.treeList[0].selected = false
      }else{
        let children = this.treeList[0].children
        children[this.selectedKey-1].selected = false
        this.treeList[0].children = children
      }
      // 2.点击的修改成选中
      if(item.nodeKey===0){
        this.treeList[0].selected = true
      }else{
        let children = this.treeList[0].children
        children[item.nodeKey-1].selected = true
        this.treeList[0].children = children
      }
      // 切换key
      this.selectedKey = item.nodeKey
      this.selectedId = item.id||0
      if(item.nodeKey!==0){
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
    formReset(name) {
      this.addModal = false
      this.$refs[name].resetFields();
    },
    addSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let that = this;
          let params = {
            ...this.addDefaultData,
            ...this.addData
          }
          let submitFun = axiosCatalogAdd
          if(!this.isNew){
            params.id = this.selectedId
            submitFun = axiosCatalogEdit
          }
          submitFun(params).then(res => {
            that.getTreeData(true);
            that.addModal = false;
            that.$Message.success(that.modalTitle+'成功！');
            that.formReset(name);
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
  }
};
</script>
<style lang='less' src="../style.less"></style>