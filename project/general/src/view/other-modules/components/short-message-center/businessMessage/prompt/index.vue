<template>
  <div>
    <Form inline="inline" :label-width="85">
      <FormItem label="提示场景:">
        <Select v-model="promptType" clearable style="width:200px" placeholder="请选择提示场景">
          <Option v-for="(item,index) in promNameList" :key="index" :value="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="产品线">
        <Select v-model="productLine" clearable style="width:200px" placeholder="请选择产品线">
          <Option
            v-for="item in bizTypeList"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</Option>
<!--          <Option :value="5">顺风车</Option>-->
<!--          <Option :value="10">包车</Option>-->
<!--          <Option :value="13">企业用车</Option>-->
        </Select>
      </FormItem>
      <FormItem label="生效状态">
        <Select v-model="promptStatus" clearable style="width:200px" placeholder="请选择状态">
          <Option :value="1">启用</Option>>
          <Option :value="0">停用</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="0">
        <Button
          type="primary"
          @click="search"
          style="margin-right:20px;margin-left:40px"
          >查询</Button
        >
        <Button @click="init()">清空</Button>
      </FormItem>
    </Form>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <add ref="add" @reload="getTableList()" />
  </div>
</template>

<script>
import { listColumns,promNameList} from "./fields";
import add from "./add";
import { mapState } from "vuex";
import { promptList, promptUpdate } from "_o/api/push-message.js";
export default {
  components: {
    add
  },
  mounted() {
    this.init();
  },
  data() {
    let { columns } = listColumns;
    return {
      promNameList,
      productLine:null,
      promptName: "",
      promptType:null,
      promptStatus:null,
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10
    };
  },
  computed:{
    ...mapState({
      bizTypeList: state => state.common.bizTypeList,
    }),
  },
  methods: {
    init() {
      this.promptType = null;
      this.promptStatus = null;
      this.productLine = null;
      this.promptName = "";
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      let params = {
        promptType: this.promptType,
        currPage: this.current,
        pageSize: this.pageSize,
        productLine: this.productLine,
        promptStatus: this.promptStatus
      }
      promptList(params).then(res => {
        let data = res.data.data || {};
        this.tableData = data.list;
        this.total = data.totalCount;
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
    addData() {
      this.$refs.add.init();
    },
    goEdit(val) {
      this.$refs.add.init(val);
    },
    deleteData(val) {
      let params = {
        id: val.id,
        promptTitle: val.promptTitle,
        promptList: val.promptList,
        promptStatus: val.promptStatus === 1 ? 0 : 1
      };
      promptUpdate(params).then(res => {
        this.getTableList();
        this.$Message.success(res.data.msg);
      });
    }
  }
};
</script>

