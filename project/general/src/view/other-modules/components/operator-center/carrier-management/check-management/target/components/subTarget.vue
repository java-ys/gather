<template>
  <div>
    <Modal
      v-model="visible"
      title="请选择指标"
      width="880"
      :mask-closable="false"
      :closable="false"
    >
      <searchList
        ref="subtarget"
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
        <Button v-lazy-click="save" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { indicatorColumn, indicatorInputList } from "./fields";
import { store, mutations, SelectedQuestions } from "./store";
import { assessPageService } from "_o/api/check";
import { tool } from "_o/api/baseMixin.js";

export default {
  components: {
    m2Table,
  },
  mixins: [tool],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    subTargetList: {
      type: Array,
      default: ()=>{
          return []
      },
    },
    extraParams: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      tableColumns: indicatorColumn,
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
        parentFlag: 0,
        status: 1,
        ...this.searchData,
        ...this.extraParams
      };
      const [err, data] = await this.toResult(assessPageService(p));
      if (err) {
        return;
      }
      console.log(this.subTargetList)
      this.tableData = data?.list.map(it=>{
          let obj = {...it,_disabled:it.status === 0}
          for(let item of this.subTargetList){
              if(item.childIndexId === it.id){
                  obj._checked = true
                  this.topicSelectedList.addItem(it);
              }

          }
          return obj
      }).filter(it=>it.status !== 0) || [];
      this.total = data?.totalCount
    },
    async cancel() {
      this.$emit("close", this.topicSelectedList.list); // 把传来的传回去保持不变
    },
    async save() {
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
          if (this.topicSelectedList.has(item.id)) this.topicSelectedList.delItem(item.id);
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
      this.searchData =data
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
