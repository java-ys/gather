<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-07-20 10:22:30
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-26 17:54:25
-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="详情"
    :visible="detailVisible"
    width="50%"
    style="font-weight: bold"
    @close="closeDialog"
  >
    <div v-if="fileList.length" style="margin-bottom:10px">下载附件：
      <template v-for="(item, index) in fileList">
        <span :key="index" style="cursor: pointer; color: #4694FA; margin: 0 5px" @click="getFile(item.uuid)">{{item.fileName}}</span>
      </template>
    </div>
    <m2-el-table
      :tableData="tableData"
      :columns="weekColumns"
      :pageObj="pageObj"
      :options="options"
      height="400"
      @on-pagesize-change="pageSizeChange"
      @on-sort-change="sortChange"
      @pagesizeChange="sizeChange"
    >
      <el-table-column
        slot="auditStatus"
        label="状态"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{scope.row.auditStatus | auditStatusFormatter}}</span>
        </template>
      </el-table-column>
    </m2-el-table>
  </el-dialog>
</template>
<script>
import m3elTable from "_o/components/operator-center/salary-modules/common/m3elTable";
import { toResult } from "_o/common/salaryMixin";
import { queryOfflineRewardsDetail, getFileList, getFileUrl } from "_o/api/salary/salaryRule";
import { weekColumns } from "./fields";
export default {
  components: {
    m3elTable,
  },
  filters: {
    auditStatusFormatter(val) {
      const statusName = {
        0: "初始",
        1: "审核中",
        2: "审批通过",
        3: "驳回",
        4: "失败"
      }
      return statusName[val]
    }
  },
  props: ["detailVisible", "batchNo"],
  data() {
    return {
      weekColumns,
      tableData: [],
      pageObj: {
        size: 20,
        total: 0,
        currentPage: 1
      },
      options: {
        selection: false,
        sequence: true
      },
      fileList: []
    };
  },
  computed: {
    queryParams() {
      return {
        currPage: 1,
        pageSize: 20,
        batchId: this.batchNo
      };
    }
  },
  created() {
    this.getData();
    this.getFileData();
  },
  methods: {
    async getFile(uuid) {
      const [err, data] = await toResult(getFileUrl({ uuid: uuid }));
      if (err) {
        this.$message.error(err.msg);
        return;
      }
      let fileFormat = "";
      this.fileList.map(it => {
        if (it.uuid === uuid) {
          fileFormat = it.fileName;
        }
      })
      let fileData = fileFormat.split(".");
      let url = fileData[fileData.length - 1];
      let fileType = ["png", "jpg", "jpeg"];
      if (fileType.includes(url)) {
        window.open(data.url);
      } else {
        window.location.href = data.url;
      }
    },
    async getFileData() {
      const [err, data] = await toResult(getFileList({ id: this.batchNo }));
      if (err) {
        this.$message.error(err.msg);
        return;
      }
      this.fileList = data;
    },
    async getData() {
      const [err, data] = await toResult(queryOfflineRewardsDetail(this.queryParams));
      if (err) {
        this.$alert(err.message);
        return;
      }
      this.tableData = data.list;
      this.pageObj.total = data.totalCount;
    },
    pageSizeChange(v) {
      this.pageObj.currentPage = v;
      this.queryParams.currPage = v;
      this.getData();
    },
    sizeChange(v) {
      this.pageObj.currentPage = 1;
      this.pageObj.size = v;
      this.queryParams.currPage = 1;
      this.queryParams.pageSize = v;
      this.getData();
    },
    sortChange() {},
    closeDialog() {
      this.$emit("closeDialogHandle", "detail");
    }
  }
};
</script>
