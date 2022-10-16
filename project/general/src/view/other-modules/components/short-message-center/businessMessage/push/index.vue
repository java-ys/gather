
<template>
  <div class="push">
    <Form
      ref="searchForm"
      :model="searchData"
      :label-width="100"
      inline
      class="search-form"
    >
      <FormItem label="push标题：">
        <Input
          v-model="searchData.titile"
          :maxlength="20"
          clearable
          placeholder="push标题"
          style="width: 200px;"
        ></Input>
      </FormItem>
      <FormItem label="发送对象：">
        <Select
          v-model="searchData.sendTarget"
          clearable
          filterable
          style="width:200px"
        >
          <Option
            v-for="(item, index) in targetMap"
            :key="index"
            :value="index"
          >
            {{ item }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="发送节点：">
        <Select
          v-model="searchData.routeNode"
          clearable
          filterable
          style="width:200px"
        >
          <Option
            v-for="(item, index) in nodeMap"
            :key="index"
            :value="index"
          >
            {{ item }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="适用业务：">
        <Select
          v-model="searchData.businessId"
          clearable
          filterable
          style="width:200px"
        >
          <Option :value="0">全局</Option>
          <Option
            v-for="item in bizTypeList"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="状态：">
        <Select
          v-model="searchData.status"
          clearable
          filterable
          style="width:200px"
        >
          <Option
            v-for="(item, index) in stateMap"
            :key="index"
            :value="index"
          >
            {{ item }}
          </Option>
        </Select>
      </FormItem>
      <FormItem :label-width="40">
        <Button
          type="primary"
          style="margin-right: 10px"
          @click="queryData"
        >
          搜索
        </Button>
        <Button @click="clearQueryData">
          清空
        </Button>
      </FormItem>
    </Form>
    <Button
      v-hasAuth="'business-message-add'"
      type="primary"
      style="margin-left: 20px"
      @click="addMessage"
    >
      新增消息
    </Button>
    <VTable
      style="margin-top: 20px;"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </VTable>
    <Modal
      v-model="isShowCreateModal"
      :title="modalTitle"
      :mask-closable="false"
      width="500"
    >
      <Form
        ref="addDataName"
        :model="addDataForm"
        :label-width="120"
        :rules="addDataRule"
        inline
      >
        <FormItem
          label="push标题"
          prop="titile"
        >
          <Input
            v-model="addDataForm.titile"
            placeholder="push标题"
            style="width: 250px;"
            :maxlength="20"
          ></Input>
        </FormItem>
        <FormItem
          label="push副标题"
          prop="content"
        >
          <Input
            v-model="addDataForm.content"
            placeholder="push副标题"
            style="width: 250px;"
            :maxlength="50"
          ></Input>
        </FormItem>
        <FormItem
          label="发送对象"
          prop="sendTarget"
        >
          <Select
            v-model="addDataForm.sendTarget"
            clearable
            filterable
            style="width:250px"
          >
            <Option
              v-for="(item, index) in targetMap"
              :key="index"
              :value="index"
            >
              {{ item }}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          label="跳转链接(非必填)"
          prop="linkUrl"
        >
          <Input
            v-model="addDataForm.linkUrl"
            placeholder="跳转链接"
            style="width: 250px;"
          ></Input>
        </FormItem>
        <FormItem
          label="发送节点"
          prop="routeNode"
        >
          <Select
            v-model="addDataForm.routeNode"
            clearable
            filterable
            style="width:250px"
          >
            <Option
              v-for="(item, index) in nodeMap"
              :key="index"
              :value="index"
            >
              {{ item }}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          label="适用业务"
          prop="businessId"
        >
          <Select
            v-model="addDataForm.businessId"
            clearable
            filterable
            style="width:250px"
          >
          <Option :value="0">全局</Option>
          <Option
            v-for="item in bizTypeList"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem
          label="携带参数"
          prop="parmType"
        >
          <Select
            v-model="addDataForm.parmType"
            clearable
            filterable
            style="width:250px"
          >
            <Option
              v-for="(item, index) in parmMap"
              :key="index"
              :value="index"
            >
              {{ item }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div
        slot="footer"
        style="text-align: center;"
      >
        <Button
          type="primary"
          @click="add"
        >
          保存
        </Button>
        <Button @click="isShowCreateModal = false">
          返回
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
/* eslint-disable eqeqeq */
import {
  Columns,
  targetMap,
  nodeMap,
  businesstMap,
  stateMap,
  parmMap

} from "./fields.js"
import {
  toResult,
  add,
  listMessage,
  update
} from "_o/api/push-message.js"
import { mapState } from "vuex";
export default {
  name: "push",
  components: {
  },
  data() {
    return {
      addDataRule: {
        titile: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        content: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        linkUrl: [],
        sendTarget: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        routeNode: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        businessId: [
          {
            required: true,
            message: "必选",
          }
        ],
        parmType: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ]
      },
      total: 0,
      targetMap,
      nodeMap,
      businesstMap,
      parmMap,
      stateMap,
      current: 1,
      pageSize: 10,
      tableColumns: [],
      tableData: [],
      searchData: {},
      queryAjaxPramas: {},
      isShowCreateModal: false,
      modalTitle: "新增消息",
      addDataForm: {
        titile: "",
        content: "",
        sendTarget: "",
        linkUrl: "",
        routeNode: "",
        businessId: "",
        parmType: ""
      }
    }
  },
  created() {
    this.getTableColumns()
    this.getList()
    // this.getALLType()
  },
  computed:{
    ...mapState({
      bizTypeList: state => state.common.bizTypeList,
    }),
  },
  methods: {
    getTableColumns() { // 设置表头
      let data = [
        {
          title: "操作",
          width: "100px",
          key: "action",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              params.row.status == "1"
                ? h("Button", {
                  props: {
                    type: "success",
                    ghost: true,
                    size: "small"
                  },
                  directives: [
                    {
                      name: "hasAuth",
                      value: "business-message-enable"
                    }
                  ],
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "请确认",
                        content: "<p>启用本条push消息</p>",
                        okText: "是",
                        cancelText: "否",
                        onOk: () => {
                          let data = {
                            id: params.row.id,
                            status: 0
                          }
                          this.update(data)
                        }
                      })
                    }
                  }
                }, "启用")
                : h("Button", {
                  props: {
                    type: "error",
                    ghost: true,
                    size: "small"
                  },
                  directives: [
                    {
                      name: "hasAuth",
                      value: "business-message-stop"
                    }
                  ],
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "请确认",
                        content: "<p>停用本条push消息</p>",
                        okText: "是",
                        cancelText: "否",
                        onOk: () => {
                          let data = {
                            id: params.row.id,
                            status: 1
                          }
                          this.update(data)
                        }
                      })
                    }
                  }
                }, "停用")
              // h('Button', {
              //   props: {
              //     type: 'primary',
              //     ghost: true,
              //     size: 'small',
              //     disabled: true
              //   },
              //   // directives: [
              //   //   {
              //   //     name: 'hasAuth',
              //   //     value: 'risk-alarm-rule-update'
              //   //   }
              //   // ],
              //   on: {
              //     click: () => {
              //     }
              //   }
              // }, '变更记录')
            ])
          }
        }
      ]
      Object.keys(Columns(this)).forEach(col => data.push(Columns(this)[col]))
      this.tableColumns = data
    },
    queryData() { // 点击查询
      this.queryAjaxPramas = {}
      this.current = 1
      Object.keys(this.searchData).forEach(key => {
        let item = this.searchData[key]
        if (item || item === 0) {
          this.queryAjaxPramas[key] = item
        }
      })
      this.getList()
    },
    clearQueryData() { // 点击清空
      this.queryAjaxPramas = {}
      this.searchData = {}
      this.current = 1
      this.getList()
    },
    async getList() { // 获取列表数据
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      }
      let obj = Object.assign(params, this.queryAjaxPramas)
      this.isLoading = false
      const [err, data] = await toResult(listMessage(obj))
      if (!err) {
        this.isLoading = true
        this.total = data.totalCount
        this.current = data.currPage || 1
        this.pageSize = data.pageSize
        this.tableData = data.list
      }
    },
    async update(data) { // 启用，停用
      const [err] = await toResult(update(data))
      if (err) return
      this.getList()
    },
    // 新增消息
    addMessage() {
      // this.addDataForm.sendTarget = null
      this.$refs["addDataName"].resetFields()
      this.isShowCreateModal = true
    },
    // 新增消息
    async add() {
      this.$refs.addDataName.validate(valid => {
        if (valid) {
          this.getAdd(this.addDataForm)
        }
      })
    },
    // 新增接口
    async getAdd(params) {
      const [err] = await toResult(add(params))
      if (err) return
      this.isShowCreateModal = false
      this.clearQueryData()
    },
    changePageSize(val) {
      this.pageSize = val
      this.getList()
    },
    changePage(val) {
      this.current = val
      this.getList()
    }
  }
}
</script>
<style lang="less" scoped>

</style>
