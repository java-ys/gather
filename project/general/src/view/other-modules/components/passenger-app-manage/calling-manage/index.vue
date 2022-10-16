<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="handleSearch"
      @on-reset="reset"
    />

    <div>
      <p>{{webTypeInfo[webType].introText[0]}}</p>
      <p>
        {{webTypeInfo[webType].introText[1]}}默认配置详见
        <span
          class="view-default"
          @click="viewDefaultConfig"
        >
          默认配置详情
        </span>
      </p>
    </div>

    <div style="margin-top: 10px;">
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
        :city-list="cityList"
        :web-type="webType"
        :value="itemDetail"
        :readonly="readonly"
        :isDefaultConfig="isDefaultConfig"
        :submitLoading="submitLoading"
        @submit="handleSubmit"
        @close="closeModal"
      />
    </Modal>
  </div>
</template>

<script>
import { addAppPageConfig, editAppPageConfig, getAppPageConfig, queryPage } from "_o/api/calling-manage"
import { getProvinceCityAllList } from "_g/api/common"
import { inputList, webTypeInfo } from "./fields"
import { cpTranslate } from "@/libs/tools"

import Edit from "./components/Edit"

export default {
  components: {
    Edit,
  },
  data() {
    return {
      webTypeInfo,
      columns: [
        {
          title: "序号",
          width: 80,
          render: (h, params) => {
            return h("span", {}, (this.current - 1) * this.pageSize + params.index + 1);
          }
        },
        {
          key: "proCityName",
          title: "城市"
        },
        {
          key: "updater",
          title: "操作人",
        },
        {
          key: "updateTime",
          title: "操作时间"
        },
        {
          title: "操作",
          render: (h, params) => {
            return (
              <div>
                <Button
                  type="primary"
                  style={{
                    marginRight: "5px"
                  }}
                  onClick={() => this.edit(params.row.id, params.row.cityCode)}
                >编辑</Button>
                <Button
                  type="default"
                  onClick={() => this.openDetail(params.row.id, params.row.cityCode, true, true)}
                >详情</Button>
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
      submitLoading: false,
      webType: this.$route.meta.webType || 0
    }
  },
  computed: {
    modalTitle() {
      const { editTitle } = this.webTypeInfo[this.webType]
      if (this.isDefaultConfig) {
        return editTitle
      }
      return `${this.isEdit ? "编辑" : "新建"}${editTitle}`
    }
  },
  watch: {
    "$route": {
      handler() {
        console.log("this.$route.meta.webType", this.$route.meta.webType)
        this.webType = this.$route.meta.webType || 0
        this.getList()
        this.getCityList()
      },
      immediate: true
    }
  },
  methods: {
    openModal(isEdit = false, readonly = false, isDefaultConfig = false) {
      this.editVisible = true
      this.isEdit = isEdit
      this.readonly = readonly
      this.isDefaultConfig = isDefaultConfig
      this.itemDetail = undefined
    },
    closeModal() {
      this.editVisible = false
    },
    createNewConfig() {
      this.openDetail("", 0, false, false, false)
    },
    viewDefaultConfig() {
      this.openDetail("", 0, true, true, true)
    },
    // 获取城市列表
    async getCityList() {
      const res = await getProvinceCityAllList()
      if (res.data.success) {
        const cityList = cpTranslate(res.data.data)
        this.cityList = cityList
        this.inputList[0].cascaderList = cityList
      }
    },
    getList() {
      queryPage({
        currPage: this.current,
        pageSize: this.pageSize,
        ...this.params,
        webType: this.webType
      }).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list
          this.total = res.data.data.totalCount
        }
      })
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
    async openDetail(id, cityCode, isEdit = true, readonly = false, isDefaultConfig = false) {
      this.modalLoading = true
      this.openModal(isEdit, readonly, isDefaultConfig)
      try {
        const res = await getAppPageConfig({
          id,
          cityCode,
          webType: this.webType
        })
        if (res.data.success) {
          this.itemDetail = res.data.data
          if (this.itemDetail.cityCode === "0") {
            this.itemDetail.cityCode = ""
          }
        }
        this.modalLoading = false
      } catch (e) {
        this.modalLoading = false
      }
    },
    async edit(id, cityCode) {
      await this.openDetail(id, cityCode, true)
    },
    // 提交
    async handleSubmit(params) {
      this.submitLoading = true
      const request = this.isEdit ? editAppPageConfig : addAppPageConfig
      try {
        const { updateTime, ...query } = params
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
