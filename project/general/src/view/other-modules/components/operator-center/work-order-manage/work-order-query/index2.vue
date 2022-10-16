<template>
  <div>
    <Form inline="inline" :label-width="100">
      <Row>
        <Col span="6">
          <FormItem label="工单编号:">
            <Input
              v-model="driverName"
              clearable="clearable"
              style="width:180px"
              :maxlength="50"
            />
          </FormItem>
        </Col>

        <Col span="6">
          <FormItem label="工单分类:">
            <Select v-model="doAppeal" clearable style="width:180px">
              <Option :value="1">是</Option>
              <Option :value="0">否</Option>
            </Select>
          </FormItem>
        </Col>

        <Col span="6">
          <FormItem label="判责类型:">
            <Input
              v-model="agentName"
              clearable="clearable"
              style="width:180px"
              :maxlength="50"
            />
          </FormItem>
        </Col>

        <Col span="4">
          <FormItem label="关联订单编号:"  v-if="isShowMore">
            <Input
              v-model="driverPhone"
              clearable="clearable"
              style="width:180px"
              :maxlength="50"
            />
          </FormItem>
        </Col>

      </Row>
      <Rol
        <Col span="4">
          <FormItem label="创建时间:" v-if="isShowMore">
            <Input
              v-model="driverManagerName"
              clearable="clearable"
              style="width:200px"
              :maxlength="50"
            />
          </FormItem> </Col>
        </Col>
      <Col span="4">
        <FormItem label="城市:" v-if="isShowMore">
        <Input
          v-model="driverManagerPhone"
          clearable="clearable"
          style="width:200px"
          :maxlength="50"
      /></FormItem> </Col>
      <Col span="4">
        <FormItem label="运营商:" v-if="isShowMore">
          <DatePicker
            v-model="checkTaskTime"
            type="datetimerange"
            format="yyyy-MM-dd"
            placement="bottom-end"
            placeholder="请选择生效时间"
            style="width: 200px"
            transfer
          ></DatePicker>
        </FormItem>
      </Col>
      <Col span="4">
        <FormItem label="产品线:" v-if="isShowMore">
        <Select v-model="taskStatus" clearable style="width:150px">
          <Option :value="1">待执行</Option>
          <Option :value="2">已执行</Option>
          <Option :value="3">过期未执行</Option>
          <Option :value="4">已作废</Option>
          <Option :value="5">已终止</Option>
          <Option :value="6">无需执行</Option>
          <Option :value="7">未上线</Option>
        </Select>
      </FormItem> </Col>
       <Col span="4">
        <FormItem label="司机ID:" v-if="isShowMore">
        <Input
          v-model="driverManagerName"
          clearable="clearable"
          style="width:200px"
          :maxlength="50"
      /></FormItem> </Col>
       <Col span="4">
        <FormItem label="司机姓名:" v-if="isShowMore">
        <Input
          v-model="driverManagerName"
          clearable="clearable"
          style="width:200px"
          :maxlength="50"
      /></FormItem> </Col>
      <Col span="4">
        <FormItem label="司机姓名:" v-if="isShowMore">
        <Input
          v-model="driverManagerName"
          clearable="clearable"
          style="width:200px"
          :maxlength="50"
      /></FormItem> </Col>
      <Col span="4">
        <FormItem label="司机手机号:" v-if="isShowMore">
        <Input
          v-model="driverManagerName"
          clearable="clearable"
          style="width:200px"
          :maxlength="50"
      /></FormItem> </Col>
      <Col span="4">
        <FormItem label="车牌号:" v-if="isShowMore">
        <Input
          v-model="driverManagerName"
          clearable="clearable"
          style="width:200px"
          :maxlength="50"
      /></FormItem> </Col>
      <Col span="4">
        <FormItem label="处理状态:" v-if="isShowMore">
        <Select v-model="reviewResult" clearable style="width:150px">
          <Option :value="1">待审核</Option>
          <Option :value="2">通过</Option>
          <Option :value="3">违规</Option>
          <Option :value="4">过期未审核</Option>
        </Select>
      </FormItem> </Col>
      <Col span="4">
        <FormItem label="判责结果:" v-if="isShowMore">
        <Select v-model="violationLevel" clearable style="width:150px">
          <Option :value="1">轻微</Option>
          <Option :value="2">一般</Option>
          <Option :value="3">严重</Option>
          <Option :value="4">特大</Option>
        </Select>
      </FormItem> </Col>
      <Col span="4">
        <FormItem label="申诉结果:" v-if="isShowMore">
        <Select v-model="appealResult" clearable style="width:150px">
          <Option :value="0">待审核</Option>
          <Option :value="2">申诉驳回</Option>
          <Option :value="3">申诉通过</Option>
          <Option :value="4">过期未审核</Option>
        </Select>
      </FormItem> </Col>
      <FormItem :label-width="0">
        <div class="query-btn">
          <a class="show-more" @click="isShowMore = !isShowMore">
            <Icon type="md-remove" v-show="isShowMore" />
            <Icon type="md-add" v-show="!isShowMore" />
            <span v-show="!isShowMore">查看更多</span>
            <span v-show="isShowMore">收起更多</span>
          </a>
          <Button @click="init">重置</Button>
          <Button type="primary" @click="search">查询</Button>
        </div>
      </FormItem> </Col>
    </Form>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    />
  </div>
</template>

<script>
import { checkListColumns } from "./fields";

export default {
   data() {
    let { columns } = checkListColumns;
    return {
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      searchData: {},
      isShowMore: false,
      driverName: "",
      driverPhone: "",
      driverName:'',
      agentName: "",
      driverList: [],
      driverUuid:""
    };
  },
   methods: {
    init() {
      this.driverUuid = ""; // 司机名称
      this.driverPhone = ""; // 司机手机号
      this.driverName = ''; //司机姓名
      this.agentName = ""; // 运营商名称
      this.driverManagerName = ""; // 司管姓名
      this.driverManagerPhone = ""; // 司管手机号
      this.checkTaskTime = ""; // 任务执行日期
      this.operateTimeStart = ""; // 任务执行日期开始
      this.operateTimeEnd = ""; // 任务执行日期结束
      this.taskStatus = ""; // 任务执行状态
      this.reviewResult = ""; // 任务审核结果
      this.violationLevel = ""; // 违规级别
      this.doAppeal = ""; // 是否申诉
      this.appealResult = ""; // 申诉结果
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
      // this.getDriverList();
    },
    getTableList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        driverUuid: this.driverUuid,
        driverPhone: this.driverPhone,
        driverName:this.driverName,
        agentName: this.agentName,
        driverManagerName: this.driverManagerName,
        driverManagerPhone: this.driverManagerPhone,
        operateTimeStart: this.checkTaskTime[0],
        operateTimeEnd: this.checkTaskTime[1],
        taskStatus: this.taskStatus,
        reviewResult: this.reviewResult,
        violationLevel: this.violationLevel,
        doAppeal: this.doAppeal,
        appealResult: this.appealResult,
        taskUuid: this.$route.query.uuid
      };
      this.searchData = params;
      driverCheckTaskList(params).then(res => {
        let data = res.data.data || {};
        this.tableData = data.list;
        this.total = data.totalCount;
      });
    },
    search() {
      this.current = 1;
      this.getTableList();
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    },
    goDetail(val) {
      this.$router.push({
        name: "check-detail",
        query: {
          uuid: val.recordUuid
        }
      });
    }
  }
}
</script>

<style>

</style>