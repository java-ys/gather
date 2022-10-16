<template>
  <div class="driver-configure">
    <m2-table
      class="mt-20"
      :total="1"
      :isLoading="isLoading"
      :parColumns="triggerTableColumns"
      :parTableData="tableData"
      ></m2-table>
    <log ref="log" />
    <!-- 操作记录弹框 -->
    <Modal v-model="showRecord" width="960" title="操作记录">
      <div class="showRecord-content">
      </div>
      <div slot="footer">
        <Button type="primary" @click="showRecord = false">确定</Button>
      </div>
    </Modal>

    <Modal v-model="showModal" width="1024" :title="modalTitle">
      <trigger-config
        v-if="showModal"
        @cancel="cancel"
        @confirm="confirm"
        :type="type"
        :triggerData="tableData[0]"
      />
      <div slot="footer">

      </div>
    </Modal>
  </div>
</template>

<script>
import { cpTranslate, cpLabelValue } from "@/libs/tools";
import m2Table from "_a/m2-table/v-table";
import { triggerTableColumns } from "./conf";
import { recommendLog } from "_o/api/operator-carrier";
import TriggerConfig from "./components/trigger-config/trigger-config"
import { getSfFrequency, upOrDownLine } from "_o/api/guide-config"
import log from './components/log'
import { EDIT, DETAIL } from "./constant";

export default {
  name: "secret-free-trigger",
  data() {
    return {
      type: '',
      formData: {},
      showModal: false,
      showRecord: false, // 操作记录
      isLoading: false,
      id: "",
      triggerTableColumns: triggerTableColumns(this),
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    };
  },
  components: { m2Table, TriggerConfig, log },
  mounted() {
    this.fetchSfFrequency()
  },
  watch: {
    showModal(v) {}
  },
  computed: {
    modalTitle: function() {
      return this.type === DETAIL ? '详情' : '编辑'
    }
  },
  methods: {
    async onlineAndOffline({ id, operatorFlag, operatorType }) {
      this.$Modal.confirm({
        title: '提示',
        content: operatorFlag === 2 ? '是否确认上线' : '是否确认下线',
        onOk: async () => {
          const res = await upOrDownLine({ id, operatorFlag, operatorType })
          if (!res.data.success) return this.$Message.error(res.data.msg)
          this.fetchSfFrequency()
        }
      })
    },
    detail() {
      this.showModal = true
      this.type = DETAIL
    },
    edit() {
      this.showModal = true
      this.type = EDIT
    },
    confirm() {
      this.showModal = false
      this.fetchSfFrequency()
    },
    cancel() {
      this.showModal = false
    },
    async fetchSfFrequency() {
      const res = await getSfFrequency()
      if (!res.data.success) return this.$Message.error(res.data.msg)

      this.tableData = [res.data.data || {}]
    },
    // 获取操作记录列表数据
    getModalTableData(id) {
      this.id = id;
      recommendLog({
        businessCode: 1,
        businessId: id,
        currPage: this.current,
        pageSize: this.pageSize
      }).then(res => {
        this.tableData = res.data.data.list;
        this.total = res.data.data.totalCount;
      });
    },
    goLog(val) {
      this.$refs.log.init({ ...val, ...{ type: 2 } });
    },
  }
};
</script>

<style lang="less">
.driver-configure {
  .button-wrap {
    margin-bottom: 20px;
  }
}
</style>
