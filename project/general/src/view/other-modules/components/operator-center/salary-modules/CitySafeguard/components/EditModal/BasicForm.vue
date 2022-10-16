<template>
  <div>
    <el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input v-model="form.ruleName" placeholder="规则名称" :class="$style.width320" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效开始时间" prop="validBeginTime">
            <el-date-picker
              v-model="form.validBeginTime"
              :disabled="isEdit"
              :class="$style.width320"
              :clearable="false"
              placeholder="选择生效起始时间"
              :picker-options="weekPickerOptions"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生效结束时间" prop="validEndTime">
            <el-date-picker
              v-model="form.validEndTime"
              :disabled="isEdit"
              :class="$style.width320"
              :clearable="false"
              placeholder="选择生效结束时间"
              :picker-options="weekPickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品线" prop="businessType">
            <el-select
              v-model="form.businessType"
              :disabled="isEdit"
              placeholder="产品线"
              :class="$style.width320"
            >
              <el-option label="专享" :value="2" />
              <el-option label="快享" :value="4" />
              <el-option label="惠享" :value="6" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="司机工资类别">
            <el-select
              v-model="form.driverTagList"
              :disabled="isEdit"
              placeholder="司机工资类别"
              multiple
              :class="$style.width320"
            >
              <el-option
                v-for="item in options.driverTags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="cityCode">
            <el-select
              v-model="form.cityCode"
              :disabled="isEdit"
              placeholder="城市"
              filterable
              :class="$style.width320"
              @change="onCityChange"
            >
              <el-option
                v-for="cityObj in options.cityList"
                :key="cityObj.value"
                :label="cityObj.label"
                :value="cityObj.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="!isEdit" label="是否区分运营商" prop="appointAgent">
            <el-radio-group v-model="form.appointAgent" :disabled="true">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-else-if="form.appointAgent === 1">
            <el-form-item label="运营商" prop="displayAgentList">
              <div>{{(form.agentInfoList || []).map(v => v.agentName || '').join(', ')}}</div>
            </el-form-item>
          </template>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否在任务中心显示">
            <el-radio-group v-model="form.toTask">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.appointAgent === 1 && !isEdit">
        <el-col :span="24">
          <el-form-item label="运营商" prop="agentList">
            <div :class="[$style.flexFormItemWrapper, $style.width320]">
              <el-select
                v-model="form.agentList"
                :class="$style.flexFormItem"
                placeholder="运营商"
                multiple
                :disabled="isEdit"
                @change="onOperatorsChange"
              >
                <el-option v-for="operator in operatorList" :key="operator.value" :label="operator.label" :value="operator.value" />
              </el-select>
              <el-checkbox
                v-model="form.chooseAllOperators"
                style="margin-left: 8px"
                :disabled="operatorList.length === 0 || isEdit"
                :indeterminate="isIndeterminate"
                @change="onChooseAllChange"
              >全选</el-checkbox>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- 司机人群包 -->
          <selectDriverGroup
            :addData="form"
            :isEdit="isEdit"
            @handleDeleteDriverGroup="handleDeleteDriverGroup"
            @selectDriverGroup="selectDriverGroup"
          ></selectDriverGroup>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="规则描述">
            <u-editor v-if="visible" v-model="form.richContent" :inputMax="2000" :maximumWords="2000"></u-editor>
          </el-form-item>
        </el-col>
      </el-row>
    </el-row>
    <!-- 选择司机人群包 -->
    <driverGroup v-if="form.showDriverGroup" :list="form.crowdCodeList" :limitNumber="15" @close="handleCloseDriverGroup" @selectDown="selectDown" />
  </div>
</template>
<script>
import { computed } from "@vue/composition-api";
import {
  injectBiz,
  weekPickerOptions,
} from "./useBiz";
import { injectBizData } from "../../biz/useBizData";
import selectDriverGroup from "../selectDriverGroup.vue"
import driverGroup from "_o/components/operator-center/task-manager/components/driverGroup/index.vue"
import uEditor from "_a/u-editor/index.vue";
export default {
  name: "BasicForm",
  components: { selectDriverGroup, driverGroup, uEditor },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup: () => {
    const { options } = injectBizData();
    const {
      form, isEdit, operatorList, loadCityOperatorList, resetAgentList,
    } = injectBiz();
    const isIndeterminate = computed(() => {
      const { length } = form.agentList;
      return length > 0 && length < operatorList.value.length;
    });
    const onCityChange = async v => {
      await loadCityOperatorList(v);
      resetAgentList();
    };
    const onOperatorsChange = list => {
      form.chooseAllOperators = list.length > 0;
    };
    const onChooseAllChange = v => {
      if (v) {
        form.agentList = operatorList.value.map(({ value }) => value);
      } else {
        form.agentList = [];
      }
    };
    // 删除围栏
    const handleDeleteDriverGroup = c => {
      form.crowdCodeList = form.crowdCodeList.filter(item => item.crowdCode !== c.crowdCode)
    };
    // 新增或者选择围栏
    const selectDriverGroup = () => {
      form.showDriverGroup = true
    };

    const handleCloseDriverGroup = () => {
      form.showDriverGroup = false
    };

    const selectDown = list => {
      let selectCopy = JSON.parse(JSON.stringify(form.crowdCodeList));
      let selectHash = {};
      let addList = [];
      // 清空原来的选择
      form.crowdCodeList.splice(0, 15);
      // 记录原来的选择
      selectCopy.forEach((item, index) => {
        selectHash[item.crowdCode] = String(index);
      });
      // 判断如果原来也选了，放到相同的位置，没选加进去
      list.forEach(item => {
        let index = selectHash[item.crowdCode];
        if (index) {
          form.crowdCodeList.push(selectCopy[index]);
        } else {
          addList.push({ crowdCode: item.crowdCode, crowdName: item.crowdName });
        }
      });
      form.crowdCodeList.push(...addList);
    };
    return {
      isEdit,
      form,
      options,
      weekPickerOptions,
      onCityChange,
      onOperatorsChange,
      onChooseAllChange,
      operatorList,
      isIndeterminate,
      handleDeleteDriverGroup,
      selectDriverGroup,
      handleCloseDriverGroup,
      selectDown
    };
  },
};
</script>
<style lang="less" module>
.width320 {
  width: 320px !important;
}

.flexFormItemWrapper {
  display: flex;
}
.flexFormItem {
  flex: 1;
}
</style>
<style lang="less" scoped>
/deep/ .line {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  .right {
    margin-left: 16px;
  }
  .item {
    margin-right: 16px;
    .name {
      font-size: 15px;
    }
    .delete {
      font-size: 16px;
      color: red;
      margin-left: 4px;
      font-weight: 600;
      cursor: pointer;
      width: 25px;
      height: 25px;
    }
  }
  .driverGroup_list {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
  }
}
</style>
