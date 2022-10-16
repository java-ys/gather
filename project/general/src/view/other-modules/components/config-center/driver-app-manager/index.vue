<template>
  <div>
    <Form inline="inline" :label-width="85">
      <FormItem label="应用名称:">
        <Input
          v-model="formData.appName"
          clearable="clearable"
          style="width:200px"
          :maxlength="50"
        ></Input>
      </FormItem>
      <FormItem label="开放城市:" prop="cityCode">
        <Select
          v-model="formData.cityCode"
          filterable
          clearable
          style="width:200px"
          @on-change="getAgentList"
        >
          <!--          <Option label="全部" :value="'all'">全部</Option>-->
          <Option
            v-for="value in cityList"
            :key="value.cityID"
            :value="value.cityID"
            :label="value.city"
          >
          </Option>
        </Select>
      </FormItem>
      <FormItem label="运营商:">
        <Select v-model="formData.agentId" filterable clearable style="width:200px">
          <!--          <Option label="全部" :value="'all'">全部</Option>-->
          <Option
            v-for="(value) in agentList"
            :key="value.uuid"
            :value="value.uuid"
            :label="value.name"
          >
          </Option>
        </Select>
      </FormItem>
      <FormItem label="司机类型:">
        <Select v-model="formData.driverType" clearable style="width:200px">
          <Option v-for="value in driverTypeList" :key="value.value" :value="value.value" :label="value.name"></Option>
        </Select>
      </FormItem>
      <FormItem label="菜单名称:">
        <Select v-model="formData.menuUuid" filterable clearable style="width:200px">
          <Option
            v-for="value in menuList"
            :key="value.menuUuid"
            :value="value.menuUuid"
            :label="value.menuName"
          >
          </Option>
        </Select>
      </FormItem>
      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right:20px;margin-left:40px"
          @click="search"
        >
          查询
        </Button>
        <Button @click="init">清空</Button>
      </FormItem>
    </Form>
    <Button v-hasAuth="'driver-app-manager-add'" type="primary" style="margin-bottom:20px" @click="goToEdit">
      新增应用
    </Button>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
  </div>
</template>

<script>
import { listColumns, driverTypeList } from "./fields";
import VTable from "_a/v-table/v-table";

import {
  driverMenuAppDelete,
  driverMenuAppList,
  driverMenuList,
  queryMultiCityAgentPageList
} from "_o/api/configData";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    VTable,
  },
  data() {
    let { columns } = listColumns;
    return {
      formData: {
        appName: "",
        menuUuid: "",
        cityCode: "",
        driverType: null,
        agentId: ""
      },
      columns: columns(this),
      tableData: [],
      agentList: [],
      menuList: [],
      driverTypeList,
      current: 1,
      total: 0,
      pageSize: 10
    };
  },
  computed: {
    // selectedAll() {
    //   return this.formData.cityCode.indexOf("all") !== -1
    // },
    ...mapState({
      cityList: (state) => state.common.cityList || [],
    })
  },
  mounted() {
    this.init();
    if (!this.cityList || !this.cityList.length) {
      this.getCityList();
    }
  },
  methods: {
    ...mapActions(["getCityList"]),
    init() {
      // this.formData = {
      //   appUuid: "",
      //   menuUuid: "",
      //   cityCode: "",
      //   driverType: "",
      //   agentId: ""
      // };
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
      this.getMenuList();
    },
    getMenuList() {
      driverMenuList({
        currPage: 1,
        pageSize: 200
      }).then(res => {
        if (res && res.data && res.data.success && res.data.data && res.data.data.list) {
          // this.menuList = res.data.data.list
          Array.prototype.push.apply(this.menuList, res.data.data.list);
        }
      })
    },
    getAgentList(cityItem) {
      // console.log(cityItem)
      // this.formData.cityCode = [];
      // if (cityItem.indexOf("all") !== -1) {
      //   this.formData.cityCode = [];
      //   this.formData.cityCode.push("all");
      // } else {
      //   Array.prototype.push.apply(this.formData.cityCode, cityItem);
      // }
      let params = {
        cityIdList: [this.formData.cityCode],
        // currPage: 1,
        // pageSize: 100,
        // provinceId: "",
      };
      // if (cityItem.length && cityItem.indexOf("all") === -1) {
      //   params.cityCode = [{
      //     "cityCode": "all",
      //     "cityName": "全部"
      //   }];
      // } else {
      //   params.cityIdList = cityItem.map(item => ({ cityCode: item }));
      // }
      queryMultiCityAgentPageList(params).then(res => {
        if (res && res.data && res.data.success && res.data.data && res.data.data.list.length) {
          this.agentList = res.data.data.list;
        }
      })
    },
    getTableList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        ...this.formData
      };
      driverMenuAppList(params).then(res => {
        this.tableData = res.data.data.list || [];
        this.total = res.data.data.totalCount || 0;
      }).catch(err => {
        console.log(err);
        this.tableData = [];
        this.total = 0;
      });
    },
    search() {
      this.current = 1;
      this.getTableList();
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    },
    deleteAppMenu(row) {
      // 删除菜单
      this.$Modal.confirm({
        title: "确定删除该应用吗？",
        onOk: () => {
          driverMenuAppDelete({
            id: row.id
          }).then(res => {
            if (res && res.data && res.data.success) {
              this.$Message.info("删除成功！");
              this.getTableList();
            } else {
              this.$Message.info("删除失败，" + res.data.msg || "");
            }
          })
        },
        onCancel: () => {

        }
      })
    },
    goToEdit(val = {}, isView) {
      this.$router.push({
        name: isView ? "view-driver-app-manager" : (val.id ? "edit-driver-app-manager" : "add-driver-app-manager"),
        params: {
          id: val.id || "",
          isView,
          data: val
        }
      }).then(res => {
        console.log(res)
      }).catch(err => console.log(err))
    }
  }
};
</script>
<style>

</style>
