<template>
  <div>
    <SearchList :inputList="inputList"
                @on-search="queryData"
                @on-reset="clearQueryData"
                @on-change="handleSelectChange"
    >
    </SearchList>
    <div class="action">
      <Button type="primary" @click="onAdd">新建</Button>
    </div>
    <m2-table
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="handleChangePage"
      @changePageSize="handleChangePageSize"
    >
    </m2-table>
    <add ref="addModal" :openCityList="inputList[0].dropList" :driverTypeMap="driverTypeMap" @reset="getList"></add>
  </div>
</template>
<script>
import SearchList from "_a/search-list/search-list.vue";
import m2Table from "_a/m2-table/v-table";
import add from "./components/add";
import { tableTitle } from "./fields";
import * as webapi from "_o/api/work-order/work-order-config";
import { getCitys } from "_g/api/common.js";
import { fetchCityList } from "_o/api/work-order/work-order-config";
export default {
  name: "third-party",
  components: {
    SearchList,
    m2Table,
    add
  },
  data() {
    return {
      total: 0,
      current: 1,
      pageSize: 10,
      tableColumns: [],
      queryParams: {},
      tableData: [],
      // 司机类型map
      driverTypeMap: [],
      inputList: [
        {
          name: "drop-input", // 文本输入框名
          bind_key: "cityID", // 返回数据的key名
          placeholder: "请选择",
          filterable: true,
          value: "city", // 绑定返回数据
          dropList: [], // 级联列表
          title: "城市："
        }
      ],
    }
  },
  mounted() {
    this.tableColumns = tableTitle(this);
    // 获取列表
    this.getList();
    this.getCityList();
    // 获取司机类型
    this.queryDriverType();
  },
  methods: {
    onAdd() {
      this.$refs.addModal.init();
    },
    async getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      }
      const res = await webapi.getList({ ...params, ...this.queryParams });
      if (res.data.success) {
        const { data } = res.data;
        this.tableData = data?.list || [];
        this.total = data?.totalCount || 0;
        this.current = data?.currPage || 1;
      } else {
        await this.$message.error(res.data.msg);
      }
    },
    // async getCityList() {
    //   const res = await getCitys({});
    //   if (res.data.success) {
    //     const { data } = res.data;
    //     this.inputList[0].dropList = data.map(item => {
    //       return {
    //         value: item.cityID,
    //         label: item.city
    //       }
    //     });
    //   }
    // },
    async getCityList() {
      let param = {
        bizTypes:[1, 2, 4, 6, 7],
        showAllCity: 1,
      }
      const { data: { success, data } } = await fetchCityList(param);
      if (success) {
        this.inputList[0].dropList = data.map(it => {
          return {
            label:it.cityName,
            value:it.cityCode
          }
        })
      }
    },
    async queryDriverType() {
      const res = await webapi.queryDriverType({});
      if (res.data.success) {
        const { data } = res.data;
        this.driverTypeMap = data;
      } else {
        await this.$message.error(res.data.msg);
      }
    },
    async showDetail(row) {
      this.$refs.addModal.init(row.id, "detail");
    },
    // 删除
    async delData(row) {
      let title = "删除配置"
      this.$Modal.confirm({
        title: title,
        onOk: () => {
          webapi.delteRule({ id: row.id }).then(res => {
            this.$Message.success("删除成功")
            this.getList()
          });
        }
      });
    },
    // 启用
    enable(id) {
      webapi.enable({ id }).then(res => {
        this.$Message.success("启用成功")
        this.getList()
      });
    },
    // 停用
    disable(id) {
      let title = "停用配置"
      this.$Modal.confirm({
        title: title,
        onOk: () => {
          webapi.stopUse({ id }).then(res => {
            this.$Message.success("停用成功")
            this.getList()
          });
        }
      });
    },
    handleSelectChange(value, name) {
      this.queryParams = {
        cityCode: value
      }
    },
    queryData() {
      this.getList();
    },
    clearQueryData() {
      this.current = 1;
      this.pageSize = 10;
      this.queryParams = {};
      this.getList();
    },
    handleChangePage(page) {
      this.current = page;
      this.getList();
    },
    handleChangePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getList();
    },
  }
}
</script>

<style lang="less" scoped>
.action {
  margin: 0 0 15px;
}
</style>
