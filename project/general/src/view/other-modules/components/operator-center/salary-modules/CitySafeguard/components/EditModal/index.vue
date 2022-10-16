<template>
  <el-dialog
    v-bind="dialogProps"
    :visible.sync="visible"
    @close="onDialogClose"
    width="74%"
  >
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      :rules="formRules"
      size="small"
      label-width="140px"
    >
      <BasicForm :key="refreshKey" :visible="visible" />
      <el-row>
        <el-tabs type="card" value="safeguard">
          <el-tab-pane label="保底策略配置" name="safeguard" />
        </el-tabs>
        <el-card>
          <StrategyForm :key="refreshKey" ref="strategyForm" />
        </el-card>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="onClickSave">保存</el-button>
      <el-button type="info" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { reactive, ref } from "@vue/composition-api";
import moment from "moment";
import {
  checkTimeDurationList,
  getDefaultDurationConfig,
  getStrategyIndexFromGuaranteedMode,
  useBiz,
  DEFAULT_RANGE_DATE,
  STRATEGY_INDEX__DAILY_ONLINE_TIME,
  STRATEGY_INDEX__DAILY_PEAK_TIME,
} from "./useBiz";
import BasicForm from "./BasicForm.vue";
import StrategyForm from "./StrategyForm.vue";
import {
  callMessageError,
  callMessageSuccess,
} from "_o/components/operator-center/salary-modules/CitySafeguard/uiUtils";

export default {
  name: "EditModal",
  components: {
    BasicForm,
    StrategyForm,
  },
  setup: (props, { emit }) => {
    const refreshKey = ref(0);
    const formRef = ref(null);
    const strategyFormRef = ref(null)
    const visible = ref(false);
    const {
      form, formRules, isEdit, submitForm, resetForm,
    } = useBiz();
    const dialogProps = reactive({
      closeOnClickModal: false,
      closeOnPressEscape: false,
      width: "960px",
      title: "",
    });

    const open = () => {
      refreshKey.value += 1;
      isEdit.value = false;
      visible.value = true;
      dialogProps.title = "新建城市保底策略";
    };

    const validatorRichContent = () => {
      let node = form.richContent.split('<p>')[1];
      let nodeText = node && node.split('</p>')[0].length || 0;
      return nodeText > 2000;
    }

    const openWithData = (data, _isEdit = false) => {
      isEdit.value = _isEdit;
      visible.value = true;
      dialogProps.title = _isEdit ? "修改城市保底策略" : "复制上周城市保底策略";
      Object.assign(form, data || {});
      form.driverTagList = [form.driverTag];
      form.strategyIndex = getStrategyIndexFromGuaranteedMode(form.guaranteedMode);
      // 反向还原规则生效时间区间
      form.validBeginTime = moment(form.validBeginTime).toDate();
      form.validEndTime = moment(form.validEndTime).toDate();
      if (Array.isArray(form.strategyRuleList) && form.strategyRuleList.length > 0) {
        form.strategyRuleList.forEach((it, index) => {
          if (Array.isArray(it.durationConfigList) && it.durationConfigList.length > 0) {
            it.durationConfigList.forEach(v => {
              v.startTime = new Date(`${DEFAULT_RANGE_DATE} ${v.startTime}`);
              v.endTime = new Date(`${DEFAULT_RANGE_DATE} ${v.endTime}`);
              v.onlineDuration = String(v.onlineDuration);
              v.durationOrderCount = String(v.durationOrderCount);
            });
          } else {
            form.strategyRuleList[index].durationConfigList.push(getDefaultDurationConfig());
          }
          if (Array.isArray(it.durationPeakConfigList) && it.durationPeakConfigList.length > 0) {
            it.durationPeakConfigList.forEach(v => {
              v.startTime = new Date(`${DEFAULT_RANGE_DATE} ${v.startTime}`);
              v.endTime = new Date(`${DEFAULT_RANGE_DATE} ${v.endTime}`);
              v.onlineDuration = String(v.onlineDuration);
              v.durationOrderCount = String(v.durationOrderCount);
            });
          } else {
            form.strategyRuleList[index].durationPeakConfigList.push(getDefaultDurationConfig());
          }
        })
      } else {
        form.strategyRuleList = [];
      }
      form.agentList = form.agentInfoList.map(v => v.agentUuid);
    };
    const close = () => {
      visible.value = false;
    };
    const onClickSave = () => {
      formRef.value.validate(async st => {
        if (!st) return;
        if (!strategyFormRef.value.getTimeConfigValidateStatus()) return;
        // 日在线时长
        if (form.strategyIndex.includes(STRATEGY_INDEX__DAILY_ONLINE_TIME)) {
          const isTimeRangeNull = (form.strategyRuleList.map(it => (it.durationConfigList.map(v => [v.startTime, v.endTime]))).flat(Infinity).findIndex(v => v==null) >= 0);
          if (isTimeRangeNull) {
            callMessageError("日在线时长时间段有空值，请检查");
            return;
          }
          const isTimeRangeValid = form.strategyRuleList.map(it => checkTimeDurationList(it.durationConfigList.map(v => [v.startTime, v.endTime])));
          if (!isTimeRangeValid) {
            callMessageError("日在线时长时间段有交集，请检查");
            return;
          }
        }
        // 日高峰时长
        if (form.strategyIndex.includes(STRATEGY_INDEX__DAILY_PEAK_TIME)) {
          const isTimeRangeNull = (form.strategyRuleList.map(it => (it.durationPeakConfigList.map(v => [v.startTime, v.endTime]))).flat(Infinity).findIndex(v => v==null) >= 0);
          if (isTimeRangeNull) {
            callMessageError("高峰日在线时长时间段有空值，请检查");
            return;
          }
          const isTimeRangeValid = form.strategyRuleList.map(it => checkTimeDurationList(it.durationPeakConfigList.map(v => [v.startTime, v.endTime])));
          if (!isTimeRangeValid) {
            callMessageError("高峰日在线时长时间段有交集，请检查");
            return;
          }
        }
        // 司机人群包与司机工资类别至少二选一
        if (!form.crowdCodeList.length && !form.driverTagList.length) {
          callMessageError("司机工资类别和人群包至少二选一");
          return;
        }
        // 规则描述字数校验
        if (validatorRichContent()) {
          callMessageError("规则描述已超出最大输入字符长度");
          return;
        }
        const isSuccess = await submitForm();
        if (isSuccess) {
          callMessageSuccess("操作成功!");
          visible.value = false;
          const loadFirstPage = !isEdit.value;
          emit("finish", loadFirstPage);
        }
      });
    };

    const onDialogClose = () => {
      isEdit.value = false;
      resetForm();
    };

    return {
      refreshKey,
      formRef,
      strategyForm: strategyFormRef,
      visible,
      dialogProps,

      form,
      formRules,

      open,
      openWithData,
      close,
      onClickSave,
      onDialogClose,
    };
  },
};
</script>
