<template>
  <div class="feedback-tool-container">
      <Button type="primary" @click="addnewType" style="margin-left: 20px" v-hasAuth="'feedback-type-add'">新增提报单类型</Button>
      <VTable
        style="margin-top: 20px;"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        :isShowPage='ispageShow'>
      </VTable>
      <modal v-model="newMobel" :title="title" :mask-closable="false" :width="600">
          <Form :label-width="120" :model="toolData" ref="toolData" :rules="ruleValidate">
            <FormItem label="提报单类型：" prop="name">
              <Input v-model="toolData.name" type="text" placeholder="" :maxlength='maxlength' />
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="newMobel = false">取消</Button>
            <Button type="primary" v-lazy-click="comfirm">确认</Button>
          </div>
        </modal>
  </div>

</template>

<script>
import { feedbackTypeList, addFeedbackType, updateFeedbackType} from '_o/api/experience.js';
import {tableTitle, toolPageData} from './fields.js';

export default {
  name: 'feedbackTool',
  components: {
  },
  data() {
    return {
      ...toolPageData,
      ruleValidate: {
          name: [
            { required: true, message: '必填', }
          ]
        },
    }
  },
  mounted() {
    this.getList();
    this.getTableColumns();
  },
  methods: {
    getList() {
      this.$store.commit('changeLoadingFlag', true)
      feedbackTypeList().then(res => {
          this.tableData = res.data.data;
          this.$store.commit('changeLoadingFlag', false)
      })
    },
    getTableColumns () {
      this.tableColumns = [];
      this.tableColumns = tableTitle(this);
    },
    addnewType(){
     this.newMobel=true;
     this.title='新增提报单类型';
     this.toolData={};
     this.$refs.toolData.resetFields();
    },
    comfirm(){
      this.$refs.toolData.validate((valid) => {
          if (valid) {
            if(this.title=='新增提报单类型'){
              addFeedbackType(this.toolData).then(res =>{
               if(res.data.success){
                this.newMobel=false;
                this.getList();
               }
             })
            }else{
              updateFeedbackType(this.toolData).then(res =>{
               if(res.data.success){
                this.newMobel=false;
                this.getList();
               }
             })
            }
          }
        })
    },
    del(){

    }
  }
}
</script>
<style lang="less">
</style>
