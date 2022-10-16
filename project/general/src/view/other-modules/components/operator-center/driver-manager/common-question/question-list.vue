<template>
  <div>
    <strong class="fontsize18">问题列表</strong>
    <SearchList class="top15" :inputList="inputList" @on-search="search" @on-reset="search"></SearchList>
    <Button type="primary" @click="addNew" v-hasAuth="'common-question-addQues'">新建问题</Button>
    <m2-table
      class="top15"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template slot-scope="params" slot="action">
        <ButtonGroup>
          <Button ghost type="info" size="small" v-hasAuth="'common-question-upQues'" :disabled="params.data.index===0 && current===1" @click="moveItem(1,params.data.row,'上移')">上移</Button>
          <Button ghost type="info" size="small" v-hasAuth="'common-question-downQues'" :disabled="(current-1)*pageSize+params.data.index+1===total" @click="moveItem(2,params.data.row,'下移')">下移</Button>
          <Button ghost type="error" size="small" v-hasAuth="'common-question-stopQues'" v-if="params.data.row.faqStatus===1" @click="switchItem(0,params.data.row,'停用')">停用</Button>
          <Button ghost type="success" size="small" v-hasAuth="'common-question-startQues'" v-else @click="switchItem(1,params.data.row,'启用')">启用</Button>
          <Button ghost type="warning" size="small" v-hasAuth="'common-question-editQues'"  @click="editItem(params.data.row)">编辑</Button>
          <Button ghost type="primary" size="small" v-hasAuth="'common-question-detailQues'" @click="openDetail(params.data.row)">详情</Button>
        </ButtonGroup>
      </template>
    </m2-table>
    <Modal
      v-model="addModal"
      :width="670"
      :title="isDetail?'详情':`${modalTitle}问题`"
      :mask-closable="false"
      :footer-hide="isDetail"
      @on-cancel="formReset('questionForm')">
      <Form ref="questionForm" :model="addData" :rules="ruleValidate" :label-width="90" :show-message="!isDetail">
        <FormItem label="问题名称：" prop="faqName">
          <Input
            v-model="addData.faqName"
            type="textarea"
            :maxlength="30"
            :readonly="isDetail"
            style="width:450px"
            :rows="2"
            placeholder="请输入问题名称"
          />
          <span class="counter">( {{ addData.faqName ? addData.faqName.length:0 }}/30 )</span>
        </FormItem>
        <FormItem label="答案：" prop="replyDesc">
          <Input
            v-model="addData.replyDesc"
            type="textarea"
            :maxlength="1000"
            :readonly="isDetail"
            style="width:450px"
            :autosize="{minRows: 4,maxRows:8}"
            placeholder="请输入答案"
          />
          <span class="counter">( {{ addData.replyDesc ? addData.replyDesc.length:0 }}/1000 )</span>
        </FormItem>
        <FormItem label="客服类型：" prop="customerServiceType">
          <Select v-model="addData.customerServiceType" style="width:200px" :disabled="isDetail">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="formReset('questionForm')">取消</Button>
        <Button type="primary" @click="addSubmit('questionForm')">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import { inputList, parColumns,ruleValidate,typeList } from "./fields";
import {
  axiosFaqInfoList,
  axiosFaqInfoAdd,
  axiosFaqInfoEdit,
  axiosFaqInfoMove,
  axiosFaqInfoDetail,
  axiosFaqInfoShift
} from "_o/api/operator-carrier";

export default {
  name: "",
  props: ['catalogId'],
  data() {
    return {
      ruleValidate,
      parColumns:parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      typeList,
      tableData: [],
      searchData: {},
      addData: {
        faqName:'',
        replyDesc:'',
        customerServiceType:"1"
      },
      addModal: false,
      isNew: true,
      isDetail: false,
      addDefaultData:{
        serviceObj: 1//服务对象，1：司机，2：乘客，3：运营商
      }
    };
  },
  components: {
    m2Table
  },
  computed: {
    modalTitle() {
      return this.isNew ? "新建" : "编辑";
    }
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    getTableList() {
      let params = {
        catalogId: this.catalogId,
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData
      };
      axiosFaqInfoList(params).then(res => {
        let data = res.data.data || {};
        this.tableData = data.list || [];
        this.total = data.totalCount || 0;
      })
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
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
            catalogId: this.catalogId,
            ...this.addData
          }
          let axiosFun = this.isNew?axiosFaqInfoAdd:axiosFaqInfoEdit
          axiosFun(params).then(res => {
            that.getTableList();
            that.addModal = false;
            that.$Message.success(that.modalTitle+'成功！');
            that.formReset(name);
          });
        }
      });
    },
    addNew(){
      this.addData = {
        faqName:'',
        replyDesc:'',
        customerServiceType:"1"
      }
      this.isNew = true
      this.isDetail = false
      this.addModal = true
    },
    getItemDetail(id){
      axiosFaqInfoDetail({id}).then(res => {
        let data = res.data.data || {};
        this.addData = {
          id: data.id,
          faqName: data.faqName,
          replyDesc: data.replyDesc,
          customerServiceType:data.customerServiceType.toString()
        }
        this.addModal = true
      })
    },
    openDetail(item){
      this.getItemDetail(item.id)
      this.isDetail = true
    },
    editItem(item){
      this.getItemDetail(item.id)
      this.isDetail = false
      this.isNew = false
    },
    moveItem(value,item,msg){
      let that = this
      let params = {
        moveFlag: value,
        faqId: item.id
      }
      axiosFaqInfoMove(params).then(res => {
        that.getTableList(true);
        that.$Message.success(msg+'成功！');
      });
    },
    switchItem(value,item,msg){
      let that = this
      let params = {
        faqStatus: value,
        id: item.id
      }
      axiosFaqInfoShift(params).then(res => {
        that.getTableList(true);
        that.$Message.success(msg+'成功！');
      });
    }
  },
  watch: {
    catalogId() {
      this.getTableList();
    }
  }
};
</script>
<style scoped lang='less'>
</style>