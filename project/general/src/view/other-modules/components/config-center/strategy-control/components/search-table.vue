<template>
  <div>
    <searchList
      :inputList="inputDataList"
      @on-search="queryList"
      @on-reset="handelReset"
      @cascade-change="(value, selectedData, item) => handleCascadeChange(value, selectedData, item)"
      @clear-cascade="(item) => handleClearCascade(item)"
    ></searchList>
    <Button
      v-hasAuth="hasAuth"
      type="primary"
      @click="addnew"
    >
      新建策略
    </Button>
    <VTable
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      class="top20"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></VTable>
  </div>
</template>



<script>
import {
  cancelData,
  deviateData,
  timeData,
  tacticData,
  cancelColumns,
  bookingData,
  bookingColumns,
  deviateColumns,
  timeColumns,
  tacticColumns,
  hotAreaData,
  hotAreaColumns,
  orderPriorityData,
  orderPriorityColumns
} from "./fields"
import VTable from "_a/v-table/v-table"
import {
  axiosCancelStrategyList,
  axiosDriverCancelStrategyList,
  axiosTimeStrategyList,
  axiosPriorityStrategyList,
  axiosHotAreaStrategyList,
  axiosOrderPriorityStrategyList,
  axiosBookingStrategyList
} from "_o/api/configData.js"
import { mapState, mapGetters } from "vuex"
import { getNewBusinessLine } from "_gc/status-map";

const DATA = {
  tab1: { data: cancelData, column: cancelColumns, api: axiosCancelStrategyList },
  tab2: { data: deviateData, column: deviateColumns, api: axiosDriverCancelStrategyList },
  tab3: { data: timeData, column: timeColumns, api: axiosTimeStrategyList },
  tab4: { data: tacticData, column: tacticColumns, api: axiosPriorityStrategyList },
  tab5: { data: hotAreaData, column: hotAreaColumns, api: axiosHotAreaStrategyList },
  tab6: { data: orderPriorityData, column: orderPriorityColumns, api: axiosOrderPriorityStrategyList },
  tab7: { data: bookingData, column: bookingColumns, api: axiosBookingStrategyList }
}

export default {
  components: {
    VTable
  },
  props: {
    tabNum: {
      type: String,
      default: "1"// 1:乘客取消策略2.司机取消策略3.时间段及高峰策略4.产品线及订单来源优先级策略5.订单热区价值
    },
    hasAuth: {
      type: String,
      default: ""// 1:取消策略2.司机取消策略3.时间段及高峰策略4.产品线及订单来源优先级策略5.订单热区价值
    }
  },
  data() {
    let pageData = this.handleData("data")
    return {
      ...pageData
    }
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList,
      bookingBusinessGradeList: (state) => state.common.businessGradeList.filter(it => it.value !==8 && it.value !==9),
      bizTypeList: (state) => state.common.bizTypeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    })
  },
  created() {
    // 表头
    let columnsFun = this.handleData("column")
    this.tableColumns.splice(0, this.tableColumns.length)
    Object.entries(columnsFun(this)).forEach(([key, value]) => {
      this.tableColumns.push(value)
    })
    if (this.tabNum === "2") {
      this.inputList[2].dropList = getNewBusinessLine().list
    }
    // 第三方优先级策略只能根据城市code筛选,所以过滤掉 '全部' 选项
    // fix 后台处理可以根据省code筛选数据
    // let cityList = this.inputList.find(item => item.name === 'cascader-input');
    // cityList && cityList.cascaderList.forEach(it => {
    //   let child = it.children
    //   if(this.tabNum - 4 === 0) {
    //     if(Array.isArray(child) && child.length) {
    //       let index = child.findIndex(v => !v.value)
    //       if(index > -1) child.splice(index, 1)
    //     }
    //   } else {
    //     if(child[0] && child[0].value) {
    //       child.unshift({
    //         label: "全部",
    //         value: ""
    //       });
    //     }
    //   }
    // })
    // 搜索条件
    this.inputDataList = this.inputList // JSON.parse(JSON.stringify(this.inputList))
  },
  mounted() {
    if (this.tableData.length === 0) {
      this.judgeGetList(this.searchData)
    } else {
      this.$store.commit("changeLoadingFlag", false)
    }
    this.businessGradeList.forEach(v => {
      v.children = v.children.map(vv => {
        const children = vv.levels.map(vvv => {
          return {
            ...vvv,
            value: vvv.vehicleLevel,
            label: vvv.vehicleName
          }
        })
        return {
          ...vv,
          label: vv.bizTypeName,
          value: vv.bizType,
          children: children
        }
      })
    })
    // 处理重新赋值下拉数据
    for (let item of this.inputDataList) {
      if (item.key === "productLine") {
        item.cascaderList = this.businessGradeList
        break
      }
    }
    // 司机取消策略
    for (let item of this.inputDataList) {
      if (item.key === "partProductLine") {
        item.dropList = this.bizTypeList
        continue
      }
      if (item.key === "expandBizLine") {
        item.dropList = this.businessGradeList
        continue
      }
    }
    if (this.tabNum === "7") {
      // 预约单改派策略 修改产品线下拉
      this.inputDataList[2].dropList = this.bizTypeList
      this.inputDataList[1].dropList = this.bookingBusinessGradeList
    }
  },
  beforeDestroy() {
    // console.log(this.$data, 2)
  },
  methods: {
    handleCascadeChange(value, selectedData, item) {
      if (item.needCb) {
        this.changeData = true
        this.cascadeData = selectedData
        this.selectedValue = value
      } else {
        this.changeData = false
        this.cascadeData = null
        this.selectedValue = null
      }
    },
    handleClearCascade(item) {
      if (item.needCb) {
        this.changeData = false
        this.cascadeData = null
        this.selectedValue = null
      }
    },
    addnew() {
      this.$emit("addnew")
    },
    // 条件搜索后回调方法
    queryList(data) {
      // 点击查询
      this.pageObj.current = 1
      for (let key in this.searchData) {
        delete this.searchData[key]
      }
      for (let key in data) {
        this.searchData[key] = data[key]
      }

      if (this.changeData) {
        if (this.searchData["cityUuid"] && this.selectedValue) {
          const value = this.selectedValue[this.selectedValue.length - 1]
          const item = this.cascadeData.find(i => String(i.cityID) === String(value)) || {}
          this.searchData["cityUuid"] = (this.cascadeData && item) ? item.cityUuid : ""
        }
      }
      this.judgeGetList(data)
    },
    handelReset() {
      // 点击清空
      this.pageObj.current = 1
      for (let key in this.searchData) {
        delete this.searchData[key]
      }
      this.judgeGetList()
    },
    selectObj: function () {
    },
    changePage: function (val) {
      this.pageObj.current = val
      this.judgeGetList(this.searchData)
    },
    changePageSize: function (val) {
      this.pageObj.pageSize = val
      this.judgeGetList(this.searchData)
    },
    judgeGetList(data, noLoading) {
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current,
        ...this.searchData
      }
      // if (data) {
      //  for (let key in data) {
      //    params[key] = data[key];
      //  }
      // }
      let axiosFun = this.handleData("api")
      !noLoading && this.$store.commit("changeLoadingFlag", true)
      axiosFun(params).then(res => {
        if (res.data.success) {
          let resdata = res.data.data
          if (this.tabNum !== "8") {
            let list = resdata && resdata.list || []
            this.tableData.splice(0, this.tableData.length)
            this.tableData.push(...list)
            this.pageObj.total = resdata && resdata.totalCount
            this.$store.commit("changeLoadingFlag", false)
          } else {
            let list = resdata;
            for (let item of list) {
              item.businessType = item.productLine
            }
            this.tableData.splice(0, this.tableData.length)
            this.tableData.push(...list)
            this.pageObj.total = res.data.totalSize;
            this.$store.commit("changeLoadingFlag", false)
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    handleData(type) {
      let _t = DATA[`tab${this.tabNum}`] || DATA.tab1
      return _t[type]
    }
  }
}
</script>
