<template>
  <div>
    <div class="day-operate-wrap">
      <Form inline :label-width="120" class="formQueryStyle" :model="queryForm">
        <FormItem label='申请状态：'>
          <Select v-model="queryForm.status" clearable style="width: 200px">
            <Option :value="1">申请中</Option>
            <Option :value="2">已通过</Option>
            <Option :value="3">未通过</Option>
          </Select>
        </FormItem>
        <FormItem label='年龄：'>
          <InputNumber :min="0" v-model="queryForm.ageMin" style="width: 80px"></InputNumber><span
            style="margin:0 5px">岁至</span>
          <InputNumber :min="0" v-model="queryForm.ageMax" style="width: 80px"></InputNumber><span
            style="margin-left: 5px">岁</span>
        </FormItem>
        <FormItem label='性别：'>
          <Select v-model="queryForm.sex" clearable style="width: 200px">
            <Option :value="1">男</Option>
            <Option :value="2">女</Option>
          </Select>
        </FormItem>
        <FormItem label='学历：'>
          <Select v-model="queryForm.educationList" clearable multiple style="width: 200px">
            <Option v-for="item in dropList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label='用车时间段：'>
          <Select v-model="queryForm.usagePeriod" clearable style="width: 200px">
            <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label='用车频次：'>
          <Select v-model="frequency" clearable style="width: 200px">
            <Option v-for="(item,index) in frequencyList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button style="margin: 0 20px 0 -20px" @click="clearQueryData">清空</Button>
          <Button type="primary" @click="queryData">查询</Button>
        </FormItem>
      </Form>
      <ExportFile exportUrl='/admin/passenger/recruit/export' exportFileName='体验官报名结果.xls' :queryData='queryAjaxPramas'
        btnText='导出查询结果' v-hasAuth="'sign-export'">
      </ExportFile>
      <Button type="primary" @click="approval" style="margin-left: 20px" v-hasAuth="'sign-approval'" :disabled="isDisabled">审批</Button>
    </div>
    <VTable style="margin-top: 20px;" class="staff-table-container" :total="total" :current="current"
      :pageSize="pageSize" :parColumns="tableColumns" :parTableData="tableData" @changePage="changePage"
      @changePageSize="changePageSize" @selectHandle="selectHandle">
    </VTable>
    <modal v-model="newMobel" title="体验官审批" :mask-closable="false" :width="600">
      <Form :label-width="120" :model="signData" ref="signData" :rules="ruleValidate">
        <FormItem label="审批结果：" prop="status">
          <Select clearable style="width:200px" v-model="signData.status">
            <Option v-for="item in signType" :value="item.value" :key="item.value">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="signData.remark" type="text" placeholder="请输入备注" :maxlength='maxlength' />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="newMobel = false">取消</Button>
        <Button type="primary" @click="approvalOk">确认</Button>
      </div>
    </modal>
  </div>
</template>

<script>
  import { experienceList, approval } from '_o/api/experience.js';
  import { tableTitle, signList } from './fields.js';
  import ExportFile from '_a/export-file/exportFile';
  export default {
    name: 'sign',
    components: {
      ExportFile,
    },
    created() {
      this.getTableColumns();
    },
    mounted() {
      this.clearQueryData();
    },
    data() {
      return {
        ...signList,
        frequency:'',
        ruleValidate: {
          status: [
            { required: true, message: '审批结果不能为空', type:'number'}
          ],
        },
        uuids: [],
        mobiles: [],
        isDisabled:true
      }
    },
    methods: {
      queryData() { // 点击查询
        this.current = 1;
        this.queryAjaxPramas = {};
        for (let searchkey in this.queryForm) {
          if (this.queryForm[searchkey] !== null && this.queryForm[searchkey] !== '' && this.queryForm[searchkey] !== undefined) {
            this.queryAjaxPramas[searchkey] = this.queryForm[searchkey];
          };
        };
        if(this.frequency){
          let frequency = JSON.parse(this.frequency)
          this.queryAjaxPramas = Object.assign(frequency,this.queryAjaxPramas)
        }
        this.getList()
      },
      clearQueryData() { // 点击清空
        this.queryForm = {
          ageMin: null,
          ageMax: null,
          educationList:null
        },
        this.frequency = ''
        this.current = 1
        this.queryData()
      },
      getList() {
        let params = {
          currPage: this.current,
          pageSize: this.pageSize
        };
        this.uuids = [];
        this.mobiles = [];
        let obj = Object.assign(params, this.queryAjaxPramas);
        this.$store.commit("changeLoadingFlag", true);
        experienceList(obj).then(res => {
          this.total = res.data.data.totalCount;
          this.current = res.data.data.currPage !== 0 ? res.data.data.currPage : 1;
          // this.pageSize = res.data.data.pageSize;
          this.tableData = res.data.data.list;
          this.tableData.forEach(item=>{
            if(item.status!=1){
              item._disabled = true
            }
            })
          this.$store.commit('changeLoadingFlag', false)
        })
      },
      getTableColumns() {
        this.tableColumns = [];
        this.tableColumns = tableTitle(this);
      },
      changePageSize(val) {
        this.pageSize = val;
        this.getList();
      },
      changePage(val) {
        this.current = val;
        this.getList();
      },
      approval() {
        if(this.uuids.length>0){
        this.newMobel = true;
        this.signData = {};
        this.$refs.signData.resetFields();
        }
      },
      selectHandle(list) {
        if(list.length>0){
          this.isDisabled = false
        }else{
          this.isDisabled = true
        }
        this.uuids = list.map(itm => {
          return itm.uuid
        })
        this.mobiles = list.map(itm => {
          return itm.mobile
        })
      },
      approvalOk() {
        this.$refs.signData.validate((valid) => {
          if (valid) {
            let data = {
              uuids: this.uuids,
              mobiles: this.mobiles,
              status: this.signData.status,
              approveDesc: this.signData.remark
            }
            approval(data).then(res => {
              if (res.data.success) {
                this.newMobel = false;
                this.getList();
                this.isDisabled = true
              }
            })

          } else {
            // this.$Message.error('请选择审批结果');
          }
        })
      }
    }
  }
</script>
<style lang="less">

</style>