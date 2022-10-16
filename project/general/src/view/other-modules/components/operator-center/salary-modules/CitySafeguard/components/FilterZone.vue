<template>
  <el-form inline size="mini" label-position="right" label-width="100px" :model="filters">
    <el-row>
      <el-form-item label="城市">
        <el-select
          v-model="filters.cityCode"
          placeholder="城市"
          style="width: 200px"
          filterable
        >
          <el-option v-for="city in options.cityListWithAllOption" :key="city.value" :label="city.label" :value="city.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品线">
        <el-select
          v-model="filters.businessType"
          placeholder="产品线"
          style="width: 230px"
          filterable
        >
          <el-option v-for="type in options.businessTypeList" :key="type.value" :label="type.label" :value="type.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="规则名称">
        <el-input
          v-model="filters.ruleName"
          placeholder="规则名称"
          maxlength="16"
          style="width: 200px"
          @keydown.enter.native="onFormEnter"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="filters.ruleStatus"
          placeholder="状态"
          style="width: 200px"
        >
          <el-option v-for="rule in options.ruleStateList" :key="rule.value" :label="rule.label" :value="rule.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="司机工资类别">
        <el-select
          placeholder="请选择司机类别"
          v-model="filters.driverTag"
          style="width: 230px"
        >
          <el-option
            v-for="item in options.driverTags"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="运营模式">
        <el-select v-model="filters.operationType" placeholder="请选择运营模式" style="width: 200px">
          <el-option v-for="type in options.operationTypeList" :key="type.value" :label="type.label" :value="type.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="生效时间">
        <el-date-picker
          style="width: 260px"
          v-model="filters.validBeginTime"
          placeholder="生效开始时间"
        />
        -
        <el-date-picker
          style="width: 260px"
          v-model="filters.validEndTime"
          placeholder="生效结束时间"
        />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" @click="onClickSearch">搜索</el-button>
        <el-button type="info" @click="onClickReset">重置</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>
<script>
import { injectBizData } from '../biz/useBizData';

export default {
  name: 'FilterZone',
  setup: (props, { emit }) => {
    const { options, filters } = injectBizData();
    const onClickSearch = () => {
      emit('search');
    };
    const onClickReset = () => {
      emit('reset');
    };
    const onFormEnter = () => {
      emit('search');
    };

    return {
      options,

      filters,

      onClickSearch,
      onClickReset,
      onFormEnter,
    };
  },
};
</script>
