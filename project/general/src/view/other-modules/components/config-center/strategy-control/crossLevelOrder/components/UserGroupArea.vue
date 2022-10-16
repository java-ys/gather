<script>
import { defineComponent, reactive } from "@vue/composition-api";

export default defineComponent({
  name: "UserGroupArea",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup: (props, ctx) => {
    const tableProps = reactive({
      size: "small",
      bordered: true,
      pagination: false,
      columns: [
        {
          title: "序号",
          key: "crowdCode",
          scopedSlots: {
            customRender: "index"
          },
        },
        {
          title: "用户群名称",
          dataIndex: "crowdName",
          key: "crowdName",
        },
        {
          title: "是否动态更新",
          dataIndex: "isDynamic",
          key: "isDynamic",
          scopedSlots: {
            customRender: "isDynamic"
          },
        },
        {
          title: "用户群人数",
          dataIndex: "userNum",
          key: "userNum",
        },
        {
          title: "操作",
          scopedSlots: {
            customRender: "ops"
          },
          key: "ops",
        },
      ]
    })

    const clickDelGroup = index => {
      ctx.emit("del-group", index)
    }
    const showGroupModal = () => {
      ctx.emit("show-modal")
    }
    return {
      tableProps,
      clickDelGroup,
      showGroupModal,
    }
  }
})
</script>
<template>
  <div>
    <div>目标用户： <a-button size="small" type="primary" @click="showGroupModal">查看用户群</a-button></div>
    <div v-if="list.length > 0">
      <a-table v-bind="tableProps" :dataSource="list">
        <span slot="index" slot-scope="text,record,index">
          {{index + 1}}
        </span>
        <span slot="ops" slot-scope="text, record, index">
          <a-button type="link" size="small" @click="clickDelGroup(index)">删除</a-button>
        </span>
        <span slot="isDynamic" slot-scope="text, record">
          {{record.isDynamic === 1 ? '是' : '否'}}
        </span>
      </a-table>
    </div>
  </div>
</template>
