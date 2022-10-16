<template>
  <Modal
    v-model="visible"
    title="扣款明细"
    @on-cancel="closeModal"
  >
    <Table
      ref="table"
      :columns="columns"
      :data="tableData"
    />
  </Modal>
</template>
<script>
import { queryBillDetail } from "_o/api/work-order/payment"
export default {
  name: "detail",
  data() {
    return {
      visible: false,
      columns: [
        {
          title: "扣款金额（元）",
          key: "settledAmount",
          render: (h, params) => {
            const { settledAmount, billSymbol } = params.row
            return billSymbol === 1 ? h(
              "span",
              `+${settledAmount}`
            ) : h(
              "span",
              `-${settledAmount}`
            )
          }
        },
        {
          title: "扣款时间",
          key: "createTime",
          render: (h, params) => {
            const { createTime } = params.row
            return createTime ? h(
              "span",
              this.$moment(createTime).format("YYYY-MM-DD HH:mm:ss")
            ) : null
          }
        }
      ],
      // 列表数据
      tableData: []
    }
  },
  methods: {
    async openModal() {
      // 查看明细,将参数继续往下传
      if (arguments[0]) {
        await this.getDetail(...arguments)
      }
      this.visible = true
    },
    async closeModal() {
      this.visible = false
    },
    async getDetail() {
      const [userId, billCode] = arguments
      // 查询明细
      const res = await queryBillDetail({ userId, billCode })
      if (res.data.success) {
        const { data } = res.data
        this.tableData = data
      } else {
        this.$Message.error(res.data.msg)
      }
    }
  }
}
</script>
