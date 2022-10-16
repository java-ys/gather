<template>
  <div>
    <SearchList :inputList="inputList" @on-change="onSearchFieldChange" @on-search="search" @on-reset="search" />
    <Button
      v-hasAuth="'driver-waterflow-strategy-add'"
      type="primary"
      @click="operation(1)"
    >新建策略</Button>
    <m2-table
      class="top15"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template slot="action" slot-scope="params">
        <Button
          v-if="params.data.row.status == 0 || params.data.row.status == 2"
          ghost
          size="small"
          type="primary"
          style="margin-right: 15px;"
          v-hasAuth="'driver-waterflow-strategy-enable'"
          @click="operation(0, params.data.row)"
        >启用</Button>
        <Button
          v-else
          ghost
          size="small"
          type="primary"
          style="margin-right: 15px;"
          v-hasAuth="'driver-waterflow-strategy-disable'"
          @click="operation(0, params.data.row)"
        >停用</Button>
        <Button
          v-if="params.data.row.status == 0"
          ghost
          size="small"
          type="primary"
          style="margin-right: 15px;"
          v-hasAuth="'driver-waterflow-strategy-edit'"
          @click="operation(2, params.data.row)"
        >编辑</Button>
        <Button
          ghost
          size="small"
          type="primary"
          style="margin-right: 15px;"
          v-hasAuth="'driver-waterflow-strategy-detail'"
          @click="operation(3, params.data.row)"
        >详情</Button>
      </template>
    </m2-table>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import { inputList, parColumns } from "./fields";
import { getOnLineCity } from "_g/api/common.js"
import {
  querySalaryDriverTypes,
  queryDriverWaterflowStrategyRuleList,
  queryChannelList,
  updateStrategyStatus,
  getAreaInfoByCityCode,
} from "_o/api/configData";

export default {
  name: "driver-waterflow-strategy-manage",
  components: {
    m2Table,
  },
  data() {
    return {
      parColumns: parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {},
      isLoading: true,
      showModal: false,
    };
  },
  created() {
    this.updateSalaryDriverTypes();
    this.updateChannelList();
    this.getCityList();
    this.getTableList();
  },
  activated() {
    this.getTableList();
  },
  methods: {
    onSearchFieldChange(value, key) {
      if(key === "cityCode") {
        if(value) this.updateAreas(value);
        else {
          const item = this.inputList.find(v => v.bind_key === "areaCode");
          if(item) {
            item.value = "";
            item.dropList = [];
          }
        }
      }
    },
    updateAreas(val) {
      getAreaInfoByCityCode({ cityCode: val }).then(res => {
        if(!res.data.success) return;
        const item = this.inputList.find(v => v.bind_key === "areaCode");
        if(item) item.dropList = (res.data.data || []).map(it => ({
          label: it.orgName,
          value: it.orgCode
        }));
      });
    },
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    getCityList() {
      getOnLineCity().then(res => {
        const item = this.inputList.find(v => v.bind_key === "cityCode");
        if(item) item.dropList = (res.data.data || []).map(item => ({
          label: item.city,
          value: item.cityId
        }));
      })
    },
    getTableList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData,
      };
      this.isLoading = true
      queryDriverWaterflowStrategyRuleList(params).then(res => {
        this.isLoading = false
        let data = res.data.data || {};
        this.tableData = data.list || [];
        this.total = data.totalCount || 0;
      }).catch(err => {
        this.isLoading = false
        this.total = 0
        this.tableData = []
      });
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    // 初始司机工资类别
    updateSalaryDriverTypes() {
      querySalaryDriverTypes().then(res => {
        if (res.data.success) {
          const salaryTypeList = res.data.data.driverTypeDtos || [];
          const item = this.inputList.find(v => v.bind_key === "driverType");
          if (salaryTypeList && item) {
            item.dropList = salaryTypeList.map(item => ({
              label: item.desc,
              value: item.driverType
            }));
          }
        }
      });
    },
    // 初始渠道列表
    updateChannelList() {
      queryChannelList().then(res => {
        if(!res.data.success) return;
        const item = this.inputList.find(v => v.bind_key === "channelSource");
        if(item) item.dropList = res.data.data.map(v => ({
          label: v.sourseName,
          value: v.sourseValue
        }))
      })
    },
    /**
     * 操作
     * @param {1|2|3} index 1-启/停，2-编辑，3-详情
     * @param {object} row 行数据
     */
    operation(index, row) {
      if(index === 0) this.updateStatus(row);
      else this.$router.push({name: "driver-waterflow-strategy-rule", params: row ? {uuid: row.uuid} : null, query: {type: index}});
    },
    // 启/停用
    updateStatus(row) {
      const s = row.status === 1 ? "停" : "启";
      this.$Modal.confirm({
        title: s + "用提醒",
        content: "确认" + s + "用该策略?",
        onOk: () => {
          updateStrategyStatus({
            uuid: row.uuid,
            status: row.status === 1 ? -2 : 1,
          }).then(res => {
            if(!res.data.success) return;
            this.getTableList();
          })
        },
        onCancel: () => {
          this.$Message.info("已取消");
        }
      });
    },
  }
};
</script>
<style scoped lang='less'>
</style>