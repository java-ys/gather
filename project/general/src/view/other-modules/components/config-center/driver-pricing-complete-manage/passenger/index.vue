<template>
  <div class="dynamic-price">
    <search-list
      :inputList="inputList"
      @on-change="handleChange"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <!-- v-hasAuth="'price-divers-add'" -->
    <Button type="primary"  v-hasAuth="'price-complete-add'" @click="(e) => showAdd()">新增策略</Button>
    <m2-table
      class="top15"
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </m2-table>
    <!-- 补偿明细 -->
    <Modal v-model="showRecord" width="860" title="奖励明细">
      <div >
        <v-table v-if="showRecord" :current="currents" :pageSize="pageSizes" :total="totals" :parColumns="modalTableColumns"
        :parTableData="tableDataLogs" :isShowPage="true"
        @changePage="modalTablePageChange"
        @changePageSize="modalTablePageSizeChange">
        </v-table>
      </div>
      <div slot="footer">
        <!-- :isDisabled="tableDataLogs.length===0" -->
        <export-file
          type="success"
          exportUrl="/config/replenishlRule/export"
          exportFileName="奖励明细信息.xlsx"
          :baseUrlKey="baseUrlKey"
          :isExportDetail= isExportDetail
          :queryData="exportData"
          btnText="导出表格"
      ></export-file>
        <Button type="primary" @click="isCloseModelDetail">关闭</Button>
      </div>
    </Modal>
    <add :visible="visible" :detail="detailData" @close="close"></add>
  </div>
</template>

<script>
import { inputList, tableColumns, extraLine, extraBiz, modalTableColumns } from "../fields.js";
import m2Table from "_a/m2-table/v-table";
import VTable from "_a/v-table/v-table";
import list from "@/mixins/list";
import { findO, tool } from "@/mixins/base";
import Add from "./add.vue";
import { mapState, mapGetters } from "vuex";
import { _getAreaInfoByCityCode, _getOpenCity } from "_g/api/general";
import { changeStatusService, getDetailService, queryService, updateService,
getPageQuery, queryDetailService, changeStatusServiceList, queryReplenishOrder } from '_o/api/dynamic-price'
import ExportFile from '_a/export-file/exportFile';


export default {
  name: "dynamic-price-list",
  components: {
    m2Table,
    Add,
    ExportFile,
    VTable
  },
  provide() {
    return {
      getCityList: () => this.cityList,
      getBizTypeList: () => this.bizTypeListF,
      getBusinessGradeList: () => this.businessGradeList,
      getExpandBizLineList: () => this.expandBizLineList
    };
  },
  mixins: [tool, list],
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
      businessGradeList: (state) => state.common.businessGradeList,
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName",
    }),
  },
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      modalTableColumns: modalTableColumns(this),
      cityList: [], // 已开通城市列表
      visible: false,
      detailData: undefined,
      expandBizLineList: [], // 过滤后的业务线
      bizTypeListF: [], // 过滤后的产品线
      showRecord: false, // 补偿明细
      // 补偿明细
      currents: 1,
      pageSizes: 10,
      totals: 0,
      id: "",
      tableDataLogs:[],
      isExportDetail:false,
      exportData:{
        uuid:""
      },
      baseUrlKey:"_routeAdmin"
    };
  },
  created() {
    this.getCityList();
    this.func = getPageQuery;
    this.getList();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.expandBizLineList = this.businessGradeList.filter((it) => !extraLine(it.value));
      findO("expandBizLine", "bind_key", this.inputList).dropList =this.expandBizLineList

      this.bizTypeListF = this.bizTypeList.filter(it => !extraBiz(it.value));
      findO("bizType", "bind_key", this.inputList).dropList = this.bizTypeListF;

    },
    // -1 删除 -3 停用
    activate({ uuid }, status) {
      // let msg = status - ( -1) === 0 ? '删除' : '停用'
      this.$Modal.confirm({
        title: "提示",
        content: `确定停用此规则吗？`,
        onOk: async () => {
          const [err] = await this.toResult(
            changeStatusServiceList({ uuid, changeStatus:-3 })
          );
          if (err) {
            return;
          }
          this.$Message.success(`停用成功`);
          this.getList();
        },
      });
    },
    delActivate({ uuid }, status) {
      this.$Modal.confirm({
        title: "提示",
        content: `确定删除此规则吗？`,
        onOk: async () => {
          const [err] = await this.toResult(
            changeStatusServiceList({ uuid, changeStatus:-1 })
          );
          if (err) {
            return;
          }
          this.$Message.success(`删除成功`);
          this.getList();
        },
      });
    },
    passSubmit({ uuid },val) {
      this.$Modal.confirm({
        title: "提示",
        content: `确定将此任务奖励规则提交至OA审批？`,
        onOk: async () => {
          const [err] = await this.toResult(
            changeStatusServiceList({ uuid, changeStatus:2 })
          );
          if (err) {
            return;
          }
          this.$Message.success(`${msg}成功`);
          this.getList();
        },
      });
    },
    // type 1 编辑 2复制
    async edit({ uuid }, type = 1) {
      const [err, data] = await this.toResult(queryDetailService({ uuid }));
      if (err) {
        return;
      }
      this.detailData = data;
      this.detailData.isCopy = type - 2 === 0
      this.visible = true;
    },
    // 打开新增弹层
    showAdd() {
      this.detailData = undefined
      this.visible = true;
    },
    // 查看详情
    async showRow({ uuid }) {
      const [err, data] = await this.toResult(queryDetailService({ uuid }));
      if (err) {
        return;
      }
      this.detailData = data
      // debugger
      this.detailData.isDetail = true
      this.visible = true;
    },
    async getCityList() {
      const { list } = await _getOpenCity({});
      this.cityList = list;
      findO("cityCode", "bind_key", this.inputList).dropList = list;
    },
    close(r) {
      this.visible = false;
      r && this.getList();
    },
    async handleChange(value, name) {
      if (name === "bizType") {
        // 产品线 车型联动
        let car = findO("vehicleLevel", "bind_key", this.inputList);
        if (value) {
          let f = this.bizTypeList.find((it) => `${it.value}` === `${value}`);
          car.dropList = f ? f.children : [];
        } else {
          car.dropList = [];
          car.value = "";
        }
      } else if (name === "cityCode") {
        // 城市获取区县
        let county = findO("areaCode", "bind_key", this.inputList);
        if (value) {
          const { list } = await _getAreaInfoByCityCode(value);
          county.dropList = list;
        } else {
          county.dropList = [];
          county.value = "";
        }
      }
    },
    // 获取补偿明细列表数据
    getModalTableData(val) {
      // console.log(11111,this.modalTableColumns)
      this.showRecord = true
      this.id = val;
      this.exportData.uuid = val;
      this.isExportDetail = true;
      // this.tableDataLogs = [{routePlanUuid:1321456464,routeNo:"123123465",replenishFare:2.2659}];
      queryReplenishOrder({
        uuid: this.id ,
        currPage: this.currents,
        pageSize: this.pageSizes
      }).then(res => {
        this.tableDataLogs = res.data.data.list;
        this.totals = res.data.data.totalCount;
      });
    },
    modalTablePageChange(page) {
      this.currents = page;
      this.getModalTableData(this.id);
    },
    modalTablePageSizeChange(pageSize) {
      debugger
      this.pageSizes = pageSize;
      this.getModalTableData(this.id);
    },
    // 跳转
    showOrder(val){
      // debugger
      // this.$router.push({
      //   name: val.clickUrl,
      //   query: val.clickParam,
      // });
      this.showRecord = false
      this.$router.push({name:'order-detail',params:{id: val.routePlanUuid}})
    },
    isCloseModelDetail(){
      this.showRecord = false;
      this.isExportDetail = false;
      this.currents = 1;
      this.pageSizes = 10;
      this.totals = 0;
    },
  },
};
</script>

<style scoped></style>
