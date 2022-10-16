<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <!-- @cascade-change="handleCityChange" -->
    <Button
      type="primary"
      v-hasAuth="'urge-collect-add'"
      @click="(e) => showAdd()"
      >新增</Button
    >
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
    <edit ref="_edit" :template="selectTemplate" @refresh="getList" @select="(selectTemplate = null,showTemplateModal = true)"></edit>
    <!-- 暂时不做 -->
    <!-- <detail ref="_detail"></detail> -->
    <TemplateModal
      v-model="selectTemplate"
      :show="showTemplateModal"
      app-name="运营后台管理系统"
      app-code="T3_OPERATION_SYSTEM"
      @cancel="showTemplateModal = false"
    />
  </div>
</template>

<script>
import { getProvinceCityList, getOnLineCity } from "_g/api/common.js";
import { getAgentByCity } from "_g/api/configData";
import { cpTranslate } from "@/libs/tools";
import { inputList, tableColumns } from "./fields.js";
import m2Table from "_a/m2-table/v-table";
import list from "@/mixins/list";
import { tool } from "@/mixins/base";
import {
  pressListService,
  pressGetOneService,
  pressUpdateStatusService,
} from "_o/api/urge";
import Edit from "./components/edit";
// import Detail from "./components/detail";
import TemplateModal from "_o/components/reach-platform/components/TemplateModal"

export default {
  name: "urge-collect-list",
  components: {
    m2Table,
    Edit,
    TemplateModal,
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
      showTemplateModal: false,
    };
  },
  created() {
    this.getCityList();
    this.func = pressListService;
    this.getList();
  },
  methods: {
    setPageParams(p) {
      if (p.currPage) {
        p.currentPage = p.currPage;
        delete p.currPage;
      }
      return p;
    },
    // 启用/停用
    activate({ uuid, taskStatus }) {
      let msg = taskStatus - 1 === 0 ? "停用" : "启用";
      let t = taskStatus - 1 === 0 ? 2 : 1;

      this.$Modal.confirm({
        title: "提示",
        content: `确定${msg}吗?`,
        onOk: async () => {
          const [err, data] = await this.toResult(
            pressUpdateStatusService({ uuid, taskStatus: t })
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
    async openEdit({ uuid }, type = 1) {
      const [err, data] = await this.toResult(pressGetOneService({ uuid }));
      if (err) {
        return;
      }
      if (type - 2 === 0) {
        delete data.id;
      }
      this.showAdd(data);
    },
    // 打开新增弹层
    showAdd(p) {
      this.$refs._edit.init(p);
    },
    // 查看详情
    async showRow({ uuid }) {
      const [err, data] = await this.toResult(pressGetOneService({ uuid }));
      if (err) {
        return;
      }
      data._detail = true
      this.showAdd(data);
    },
    async getCityList() {
      const [err, data] = await this.toResult(getOnLineCity({}));
      this.inputList[2].dropList = this.cityList = data
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
    // 获取省市
    // async getCityList() {
    //   const [err, data] = await this.toResult(getProvinceCityList({}));
    //   if (err) {
    //     this.$Message.error(err.message);
    //     return;
    //   }
    //   let list = cpTranslate(data);
    //   this.cascaderList = list;
    //   const f = this.inputList.find((it) => it.name === "cascader-input");
    //   if (!f) return;
    //   f.cascaderList = list;
    // },
    // handleCityChange(value) {
    //   const [provinceCode, citycode] = value;
    //   if (!provinceCode) {
    //     const f = this.findAgentOpt();
    //     if (!f) return;
    //     f.dropList = [];
    //     return;
    //   }
    //   this.getAgentList(citycode);
    // },
    // 根据城市code 获取运营商列表
    // async getAgentList(cityCode) {
    //   if (!cityCode) return;
    //   let [err, data] = await this.toResult(getAgentByCity({ cityCode }));
    //   if (err || !data) return;
    //   let list = data;
    //   const f = this.findAgentOpt();
    //   if (!f) return;
    //   f.dropList = list.map((item) => {
    //     return {
    //       label: item.name,
    //       value: item.uuid,
    //     };
    //   });
    // },
    // findAgentOpt() {
    //   return this.inputList.find((it) => it.bind_key === "agentUuid");
    // },
  },
};
</script>

<style scoped>
</style>