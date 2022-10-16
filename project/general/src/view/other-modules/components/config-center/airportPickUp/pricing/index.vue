<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 11:10:35
 * @LastEditTime: 2021-12-02 10:29:35
 * @Description: 定价策略
-->
<template>
  <div class="container">
    <search ref="search" :cityList="cityList" @search="handleSearch" />
    <div class="add-pricing-strategy">
      <Button type="primary" @click="handleAdd">新增定价策略</Button>
    </div>

    <Table border :columns="columns" :data="tableList" :loading="loading">
      <template slot="action" slot-scope="{ row, index }">
        <Button v-if="row.status === 0" class="text-button" type="text" size="small" style="color:#2b85e4" @click="handleEdit(row)">
          编辑
        </Button>
        <Button class="text-button" type="text" size="small" style="color:#2b85e4" @click="handleCopy(row)">
          复制
        </Button>
        <Button class="text-button" type="text" style="color:#2b85e4" @click="showDetail(row)">
          详情
        </Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="pageInfo.total" :page-size="pageInfo.pageSize" :current="pageInfo.currPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="addModel" title="新增定价策略" width="800" footer-hide>
      <div>
        <addForm v-if="addModel" :cityList="cityList" @close="addModel = false" @update="refreshTable" />
      </div>
    </Modal>
    <Modal v-model="detailModel" title="定价策略详情" width="800" footer-hide @on-visible-change="handleDetailVisible">
      <div>
        <detailForm v-if="detailModel" :uuid="uuid" :cityList="cityList" @close="detailModel = false" />
      </div>
    </Modal>
    <Modal v-model="editModel" title="编辑定价策略" width="800" footer-hide @on-visible-change="handleDetailVisible">
      <div>
        <editForm v-if="editModel" :uuid="uuid" :cityList="cityList" @close="editModel = false" @update="refreshTable" />
      </div>
    </Modal>
    <Modal v-model="copyModel" title="复制定价策略" width="800" footer-hide @on-visible-change="handleDetailVisible">
      <div>
        <copyForm v-if="copyModel" :uuid="uuid" :cityList="cityList" @close="copyModel = false" @update="refreshTable" />
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import search from "./components/search.vue";
import addForm from "./components/addForm.vue";
import detailForm from "./components/detail.vue"
import editForm from "./components/editForm.vue"
import copyForm from "./components/copyForm.vue"
import { queryPricingStrategy } from "_o/api/airportPickUp.js"
import { filterOrderType, filterPricingOrderStatus } from "../nums"
export default {
  components: { search, addForm, detailForm, editForm, copyForm },
  props: {
    cityList: {
      type: Array,
      default: () => []
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      addModel: false, // 新增定价策略表单弹窗
      detailModel: false, // 详情
      editModel: false,
      copyModel: false,
      pageInfo: {
        total: 0,
        pageSize: 10,
        currPage: 1
      },
      columns: [
        {
          title: "序号",
          type: "index",
          width: 68,
          align: "center"
        },
        {
          title: "策略名称",
          key: "fareTypeNote"
        },
        {
          title: "城市",
          key: "cityName"
        },
        {
          title: "订单类型",
          key: "typeTime",
          render: (h, params) => {
            return h("div", filterOrderType(params.row.typeTime));
          }
        },
        {
          title: "生效时间",
          key: "effectiveTime"
        },

        {
          title: "业务线",
          key: "expandBizLine",
          render: (h, params) => {
            const { businessKeyValue } = this.businessGradeName
            return h("div", businessKeyValue[params.row.expandBizLine]);
          }
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            return h("div", filterPricingOrderStatus(params.row.status));
          }
        },
        {
          title: "操作",
          slot: "action",
          width: 168,
          align: "center"
        }
      ],
      tableList: [
      ],
      searchData: {},
      uuid: "", // 用来查看详情
    };
  },
  computed: {
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    })
  },
  watch: {
    active: {
      handler: function(val) {
        if (val) {
          this.pageInfo.currPage = 1
          this.initTable()
        }
      },
      immediate: true
    }
  },
  methods: {
    initTable() {
      this.$nextTick(() => {
        // 傻逼后端自己不会过滤，要前端默认给个业务线初始值，初始化的时候，要带上业务线参数
        this.searchData = this.$refs.search.getSearchData()
        this.getTableList()
      })
    },
    // 查询列表
    async getTableList() {
      const { pageSize, currPage } = this.pageInfo
      const params = {
        pageSize,
        currPage,
        ...this.searchData
      }
      this.loading = true
      try {
        const res = await queryPricingStrategy(params)
        this.loading = false
        const { data, success } = res.data
        if (success) {
          const { pageResult } = data // 垃圾后端多加了一个层级数据
          this.pageInfo.total = pageResult.totalCount
          this.tableList = pageResult.list
        }
      } catch (error) {
        this.loading = false
      }
    },

    // 查询按钮
    handleSearch(params) {
      this.searchData = params
      this.pageInfo.currPage = 1
      this.getTableList()
    },
    handleAdd() {
      this.addModel = true;
    },
    changePage(val) {
      this.pageInfo.currPage = val
      this.getTableList()
    },
    refreshTable() {
      this.addModel = false
      this.editModel = false
      this.copyModel = false
      this.pageInfo.currPage = 1
      this.getTableList()
    },
    // 查看
    showDetail(row) {
      this.detailModel = true
      this.uuid = row.uuid
    },
    handleDetailVisible(val) {
      if (!val) {
        this.uuid = ""
      }
    },
    // 编辑
    handleEdit(row) {
      this.editModel = true
      this.uuid = row.uuid
    },
    // 复制
    handleCopy(row) {
      this.copyModel = true
      this.uuid = row.uuid
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  min-height: 500px;
}
.add-pricing-strategy {
  margin-bottom: 24px;
}
.text-button{
  padding: 5px;
}
</style>
