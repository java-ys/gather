<template>
  <div class="dynamic-price">
    <search-list
      :inputList="inputList"
      @on-change="handleChange"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <Button type="primary" v-hasAuth="'price-passenger-add'" @click="(e) => showAdd()">新增策略</Button>
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
    <add :visible="visible" :detail="detailData" @close="close"></add>
  </div>
</template>

<script>
import { inputList, tableColumns, extraLine, extraBiz } from "../fields.js";
import m2Table from "_a/m2-table/v-table";
import list from "@/mixins/list";
import { findO, tool } from "@/mixins/base";
import Add from "./add.vue";
import { mapState, mapGetters } from "vuex";
import { _getAreaInfoByCityCode, _getOpenCity } from "_g/api/general";
import { changeStatusService, getDetailService, queryService, updateService } from '_o/api/dynamic-price'
import {defaultInner} from "../fields"
export default {
  name: "dynamic-price-list",
  components: {
    m2Table,
    Add,
  },
  provide() {
    return {
      getCityList: () => this.cityList,
      getBizTypeList: () => this.bizTypeList,
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
      cityList: [], // 已开通城市列表
      visible: false,
      detailData: undefined,
      expandBizLineList: [], // 过滤后的业务线
      // bizTypeListF: [] // 过滤后的产品线
    };
  },
  created() {
    this.getCityList();
    this.func = queryService;
    this.getList();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.expandBizLineList = this.businessGradeList.filter((it) => !extraLine(it.value));
      findO("expandBizLine", "bind_key", this.inputList).dropList =this.expandBizLineList

      // this.bizTypeListF = this.bizTypeList.filter(it => !extraBiz(it.value));
      findO("bizType", "bind_key", this.inputList).dropList = this.bizTypeList;

    },
    // -2 停用 -1 删除
    activate({ uuid }, status) {
      let msg = status - ( -1) === 0 ? '删除' : '停用'
      this.$Modal.confirm({
        title: "提示",
        content: `确定${msg}该策略？`,
        onOk: async () => {
          const [err] = await this.toResult(
            changeStatusService({ uuid, status })
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
      const [err, data] = await this.toResult(getDetailService({ uuid }));
      if (err) {
        return;
      }
      this.detailData = this.handleDetailData(data);
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
      const [err, data] = await this.toResult(getDetailService({ uuid }));
      if (err) {
        return;
      }
      this.detailData = this.handleDetailData(data)
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
    handleDetailData(data) {
      if(!data?.discountItems?.length) return data
      // 添加兜底系数
      data.discountItems.forEach(item => {
        if(!item?.defaultDiscountDetails?.length) {
          item.defaultDiscountDetails = [{...defaultInner}];
        }
      })
      return data
    }
  },
};
</script>

<style scoped></style>
