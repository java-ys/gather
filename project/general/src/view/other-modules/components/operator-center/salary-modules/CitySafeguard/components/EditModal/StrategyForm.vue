<template>
  <div>
    <el-row>
      <el-form-item label="保底门槛设置" prop="strategyIndex">
        <el-checkbox-group v-model="form.strategyIndex">
          <el-checkbox :label="strategyIndexTime">日在线时长</el-checkbox>
          <el-checkbox :label="strategyIndexOrder">日完单数</el-checkbox>
          <el-checkbox :label="strategyIndexPeak">高峰时长</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-row>
    <div :class="$style.strategy" v-for="(item, ie) in form.strategyRuleList" :key="`${'strategyRuleList' + ie}`">
      <div :class="$style.strategyRule">
        <el-row v-if="includesSomeStrategyIndex(strategyIndexTime, form.strategyIndex)" style="margin-top: 20px">
          <el-col :span="24">
            <el-form-item label="日在线时长">
              <template v-if="showDurationConfig">
                <OnlineTimeConfigRow
                  v-for="(config, index) in item.durationConfigList"
                  ref="durationRef"
                  :key="index"
                  :index="index"
                  :config="config"
                  configName="durationConfigList"
                  @add="onClickDurationAdd(ie, 'durationConfigList', index)"
                  @del="onClickDurationDel(ie, 'durationConfigList', index)"              
                />
              </template>
            </el-form-item>
          </el-col>
        </el-row>   
        <el-row v-if="includesSomeStrategyIndex(strategyIndexOrder, form.strategyIndex)">
          <el-col :span="24">
            <el-form-item label="日完单数">
              <el-form-item label="日完单数" label-width="100px" :prop="'strategyRuleList.' + ie + '.dayOrderCount'" :rules="formRules.dayOrderCount">
                >=
                <el-input
                  v-model="item.dayOrderCount"
                  :class="$style.strategyInlineInput"
                  @blur="$event.target.value.trim()"
                />
                单
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="includesSomeStrategyIndex(strategyIndexPeak, form.strategyIndex)">
          <el-col :span="24">
              <el-form-item label="日高峰时长">
                <el-form-item label="日高峰总时长" label-width="120px" :prop="'strategyRuleList.' + ie + '.peakDuration'" :rules="formRules.peakDuration">
                  >=
                  <el-input
                    v-model="item.peakDuration"
                    :class="$style.strategyInlineInput"
                    @blur="$event.target.value.trim()"
                  />
                  小时
                </el-form-item>
                <el-form-item label="日高峰总完单" label-width="120px" :prop="'strategyRuleList.' + ie + '.peakOrderCount'" :rules="formRules.peakOrderCount">
                  >=
                  <el-input
                    v-model="item.peakOrderCount"
                    :class="$style.strategyInlineInput"
                    @blur="$event.target.value.trim()"
                  />
                  单
                </el-form-item>
                <template v-if="showDurationConfig">
                  <OnlineTimeConfigRow
                    v-for="(config, index) in item.durationPeakConfigList"
                    ref="durationPeakRef"
                    :key="`peak${index}`"
                    :index="index"
                    :config="config"
                    configName="durationPeakConfigList"
                    @add="onClickDurationAdd(ie, 'durationPeakConfigList', index)"
                    @del="onClickDurationDel(ie, 'durationPeakConfigList', index)"
                  />
                </template>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="日保底金额设置" :prop="'strategyRuleList.' + ie + '.guaranteedAmt'" :rules="formRules.guaranteedAmt">
              日保底金额 =
              <el-input
                v-model="item.guaranteedAmt"
                placeholder="请输入"
                :class="$style.strategyInlineInput"
                @blur="$event.target.value.trim()"
              />
              元
            </el-form-item>
          </el-col>
        </el-row>        
      </div>
      <div style="display:flex;justify-content:flex-end;">
      <el-button v-if="form.strategyRuleList.length > 1" type="info" size="mini" @click="handleMinus(ie)">-</el-button>
      <el-button v-if="form.strategyRuleList.length < 10" type="primary" size="mini" @click="handlePlus()">+</el-button>
      </div>       
    </div>     
    </div>
</template>
<script>
import { MessageBox } from "element-ui";
import { ref } from "@vue/composition-api";
import Vue from "vue";
import {
  getDefaultDurationConfig,
  // getDefaultPeakDurationConfig,
  injectBiz,
  STRATEGY_INDEX__DAILY_ONLINE_TIME,
  STRATEGY_INDEX__DAILY_ORDER_COUNT,
  STRATEGY_INDEX__DAILY_PEAK_TIME,
  useBiz,
} from "./useBiz";
import OnlineTimeConfigRow from "./OnlineTimeConfigRow.vue";

export default {
  name: "StrategyForm",
  components: {
    OnlineTimeConfigRow,
  },
  setup: () => {
    const durationRef = ref(null);
    const durationPeakRef = ref(null);
    const { form } = injectBiz();
    const { formRules } = useBiz();
    const showDurationConfig = ref(true);
    const onClickDurationAdd = async (ie, configName, index) => {
      if (form.strategyRuleList[ie][configName].length >= 10) {
        MessageBox.alert("无法新增，最多创建10条规则！");
      } else {
        showDurationConfig.value = false;
        form.strategyRuleList[ie][configName].splice(index + 1, 0, getDefaultDurationConfig());
        await Vue.nextTick();
        showDurationConfig.value = true;
      }
    };

    const onClickDurationDel = async (ie, configName, index) => {
      if (form.strategyRuleList[ie][configName].length === 1) {
        MessageBox.alert("须至少存在一条数据，不允许删除此行");
      } else {
        showDurationConfig.value = false;
        form.strategyRuleList[ie][configName].splice(index, 1);
        await Vue.nextTick();
        showDurationConfig.value = true;
      }
    };

    const getTimeConfigValidateStatus = () => {
      let st1 = true;
      let st2 = true;
      if (Array.isArray(durationRef.value)) {
        st1 = durationRef.value.map(v => v.isValidatePassForSubmit).every(Boolean)
      }
      if (Array.isArray(durationPeakRef.value)) {
        st2 = durationPeakRef.value.map(v => v.isValidatePassForSubmit).every(Boolean)
      }
      return st1 && st2;
    }

    // 删除一条
    const handleMinus = (index = 0) => {
      form.strategyRuleList.splice(index, 1);
    };
    // 新增一条
    const handlePlus = () => {
      form.strategyRuleList.push({
        durationConfigList: [getDefaultDurationConfig()],
        dayOrderCount: "",
        guaranteedAmt: "",
        peakDuration: "",
        peakOrderCount: "",
        durationPeakConfigList: [getDefaultDurationConfig()],
      });
    };

    return {
      durationRef,
      durationPeakRef,
      form,
      formRules,
      showDurationConfig,
      strategyIndexTime: STRATEGY_INDEX__DAILY_ONLINE_TIME,
      strategyIndexOrder: STRATEGY_INDEX__DAILY_ORDER_COUNT,
      strategyIndexPeak: STRATEGY_INDEX__DAILY_PEAK_TIME,
      includesSomeStrategyIndex: (target, list) => list.includes(target),
      onClickDurationAdd,
      onClickDurationDel,
      handleMinus,
      handlePlus,
      getTimeConfigValidateStatus,
    };
  },
};
</script>
<style lang="scss" module>
.strategyInlineInput {
  display: inline-block;
  width: 160px;
}
.strategy {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.strategyRule {
  border:1px solid #ccc;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
