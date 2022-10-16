<template>
  <div>
    <searchList
      ref="searchList"
      :inputList="inputList"
      @on-search="searchData"
      @on-reset="resetData"
    >
    </searchList>
    <export-file
      v-hasAuth="''"
      type="success"
      :isDisabled="total === 0"
      baseUrlKey="_workOrder"
      exportUrl="/manage/order/bill/export"
      exportFileName="账单列表.xlsx"
      :queryData="exportParams"
      btnText="导出"
    ></export-file>
    <m2-table
      class="top15"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="tablePageChange"
      @changePageSize="tablePageSizeChange"
    >
    </m2-table>
    <detail ref="detail"></detail>
  </div>
</template>
<script>
import searchList from "_a/search-list/search-list.vue"
import * as webapi from "_o/api/work-order/common.js"
import m2Table from "_a/m2-table/v-table"
import detail from "./components/detail"
import { inputList, tableTitle } from "./field"
import { getBillList } from "_o/api/work-order/payment"
import ExportFile from "_a/export-file/exportFile"
import { fetchCityList } from "_o/api/work-order/work-order-config";
export default {
  name: "work-order-payment-bill",
  components: { searchList, m2Table, detail, ExportFile },
  data() {
    return {
      inputList: inputList,
      total: 0,
      current: 1,
      pageSize: 10,
      tableColumns: [],
      tableData: [],
      isLoading: false,
      exportParams: {}
    }
  },
  mounted() {
    this.init()
    this.getTableData()
    this.tableColumns = tableTitle(this)
  },
  methods: {
    init() {
      this.getOptions();
      this.queryOptions();
    },
    async getOptions() {
      // 运营商和城市
      // const [res1, res2] = await Promise.all([webapi.getAgentList(), webapi.getOpenAreaAll()])
      const [res1] = await Promise.all([webapi.getAgentList()])
      if (res1.data.success) {
        const agentList  = res1.data.data
        this.inputList.find(item => item.bind_key === "agentId").dropList = agentList
      }
      // if (res2.data.success) {
      //   const openAreaList = res2.data.data
      //   this.inputList.find(item => item.bind_key === "cityCode").dropList = openAreaList
      // }
    },
    async queryOptions() {
      let param = {
        bizTypes:[1, 2, 4, 6, 7]
      }
      const { data: { success, data } } = await fetchCityList(param);
      if (success) {
        this.cityList = data.map(it => {
          return {
            label:it.cityName,
            value:it.cityCode
          }
        });
        const idx = this.inputList.findIndex(input => input.bind_key === 'cityCode')
        this.inputList[idx].dropList = data.map(it => {
          return {
            label:it.cityName,
            value:it.cityCode
          }
        })
      }
    },
    async searchData(params) {
      const { startTime, endTime } = params
      if (startTime && endTime) {
        params.startTime = this.$moment(startTime).format("YYYY-MM-DD HH:mm:ss")
        params.endTime = this.$moment(endTime).format("YYYY-MM-DD HH:mm:ss")
      }
      this.exportParams = { ...params }
      this.getTableData(params)
    },
    async getTableData(params) {
      // eslint-disable-next-line standard/object-curly-even-spacing
      const res = await getBillList({ ...params, currPage: this.current, pageSize: this.pageSize })
      if (res.data.success) {
        const { data: { currPage, totalCount, list }} = res.data
        this.tableData = list
        // 分页信息
        this.current = currPage || 1
        this.total = totalCount || 0
      } else {
        this.$Message.error(res.data.msg)
      }
    },
    async resetData() {
      // 清空列表参数和导出参数
      this.exportParams = {}
    },
    tablePageChange(page) {
      this.current = page
      this.getTableData(this.exportParams)
    },
    tablePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getTableData(this.exportParams)
    }
  }
}
</script>
<style>
.action {
  margin: 0 0 15px;
}
</style>
