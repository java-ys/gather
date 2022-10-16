<template>
  <div v-if="showModal">
    <Modal v-model="showModal" title="选择活动" width=1400 :mask-closable="false" draggable>
      <div class="content">
        <search-list :inputList="inputList" @on-search="searchData" @on-reset="resetData"></search-list>
        <v-table :current="current" :pageSize="pageSize" :total="total" :parColumns="columns" :parTableData="tableData"
          @changePage="changePage" @changePageSize="changePageSize" @selectHandle="changeSelection"></v-table>
      </div>
      <div slot="footer">
        <Button @click="cancelData">取消</Button>
        <Button type="primary" @click="saveData">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import searchList from '_a/search-list/search-list.vue';
import vTable from '_a/v-table/v-table.vue';
import { inputList, columns } from './conf.js';
import { axiosPageList } from '_g/api/market.js';
export default {
  components: { searchList, vTable },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    limitNumber: {
      type: Number,
      default: 1
    },
    searchItem: {
      type: Object,
      default() {
        return {};
      }
    },
    choosenList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      showModal: false,

      inputList,
      searchParams: {},

      current: 1,
      pageSize: 10,
      total: 0,
      columns: columns(this),
      tableData: [],

      selectionData: []
    };
  },
  methods: {
    searchData(params) {
      this.searchParams = params;
      this.getTableData();
    },
    resetData() {
      this.current = 1;
      this.searchParams = {};
      this.getTableData();
    },

    getTableData(params = this.searchParams) {
      let conf = {
        currPage: this.current,
        pageSize: this.page,
        auditStatus: 1,
        isInclude: false
      };
      Object.assign(params, conf, this.searchItem);
      axiosPageList(params).then(res => {
        let data = res.data.data;
        this.total = data.totalCount;
        this.tableData = data.list;
        this.isOverLimit();
        this.$store.commit('changeLoadingFlag', false);
      });
    },
    changePage(page) {
      this.current = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    },
    changeSelection(selection) {
      this.selectionData = selection;
      if (this.selectionData.length > this.limitNumber) {
        this.selectionData.splice(this.limitNumber);
      }
      this.isOverLimit();
    },
    isOverLimit(data = this.tableData, limitNumber = this.limitNumber) {
      if (this.selectionData.length >= limitNumber) {
        data.map(item => {
          if (this.selectionData.find(value => value.activityCode === item.activityCode)) {
            item._checked = true;
            item._disabled = false;
          } else {
            item._checked = false;
            item._disabled = true;
          }
          return item;
        });
      } else {
        data.map(item => {
          item._checked = false;
          item._disabled = false;
          return item;
        });
      }
      // 强制更新视图
      data.length && data.splice(0, 1, data[0]);
    },

    cancelData() {
      this.showModal = false;
      this.selectionData = [];
    },
    saveData() {
      this.$emit('on-save', this.selectionData);
      this.cancelData();
    },
    skip() {
      this.cancelData();
      // this.$parent.cancelData && this.$parent.cancelData();
    }
  },
  watch: {
    value: {
      handler(value) {
        this.showModal = value;
        if (value) {
          this.getTableData();
          this.selectionData = [...this.choosenList];
        }
      },
      immediate: true
    },
    showModal(value) {
      this.$emit('input', value);
    }
  }
};
</script>

<style>
.ivu-modal-no-mask {
    pointer-events: auto;
    }
</style>