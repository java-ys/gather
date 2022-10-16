<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      :selectNumber="99"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <!-- @cascade-change="handleCityChange" -->
    <!--    v-hasAuth="'urge-collect-add'"-->

    <Button type="primary" @click="(e) => showAdd()">新建</Button>
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
    <edit v-model="show" :cData="rowData" @refresh="getList"></edit>
  </div>
</template>

<script>
import { getProvinceCityList, getOnLineCity } from "_g/api/common.js";
import { inputList, tableColumns } from "./fields.js";
import m2Table from "_a/m2-table/v-table";
import list from "@/mixins/list";
import { tool } from "@/mixins/base";
import {
  listService,
  detailService,
  updateService,
} from "_o/api/vehicle-default";
import Edit from "./components/edit.vue";

export default {
  name: "vehicle-default-list",
  components: {
    m2Table,
    Edit,
    // Detail,
  },
  provide() {
    return {
      getCityList: () => {
        return this.cityList;
      },
    };
  },
  mixins: [tool, list],
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      cityList: [], // 已开通城市列表
      selectTemplate: null,
      show: false,
      rowData: undefined,
    };
  },
  created() {
    this.getCityList();
    this.func = listService;
    this.getList();
  },
  methods: {
    // 停用
    activate({ uuid, cityCode }) {
      this.$Modal.confirm({
        title: "提示",
        content: `确定停用该策略?`,
        onOk: async () => {
          const [err, data] = await this.toResult(
            updateService({ uuid, status: -2, cityCodes: [cityCode] })
          );
          if (err) {
            return;
          }
          this.$Message.success(`停用成功`);
          this.getList();
        },
      });
    },
    // type 1 编辑 2复制
    async openEdit({ uuid }, type = 1) {
      const [err, data] = await this.toResult(detailService({ uuid }));
      if (err) {
        return;
      }
      this.rowData = data;

      if (type - 2 === 0) {
        delete this.rowData.uuid;
        this.rowData._copy = true;
        this.rowData.effectiveTime = ''
      }
      if(type - 1 === 0) {
        this.rowData._edit = true
      }
      this.showEdit(this.rowData);
    },
    showAdd(p) {
      this.rowData = undefined;
      this.show = true;
    },
    showEdit() {
      this.show = true;
    },
    // 查看详情
    async showRow({ uuid }) {
      const [err, data] = await this.toResult(detailService({ uuid }));
      if (err) {
        return;
      }
      data._detail = true;
      this.rowData = data;
      this.showEdit(data);
    },
    async getCityList() {
      const [err, data] = await this.toResult(getOnLineCity({}));
      this.inputList[0].dropList = this.cityList = data
        ? [{label: '全国', value: '0'}].concat(data.map((it) => ({
            label: it.city,
            value: it.cityId,
          })))
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
  },
};
</script>

<style scoped></style>
