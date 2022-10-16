<template>
  <div class="project-search-block">
    <Form
      ref="searchForm"
      :model="searchData"
      :label-width="100"
      :rules="searchRule"
      inline
      class="search-form"
    >
      <FormItem
        label="资产公司："
        prop="authCo"
      >
        <Select
          v-model="searchData.authCo"
          clearable
          class="search-input"
          placeholder="请选择"
          remote
          :remote-method="queryAuthCo"
          filterable
        >
          <Option
            v-for="(dropItem, idx) in authCoList"
            :key="idx"
            :value="dropItem.authCo"
          >
            {{ dropItem.companyName }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="方案名称："
        prop="schemaName"
      >
        <Input
          v-model="searchData.schemaName"
          :maxlength="20"
          clearable
          placeholder="请输入"
        />
      </FormItem>
      <FormItem
        label="方案编号："
        prop="schemaNo"
      >
        <Select
          v-model="searchData.schemaNo"
          clearable
          class="search-input"
          placeholder="请选择"
          remote
          :remote-method="getSchemaNo"
          filterable
        >
          <Option
            v-for="(dropItem, idx) in searchSchemaList"
            :key="idx"
            :value="dropItem.schemaNo"
          >
            {{ dropItem.schemaNo }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="租赁城市："
        prop="cityUuid"
      >
        <Select
          v-model="searchData.cityUuid"
          clearable
          class="search-input"
          placeholder="请选择"
          filterable
        >
          <Option
            v-for="(dropItem, idx) in allCityList"
            :key="idx"
            :value="dropItem.cityCode"
          >
            {{ dropItem.cityName }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="租期（月）："
        prop="stage"
      >
        <Input
          v-model="searchData.stage"
          :maxlength="3"
          clearable
          placeholder="请输入"
        />
      </FormItem>
      <FormItem
        label="状态："
        prop="schemaState"
      >
        <Select
          v-model="searchData.schemaState"
          clearable
          class="search-input"
          placeholder="请选择"
          filterable
        >
          <Option
            v-for="(dropItem, idx) in StateOptionMap"
            :key="idx"
            :value="dropItem.value"
          >
            {{ dropItem.label }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="车龄："
        prop="carAge"
      >
        <Select
          v-model="searchData.carAge"
          clearable
          class="search-input"
          placeholder="请选择"
          filterable
        >
          <Option
            v-for="(dropItem, idx) in CarAgeMap"
            :key="idx"
            :value="idx"
          >
            {{ dropItem }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="里程："
        prop="mileage"
      >
        <Select
          v-model="searchData.mileage"
          clearable
          class="search-input"
          placeholder="请选择"
          filterable
        >
          <Option
            v-for="(dropItem, idx) in MileageMap"
            :key="idx"
            :value="idx"
          >
            {{ dropItem }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="品牌车系车型："
        prop="carBrandSeriesLevel"
      >
        <Input
          v-model="searchData.carBrandSeriesLevel"
          :maxlength="30"
          clearable
          placeholder="请输入"
        />
        <!-- <CarLevelCode
          ref="searchCarCode"
          :input-width="500"
          changeImmediate
          @on-change="searchChange"
        >
        </CarLevelCode> -->
      </FormItem>
      <FormItem :label-width="40">
        <Button
          type="primary"
          style="margin-right: 10px"
          @click="search"
        >
          查询
        </Button>
        <Button @click="reset">
          重置
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
/**
 * @Desc: m2-web-asset
 * @Author: zhangke
 * @CreateTime: 2020/12/21 15:49
 */
import { CarAgeMap, MileageMap, searchRule, StateMap, StateOptionMap } from "./config";
// import { mapActions, mapState } from "vuex";
import {
  queryNo, queryAuthCo,
  // queryLeaseSchemaList
} from "_o/api/lease";
import { getProvinceCityAllList } from "_g/api/common.js";
// import CarLevelCode from "./components/CarLevelCode/CarLevelCode.vue";
export default {
  name: "SearchBlock",
  components: {
    // CarLevelCode
  },
  data() {
    return {
      searchData: {
        authCo: "", // 资产公司
        schemaName: "", // 方案名称
        schemaNo: "", // 方案编号
        cityUuid: "", // 租赁城市
        stage: null, // 租期
        schemaState: "", // 状态
        carAge: "", // 车龄
        mileage: "", // 里程
        carBrandSeriesLevel: "", // 品牌车系车型
        carBrand: "",
        carLevelType: "",
        carLevelCode: ""
      },
      allCityList: [], // 开通与未开通城市
      StateMap, // 状态枚举
      CarAgeMap, // 车龄枚举
      MileageMap, // 里程枚举
      StateOptionMap,
      searchSchemaList: [], // 方案编号列表
      authCoList: [], // 资产公司列表
      // SchemaNameList: [], // 方案名称列表
      searchRule
    };
  },
  mounted() {
    this.getCityList();
    this.getSchemaNo();
    this.queryAuthCo();
    // this.queryLeaseSchemaList();
    this.search();
  },
  methods: {
    searchChange(level = {}) {
      this.searchData.carBrand = level.brandName || "";
      this.searchData.carLevelType = level.levelName || "";
      this.searchData.carLevelCode = level.levelCode || "";
    },
    // 获取租赁城市
    getCityList() {
      getProvinceCityAllList({}).then(res => {
        if (res.data.success) {
          this.setAllCityList(res.data.data);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    setAllCityList(data) {
      if (data.length) {
        data.forEach(e => {
          if (e.nodes.length) {
            e.nodes.forEach(ele => {
              this.allCityList.push({
                cityName: ele.city,
                cityCode: ele.cityID
              });
            });
          }
        });
      }
    },
    // queryLeaseSchemaList(val) {
    //   queryLeaseSchemaList({
    //     schemaName: val || "",
    //     currPage: 1,
    //     pageSize: 100
    //   }).then(res => {
    //     if (res && res.data && res.data.success) {
    //       this.SchemaNameList = res.data.data.list;
    //     } else {
    //       this.SchemaNameList = [];
    //     }
    //   });
    // },
    // 获取资产公司
    queryAuthCo(val) {
      queryAuthCo({
        companyName: val || "",
        currPage: 1,
        pageSize: 100
      }).then(res => {
        if (
          res &&
          res.data &&
          res.data.success &&
          res.data.data.list &&
          res.data.data.list.length
        ) {
          this.authCoList = res.data.data.list;
        } else {
          this.authCoList = [];
        }
      });
    },
    // 获取方案编号
    getSchemaNo(val) {
      queryNo({
        schemaNo: val || "",
        currPage: 1,
        pageSize: 100
      }).then(res => {
        if (
          res &&
          res.data &&
          res.data.success &&
          res.data.data.list &&
          res.data.data.list.length
        ) {
          this.searchSchemaList = res.data.data.list;
        } else {
          this.searchSchemaList = [];
        }
      });
    },
    search() {
      this.$emit("on-search", this.searchData);
    },
    reset() {
      this.$refs.searchForm.resetFields();
      this.$emit("on-reset", this.searchData);
    }
  }
};
</script>

<style scoped lang="less">
.project-search-block {
  min-width: 1050px;
  /*max-width: 1290px;*/

  /deep/ .ivu-input-number,
  .ivu-input-wrapper,
  .ivu-select {
    width: 200px;
  }
}
</style>
