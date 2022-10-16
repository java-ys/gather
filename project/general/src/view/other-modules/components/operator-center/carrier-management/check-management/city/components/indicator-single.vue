<template>
  <div>
    <Modal
      v-model="show"
      title="配置基础分佣抽成系数"
      width="980"
      :mask-closable="false"
      :closable="false"
    >
      <SearchList
        :inputList="inputList"
        @on-search="queryData"
        @on-reset="clearQueryData"
      />
      <m2-table
        v-if="show"
        class="mt-20 table-con"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></m2-table>
      <div v-if="editable && selectedRow">
        <Divider />
        <h2 class="title-b">系数配置</h2>
        <div class="list-c">
          <standard-list ref="_standard_list" :cData="selectedRow"></standard-list>
        </div>
      </div>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-lazy-click="save">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { indicatorInputList, indicatorColumnSingle } from "../fields";
import { assessPageService } from "_o/api/check";
import { tool } from "_o/api/baseMixin.js";
import StandardList from '../../components/standard'

// 单指标选择
export default {
  name: 'indicator-single',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 获取指标列表额外参数
    extraParams: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 是否可以修改选中的指标
    editable: {
      type: Boolean,
      default: true
    },
    selected: { // 选中的指标
      type: Object,
    }
  },
  components: {
    m2Table,
    StandardList
  },
  mixins: [tool],
  watch: {
    visible(v) {
      this.show = v
      if(!v) {
        this.clearSearchParams()
      } else {
        this.getList();
        if(this.selected?.standard) {
          this.selectedRow = this.selected
          this.currentId = this.selectedRow.uuid || this.selectedRow.indexUuid;
        }
      }
    }
  },
  data() {
    return {
      show: this.visible,
      tableColumns: indicatorColumnSingle(this),
      isLoading: false,
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [10, 30, 50, 100],
      tableData: [],
      inputList: indicatorInputList,
      height: 500,

      searchData: {},
      selectedRow: undefined, // 选中的指标
      currentId: ''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      let p = {
        currPage: this.current,
        pageSize: this.pageSize,
        status: 1,
        ...this.searchData,
        ...this.extraParams,
      };
      const [err, data] = await this.toResult(assessPageService(p));
      if (err) {
        return;
      }
      this.tableData =
        data?.list
          .map((it) => {
            return { ...it };
          })
          .filter((it) => it.status !== 0) || [];
      this.total = data?.totalCount;
    },
    async cancel() {
      this.$emit("close", null);
    },
    async save() {
      if(this.editable) {
        let data = this.getSelectedIndicator();
        this.selectedRow.standard = JSON.stringify(data)
      }
      this.$emit("close", this.selectedRow);
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getList();
    },
    changePage(current) {
      this.current = current;
      this.getList();
    },
    queryData(data) {
      Object.keys(data).forEach((it) => {
        this.searchData[it] = data[it];
      });
      this.getList();
    },
    clearQueryData() {
      this.current = 1;
      this.searchData = {};
      this.getList();
    },
    selectRow(row) {
      this.currentId = row.uuid
      this.selectedRow = row
      if(row.parentFlag - 1 === 0) {
        this.selectedRow._subIndex = 0
      }
    },
    clearSearchParams() {
      this.inputList[0].value = ''
    },
    getSelectedIndicator() {
      return this.$refs?._standard_list?.getData() || ''
    }
  },
};
</script>

<style lang="less" scoped>
/deep/ .table-con table {
  width: 100% !important;
}
/deep/ .ivu-table-wrapper {
  width: 100% !important;
  table {
    width: 100% !important;
  }
}
.list-c {
  margin-left: 80px;
}
.title-b {
  margin-bottom: 12px;
}

</style>
