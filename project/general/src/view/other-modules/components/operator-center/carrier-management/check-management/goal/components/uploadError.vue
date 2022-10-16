<template>
  <div>
    <Modal v-model="visible">
      <Row type="flex" justify="center" align="middle">
        <Col span="1">
          <div>
            <span
              class="circle"
              style="background-color: #faad14; color: #fff; padding: 0 4px"
              >!</span
            >
          </div></Col
        >
        <Col span="23">
          <p>{{ successInfo }}条, {{ failInfo }}条，请在本地修改后重新上传。</p>
        </Col>
      </Row>
      <div style="margin-top: 24px; max-height: 384px; overflow: auto">
        <m2-table
          :isShowPage="false"
          :total="total"
          :current="current"
          :pageSize="pageSize"
          :height="height"
          :isLoading="isLoading"
          :parColumns="parColumns"
          :parTableData="tableData"
        >
        </m2-table>
      </div>

      <div
        slot="footer"
        style="margin-top: 20px; display: flex; justify-content: flex-end"
      >
        <Button type="primary" @click="uploadAgain" style="margin-right: 10px"
          >重新上传</Button
        >
        <Button type="primary" @click="close">取消</Button>
        <!-- <Tooltip content="点此下载失败列表" placement="left">
        <Button @click="downExecl" style="margin-right: 16px">下载</Button>
      </Tooltip> -->
      </div>
    </Modal>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";

export default {
  components: {
    m2Table,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    uploadInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    let tableData = this.uploadInfo.failInfoList;
    return {
      total: 0,
      current: 1,
      pageSize: 10,
      height: 300,
      isLoading: false,
      parColumns: [
        {
          title: "行数",
          align: "center",
          minWidth: 50,
          tooltip: true,
          key: "failRow",
          render(h, { row }) {
            return h("span", {}, `第${row.failRow}行`);
          }
        },
        {
          title: "错误描述",
          key: "failReason",
          align: "center",
          minWidth: 120,
          tooltip: true,
          ellipsis: true,
        },
      ],
      tableData,
    };
  },
  computed: {
    successInfo() {
      return "上传成功：" + this.uploadInfo.successCount;
    },
    failInfo() {
      return "上传失败：" + this.uploadInfo.failureCount;
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    uploadAgain() {
      this.$emit("close");
    },
  },
};
</script>
<style>
</style>
