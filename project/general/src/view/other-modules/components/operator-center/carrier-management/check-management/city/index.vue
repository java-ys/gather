<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <div class="button-wrap">
      <Button v-hasAuth="'check-management-city-add'" type="primary" @click="addNew">新建考核模板</Button>
    </div>
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
<!--    新增/编辑-->
    <add
      v-if="showAdd"
      :visible="showAdd"
      :detail="detailData"
      @close="close"
    ></add>
<!--    详情-->
    <detail
      v-if="showDetail"
      :visible="showDetail"
      :detailData="detailData"
      @close="closeDetail"
    ></detail>
  </div>
</template>

<script>
import { getProvinceCityList } from "_g/api/common.js";
import { getAgentByCity } from "_g/api/configData";
import { cpTranslate } from "@/libs/tools";
import { inputList, tableColumns } from "./fields.js";
import Add from "./components/add.vue";
import Detail from "./components/detail.vue";
import m2Table from "_a/m2-table/v-table";
import { tool } from "_o/api/baseMixin.js";
import common from "../tool/common";
import {
  cityCommitAgentService,
  cityCopyService,
  cityDelService,
  cityDetailService,
  cityPageService,
  deputyCommissionService,
  cityQueryAgentListService,
  citySaveService,
  citySubmitAndCommitService,
  cityUpdateService,
} from "_o/api/city-check";

export default {
  name: "check-management-check",
  components: {
    Add,
    Detail,
    m2Table,
  },
  provide() {
    return {
      getCityList: () => this.originCityList
    }
  },
  mixins: [tool, common],
  data() {
    return {
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),

      showAdd: false,
      detailData: {},
      originCityList: [],
      showDetail: false,
    };
  },
  created() {
    this.func = cityPageService;
    this.getList();
  },
  mounted() {
    this.getCityList();
    // this.detail({id: 1}) // todo
  },
  methods: {
    // 关闭新增
    close(r) {
      this.showAdd = false;
      this.detailData = {};
      r && this.getList();
    },
    closeDetail() {
      this.showDetail = false;
      this.detailData = {};
    },
    delete({ id }) {
      let self = this;
      this.$Modal.warning({
        title: "提示",
        closable: true,
        content: `确认删除吗?`,
        onOk: async function () {
          const [err, data] = await self.toResult(cityDelService({ id }));
          if (err) {
            return;
          }
          self.$Message.success(`删除成功`);
          self.getList();
        },
      });
    },
    addNew() {
      this.detailData = {};
      this.showAdd = true;
    },
    async copy(row) {
      await this.getDetail(row);
      this.detailData._type = "copy" // 复制标识
      this.showAdd = true;
    },
    async edit(row) {
      await this.getDetail(row);
      this.showAdd = true;
    },
    async detail(row) {
      await this.getDetail(row);
      this.showDetail = true;
    },
    async create(row) {
      const [err, data] = await this.toResult(cityCommitAgentService({id: row.id}));
      if (err) {
        return;
      }
      this.$Message.success(`生成模板成功`);
      this.getList();
    },
    async getDetail(row) {
      const [err, data] = await this.toResult(
        cityDetailService({ id: row.id })
      );
      if (err || !data) {
        return;
      }
      this.detailData = data;
      this.detailData.id = row.id;
      this.detailData.cityAssessIndexVoList = this.detailData.cityAssessIndexVoList.map((it) => {
        if (it.parentFlag - 1 === 0) {
          // 如果是父指标 默认显示第一个子指标
          it._subIndex = 0;
        }
        if(typeof it.indexRuleJson === 'string') {
          it.indexRuleJson = JSON.parse(it.indexRuleJson)
        }
        return it;
      });
    },
    // 获取省市
    async getCityList() {
      const [err, data] = await this.toResult(getProvinceCityList({}));
      if (err) {
        this.$Message.error(err.message);
        return;
      }
      let list = cpTranslate(data);
      let ori = [];
      data.forEach(p => {
        if(p?.nodes?.length)
          ori = ori.concat(p.nodes)
      })
      this.originCityList = ori
      this.cascaderList = list;
      const f = this.inputList.find((it) => it.name === "cascader-input");
      if (!f) return;
      f.cascaderList = list;
    },
    setPageParams(p = {}) {
      delete p.provinceCode;
      // 根据cityID 回找 cityUuid
      if (p.cityUuidList) {
        let f = this.originCityList.find(
          (it) => it.cityID + "" === p.cityUuidList + ""
        );
        if (f) {
          p.cityUuidList = [f.cityUuid];
        } else {
          delete p.cityUuidList;
        }
      }
      return p;
    },
  },
};
</script>

<style scoped>
</style>
