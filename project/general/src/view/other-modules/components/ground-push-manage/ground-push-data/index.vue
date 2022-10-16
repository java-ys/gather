<!--电子围栏管理-->
<template>
  <div class="carrier">
    <div class="carrier-header">
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
        @on-change="selectChange"
      />
      <div>
        <div class="totleData" style="display: flex; justify-content: space-between; margin-bottom: 26px;">
          <div style="flex-basis: 25%;">
            <span style="font-size: 22px; font-weight: bold;">汇总数据</span>
          </div>
          <div style="display: flex; font-size: 14px;">
            <section style="height: 46px; flex-basis: 50%; display: flex; justify-content: space-around;">
              <p>有效注册|2000</p>
              <p>有效首单|800</p>
              <p>有效多单|400</p>
              <p>异常人数|400</p>
            </section>
            <section style="border: 1px dashed #000; flex-basis: 50%; display: flex; height: 46px; justify-content: space-between; flex-wrap: wrap;">
              <p>首单达标率|800/1000 80%</p>
              <p>多单达标率|400/800 50%/60% 83.33%</p>
              <p>
                首单达标率|800/1000 80%
                <Icon type="ios-help-circle-outline" style="cursor: pointer;" size="20" @click="popView" />
              </p>
            </section>
          </div>
        </div>
        <div class="title">
          <div>
            <span style="font-size: 22px; font-weight: bold;">明细数据</span>
          </div>
        </div>
      </div>
    </div>
    <div class="carrier-content">
      <VTable
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="parColumns"
        :parTableData="tableData"
        style="margin-top: 25px;"
        @selectObj="selectObj"
        @changePage="changePage"
        @changePageSize="changePageSize"
      />

      <Modal
        v-model="visible"
        :title="title"
        width="600"
        :mask-closable="false"
        :closable="false"
      >
        <section>
          预计结算金额 = 单价 * 实际首单量 * 目标首单达成率 * 多单达成率 * 多单率低于下限扣点
        </section>
        <section style="display: flex; padding-left: 92px;">
          <span style="margin-right: 33px;">50</span>
          <span style="margin-right: 71px;">800</span>
          <span style="margin-right: 54px;">80%</span>
          <span style="margin-right: 71px;">100%</span>
          <span>1</span>
        </section>
      </Modal>
    </div>
  </div>
</template>

<script>
import { returnFields, inputList, railTypeMap, statusData, serviceTypeData } from "./index"
import { getCarrierList } from "_o/api/operator-carrier"
import { cityList } from "_o/api/assetSupplier.js"
import { keys, cpLabelValue } from "@/libs/tools"
import VTable from "_a/v-table/v-table"
import SearchList from "_a/search-list/search-list"
import { cpTranslate } from "@/libs/tools";
import {mapActions, mapGetters, mapState} from "vuex";
import {
  selectPen,
  getPenDetail,
  updateFenceStatus,
  getCitys
} from "_o/api/configData.js"
export default {
  components: {
    VTable,
    SearchList,
  },
  data() {
    return {
      ...returnFields(this),
      title: "结算公式",
      visible: false,
      tableData: [],
      inputList: [],
      isLoading: true,
      pageSize: 10,
      currPage: 1,
      searchListParams: {} // 保存搜索条件参数
    }
  },
  computed: {
    ...mapState({ }),
    ...mapGetters({ }),
  },
  mounted() {
    this.getTableList()
    this.inputList = inputList
    this.setProvinceCity()
  },
  methods: {
    async setProvinceCity() {
      const f = this.inputList.find(it => it.name === "cascader-input");
      if (!f) return;
      const { list } = await this.getCityList();
      this.provinceCityList = list;
      f.cascaderList = list;
    },
    getCityList() {
      return new Promise((resolve) => {
        cityList({}).then(res => {
          let list = res.data.data || []
          let params = {
            list: list,
            labelKey: "provinceName",
            valueKey: "provinceCode",
            children: "cityDtoList",
            sonLableKey: "orgName",
            sonValueKey: "orgCode",
            isDeep: true,
          }
          list = cpLabelValue(params)
          resolve({ list })
        });
      })

    },
    getTableList() {
      const params = this.searchListParams
      // 获取表格数据
      params.pageSize = this.pageSize
      params.currPage = this.current
      selectPen(params).then(res => {
        this.tableData  = (res.data.data && res.data.data.list) || []
        // 过滤运营围栏和人车证过滤围栏
        // this.tableData = list.filter(item => item.railType !== 1 &&  item.railType !== 28)
        this.total = (res.data.data && res.data.data.totalCount) || 0
        this.$store.commit("changeLoadingFlag", false)
      })
    },
    popView() {
      this.visible = true
    },
    confirm(data) {
      if (data) this.getTableList()
      this.isPop = false
    },
    search(data) {
      this.current = 1
      this.searchListParams = { ...data }
      this.getTableList()
    },
    reset(data) {
      this.current = 1
      this.searchListParams = {}
      this.getTableList()
    },
    selectObj(val) {
      this.current = val
      this.getTableList()
    },
    changePage(val) {
      this.current = val
      this.getTableList()
    },
    changePageSize(val) {
      this.pageSize = val
      this.getTableList()
    },
    selectChange(data,name){
    }
  }
}
</script>
<style scoped>
.carrier-header {
  margin-top: 10px;
}
</style>
