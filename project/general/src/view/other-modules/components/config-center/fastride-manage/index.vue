<template>
  <div class="carrier">
    <div class="carrier-header">
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
      ></SearchList>
      <Button
        v-hasAuth="'fastride-car-add'"
        type="primary"
        @click="goAdd"
      >
        新增
      </Button>
    </div>
    <div class="carrier-content">
      <VTable
        :total="total"
        :current="currPage"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="parColumns"
        :parTableData="tableData"
        style="margin-top: 25px;"
        @selectObj="selectObj"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></VTable>
      <add ref="add" @confirmAdd="confirmAdd"></add>
    </div>
  </div>
</template>

<script>
import {
  returnFields,
  inputList,
} from "./index";
import VTable from "_a/v-table/v-table";
import add from "./add/index";
import SearchList from "_a/search-list/search-list";
import { getCitys } from "_o/api/configData.js";
import { cpTranslate } from "@/libs/tools";
import {
  getFastCarList, fastCarDel, fastCarDetail,
} from "_o/api/fast-car.js";

export default {
  components: {
    VTable,
    SearchList,
    add
  },
  data() {
    return {
      ...returnFields(this),
      uuid: "",
      tableData: [],
      inputList: [],
      cityList: [],
      isLoading: true,
      pageSize: 10,
      currPage: 1,
      searchListParams: {}, // 保存搜索条件参数
      detailData: {},
    };
  },
  mounted() {
    this.getTableList();
    this.getCityListData();
    this.inputList = inputList;
  },
  methods: {
    // 获取权限内省市级联
    getCityListData() {
      getCitys().then(res => {
        let list = cpTranslate(res.data.data);
        this.inputList[0].cascaderList = list;
        this.cityList = list;
      });
    },
    getTableList() {
      const params = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        ...this.searchListParams,
      }
      getFastCarList(params).then(res => {
        this.tableData = (res.data.data && res.data.data.list) || [{}];
        this.total = (res.data.data && res.data.data.totalCount) || 0;
      });
    },
    confirmAdd() {
      this.getTableList();
    },
    search(data) {
      this.currPage = 1;
      this.searchListParams = { ...data };
      this.getTableList();
    },
    reset(data) {
      this.currPage = 1;
      this.searchListParams = {};
      this.getTableList();
    },
    selectObj(val) {
      this.currPage = val;
      this.getTableList();
    },
    changePage(val) {
      this.currPage = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    // 新建
    goAdd() {
      this.$refs.add.init({}, "新建");
    },
    // 停用
    stop(uuid) {
      this.$Modal.confirm({
        title: "确认停用该策略？",
        onOk: () => {
          fastCarDel({ uuid }).then(res => {
            if (res.data.success) {
              this.$Message.success("已停用");
              this.getTableList();
            }
          });
        },
      })
    },
    // 编辑
    edit(uuid) {
      fastCarDetail({ uuid }).then(res => {
        if (res.data.success) {
          this.detailData = res.data.data;
          this.$refs.add.init(this.detailData, "编辑");
        }
      });
    },
    // 查看
    view(uuid) {
      fastCarDetail({ uuid }).then(res => {
        if (res.data.success) {
          this.detailData = res.data.data;
          this.$refs.add.init(this.detailData, "详情");
        }
      });
    },
    // 复制
    copy(uuid) {
      this.$Modal.confirm({
        title: "确认复制该策略？",
        onOk: () => {
          fastCarDetail({ uuid }).then(res => {
            if (res.data.success) {
              this.detailData = res.data.data;
              this.$refs.add.init(this.detailData, "复制");
            }
          });
        },
      })
    },
  }
};
</script>