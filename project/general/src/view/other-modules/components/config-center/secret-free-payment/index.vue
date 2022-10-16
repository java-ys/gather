<template>
  <div class="driver-configure">
    <search-list :inputList="inputList" @on-search="searchData" @on-reset="resetData"></search-list>
    <div class="button-wrap">
      <Button type="primary" v-hasAuth="'strategy-create'" @click="addRow">新增策略</Button>
      <Button type="primary" v-hasAuth="'trigger-config'" @click="toTrigger">触发频率</Button>
    </div>
    <m2-table
      class="mt-20"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="tablePageChange"
      @changePageSize="tablePageSizeChange"
      ></m2-table>
    <log ref="log" />
    <!-- 操作记录弹框 -->
    <Modal v-model="showRecord" width="960" title="操作记录">
      <div class="showRecord-content">
        <v-table :current="current" :pageSize="pageSize" :total="total" :parColumns="tableColumns" :parTableData="tableData" :isShowPage="true" @changePage="modalTablePageChange" @changePageSize="modalTablePageSizeChange">
        </v-table>
      </div>
      <div slot="footer">
        <Button type="primary" @click="showRecord = false">确定</Button>
      </div>
    </Modal>

    <!-- 新增 编辑 详情 -->
    <Modal v-model="showModal" width="660" :title="modalTitle" @on-cancel="cancel">

      <div slot="footer">
        <Button @click="cancel">{{ !isEdit ? '关闭' : '取消' }}</Button>
        <Button v-if="isEdit" type="primary" v-lazy-click="confirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { cpTranslate, cpLabelValue } from "@/libs/tools";
import m2Table from "_a/m2-table/v-table";
import { inputList, tableColumns, modalTableColumns } from "./conf";
import { secretFreeGuidanceQueryPage, upOrDownLine } from "_o/api/guide-config";
import { cityList } from "_o/api/assetSupplier.js"
import { getProvinceCityAllList } from "_g/api/common.js";
import log from "./components/log";
import { mapState } from "vuex";
export default {
  name: "secret-free-payment",
  data() {
    return {
      formData: {},
      showModal: false,
      modalTitle: '上线',
      inputList: JSON.parse(JSON.stringify(inputList)),
      cityList: [], // 城市
      cascaderList: [],
      showRecord: false, // 操作记录
      isLoading: false,
      id: "",
      tableColumns: tableColumns(this),
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      accountDetail: { supId: 0, id: 0 },
      isEdit: true,

    };
  },
  components: { m2Table, log },
  mounted() {
    this.translateCityList()
    this.getTableConfigData();
    this.inputList[2].dropList = this.businessGradeList
  },
  watch: {
    showModal(v) {},
    businessGradeList(v) {
      this.inputList[2].dropList = v
    }
  },
  computed: {
    ...mapState({
      businessGradeList: state => state.common.businessGradeList
    })
  },
  methods: {
    async onlineAndOffline({ id, operatorFlag, operatorType }) {
      this.$Modal.confirm({
        title: '提示',
        content: operatorFlag === 2 ? '是否确认上线' : '是否确认下线',
        onOk: async () => {
          const res = await upOrDownLine({ id, operatorFlag, operatorType })
          if (!res.data.success) return this.$Message.error(res.data.msg)
          this.current = 1
          this.pageSize = 10
          this.getTableConfigData()
        }
      })
    },
    cancel() {
      console.log('cancel');
    },
    confirm() {
      console.log('confirm');
    },
    edit(id) {
      this.$router.push({
        name: 'payment-strategy-edit',
        params: { id }
      })
    },
    detail(id) {
      this.$router.push({
        name: 'payment-strategy-detail',
        params: { id }
      })
    },
    addRow() {
      this.$router.push({
        name: 'payment-strategy-create'
      })
    },
    toTrigger() {
      this.$router.push({
        name: "secret-free-payment-trigger",
      })
    },
    getTableConfigData(params = this.searchParams) {
      this.isLoading = true
      let conf = {
        currPage: this.current,
        pageSize: this.pageSize,
      };
      params = Object.assign(conf, params);
      secretFreeGuidanceQueryPage(params).then(res => {
        let list = res.data.data.list;
        this.tableData = list;
        this.total = res.data.data.totalCount;
        this.isLoading = false
      });
    },
    translateCityList() {
      if (this.cityList.length > 0) return
      getProvinceCityAllList().then(res => {
        let list = cpTranslate(res.data.data);
        this.cityList = [{ label: "全国所有城市", value: 1 }, ...list];
        this.inputList[1].cascaderList = this.cityList
      });
    },
    // 获取操作记录列表数据
    getModalTableData(id) {
      this.id = id;
      // recommendLog({
      //   businessCode: 1,
      //   businessId: id,
      //   currPage: this.current,
      //   pageSize: this.pageSize
      // }).then(res => {
      //   this.tableData = res.data.data.list;
      //   this.total = res.data.data.totalCount;
      // });
    },
    searchData(params) {
      this.searchParams = params;
      this.current = 1;
      this.getTableConfigData();
    },
    resetData() {
      // 重置搜索条件与分页
      this.current = 1;
      this.searchParams = {};
      this.getTableConfigData();
    },
    tablePageChange(page) {
      this.current = page;
      this.getTableConfigData();
    },
    tablePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTableConfigData();
    },
    modalTablePageChange(page) {
      this.current = page;
      this.getModalTableData(this.id);
    },
    modalTablePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getModalTableData(this.id);
    },
    goLog(val) {
      this.$refs.log.init({ ...val, ...{ type: 1 } });
    },
  }
};
</script>

<style lang="less">
.driver-configure {
  .btn-wrap {

  }
  .button-wrap {
    margin-bottom: 20px;
  }
}
</style>
