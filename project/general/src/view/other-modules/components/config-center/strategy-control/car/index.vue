<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
      @on-change="(v, key) => searchChange(v, key)"
    ></search-list>
    <Button type="primary" @click="addNew">新增策略</Button>
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
    <add-com v-model="show" :cData="rowDetail" @refresh="getList"></add-com>
  </div>
</template>

<script>
import { getProvinceCityList, getOnLineCity } from "_g/api/common.js";
import { inputList, tableColumns, excludeLine } from "./fields.js";
import m2Table from "_a/m2-table/v-table";
import list from "@/mixins/list";
import { tool } from "@/mixins/base";
import {
  pageList,
  updateService,
  deleteService,
  detailService,
} from "_o/api/lookForCar";
import addCom from "./components/add";
import AreaMixin from "./mixin/area.js";

export default {
  name: "look-for-car",
  components: {
    m2Table,
    addCom,
  },
  provide() {
    return {
      getCityList: () => {
        return this.cityList;
      },
    };
  },
  mixins: [tool, list, AreaMixin],
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      cityList: [], // 已开通城市列表
      selectTemplate: null,
      showTemplateModal: false,
      show: false,
      rowDetail: undefined,
    };
  },
  created() {
    this.func = pageList;
    this.getList();
  },
  mounted() {
    this.getCityList();
    this.$nextTick(() => {
      if (this.inputList[3]) {
        this.inputList[3].dropList = this.businessGradeList.filter(it => excludeLine(it.value));
      }
    });
  },
  methods: {
    async getRowDetail({ uuid }) {
      const [err, res] = await detailService({ uuid });
      if (err) {
        return {};
      }
      let r = res.data;
      r?.rules?.forEach((it) => {
        it.period = [it.startTime, it.endTime];
      });
      return {
        data: r,
      };
    },
    async getCityList() {
      const [err, data] = await this.toResult(getOnLineCity({}));
      this.inputList[1].dropList = this.cityList = data
        ? data.map((it) => ({
            label: it.city,
            value: it.cityId,
          }))
        : [];
    },
    getCityNameByCode(c) {
      c = `${c}`;
      if (!c || c - -1 === 0) return "全国";
      return c
        .split(",")
        .map((code) => {
          let f = this.cityList.find((it) => it.value === code);
          if (f) {
            return f.label;
          }
        })
        .filter(Boolean)
        .join(", ");
    },
    async searchChange(v, key) {
      if (key === "cityCode" && v) {
        const { list } = await this.getArea(v);
        this.inputList[2].dropList = list;
      }
    },
    // 停用
    activate({ uuid }) {
      this.$Modal.confirm({
        title: "提示",
        content: `确定停用吗?`,
        onOk: async () => {
          const [err, data] = await this.toResult(updateService({ uuid }));
          if (err) {
            return;
          }
          this.$Message.success(`停用成功`);
          await this.getList();
        },
      });
    },
    deleteRow({ uuid }) {
      this.$Modal.confirm({
        title: "提示",
        content: `是否删除该策略?`,
        onOk: async () => {
          const [err, data] = await this.toResult(deleteService({ uuid }));
          if (err) {
            return;
          }
          this.$Message.success(`删除成功`);
          await this.getList();
        },
      });
    },
    async copyEdit(row) {
      const { data = {} } = await this.getRowDetail(row);
      data._copy = true;
      this.rowDetail = data;
      this.show = true;
    },
    async openDetail(row) {
      const { data = {} } = await this.getRowDetail(row);
      data._detail = true;
      this.rowDetail = data;
      this.show = true;
    },
    addNew() {
      this.rowDetail = undefined;
      this.show = true;
    },
  },
};
</script>

<style scoped></style>
