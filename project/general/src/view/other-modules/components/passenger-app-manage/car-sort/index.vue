<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="handleSearch"
      @on-reset="reset"
    />

    <div>
      <p>本页面用以配置乘客端（APP/小程序）确认用车，追加车型页面的车型展示顺序。</p>
      <p>未配置的城市以默认配置生效。默认配置顺序：经济型(快享) >惠享 > 豪华型(尊享) > 舒适型 > 商务型 ></p>
      <p>行政型>出租车>自动驾驶</p>
      <Button
        v-has-auth="'addStrategy'"
        type="primary"
        style="margin-top: 20px;"
        @click="openAddModal"
      >
        新增策略
      </Button>
    </div>

    <div class="table-content">
      <VTable
        style="margin-top: 25px;width: 70%"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :parColumns="columns"
        :parTableData="tableData"
        :pageSizeOpts="[10,20,30,40,50]"
        @changePage="changePage"
        @changePageSize="changePageSize"
      />
      <img
        class="right"
        src="../../../assets/images/20210816101648.jpg"
        alt=""
      >
    </div>

    <EditCarSort
      :visible="editVisible"
      :city-list="formatCitySingle"
      :modal-loading="modalLoading"
      :edit-detail="editDetail"
      :car-list="carList"
      :is-edit="isEdit"
      @submit="handleEditSubmit"
      @close="closeEditModal"
    />
  </div>
</template>

<script>
import EditCarSort from "./components/EditCarSort"
import { inputList } from "../calling-manage/fields"
import {  getProvinceCityAllList } from "_g/api/common"
import {
  getCitys
} from "_o/api/configData.js"
import { cpTranslate, formatCitySingle } from "@/libs/tools"
import { addStrategy, deleteStrategy, editStrategy, queryCarList, queryDetail, queryList } from "_o/api/carSort"
import { mapState } from "vuex";
export default {
  components: {
    EditCarSort
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList
    }),
  },
  data() {
    return {
      inputList,
      cascadeCityList: [],
      cityList: [],
      formatCitySingle: [],
      editVisible: false,
      modalLoading: false,
      btnLoading: false,
      carList: [],
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 20,
      editDetail: null,
      isEdit: true,
      params: {},
      columns: [
        {
          title: "序号",
          width: 80,
          render: (h, params) => {
            return h("span", {}, (this.current - 1) * this.pageSize + params.index + 1);
          }
        },
        {
          title: "城市",
          width: 100,
          key: "cityName"
        },
        {
          title: "车型展示顺序",
          width: 400,
          render: (h, params) => {
            const text = params.row.businessGradeDto.map(item => {
              if (item.expandBizLineDesc) {
                return `${item.expandBizLineDesc}·${item.businessCodeDesc}·${item.gradeDesc}`
              } else {
                return `${item.businessCodeDesc}·${item.gradeDesc}`
              }
            }).join(">")
            return h("span", {
              style: "text-overflow: ellipsis;overflow: hidden;width: 200px;white-space: nowrap;"
            }, text)
          }
        },
        {
          title: "操作人",
          width: 120,
          key: "updater"
        },
        {
          title: "操作时间",
          width: 180,
          key: "updateTime"
        },
        {
          title: "操作",
          fixed: "right",
          width: 220,
          render: (h, params) => {
            return (
              <ButtonGroup>
                <Button
                  v-hasAuth="checkDetail"
                  type="primary"
                  vOn:click={() => this.checkDetail(params.row.uuid)}
                >
                  详情
                </Button>

                <Button
                  vHasAuth="editStrategy"
                  type="default"
                  vOn:click={() => this.openEditModal(params.row.uuid)}
                >
                  编辑
                </Button>
                <Button
                  vHasAuth="deleteStrategy"
                  type="error"
                  vOn:click={() => this.deleteItem(params.row.uuid)}
                >
                  删除
                </Button>
              </ButtonGroup>
            )
          }
        }
      ]
    }
  },
  mounted() {
    // this.getCascadeCityList()
    this.getCityList()
    this.getList()
    // this.inputList[1].dropList = this.bizTypeList
  },
  methods: {
    // 获取城市级联列表
    async getCascadeCityList() {
      const res = await getProvinceCityAllList()
      if (res.data.success) {
        const cascadeCityList = cpTranslate(res.data.data)
        this.cascadeCityList = cascadeCityList
        this.inputList[0].cascaderList = cascadeCityList
      }
    },
    async getCityList() {
      const res = await getCitys()
      if (res.data.success) {
        let data = res.data.data || [];
        data = cpTranslate(data);
        this.cityList = data;
        this.formatCitySingle = formatCitySingle(res.data.data || [])
        this.inputList[0].cascaderList = data
      }
    },
    getList() {
      queryList({
        currPage: this.current,
        pageSize: this.pageSize,
        ...this.params
      }).then(res => {
        if (res.data.success) {
          this.tableData = res.data?.data?.list || []
          this.total = res.data?.data?.totalCount || 0
        }
      })
    },
    changePage(page) {
      this.current = page
      this.getList()
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize
      this.getList()
    },
    handleSearch(params) {
      this.current = 1
      this.params = {
        cityCode: params.cityCode
      }
      this.getList()
    },
    reset() {
      this.params = {}
      this.getList()
    },
    openAddModal() {
      this.isEdit = true
      this.editVisible = true
      this.getCarList()
    },
    // 关闭编辑
    closeEditModal() {
      this.editVisible = false
      this.carList = []
      this.editDetail = null
    },
    // 获取车型列表
    async getCarList(cityCode) {
      this.modalLoading = true
      try {
        const res = await queryCarList({
          cityCode
        })
        if (res.data.success) {
          this.carList = res.data?.data?.map((item, index) => {
            return {
              ...item,
              sort: index
            }
          }) || []
        }
        this.modalLoading = false
      } catch (e) {
        this.modalLoading = false
      }
    },
    // 处理编辑保存
    async handleEditSubmit(params) {
      const request = params.uuid ? editStrategy : addStrategy
      this.btnLoading = true
      try {
        const res = await request(params)
        if (res.data.success) {
          this.$Message.success("保存成功")
          this.editVisible = false
          this.getList()
        }
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
      }
    },
    // 获取详情
    async getDetail(uuid) {
      try {
        const res = await queryDetail({
          uuid
        })

        if (res.data.success) {
          this.editDetail = res.data.data
          this.carList = res.data.data.businessGradeDto
        }
      } catch (e) {}
    },
    // 查看详情
    async checkDetail(uuid) {
      this.isEdit = false
      this.editVisible = true
      await this.getDetail(uuid)
    },
    // 编辑
    async openEditModal(uuid) {
      this.isEdit = true
      this.editVisible = true
      this.modalLoading = true
      await this.getDetail(uuid)
      this.modalLoading = false
    },
    // 删除
    deleteItem(uuid) {
      this.$Modal.confirm({
        title: "提示",
        content: "删除后，前端将默认顺序展示，确认删除该条策略？",
        loading: true,
        onOk: async () => {
          try {
            const res = await deleteStrategy({
              uuid
            })

            if (res.data.success) {
              this.$Message.success("删除成功")
              this.$Modal.remove()
              this.getList()
            }
          } catch (e) {}
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.operate-btn {
  margin-right: 5px;
}

.text-overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 200px;
  white-space: nowrap;
}

.table-content {
  display: flex;
  width: 100%;
  .right {
    width: 375px;
  }
}

</style>
