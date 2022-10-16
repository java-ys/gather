<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="handleSearch"
      @on-reset="reset"
    />

    <div>
      <p>默认配置详见
        <span
          class="view-default"
          @click="viewDefaultConfig"
        >
          默认配置详情
        </span>
      </p>
    </div>

    <div style="margin-top: 10px;">
      <!--        v-hasAuth="'create-rule-page'"-->
      <Button
        type="primary"
        @click="createNewConfig"
      >
        新建策略
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

    <Modal
      v-model="editVisible"
      :title="modalTitle"
      :width="800"
      :loading="modalLoading"
      footer-hide
    >
      <Edit
        :visible="editVisible"
        :value="itemDetail"
        :readonly="readonly"
        :businessGradeList="businessGradeList"
        @submit="handleSubmit"
        @viewDemo="demoVisible = true"
        @close="closeModal"
      />
    </Modal>
    <Modal
      v-model="demoVisible"
      title="默认配置"
      :width="700"
      footer-hide
      mask-closable
      class-name="demo-modal"
    >
      <div class="default-demo">
        <img src="../../../assets/fare-config-demo/price-rule-demo.png" />
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  addPageConfig,
  editPageConfig,
  getPageConfig,
  queryPage,
  deletePageConfig,
  startPageConfig, stopPageConfig
} from "_o/api/strategy-manage.js"
// import { getProvinceCityAllList } from "_g/api/common"
import { inputList, state } from "./fields"
// import { cpTranslate } from "@/libs/tools"

import Edit from "./components/Edit"
import { mapState } from "vuex";

export default {
  components: {
    Edit,
  },
  data() {
    return {
      demoVisible: false,
      columns: [
        {
          title: "序号",
          width: 80,
          render: (h, params) => {
            return h("span", {}, (this.current - 1) * this.pageSize + params.index + 1);
          }
        },
        {
          key: "strategyName",
          ellipsis: true,
          title: "策略名称"
        },
        {
          key: "expandBizLine",
          title: "业务线",
          ellipsis: true,
          render: (h, { row }) => {
            let rowGradeObj = this.businessGradeList.find(it => Number(it.value) === row.expandBizLine) || {}
            return h("span", rowGradeObj.label || "")
          }
        },
        {
          key: "state",
          title: "状态",
          render: (h, { row }) => {
            let rowGradeObj = state.find(it => Number(it.value) === row.state) || {}
            return h("span", rowGradeObj.label || "")
          }
        },
        {
          key: "entryTime",
          title: "生效时间"
        },
        {
          key: "updateTime",
          title: "更新时间"
        },
        {
          key: "updater",
          title: "操作人"
        },
        {
          title: "操作",
          key: "action",
          minWidth: 240,
          render: (h, params) => {
            return (
              <div>
                <Button
                  type="default"
                  style={{
                    margin: "5px",
                    marginLeft: 0
                  }}
                  // v-hasAuth="'view-rule-page'"
                  onClick={() => this.openDetail(params.row, false, true)}
                >查看</Button>
                {false ? <Button
                  type="primary"
                  style={{
                    margin: "5px"
                  }}
                  // v-hasAuth="'edit-rule-page'"
                  onClick={() => this.edit(params.row)}
                >编辑</Button> : null}
                <Button
                  type="primary"
                  style={{
                    margin: "5px"
                  }}
                  // v-hasAuth="'copy-rule-page'"
                  onClick={() => this.copy(params.row)}
                >复制</Button>
                {params.row.state === 0 ? <Button
                  type="error"
                  style={{
                    margin: "5px"
                  }}
                  // v-hasAuth="'delete-rule-page'"
                  onClick={() => this.deleteConfig(params.row)}
                >删除</Button> : null}
                {params.row.state === 0 ? <Button
                  type="success"
                  style={{
                    margin: "5px",
                    marginRight: 0
                  }}
                  // v-hasAuth="'config-rule-page'"
                  onClick={() => this.startConfig(params.row)}
                >启用</Button> : (params.row.state === 1 ? <Button
                  type="warning"
                  style={{
                    margin: "5px",
                    marginRight: 0
                  }}
                  // v-hasAuth="'config-rule-page'"
                  onClick={() => this.stopConfig(params.row)}
                >停用</Button> : null)}
              </div>
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
      inputList,
      editVisible: false,
      isEdit: false,
      itemDetail: undefined,
      modalLoading: false,
      readonly: false,
      isDefaultConfig: false,
      submitLoading: false
    }
  },
  computed: {
    modalTitle() {
      return `${this.isEdit ? "编辑" : "新建"}费用详情策略`
    },
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList,
      bizTypeList: (state) => state.common.bizTypeList
    })
  },
  watch: {
    "$route": {
      handler() {
        this.getList()
        this.setBusinessDrop()
      },
      immediate: true
    }
  },

  methods: {
    setBusinessDrop() {
      this.inputList[1].dropList = this.businessGradeList
    },
    openModal(isEdit = false, readonly = false) {
      this.editVisible = true
      this.isEdit = isEdit
      this.readonly = readonly
      this.itemDetail = undefined
    },
    closeModal() {
      this.editVisible = false
    },
    stopConfig(row) {
      this.$Modal.confirm({
        title: "确认",
        content: "确认停用该策略？",
        /**
         * 点击确定的回调
         */
        onOk: () => {
          stopPageConfig({
            id: row.id,
            strategyType: 2
          }).then(res => {
            if (res && res.data && res.data.success) {
              this.$message.success("停用成功")
              this.getList()
            } else {
              this.$message.error("停用失败，请重试")
            }
          })
        },
        /**
         * 点击取消的回调，只在Modal.confirm()下有效
         */
        onCancel: () => {

        }
      })
    },
    startConfig(row) {
      this.$Modal.confirm({
        title: "确认",
        content: "确认启用该策略？",
        /**
         * 点击确定的回调
         */
        onOk: () => {
          startPageConfig({
            id: row.id,
            strategyType: 2
          }).then(res => {
            if (res && res.data && res.data.success) {
              this.$message.success("启用成功")
              this.getList()
            } else {
              this.$message.error("启用失败，请重试")
            }
          })
        },
        /**
         * 点击取消的回调，只在Modal.confirm()下有效
         */
        onCancel: () => {

        }
      })
    },
    deleteConfig(row) {
      this.$Modal.confirm({
        title: "确认",
        content: "确认删除该策略？",
        /**
         * 点击确定的回调
         */
        onOk: () => {
          deletePageConfig({
            id: row.id,
            strategyType: 2
          }).then(res => {
            if (res && res.data && res.data.success) {
              this.$message.success("删除成功")
              this.getList()
            } else {
              this.$message.error("删除失败，请重试")
            }
          })
        },
        /**
         * 点击取消的回调，只在Modal.confirm()下有效
         */
        onCancel: () => {

        }
      })
    },
    createNewConfig() {
      this.openDetail("", false, false)
    },
    viewDefaultConfig() {
      this.demoVisible = true
    },
    getList() {
      queryPage({
        currPage: this.current,
        pageSize: this.pageSize,
        ...this.params,
        strategyType: 2
      }).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list
          this.total = res.data.data.totalCount
        }
      })
    },
    // 搜索
    handleSearch(params) {
      if (params.state === -1) {
        delete params.state
      }
      this.params = params
      this.current = 1
      this.getList()
    },
    reset() {
      this.params = {}
      this.current = 1
      this.getList()
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
    // 查看详情
    async openDetail(row, isEdit = true, readonly = false, isCopy = false) {
      this.modalLoading = true
      this.openModal(isEdit, readonly)
      if (!row || !row.id) {
        this.modalLoading = false
        return
      }
      try {
        const res = await getPageConfig({
          id: row.id,
          strategyType: 2
        })
        if (res.data.success) {
          if (isCopy) {
            // 复制的，删除id就行
            delete res.data.data.id
          }
          this.itemDetail = res.data.data
        }
        this.modalLoading = false
      } catch (e) {
        this.modalLoading = false
      }
    },
    async edit(row) {
      await this.openDetail(row, true)
    },
    async copy(row) {
      await this.openDetail(row, false, false, true)
    },
    // 提交
    async handleSubmit(params) {
      this.submitLoading = true
      const request = this.isEdit ? editPageConfig : addPageConfig
      console.log(params)
      try {
        const { ...query } = params
        const res = await request({ ...query, strategyType: 2 })
        if (res.data.success) {
          this.$Message.success("保存成功")
          this.closeModal()
          this.getList()
        } else {
          this.$Message.error(res.data.msg)
        }
        this.submitLoading = false
      } catch (e) {
        this.submitLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.view-default {
  color: #2d8cf0;
  cursor: pointer;
}

::v-deep .demo-modal {
  .ivu-modal-body {
    background: #efefef;
  }
}

.default-demo {
  display: flex;
  justify-content: center;

  img {
    width: 375px;
    margin: 0 20px
  }
}
</style>
