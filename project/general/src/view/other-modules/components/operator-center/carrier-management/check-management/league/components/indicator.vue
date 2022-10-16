<template>
  <div>
    <Modal
      v-model="visible"
      title="请选择指标"
      width="880"
      :mask-closable="false"
      :closable="false"
    >
      <SearchList
        :inputList="inputList"
        @on-search="queryData"
        @on-reset="clearQueryData"
      />
      <m2-table
        ref="_t3_table"
        class="mt-20"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        :height="height"
        @changePage="changePage"
        @changePageSize="changePageSize"
        @on-select="onSelect"
        @select-cancel="selectCancel"
        @select-all="selectAll"
        @select-all-cancel="selectAll"
      ></m2-table>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-lazy-click="save">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { indicatorColumn, indicatorInputList } from "../fields";
import { store, mutations, SelectedQuestions } from "./store";
import { assessPageService } from "_o/api/check";
import { tool } from "_o/api/baseMixin.js";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    extraParams: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  components: {
    m2Table,
  },
  mixins: [tool],
  data() {
    return {
      tableColumns: indicatorColumn,
      // formItem: {
      //   categoryId: "",
      // },
      isLoading: false,
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [10, 30, 50, 100],
      tableData: [],
      topicSelectedList: new SelectedQuestions([]),
      inputList: indicatorInputList,
      height: 500,

      searchData: {},
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
        ...this.extraParams
      };
      const [err, data] = await this.toResult(assessPageService(p));
      if (err) {
        return;
      }
      this.tableData = data.list;
    },
    async cancel() {
      this.$emit("close", this.topicSelectedList.list); // 把传来的传回去保持不变
    },
    async save() {
      // const { categoryId, isRandom, randomCount, singleOnePercent } = this.formItem

      // if (!!isRandom) {
      //   if(!randomCount) {
      //     this.$Message.error("请输入出题数");
      //     return
      //   }
      //   if(!singleOnePercent) {
      //     this.$Message.error("请输入单选题比例");
      //     return
      //   }
      // }

      // if (!!isRandom) {
      //   const [err, data] = await this.toResult(s.questionRandomList({ categoryId, randomCount, singleOnePercent, ids: this.topicSelectedList.ids() }));
      //   if (err) { return }
      //   data.list.forEach(async item => await this.topicSelectedList.addItem(item))
      // }
      // if (this.topicSelectedList.count() > Max_Num)
      //   return this.$Message.error(`最多只能添加${Max_Num}个题目`);

      this.$emit("close", this.topicSelectedList.list);
    },
    async onSelect(selection, row) {
      this.topicSelectedList.addItem(row);
    },
    // 取消选中
    selectCancel(selection, row) {
      this.topicSelectedList.delItem(row.id);
    },
    listSuccess() {
      this.topicSelectedList.clear();
    },
    selectAll(selection) {
      // if (!this.getTableRef()) return;
      // 当前页全部取消
      if (selection && selection.length === 0) {
        //  若取消全选，删除保存在selectedIds里和当前table数据的id一致的数据，达到，当前页取消全选的效果
        // 当前页的table数据
        // let data = this.getTableRef().data;
        let data = this.tableData;

        data.forEach((item) => {
          if (this.topicSelectedList.has(item.id))
            this.topicSelectedList.delItem(item.id);
        });
      } else {
        // 当前页全部选中
        selection.forEach((item) => this.topicSelectedList.addItem(item));
      }
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
  },
};
</script>
