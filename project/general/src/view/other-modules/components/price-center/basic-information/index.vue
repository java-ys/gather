<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="search"
      @on-reset="search"
    ></SearchList>
    <Button
      v-hasAuth="'basic-information-add'"
      type="primary"
      @click="handleItem(1)"
    >
      新建策略
    </Button>
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
          v-if="params.data.row.configStatus !== 3"
          v-hasAuth="'basic-information-operate'"
          ghost
          type="error"
          size="small"
          class="tableBtn"
          @click="shiftItem(params.data.row)"
        >
          停用
        </Button>
        <!-- <Button
          ghost
          type="success"
          size="small"
          class="tableBtn"
          @click="shiftItem(params.data.row, 0)"
          >启用</Button
        > -->
        <!-- <Button
          ghost
          type="warning"
          size="small"
          class="tableBtn"
          @click="handleItem(2, params.data.row)"
          >编辑</Button
        > -->
        <Button
          v-hasAuth="'basic-information-detail'"
          ghost
          type="info"
          size="small"
          @click="handleItem(2, params.data.row)"
        >
          详情
        </Button>
        <!-- <Button
          ghost type="info" size="small"
          @click="getLog(params.data.row)"
        >日志</Button>         -->
      </template>
    </m2-table>

    <!-- 新建策略 -->
    <edit :visible="addVisible" :type="type" @close="closeAdd"></edit>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import edit from "./component/edit";
import { getAppointedProvinceCityInAuth } from "_g/api/common.js";
import { inputList, parColumns } from "./fields";
import {
  baseInfoListService,
  getDicItemByDicCode,
  baseInfoOperateService,
} from "_o/api/priceCenter";
import mixin from "./mixin";
import { mapState, mapGetters } from "vuex"

export default {
  name: "basicInformation",
  components: {
    m2Table,
    edit,
  },
  mixins: [mixin],
  provide() {
    return {
      getCities: () => this.cities || [],
      getDicItem: () => this.dicItems || [],
      getRow: () => this.currentRow, // 处理单条数据
    };
  },
  data() {
    return {
      parColumns: parColumns(this),
      inputList: [],
      tableData: [],
      searchData: {},
      isLoading: true,
      addVisible: false,
      type: 1, // 1:新建、2:详情
      currentRow: {}, // 当前操作行数据
      cities: [],
      dicItems: []
    };
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    })
  },
  mounted() {
    this.getCityList();
    this.getDicItemList();
    this.getList();
    // 更新搜索
    inputList[3].dropList = this.bizTypeList
    this.inputList = inputList
  },
  methods: {
    setCurrentRow(row) {
      this.currentRow = row;
      return this;
    },
    // getLog() {},
    shiftItem(row) {
      const p = { editType: "setable", message: { id: row.id, isAble: false }};
      this.$Modal.confirm({
        title: "提示",
        content: "<p>是否确定停用该策略?</p>",
        onOk: () => {
          this.call(
            baseInfoOperateService,
            p,
            this.operateSuccess,
            this.operateError
          );
        },
        onCancel: () => {
          this.$Message.error("已取消");
        },
      });
    },
    operateSuccess() {
      this.getList();
    },
    operateError({ msg }) {
      // this.$Message.error(msg || "操作失败");
    },
    closeAdd(bStatus) {
      this.falsy("addVisible");
      this.pageSize = 10;
      this.current = 1;
      bStatus && this.getList();
    },
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getList();
    },
    handleItem(val, row = {}) {
      this.type = val;
      this.setCurrentRow(row).truy("addVisible");
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    getList() {
      this.isLoading = true;
      const {
        city,
        operateMode,
        driverSalaryCategory,
        productLine,
        configName,
        configStatus,
        updater,
      } = this.searchData;
      const p = {
        currPage: this.current,
        pageSize: this.pageSize,
        city: city,
        operateMode: operateMode,
        driverSalaryCategory: driverSalaryCategory,
        productLine: productLine,
        configName: configName,
        configStatus: configStatus,
        updater: updater,
      };
      this.call(
        baseInfoListService,
        this.clearObjectFalsy(p),
        this.listSuccess,
        this.listError
      );
    },
    listError({ msg }) {
      this.falsy("isLoading");
      //   this.$Message.error(msg || "获取基础信息列表失败");
    },
    listSuccess(data) {
      this.falsy("isLoading");
      if (data) {
        const { list, totalCount } = data;
        this.tableData = list;
        this.total = totalCount;
      }
    },
    getCityList() {
      this.call(getAppointedProvinceCityInAuth, {
        areaType: 1, // 已配置城市
        authDimension: 2, // 省市+机构维度
        businessLineList: [1, 2, 4, 6, 7]// 快车、专车、出租车
      }, this.citySuccess, this.cityError);
    },
    citySuccess(data) {
      if (data) {
        let cities = []
        for (let item of data) {
          if (item.nodes && item.nodes.length) {
            cities.push(...item.nodes)
          }
        }
        data = cities.map((it) => ({
          ...it,
          ...{
            label: it.city,
            value: it.cityID,
          },
        }));
        this.inputList[0].dropList = data || [];
        this.cities = JSON.parse(JSON.stringify(data)) || [];
        this.cities.unshift({ label: "全部", value: "1" });
      }
    },
    cityError({ msg }) {
      this.$Message.error(msg || "获取城市列表失败");
    },
    getDicItemList() {
      this.call(
        getDicItemByDicCode,
        {},
        this.dicItemSuccess,
        this.dicItemError
      );
    },
    dicItemSuccess(data) {
      if (data) {
        data = data.map((it) => ({
          ...it,
          ...{
            label: it.itemvalue,
            value: it.itemcode,
          },
        }));
        this.inputList[2].dropList = data || [];
        this.dicItems = JSON.parse(JSON.stringify(data)) || [];
        this.dicItems.unshift({ label: "全部", value: "1" });
      }
    },
    dicItemError({ msg }) {
      this.$Message.error(msg || "获取司机工资类别失败");
    },
  },
};
</script>

<style>
</style>
