<!--
 * @description: 营运管理-司机管理-人员管理-人员详情-档案详情
 * @author: wuxuan
 * @date: 2019-07-27 15:17:32
!-->
<template>
  <div class="pickure-wrap">
    <Form
      inline
      :label-width="65"
    >
      <FormItem label="任务类型:">
        <Select
          v-model="searchList.taskType"
          filter
          style="width:200px"
        >
          <Option
            v-for="(item, i) in taskList"
            :key="i"
            :value="item.value"
          >
            {{ item.name }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="任务名:">
        <Input v-model="searchList.taskName" style="width: 200px;" clearable placeholder="搜索任务名"></Input>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          @click="searchTask"
        >
          搜索
        </Button>
        <Button type="default" style="margin-left: 8px" @click="resetTask">重置</Button>
      </FormItem>
    </Form>
    <t-table
      :current="current"
      :total="total"
      :isLoading="isLoading"
      :pageSize="pageSize"
      :parColumns="taskColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></t-table>
    <Modal
      v-model="showModal"
      title="任务详情"
      width="980px"
      :z-index="1"
    >
      <Row>
        <Col span="8">任务ID：{{taskDetail.taskId}}</Col>
        <Col span="8">任务名：{{taskDetail.taskName}}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">任务类型：{{taskDetail.taskTypeStr}}</Col>
        <Col span="8">任务状态：{{taskDetail.instanceStatusStr}}</Col>
        <Col span="8">任务是否达成：{{taskDetail.isTaskComplete}}</Col>
      </Row>
      <br>
      <Row>
        <Col span="12">生效时间：{{taskDetail.taskStartDate}} - {{taskDetail.taskEndDate}}</Col>
      </Row>
      <br>
      <Row>
        <Col span="24">规则说明：</Col>
        <Col span="24">
          <div v-html="taskDetail.taskDescribe"></div>
        </Col>
      </Row>
      <Divider  v-if="taskDetail.taskType!=2 && !(taskDetail.taskType==1 && taskDetail.indexType==6)"/>
      <div v-if="taskDetail.taskType!=2 && !(taskDetail.taskType==1 && taskDetail.indexType==6)">
        <Form
          inline
          :label-width="65"
        >
          <FormItem label="接单时间:">
            <DatePicker type="datetimerange" :value="dateValue" placeholder="请选择" style="width: 290px" @on-change="dateChange" :options="dateOption"></DatePicker>
          </FormItem>
          <FormItem label="筛选有效单:" :label-width='75'>
            <Select
              v-model="searchOrderList.validFlag"
              filter
              style="width:200px"
            >
              <Option
                v-for="(item, i) in validList"
                :key="i"
                :value="item.value"
              >
                {{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="searchOrder"
            >
              查询
            </Button>
            <Button type="default" style="margin-left: 8px" @click="resetOrder">重置</Button>
          </FormItem>
        </Form>
        <Table
          :columns="orderColumns"
          :data="taskOrderList"
        />
        <div style="margin: 10px;padding: 10px;overflow: hidden">
          <div style="float: right;">
            <Page
              show-total
              :total="orderTotal"
              :current="orderCurrent"
              :page-size="orderPageSize"
              @on-change="orderChangePage"
            >
            </Page>
          </div>
        </div>
      </div>
      <!-- <Table
        :columns="studyColumns"
        :data="studyList"
      /> -->
      <div slot="footer">
        <Button type="primary" @click="showModal = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  taskList,
  validList,
  taskColumns,
  studyColumns,
  orderColumns
} from "./fields.js"
import {
  driverTaskList,
  taskDetailOrderList
} from "_o/api/driver.js"
export default {
  name: "task",
  components: {

  },
  data() {
    let that =this
    return {
      taskList,
      validList,
      searchList:{
        taskType:'',
        taskName:'',
      },
      tableData:[],
      current: 1,
      total: 0,
      pageSize: 10,
      taskColumns:taskColumns(this),
      showModal:false,
      searchOrderList:{
        validFlag:'',
        orderEndTime:'',
        orderStartTime:''
      },
      dateOption:{
        disabledDate (date) {
          let smallDay=that.$moment().subtract(6, 'months').valueOf()
          return date && date.valueOf() < smallDay;
        }
      },
      dateValue:[],
      studyList:[],
      studyColumns,
      taskOrderList:[],
      orderColumns:orderColumns(this),
      orderCurrent: 1,
      orderTotal: 0,
      orderPageSize: 10,
      taskDetail:{},
      isLoading: false
    };
  },
  props:{
    driverUuid:{
      type:String,
      default:''
    },
    activeIndex:String
  },
  created() {
  },
  mounted(){
    // this.driverUuid && this.getTableList();
  },
  methods: {
    getTableList(){
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        driverUuid:this.driverUuid
      };
      let searchList=JSON.parse(JSON.stringify(this.searchList))
      searchList.taskType=searchList.taskType==-1?'':searchList.taskType
      params=Object.assign(params,searchList)
      this.isLoading = true;
      driverTaskList(params).then(res => {
        this.isLoading = false;
        this.total=res.data.data.totalCount
        this.tableData=res.data.data.list;
      }).catch(() => {
        this.isLoading = false;
      })
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    },
    searchTask(){
      this.current = 1;
      this.getTableList()
    },
    resetTask(){
      this.searchList.taskType=''
      this.searchList.taskName=''
      this.current = 1;
      this.getTableList()
    },
    dateChange(value){
      this.searchOrderList.orderEndTime=value[1]
      this.searchOrderList.orderStartTime=value[0]
    },
    searchOrder(){
      this.orderCurrent = 1;
      this.getOrderList()
    },
    orderChangePage(page) {
      this.orderCurrent = page;
      this.getOrderList();
    },
    resetOrder(){
      this.dateValue=[]
      this.orderCurrent = 1;
      this.searchOrderList={
        validFlag:'',
        orderEndTime:'',
        orderStartTime:''
      },
      this.getOrderList()
    },
    getOrderList(){
      let params = {
        currPage: this.orderCurrent,
        pageSize:this.orderPageSize,
        driverUuid:this.driverUuid,
        taskUuid:this.taskDetail.taskId
      };
      let searchOrderList=JSON.parse(JSON.stringify(this.searchOrderList))
      searchOrderList.validFlag=searchOrderList.validFlag==-1?'':searchOrderList.validFlag
      params=Object.assign(params,searchOrderList)
      taskDetailOrderList(params).then(res => {
        this.orderTotal=res.data.data.totalCount
        this.taskOrderList=res.data.data.list;
      })
    }
  },
  watch: {
    activeIndex(value) {
      if (value==="13") {
        this.getTableList();
      }
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ivu-table-cell span{
    white-space: normal;
}
</style>
