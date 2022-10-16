<template>
  <div>
    <Form ref="searchForm" :model="searchData" :label-width="100" inline class="search-form">
      <FormItem label="合同名称：" prop="contractName">
        <Select v-model="searchData.contractName" clearable filterable>
          <Option
            v-for="(item, index) in contractNameList"
            :key="index"
            :value="item.contractName"
            placeholder="请选择"
          >
            {{item.contractName}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="分类：" prop="customizationFlag">
        <Select v-model="searchData.customizationFlag" clearable filterable>
          <Option
            v-for="(item, index) in customizationList"
            :key="index"
            :value="item.value"
            placeholder="请选择"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="状态：" prop="contractStatus">
        <Select v-model="searchData.contractStatus" clearable filterable>
          <Option
            v-for="(item, index) in statusList"
            :key="index"
            :value="item.value"
            placeholder="请选择"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="适用对象：" prop="cpIdList">
        <Select v-model="searchData.cpIdList" clearable filterable multiple>
          <Option
            v-for="(item, index) in applyRentCompanyList"
            :key="index"
            :value="item.id"
            placeholder="请选择"
          >
            {{item.name}}
          </Option>
        </Select>
      </FormItem>
      <FormItem :label-width="40">
        <Button type="primary" style="margin-right: 10px" @click="search">查询</Button>
        <Button @click="reset">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { searchData } from "./config.js"
export default {
  name: "searchForm",
  props: {
    contractNameList: {
      type: Array,
      default: () => {
        return []
      }
    },
    applyRentCompanyList: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  data() {
    return {
      ...searchData,
    }
  },
  created() {

  },
  methods: {
    reset() {
      this.$refs.searchForm.resetFields();
      this.searchData.contractName = null;
      this.searchData.customizationFlag = "";
      this.searchData.contractStatus = "";
      this.searchData.cpNameList = [];
      this.$emit("on-reset", this.searchData)
    },
    search() {
      this.$refs.searchForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.$emit("on-search", this.searchData)
      })

    },
  }
}
</script>

<style>
</style>
