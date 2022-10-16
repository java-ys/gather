<template>
  <div>
    <Form
      inline="inline"
      :label-width="50"
    >
      
      <FormItem
        label="城市："
        prop="city"
      >
        <Cascader
          v-model="searchInfo.provinceCityCode"
          :data="provinceCityList"
          placeholder="请选择城市"
          trigger="hover"
          filterable
        ></Cascader>
      </FormItem>


       <FormItem
        label="策略类型："
        :label-width="80"
        prop="strategyType"
      >  
        <Select
            v-model="searchInfo.strategyType"                 
            style="width:200px"
            placeholder="请选择策略类型"
          >
            <Option
              v-for="item in clList"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
      </FormItem>

      <FormItem
        label="状态："
        prop="status"
      >  
        <Select
            v-model="searchInfo.status"                 
            style="width:200px"
            placeholder="请选择状态"
          >
            <Option
              v-for="item in statusList"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
      </FormItem>

      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right: 20px; margin-left: 40px"
          @click="search"
        >
          搜索
        </Button>
        <Button @click="clear">
          清空
        </Button>
      </FormItem>
    </Form>

    <Button
      v-hasAuth="'strategy_add'"
      type="primary"
      style="margin-bottom: 10px"
      @click="addData"
    >
      新增
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

    <handle
      ref="handle"
      :provinceCityList="provinceCityList"
      @reload="reload"
    />
  </div>
</template>

<script>
import { listColumns ,clList,statusList} from "_o/components/config-center/orderSend-control/src/filed";
import handle from "_o/components/config-center/orderSend-control/src/handle";
import { getWholeRegion } from "_g/api/common.js";
import { mapActions, mapState } from "vuex";
import { cpTranslate } from "@/libs/tools";
// import {
//   axiosPriorityStrategyList,
//   axiosPriorityStrategyDelete,
// } from "_o/api/configData.js";
import { fetchPageList, nonDelete, nonDetail ,nonActive} from "_o/api/non-license-strategy.js"
export default {
  name:'non-license-strategy',
  components: {
    handle,
  },
  data() {
    let { columns } = listColumns;
    return {
      columns: columns(this),
      provinceCityList: [],
      searchInfo:{
        provinceCityCode: [],
        strategyType: '',       //策略类型
        status: '',        //状态
      }, 
      clList,
      statusList,
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
    };
  },
  mounted() {
    this.init();
    this.getCityList();
  },

  methods: {
    init() {
      // this.provinceCityCode = [];
      // this.current = 1;
      // this.total = 0;
      // this.pageSize = 10;
      this.getTableList();
    },
    // 获取城市列表
    getCityList() {
      getWholeRegion({}).then((res) => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data, "", "", "citys");
          let listCopy = JSON.parse(JSON.stringify(list));
          this.provinceCityList = listCopy;
        }
      });
    },
    clear() {
      this.searchInfo.provinceCityCode = [];
      this.searchInfo.strategyType = '',
      this.searchInfo.status = '',
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      this.$store.commit("changeLoadingFlag", true);
      let params = {
        cityCode: (this.searchInfo.provinceCityCode.length > 0 && this.searchInfo.provinceCityCode[1]) || null,
        ruleType: 22,
        status: this.searchInfo.status,
        currPage: this.current,
        pageSize: this.pageSize,
      };      
      fetchPageList(params)
        .then((res) => {
          let data = res.data.data || {};
          this.tableData = data.list;
          this.total = data.totalCount;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch((error) => {
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    search() {
      this.current = 1;
      this.pageSize = 10;
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
    deleteData(uuid) {
      let params = { uuid: uuid };
      this.$Modal.confirm({
        title: "请再次确认要执行该 删除 操作！",
        onOk: () => {
          nonDelete(params).then((res) => {
            this.getTableList();
            this.$Message.info("操作成功！");
          });
        },
      });
    },
    goDetail(val) {
      let data = JSON.parse(JSON.stringify(val));
      nonDetail({uuid: data.uuid}).then((res) => {
        data.isDetail = true;
        res["scope"] = data.scope 
        this.$refs.handle.init(data);
      });
    },
    goEdit(val) {
      let data = JSON.parse(JSON.stringify(val));
      nonDetail({uuid: data.uuid}).then((res) => {
        res["scope"] = data.scope 
        this.$refs.handle.init(data);
      });
      
    },

    addData() {
      this.$refs.handle.init();
    },
    reload() {
      this.getTableList();
    },
    //更新状态
    rowActive(row) {
      const {status, uuid } = row;
      const params = { status: status - 1 === 0  ? -2 : 1, uuid }      
      nonActive(params).then(res => {        
        if (res.data && res.data.success) {
          this.$Message.success("状态更新成功！")
          this.getTableList()
        } else {
          this.$Message.warning("状态更新失败！")
        }
      })
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-radio-group {
  margin-top: -4px;
}
/deep/ .tableBtn {
  margin-right: 10px !important;
}
</style>
