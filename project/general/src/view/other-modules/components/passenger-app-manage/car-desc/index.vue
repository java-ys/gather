<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="handleSearch"
      @on-reset="reset"
    />
    <div>
      <p>{{ webTypeInfo[0].introText[0] }}</p>
      <p>
        {{ webTypeInfo[0].introText[1] }}
<!--        <span class="view-default" @click="viewDefaultConfig">-->
<!--          默认配置详情-->
<!--        </span>-->
      </p>
    </div>
    <div style="margin-top: 10px;">
      <Button type="primary" v-hasAuth="'car-desc-add'" @click="createNewConfig">
        新建策略
      </Button>
    </div>
    <VTable
      style="margin-top: 25px;"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      :pageSizeOpts="[10, 20, 30, 40, 50]"
      @changePage="changePage"
      @changePageSize="changePageSize"
    />
    <edit
      ref="_edit"
      :city-list="cityList"
      :modal-data="detailData"
      :mold="mold"
      @close="closeModal"
    ></edit>
  </div>
</template>

<script>
import { pageList, deleteService, detailService } from "_o/api/car-desc";
import { getProvinceCityAllList } from "_g/api/common";
import { inputList, webTypeInfo, column, defaultVehicleList } from "./fields";
import { cpTranslate } from "@/libs/tools";
import Edit from "./components/Edit";

export default {
  name: "car-desc",
  components: {
    Edit,
  },
  data() {
    return {
      webTypeInfo,
      columns: column(this),
      current: 1,
      tableData: [],
      total: 0,
      pageSize: 20,
      params: {}, // 搜索参数
      cityList: [],
      inputList,
      detailData: {},
      mold: 1,
    };
  },
  watch: {
    $route: {
      handler() {
        this.getList();
        this.getCityList();
      },
      immediate: true
    }
  },
  methods: {
    deleteRow({ id }) {
      this.$Modal.confirm({
        title: "提示",
        content: "删除后，前端将展示默认车型文案，确定删除该条策略？",
        onOk: async () => {
          const [err] = await deleteService({ id });
          if (err) {
            return;
          }
          this.$Message.success("删除成功!");
          this.getList();
        }
      });
    },
    closeModal(b) {
      b && this.getList();
    },
    createNewConfig() {
      this.detailData = {};
      this.mold = 1
      this.$refs._edit.show();
    },
    viewDefaultConfig() {
      this.detailData = {
        advertisingList: JSON.stringify(defaultVehicleList),
        provinceName: "",
        cityName: ""
      }
    },
    async showDetail(row) {
      this.mold = 3
      this.detailData = {...row}
      this.$refs._edit.show();
    },
    async edit(row) {
      this.mold = 2
      this.detailData = {...row}
      this.$refs._edit.show();
    },
    async getCityList() {
      const res = await getProvinceCityAllList();
      if (res.data.success) {
        const cityList = cpTranslate(res.data.data);
        this.cityList = cityList;
        this.inputList[0].cascaderList = cityList;
      }
    },
    getList() {
      pageList({
        currPage: this.current,
        pageSize: this.pageSize,
        ...this.params
      }).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.totalCount;
        }
      });
    },
    handleSearch(params) {
      this.params = params;
      this.current = 1;
      this.getList();
    },
    reset() {
      this.params = {};
      this.current = 1;
      this.getList();
    },
    changePage(pageNum) {
      this.current = pageNum;
      this.getList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getList();
    }
  }
};
</script>

<style scoped lang="less">
.view-default {
  color: #2d8cf0;
  cursor: pointer;
}
</style>
