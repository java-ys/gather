<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 11:10:41
 * @LastEditTime: 2021-11-23 15:05:25
 * @Description:改派策略
-->

<!--
 * 每个状态对应的操作按钮
 * 未生效 -- 启用、复制、编辑、查看
 * 生效中 -- 停止、复制、查看
 * 停用 -- 复制、查看
-->

<template>
  <div class="container">
    <search :cityList="cityList" @search="handleSearch" />
    <div class="add-reassign-strategy">
      <Button type="primary" @click="handleAdd">新增改派策略</Button>
    </div>

    <Table border :columns="columns" :data="tableList" :loading="loading">
      <template slot="action" slot-scope="{ row, index }">
        <div class="table-control flex">
          <Button v-if="row.status !== -2" type="text" size="small" style="color:#2b85e4" @click="changeStatus(row)">
            {{row.status | filterStatus}}
          </Button>
          <Button v-if="row.status === 0" type="text" size="small" style="color:#2b85e4" @click="handleEdit(row)">
            编辑
          </Button>
          <Button type="text" size="small" style="color:#2b85e4" @click="handleCopy(row)">
            复制
          </Button>
          <Button type="text" size="small" style="color:#2b85e4" @click="showDetail(row)">
            查看
          </Button>
        </div>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="pageInfo.total" :page-size="pageInfo.pageSize" :current="pageInfo.currPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="addModel" title="新增改派策略" width="800" footer-hide>
      <div>
        <addForm :cityList="cityList" @close="addModel = false" @update="refreshTable" />
      </div>
    </Modal>
    <Modal v-model="detailModel" title="改派策略详情" width="800" footer-hide @on-visible-change="handleDetailVisible">
      <div>
        <detailForm v-if="detailModel" :uuid="uuid" :cityList="cityList" @close="detailModel = false" />
      </div>
    </Modal>
    <Modal v-model="editModel" title="编辑改派策略" width="800" footer-hide @on-visible-change="handleDetailVisible">
      <div>
        <editForm v-if="editModel" :uuid="uuid" :cityList="cityList" @close="editModel = false" @update="refreshTable" />
      </div>
    </Modal>
    <Modal v-model="copyModel" title="复制改派策略" width="800" footer-hide @on-visible-change="handleDetailVisible">
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
import editForm from "./components/edit.vue"
import copyForm from "./components/copy.vue"
import { queryReassignStrategy, updateReassignStrategyStatus } from "_o/api/airportPickUp.js"
import { filterOrderStatus } from "../nums"
export default {
  components: { search, addForm, detailForm, editForm, copyForm },
  filters: {
    filterStatus(val) {
      let statusButtonText = ""
      if (val === 0) {
        // 未生效
        statusButtonText = "启用"
      }
      if (val === 1) {
        // 生效中
        statusButtonText = "停用"
      }
      return statusButtonText
    }
  },
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
      detailModel: false,
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
          key: "ruleName"
        },
        {
          title: "城市",
          key: "cityName"
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
            return h("div", filterOrderStatus(params.row.status));
          }
        },
        {
          title: "操作",
          slot: "action",
          width: 200,
          align: "center"
        }
      ],
      tableList: [
      ],
      searchData: {},
      uuid: "" // 用来查看详情
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
          this.getTableList()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 查询列表
    async getTableList() {
      const { pageSize, currPage } = this.pageInfo
      const params = {
        pageSize,
        currPage,
        ...this.searchData
      }
      try {
        this.loading = true
        const res = await queryReassignStrategy(params)
        this.loading = false
        const { data, success } = res.data
        if (success) {
          this.pageInfo.total = data.totalCount
          this.tableList = data.list
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
    async changeStatus(item) {
      // 更新状态
      const { uuid, status } = item
      const params = {
        uuid,
        status,
      }
      const res = await updateReassignStrategyStatus(params)
      const { success, data, msg } = res.data
      if (success) {
        // eslint-disable-next-line require-atomic-updates
        item.status = data.status // 更新列表状态
        this.$Message.success("状态更新成功")
        // TODO: 状态更新
      } else {
        this.$Message.error(msg)
      }
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
  }
};
</script>

<style lang="less" scoped>
.flex{
  display: flex;
  align-items: center;
}
.container {
  min-height: 500px;
}
.add-reassign-strategy {
  margin-bottom: 24px;
}
</style>
