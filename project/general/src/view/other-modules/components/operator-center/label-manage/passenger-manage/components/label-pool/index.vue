<!--充电站-配置管理-订单管理列表-wx-->
<template>
  <div>
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <div class="flex-between"> 
      <Button type="primary" @click="openNew" v-hasAuth="'passenger-manage-add'">新建标签</Button>
      <!-- <Button type="primary" @click="openHistory" v-hasAuth="''">操作记录</Button> -->
    </div>
    <VTable
      class="top15"
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></VTable>
    <Modal v-model="labelModal" :width="800" :title="modalTitle" :mask-closable="false" footer-hide>
      <Form ref="labelModalData" :model="labelModalData" :rules="ruleValidate" :label-width="120">
        <FormItem label="评价对象：" prop="evaluationTarget">
          <Select :disabled="modalTitle == '编辑标签'" v-model="labelModalData.evaluationTarget" placeholder="请选择评价对象" style="width:200px;">
            <Option v-for="item in targetList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="标签名称：" prop="labelName">
          <Input
            :disabled="modalTitle == '编辑标签'"
            v-model="labelModalData.labelName"
            :maxlength="8"
            placeholder="请输入标签名称"
            style="width:200px;"
          ></Input>
          <span class="counter">( {{labelModalData.labelName?labelModalData.labelName.length:0}}/8 )</span>
        </FormItem>
        <div class="flex-box">
          <FormItem label="标签类型：" prop="labelTypeUuid" class="right30">
            <Select v-model="labelModalData.labelTypeUuid" filterable placeholder="请选择标签类型" style="width:200px;">
              <Option v-for="item in labelTypeList" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem v-if="labelModalData.labelTypeUuid=='1'" label="标签类型名称：" prop="newLabelType">
            <Input
              v-model="labelModalData.newLabelType"
              placeholder="请输入标签类型名称"
              style="width:200px;"
            ></Input>
          </FormItem>
        </div>
        <FormItem label="评价属性：" prop="evaluationQuality">
          <Select v-model="labelModalData.evaluationQuality" placeholder="请选择评价属性" style="width:200px;">
            <Option v-for="item in qualityList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <Divider class="bottom10"/>
        <div class="right-flex">
          <Button @click="cancelNew('labelModalData')">取消</Button>
          <Button type="primary" v-lazy-click="{fn:addNew,params:{labelModalData:'labelModalData'}}" style="margin-left: 8px">确定</Button>
        </div>
      </Form>
    </Modal>
    <history-modal :show="isHistoryModal"></history-modal>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import historyModal from "../history-modal.vue";
import {
  cacheData,
  returnFields
} from "./fields";
import {
  axiosListLabel,
  axiosAddLabel,
  axiosUpdateLabel,
  axiosListLabelType
} from "_o/api/operator-carrier";
export default {
  props: {
    tabVal: {
      type: String,
      default:'tab1'
    }
  },
  components: {
    VTable,
    historyModal
  },
  data() {
    return {
      ...cacheData,
      parColumns: [],
      tableData: [],
      labelModal: false,
      labelModalData: {
        evaluationTarget: "",
        addLabelTypeStatus: 0,
        newLabelType: "",
        labelTypeUuid: "",
        labelName: "",
        evaluationQuality: "",
        businessId: this.$route.name==='special-passenger-manage'?2:4
      },
      labelTypeList: [],
      modalTitle: '新建标签',
      isHistoryModal:false
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  activated(){
    //console.log(123)
    // this.$store.commit("changeLoadingFlag", false);
  },
  mounted() {
    this.getLabelTypeList();
    this.getList(this.searchData);
  },
  methods: {
    openHistory(){
      this.isHistoryModal = true
    },
    // 获取标签类型列表
    getLabelTypeList() {
      axiosListLabelType({
        businessId: this.$route.name==='special-passenger-manage'?2:4
			}).then(res=>{
        let data = res.data.data||[]
        let list = []
        data.forEach(item=>{
          list.push({
            value: item.uuid,
            label: item.labelType
          })
        })
        this.inputList[2].dropList=[...list]
        this.labelTypeList=[...list]
        this.labelTypeList.unshift({
          value: "1",
          label: "新建标签"
        })
      })
    },
    openNew() {
      this.labelModalData = {
        evaluationTarget: "",
        addLabelTypeStatus: 0,
        newLabelType: "",
        labelTypeUuid: "",
        labelName: "",
        evaluationQuality: "",
        businessId: this.$route.name==='special-passenger-manage'?2:4
      };
      this.modalTitle = '新建标签'
      this.labelModal = true;
    },
    addNew(name) {
      if(typeof name === 'object' && name.labelModalData){
        name = name.labelModalData;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {...this.labelModalData}
          if(params.labelTypeUuid=='1'){
            params.addLabelTypeStatus = 1
            params.labelType = params.newLabelType
            delete params.labelTypeUuid
            delete params.newLabelType
          }else{
            params.addLabelTypeStatus = 0
            delete params.newLabelType
            delete params.labelType
          }
          let axiosFun = params.uuid?axiosUpdateLabel:axiosAddLabel
          axiosFun(params).then(res=>{
            this.$Message.success(res.data.msg||'操作成功')
            this.labelModal = false
            this.getList(this.searchData,true);
            if(params.addLabelTypeStatus==1){
              this.getLabelTypeList();
            }
          }).catch(err=>{
            this.labelModal = true
          })
        } else {
          this.labelModal = true;
        }
      });
    },
    cancelNew(name) {
      this.$refs[name].resetFields();
      this.labelModal = false;
    },
    // 停用启用操作
    changeStatus(item){
      let params = {
        uuid: item.uuid,
        addLabelTypeStatus: 0,
        labelStatus: Number(!item.labelStatus)
      }
      axiosUpdateLabel(params).then(res=>{
        this.$Message.success(res.data.msg||'操作成功')
        this.getList(this.searchData,true);
      })
    },
    // 条件搜索后回调方法
    queryData(data) {
      this.pageObj.current = 1;
      for (let key in this.searchData) {
        delete this.searchData[key];
      }
      for (let key in data) {
        this.searchData[key] = data[key];
      }
      this.getList(data);
    },
    clearQueryData() {
      // 点击清空
      this.pageObj.current = 1;
      for (let key in this.searchData) {
        delete this.searchData[key];
      }
      this.getList();
    },
    changePage: function(val) {
      this.pageObj.current = val;
      this.getList(this.searchData);
    },
    changePageSize: function(val) {
      this.pageObj.pageSize = val;
      this.getList(this.searchData);
    },
    // 获取列表
    getList: function(obj, notLoading) {
      // let that = this;
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current,
        businessId: this.$route.name==='special-passenger-manage'?2:4
      };
      if (obj) {
        for (let key in obj) {
          params[key] = obj[key];
        }
      }
      !notLoading && this.$store.commit("changeLoadingFlag", true);
      axiosListLabel(params).then(res => {
        let resdata = res.data.data;
        this.tableData = (resdata && resdata.list) || [];
        this.pageObj.total = resdata && resdata.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    }
  },
  watch:{
    tabVal(newVal){
      if(newVal=='tab1'){
        //console.log(123)
        this.getList(this.searchData);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.counter {
  vertical-align: bottom;
  margin-left: 12px;
}
.right-flex {
  display: flex;
  justify-content: flex-end;
}
.bottom10 {
  margin-bottom: 10px;
}
.info-modal {
  /deep/ .ivu-modal-body {
    padding-bottom: 40px;
    line-height: 30px;
  }
}
.flex-box{
  display: flex;
  justify-content: flex-start;
}
</style>

