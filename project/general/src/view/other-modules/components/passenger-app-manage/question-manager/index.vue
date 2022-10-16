<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="handleSearch"
      @on-reset="reset"
    />

    <div style="margin-top: 10px;">
      <!--        v-hasAuth="'create-question'"-->
      <Button
        type="primary"
        @click="createNewConfig"
      >
        新建配置
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
        @submit="handleSubmit"
        @close="closeModal"
      />
    </Modal>
  </div>
</template>

<script>
import { addPageConfig, editPageConfig, getPageConfig, queryPage, deletePageConfig } from "_o/api/question-manage.js"
// import { getProvinceCityAllList } from "_g/api/common"
import { inputList, qaTypeMap } from "./fields"
// import { cpTranslate } from "@/libs/tools"

import Edit from "./components/Edit"

export default {
  components: {
    Edit,
  },
  data() {
    return {
      columns: [
        {
          title: "序号",
          width: 80,
          render: (h, params) => {
            return h("span", {}, (this.current - 1) * this.pageSize + params.index + 1);
          }
        },
        {
          key: "title",
          ellipsis: true,
          title: "标题"
        },
        {
          key: "questionContent",
          ellipsis: true,
          title: "注释"
        },
        {
          key: "qaType",
          title: "类型",
          render: (h, { row }) => {
            let rowGradeObj = qaTypeMap.find(it => Number(it.value) === row.qaType) || {}
            return h("span", rowGradeObj.label || "")
          }
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
                  // v-hasAuth="'view-question'"
                  onClick={() => this.openDetail(params.row, false, true)}
                >查看</Button>
                <Button
                  type="primary"
                  style={{
                    margin: "5px"
                  }}
                  // v-hasAuth="'edit-question'"
                  onClick={() => this.edit(params.row)}
                >编辑</Button>
                <Button
                  type="error"
                  style={{
                    margin: "5px"
                  }}
                  // v-hasAuth="'delete-question'"
                  onClick={() => this.deleteConfig(params.row)}
                >删除</Button>
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
      return `${this.isEdit ? "编辑" : "新建"}配置`
    },
  },
  watch: {
    "$route": {
      handler() {
        this.getList()
      },
      immediate: true
    }
  },

  methods: {
    openModal(isEdit = false, readonly = false) {
      this.editVisible = true
      this.isEdit = isEdit
      this.readonly = readonly
      this.itemDetail = undefined
    },
    closeModal() {
      this.editVisible = false
    },
    deleteConfig(row) {
      this.$Modal.confirm({
        title: "确认",
        content: "确认删除该配置？",
        /**
         * 点击确定的回调
         */
        onOk: () => {
          deletePageConfig({
            id: row.id
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
      this.openDetail("", true, true)
    },
    getList() {
      queryPage({
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
          id: row.id
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
      try {
        const { ...query } = params
        const res = await request(query)
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
</style>
