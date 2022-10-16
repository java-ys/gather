<template>
  <div>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template
        slot="index"
        slot-scope="params"
      >
        <span>{{(current - 1) * pageSize + params.data.index + 1}}</span>
      </template>
      <template
        slot="action"
        slot-scope="params"
      >
        <Button
          v-hasAuth="'driver_pricing_strategy_detail'"
          ghost
          type="warning"
          size="small"
          style="margin-right: 15px;"
          @click="popView('detail', params)"
        >
          详情
        </Button>
        <Button
          v-hasAuth="'driver_pricing_strategy_add2'"
          ghost
          type="warning"
          size="small"
          style="margin-right: 15px;"
          @click="popView('addWithPassenger', params)"
        >
          新建司机定价策略
        </Button>
      </template>
    </VTable>
  </div>
</template>

<script>
import {
  getCityPriceStrategyList
} from "_o/api/configData.js";
import { columns } from "./fields.js"
import { mapState } from "vuex"
export default {
  name: "passengerStrategyList",
  props: ["params", "businessGradeName"],
  data() {
    return {
      total: 0,
      current: 1,
      pageSize: 10,
      searchParams: {},
      columns: columns(this),
      tableData: []
    }
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList,
    }),
  },
  mounted() {
    // 获取乘客策略列表
    this.getTableList()
  },
  methods: {
    getTableList() {
      let _params = {}
      _params.cityUuid = this.params.cityUuid
      _params.cityCode = this.params.cityCode
      // _params.businessType = this.params.businessType
      _params.consumerType = 1
      _params.pageSize = this.pageSize
      _params.currPage = this.current
      _params.userStatus = 1
      getCityPriceStrategyList(_params).then(res => {
        console.log(res, "乘客策略列表");
        let data = res.data.data
        this.tableData = data.pageResult && data.pageResult.list || []
        this.total = data.pageResult && data.pageResult.totalCount || 0
      })
    },
    changePageSize(val) {
      this.pageSize = val
      this.getTableList()
    },
    changePage(val) {
      this.current = val
      this.getTableList()
    },
    popView(type, data) {
      if (type === "detail") {
        this.$emit("detail", data)
      } else if (type === "addWithPassenger") {
        this.$emit("add", data)
      }
    }
  },
}
</script>