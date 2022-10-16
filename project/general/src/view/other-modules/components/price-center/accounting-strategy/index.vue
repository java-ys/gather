<template>
  <div>
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search"></SearchList>
    <Button v-hasAuth="'account-strategy-add'" type="primary" @click="handleItem(1)">
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
          v-if="params.data.row.channelStatus === 0 && params.data.row.hasAuth"
          v-hasAuth="'account-strategy-stop'"
          ghost type="error" size="small" class="tableBtn"
          @click="shiftItem(params.data.row,1)"
        >
          停用
        </Button>
        <Button
          v-if="params.data.row.channelStatus === 1 && params.data.row.hasAuth"
          v-hasAuth="'account-strategy-start'"
          ghost type="success" size="small" class="tableBtn"
          @click="shiftItem(params.data.row,0)"
        >
          启用
        </Button>
        <!-- 数据的所有城市都在权限内，才能编辑 -->
        <Button
          v-if="params.data.row.hasAuth"
          v-hasAuth="'account-strategy-edit'"
          ghost type="warning" size="small" class="tableBtn"
          @click="handleItem(2,params.data.row)"
        >
          编辑
        </Button>
        <Button
          v-hasAuth="'account-strategy-detail'"
          ghost type="info" size="small"
          @click="handleItem(3,params.data.row)"
        >
          详情
        </Button>
      </template>
    </m2-table>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import { inputList, parColumns, sceneMap, BusinessArr } from "./fields";
import {
  axiosChannelPriceList,
  axiosChannelPriceShift,
} from "_o/api/priceCenter";
import { getCommonAppointedCityInAuth, queryChannel } from "_g/api/common.js"
import { carTypeMapAll } from "_g/config/status-map";
import { mapState, mapGetters } from "vuex"

export default {
  name: "",
  components: {
    m2Table
  },
  data() {
    return {
      parColumns: parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {},
      isLoading: true,
      channelList: []
    };
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
      businessGradeList: (state) => state.common.businessGradeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    })
  },
  mounted() {
    this.getCityList()
    this.getTableList();
    this.getChannel()
    // 重新梳理业务线
    const partProductLine = this.bizTypeList.map(v => {
      v.children = v.children.map(vv => {
        return {
          ...vv,
          label: vv.vehicleName,
          value: vv.vehicleLevel
        }
      })
      return v
    })
    // 处理重新赋值下拉数据
    for (let item of this.inputList) {
      if (item.key === "productLine") {
        item.cascaderList = partProductLine
        break
      }
    }
  },
  methods: {
    // 获取渠道
    async getChannel() {
      const res = await queryChannel()
      const { data, success } = res.data
      if (success) {
        const list = data ? data.map(v => {
          return {
            label: v.sourseName,
            value: v.sourseValue
          }
        }) : []
        this.channelList = list
        this.inputList[0].dropList = list
      }
    },
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    // 根据产品线获取城市列表
    getCityList() {
      let params = {
        areaType: 1,
        businessLineList: [1, 2, 4, 6, 7]
      }
      getCommonAppointedCityInAuth(params).then(res => {
        let resData = res.data.data || {};
        let list = resData.openAreaConfigDtoList || []
        let transformData = list.map(item => {
          return {
            label: item.city,
            value: item.cityId
          }
        })
        // 查询，只要有城市权限，就能看到全部城市的数据
        transformData.length > 0 && transformData.unshift({ label: "全部城市", value: "1" })
        this.inputList[4].dropList = transformData
      })
    },
    getTableList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData
      };
      this.isLoading = true
      axiosChannelPriceList(params).then(res => {
        this.isLoading = false
        let data = res.data.data || {};
        let list = data.list || [];
        list.forEach(item => {
          item.carLevelNames = item.carLevels.map(val => carTypeMapAll[item.typeModule + "#" + val]).join(",")
          item.typeTripNames = item.typeTripLimited === 0 ? "不限场景" : item.typeTrips.map(val => sceneMap[val]).join(",")
          item.cityNames = item.cityNames.join(",")
          item.effectiveTime = `${item.effectiveTimeStart} 至 ${item.effectiveTimeEnd}`
        })
        this.tableData = [...list]
        this.total = data.totalCount || 0;
      }).catch(err => {
        this.isLoading = false
        this.total = 0
        this.tableData = []
      });
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    // type，同 2-编辑，3-详情
    handleItem(type, item) {
      if (type === 1) {
        // 新增
        this.$router.push(`/pricing-manage/accounting-strategy-add?type=${type}`)
      } else {
        this.$router.push(`/pricing-manage/accounting-strategy-add/${item.uuid}?type=${type}`)
      }
    },
    // 点击停用/启用
    shiftItem(item, value) {
      let params = {
        uuid: item.uuid,
        channelStatus: value
      }
      if (value === 0) {
        // 当前为停用状态
        this.axiosShiftItem(params)
      } else {
        // 当前为启用状态，点击停用
        let that = this
        this.$Modal.confirm({
          title: "是否确认停用当前策略？",
          onOk() {
            that.axiosShiftItem(params)
          }
        });
      }
    },
    // 请求停用启用接口
    axiosShiftItem(params) {
      let that = this
      let msg = params.channelStatus === 0 ? "启用成功！" : "停用成功！"
      axiosChannelPriceShift(params).then(res => {
        that.$Message.success(msg)
        that.getTableList()
      });
    }
  }
};
</script>
<style scoped lang='less'>
</style>