<!---营运管理-推荐城市管理-wx-->

<template>
  <div class="appidenty">
    <SearchList ref="reCity" :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <Button
      type="primary"
      @click="modalStatus.newMobel = true;modalStatus.isEdit = false;"
      v-hasAuth="'recomd-driver-manage-add'"
    >新增推荐配置</Button>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="parColumns"
      :parTableData="tableData"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top15"
    ></VTable>
    <!-- 新增编辑弹窗弹框 -->
    <modal
      v-model="modalStatus.newMobel"
      :mask-closable="false"
      :title="modalStatus.isEdit?'编辑推荐配置':'新建推荐配置'"
      class="add-city-model"
      @on-cancel="formReset('addCityParams')"
    >
      <Form
        ref="addCityParams"
        :model="addCityParams"
        :rules="addCityParamsRule"
        :label-width="100"
      >
        <FormItem label="城市：" prop="city">
          <Cascader
            filterable
            :data="provinceCityList"
            v-model="addCityParams.city"
            :disabled="modalStatus.isEdit"
            style="width:180px;"
          ></Cascader>
        </FormItem>
        <FormItem label="奖励金额：" prop="rewardAmount">
          <InputNumber
            :min="1"
            :max="9999"
            :precision="0"
            v-model="addCityParams.rewardAmount"
            style="display:inline-block;margin-right:10px;"
          ></InputNumber>元
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalStatus.newMobel = false;formReset('addCityParams')">取消</Button>
        <Button type="primary" @click="addSubmit('addCityParams')">确认</Button>
      </div>
    </modal>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import {
  returnFields,
  inputList,
  addCityParamsRule,
  searchData
} from "./fields";
import {
  axiosRecomdList,
  axiosRecomdAddOrUpdate
} from "_o/api/operator-carrier.js";
import { getProvinceCityAllList } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";
export default {
  name: "recomd-driver-manage",
  components: {
    VTable
  },
  data() {
    return {
      searchData: {
        ruleStatus:1
      },
      provinceCityList: [],
      inputList: JSON.parse(JSON.stringify(inputList)),
      addCityParamsRule,
      total: 0,
      current: 1,
      pageSize: 10,
      isLoading: true,
      parColumns: [],
      tableData: [],
      addCityParams: {
        //新增编辑字段
        city: [], // 城市
        rewardAmount: null // 品牌
      },
      modalStatus: {
        isEdit: false, //是否为编辑状态
        newMobel: false //新建弹出框
      }
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  mounted() {
    this.getList(true);
    this.getProvinceCityList();
  },
  methods: {
    getProvinceCityList() {
      getProvinceCityAllList().then(res => {
        // 获取已开通省、市级联列表
        let list = cpTranslate(res.data.data)
        this.provinceCityList = list
        this.inputList[0].cascaderList = list
      });
    },
    // 条件搜索后回调方法
    queryData(data) {
      // 点击查询
      this.current = 1;
      this.searchData = {}
      for (let key in data) {
        this.searchData[key] = data[key];
      }
      this.getList();
    },
    clearQueryData() {
      // 点击清空
      this.current = 1;
      this.searchData = {}
      this.getList();
    },
    // 新增提交
    addSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // let that = this;
          let params = {};
          params.rewardAmount = this.addCityParams.rewardAmount;
          params.provinceCode = this.addCityParams.city[0];
          params.cityCode = this.addCityParams.city[1];
          this.modalStatus.isEdit && (params.ruleId = this.addCityParams.ruleId);

          axiosRecomdAddOrUpdate(params).then(res => {
            this.getList();
            // this.$refs['reCity'].reset()
            this.modalStatus.newMobel = false;
            this.$Message.success(res.data.msg);
            this.formReset("addCityParams");
          });
        }
      });
    },
    formReset(name) {
      this.$refs[name].resetFields();
    },
    selectObj: function() {},
    changePage: function(val) {
      this.current = val;
      this.getList();
    },
    changePageSize: function(val) {
      this.pageSize = val;
      this.getList();
    },
    // 获取列表信息
    getList: function(isLoading) {
      isLoading && this.$store.commit("changeLoadingFlag", true);
      // let that = this;
      let obj = this.searchData
      let params = {
        cityCode: (obj && obj.cityCode) || "",
        ruleStatus: (obj && obj.ruleStatus) || "",
        pageSize: this.pageSize,
        currPage: this.current
      };
      axiosRecomdList(params).then(res => {
        let resdata = res.data.data;
        this.tableData = (resdata && resdata.list) || [];
        this.total = resdata && resdata.totalCount;
      });
    }
  }
};
</script>
<style lang="less">
.add-city-model .widthhalf {
  width: 50%;
}
</style>

