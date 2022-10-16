<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <Button type="primary" @click="download">批量下载</Button>
    <m2-table
      class="top15"
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @selectHandle="onSelect"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </m2-table>
    <div v-if="showAdd">
      <review-modal
        :visible="showAdd"
        :detail="detailData"
        @close="close"
      ></review-modal>
    </div>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import {
  queryProtocolByPageService,
  queryProtocolDetailService,
  signatureProtocolService,
  suspendProtocolService,
} from "_o/api/proto";
import { _getProvinceCityList, _getAgentList } from "_g/api/general";
import common from "../tool/common";
import { inputList, tableColumns } from "./fields.js";
import fileDownload from "js-file-download"
import { getToken } from "@/libs/util"
import axios from "axios"
import reviewModal from "./reviewModal.vue";

export default {
  name: "check-management-sign",
  components: {
    m2Table,
    reviewModal
  },
  mixins: [common],
  data() {
    return {
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),

      tableConfig: {
        searchParams: {},
        current: 1,
        total: 0,
        pageSize: 10,
        tableData: []
      },
      showAdd: false,
      selected: [],
      detailData: {},
    };
  },
  created() {
    this.func = queryProtocolByPageService;
    this.getList();
  },
  mounted() {
    this.getCityList();
    this.getAgentList();
  },
  methods: {
    onSelect(selection) {
      this.selected = selection.map(v => v.uuid);
    },
    download() {
      if (!this.selected.length) return this.$Message.info("请选择要下载的协议");
      axios({
        method: "post",
        url: this._baseUrl + "/api/operate/protocol/downloadProtocolBatch",
        responseType: "blob",
        headers: { "Authorization": getToken() },
        data: { protocolUuids: this.selected }
      }).then(async (res) => {
        try {
          const str = await res.data.text();
          const result = JSON.parse(str);
          if (!result.success) return this.$Message.error(result.msg);
        } catch (err) {
        }
        if (res.data) fileDownload(res.data, "运营商考核协议.zip")
      })
    },
    review(row) {
      this.showAdd = true;
      this.detailData = row
    },
    // 审核弹窗关闭
    close(b) {
      this.showAdd = false;
      this.detailData = {};
      console.log(this.showAdd)
      b && this.getList();
    },
    sign(row) {
      let self = this;
      this.$Modal.confirm({
        title: "提示",
        content: "是否确认签章？",
        onOk: async () => {
          const [err, data] = await self.toResult(signatureProtocolService({ protocolUuid: row.uuid }));
          if (err) {
            // this.$Message.error(err.message);
            return;
          }
          this.$Message.success("签章成功");
          self.getList();
        }
      });
    },
    async invalid(row) {
      await new Promise(resolve => this.$Modal.confirm({ title: "请再次确认是否作废该协议，作废后不可恢复！", onOk: resolve }));
      const [err, data] = await this.toResult(suspendProtocolService({ protocolUuid: row.uuid }));
      if (err) {
        // this.$Message.error(err.message);
        return;
      }
      this.$Message.success("作废成功");
      await this.getList();
    },
    async detail(row) {
      const [err, data] = await this.toResult(queryProtocolDetailService({ protocolUuid: row.uuid }));
      if (err) {
        // this.$Message.error(err.message);
        return;
      }
      data.fileUrl && window.open(data.fileUrl);
    },
    // 确认新增
    confirm() {
      this.getList();
      this.close();
    },
    async getCityList() {
      const { cityList } = await _getProvinceCityList({});
      this.findBindKey("cityCode").dropList = cityList;
    },
    async getAgentList() {
      const { list } = await _getAgentList({});
      this.findBindKey("agentUuid").dropList = list;
    },
    findBindKey(key) {
      return this.inputList.find(it => it.bind_key === key) || {};
    },
    setPageParams(p) {
      if (p.protocolDate) {
        p.protocolDate = p.protocolDate.split("-").join("");
      }
      return p;
    }
  }
};
</script>

<style scoped></style>
