<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-change="handleChange"
      @on-search="handleSearch"
      @on-reset="reset"
    />

    <div>
      <Button
        type="primary"
        @click="openAddNewConfig"
      >
        新增策略
      </Button>
    </div>

    <VTable
      style="margin-top: 25px;"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      :pageSizeOpts="[10,20,30,40,50]"
      @changePage="changePage"
      @changePageSize="changePageSize"
    />

    <Edit
      :visible="editVisible"
      :city-list="cityList"
      :modal-loading="modalLoading"
      :business-type-list="businessTypeList"
      :order-type-list="orderTypeList"
      :detail-data="detailData"
      @submit="submitEditConfig"
      @close="closeEditModal"
    />
    <Detail
      :visible="detailVisible"
      :city-list="cityList"
      :modal-loading="modalLoading"
      :detail-data="detailData"
      @close="closeDetailModal"
    />
  </div>
</template>

<script>
import Edit from "./components/Edit"
import Detail from "./components/Detail"
import {
  businessTypeList,
  businessTypeMap,
  carLevelMap,
  inputList, orderTypeList,
  orderTypeMap,
  statusMap
} from "./fields"
import { axiosSetCityList } from "_g/api/common"
import { queryAddItem, queryChangeStatus, queryEditItem, queryItemDetail, queryList } from "_o/api/holidayExpenses"
import { mapState, mapGetters } from "vuex";
export default {
  components: {
    Edit,
    Detail
  },
  data() {
    return {
      columns: [
        {
          title: "序号",
          width: 80,
          render: (h, params) => {
            return h("span", {}, (this.current - 1) * this.pageSize + params.index + 1)
          }
        },
        {
          title: "策略id",
          key: "uuid",
          minWidth: 120
        },
        {
          title: "策略名称",
          key: "ruleName",
          width: 120
        },
        {
          key: "cityCode",
          title: "城市",
          width: 100,
          render: (h, params) => {
            return h("span", this.cityMap[params.row.cityCode])
          }
        },
        {
          title: "业务线",
          width: 100,
          render: (h, params) => {
            const { row: { expandBizLine }} = params
            const { businessKeyValue } = this.businessGradeName
            return h("span", businessKeyValue[expandBizLine])
          }
        },
        {
          title: "产品线",
          width: 100,
          render: (h, params) => {
            const { row: { businessType }} = params
            const { productKeyValue } = this.businessGradeName
            return h("span", productKeyValue[businessType])
          }
        },
        {
          title: "车型等级",
          width: 100,
          render: (h, params) => {
            const { row: { businessType, holidaySurchargeExtend }} = params
            const { carLevelList } = holidaySurchargeExtend
            const { productCarKeyValue } = this.businessGradeName
            const names = carLevelList ? carLevelList.map(v => productCarKeyValue[`${businessType}#${v}`]) : []
            return h("span", names.join(","))
          }
        },
        {
          title: "订单类型",
          width: 100,
          render: (h, params) => {
            return h("span", params.row.holidaySurchargeExtend.typeTimeList.map(item => orderTypeMap[item]).join(","))
          }
        },
        {
          title: "状态",
          width: 80,
          render: (h, params) => {
            return h("span", statusMap[params.row.status])
          }
        },
        {
          title: "生效时间",
          minWidth: 180,
          render: (h, params) => {
            return h("div", `${params.row.effectiveTime} ~ ${params.row.failureTime}`)
          }
        },
        {
          key: "updateTime",
          title: "更新时间",
          width: 120,
        },
        {
          key: "updater",
          title: "更新人",
          width: 120,
        },
        {
          title: "操作",
          fixed: "right",
          width: 200,
          render: (h, params) => {
            return (
              <ButtonGroup>
                {
                  params.row.status === 0 ? (
                    <Button
                      type="warning"
                      size="small"
                      onClick={() => this.openEditModal(params.row.uuid)}
                    >编辑</Button>
                  ) : null
                }

                {
                  params.row.status === 1 ? (
                    <Button
                      size="small"
                      type="error"
                      onClick={() => this.changeStrategyStatus(params.row.uuid, -2)}
                    >停用</Button>
                  ) : null
                }

                <Button
                  size="small"
                  type="default"
                  onClick={() => this.openDetailModal(params.row.uuid)}
                >详情</Button>
              </ButtonGroup>
            )
          }
        }
      ],
      current: 1,
      tableData: [],
      total: 0,
      pageSize: 20,
      params: {},
      cityList: [],
      cityMap: {},
      inputList,
      editVisible: false,
      detailVisible: false,
      businessTypeList,
      orderTypeList,
      // 详情
      detailData: null,
      modalLoading: false
    }
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
      businessGradeList:  (state) => state.common.businessGradeList,
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
  },
  async mounted() {
    // 初始化下拉数据
    await this.getOpenedCityList() // 城市列表
    this.getList()
    // 重新梳理业务线
    const partProductLine = this.bizTypeList.map(v => {
      v.children = v.children.map(vv => {
        return {
          ...vv,
          label: vv.vehicleName,
          value: vv.vehicleLevel,
          children: []
        }
      })
      return v
    })
    // 处理重新赋值下拉数据
    for (let item of this.inputList) {
      if (item.key === "productLine") {
        item.cascaderList = partProductLine
        continue
      }
      if (item.key === "expandBizLine") {
        item.dropList = this.businessGradeList
        continue
      }
    }
  },
  methods: {
    // 搜索产品线切换
    handleChange(value, name) {
      console.log("name value", name, value)
    },
    // 新增
    openAddNewConfig() {
      this.editVisible = true
    },
    closeEditModal() {
      this.editVisible = false
      this.detailData = null
    },
    // 打开编辑
    async openEditModal(uuid) {
      await this.getDetailData(uuid)
      this.openAddNewConfig()
    },
    // 打开详情
    async openDetailModal(uuid) {
      await this.getDetailData(uuid)
      this.detailVisible = true
    },
    // 关闭详情
    async closeDetailModal() {
      this.detailVisible = false
      this.detailData = null
    },
    // 获取详情
    async getDetailData(uuid) {
      this.modalLoading = true
      try {
        const res = await queryItemDetail({
          uuid
        })

        if (res.data.success) {
          this.detailData = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
        this.modalLoading = false
      } catch (e) {
        this.modalLoading = false
      }
    },
    async submitEditConfig(params) {
      try {
        const res = params.uuid ? await queryEditItem(params) : await queryAddItem(params)
        if (res.data.success) {
          this.$Message.success(params.uuid ? "策略编辑成功" : "策略新增成功")
          this.getList()
          this.closeEditModal()
        }
      } catch (e) {}
    },
    // 启用
    changeStrategyStatus(uuid, status) {
      const obj = {
        1: "启用",
        "-2": "停用"
      }
      this.$Modal.confirm({
        content: `是否确认${obj[status]}该策略？`,
        onOk: async () => {
          try {
            const res = await queryChangeStatus({
              status,
              uuid
            })
            if (res.data.success) {
              this.$Message.success("策略状态更新成功")
              this.getList()
            }
          } catch (e) {}
        }
      })
    },
    // 获取已开城城市列表
    async getOpenedCityList() {
      const res = await axiosSetCityList({ businessType: "" })
      if (res.data.success) {
        let list = res.data.data || [];
        const cityMap = {}
        const cityList = list.map(item => {
          cityMap[item.cityId] = item.city
          return {
            label: item.city,
            value: item.cityId,
            disabled: false
          };
        });
        cityMap["1"] = "全国"
        this.cityMap = cityMap
        this.inputList[0].dropList = {
          ...cityList
        }
        cityList.unshift({
          label: "全国",
          value: 1,
        })
        this.cityList = cityList
      }
    },

    // 翻页
    changePage(pageNum) {
      this.current = pageNum
      this.getList()
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize
      this.getList()
    },
    // 搜索
    handleSearch(params) {
      this.params = params
      this.current = 1
      this.getList()
    },
    reset() {
      this.params = {}
      this.current = 1
      this.getList()
    },
    getList() {
      queryList({
        currPage: this.current,
        pageSize: this.pageSize,
        ...this.params
      }).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list
          this.total = res.data.data.totalCount
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
