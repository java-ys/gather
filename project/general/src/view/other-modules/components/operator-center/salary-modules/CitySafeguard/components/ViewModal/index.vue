<template>
  <el-dialog title="城市保底策略规则详情" :visible.sync="visible" width="74%" @close="resetData">
    <div>
      <div :class="$style.sectionHeader">基本信息</div>
      <el-row>
        <el-col v-for="item in basicFormData" :key="item.label" :span="item.fullRow ? 24 : 12">
          <div :class="$style.sectionRow">
            <span :class="$style.sectionRowLabel">{{item.label}}: </span>
            <span>{{item.value}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div :class="$style.sectionRow">
            <span :class="$style.sectionRowLabel">{{richContent.label}}: </span>
            <u-editor v-if="richContent.value" v-model="richContent.value" :inputMax="2000" class="step-editor" :maximumWords="2000"></u-editor>
          </div>
        </el-col>
      </el-row>
      <div :class="$style.sectionHeader" style="margin-top: 16px">奖励规则: 保底策略配置</div>
      <div ruleData.strategyRuleList>
        <template v-for="(item, index) in ruleData.strategyRuleList">
          <div :key="index" :class="$style.ruleList">
            <div :class="$style.sectionRow">日保底金额: {{+item.guaranteedAmt}}元</div>
            <el-row v-if="showOrderCount" :class="[$style.sectionRow, $style.sectionRowLabel, $style.sectionHeader]">
              <el-col :span="6">保底门槛: 日完单数</el-col>
              <el-col :span="6">日完单数 >= {{+item.dayOrderCount}}单</el-col>
            </el-row>
              <div :key="index">
                <template v-if="showOnlineTime">
                  <el-row :class="[$style.sectionRow, $style.sectionRowLabel, $style.sectionHeader]">
                    <el-col :span="6">保底门槛: 日在线时长</el-col>
                  </el-row>
                  <ElPaginationTable v-bind="onlineTableProps(item.durationConfigList)" />
                </template>
              </div>
            <template v-if="showPeakTime">
              <el-row :class="[$style.sectionRow, $style.sectionRowLabel, $style.sectionHeader, $style.mt_20]">
                <el-col :span="6">保底门槛: 日高峰时长</el-col>
                <el-col :span="6">日高峰总时长 >= {{+item.peakDuration}}小时</el-col>
                <el-col :span="6">日高峰总完单 >= {{+item.peakOrderCount}}单</el-col>
              </el-row>
              <ElPaginationTable v-bind="peakTableProps(item.durationPeakConfigList)" />
            </template>
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import moment from "moment";
import { computed, defineComponent, ref } from "@vue/composition-api";
import {
  BUSINESS_TYPE_MAPPINGS,
} from "../../biz/consts";
import { injectBizData, loadRuleData } from "../../biz/useBizData";
import {
  getStrategyIndexFromGuaranteedMode,
  STRATEGY_INDEX__DAILY_ONLINE_TIME,
  STRATEGY_INDEX__DAILY_ORDER_COUNT,
  STRATEGY_INDEX__DAILY_PEAK_TIME,
} from "_o/components/operator-center/salary-modules/CitySafeguard/components/EditModal/useBiz";
import ElPaginationTable from "../../BaseComponents/pagination-table";
import uEditor from '_a/u-editor/index.vue';

const OnlineTimeTableCols = [
  {
    label: "时间段",
    render: ({ row }) => `${row.startTime}-${row.endTime}`,
  },
  {
    label: "在线时长(小时)",
    render: ({ row }) => Number(row.onlineDuration),
  },
  {
    label: "时段完单(单)",
    render: ({ row }) => Number(row.durationOrderCount),
  },
];

export default defineComponent({
  name: "ViewModal",
  components: {
    ElPaginationTable,
    uEditor
  },
  setup: () => {
    const { bizMethods: { getDriverTagLabel }} = injectBizData();
    const visible = ref(false);
    const ruleData = ref({});
    const resetData = () => {
      ruleData.value = {};
    };
    const guaranteedMode = computed(() => getStrategyIndexFromGuaranteedMode(ruleData.value.guaranteedMode));
    const basicFormData = computed(() => {
      const _ruleData = ruleData.value;
      const list = [
        { label: "规则名称", value: _ruleData.ruleName },
        { label: "生效起始时间", value: moment(_ruleData.validBeginTime).format("YYYY-MM-DD") },
        { label: "生效结束时间", value: moment(_ruleData.validEndTime).format("YYYY-MM-DD") },
        { label: "产品线", value: BUSINESS_TYPE_MAPPINGS[_ruleData.businessType] },
        { label: "司机工资类别", value: getDriverTagLabel(_ruleData.driverTag) },
        { label: "城市", value: _ruleData.cityName },
        { label: "司机人群包", value: getCrowdCodeName(_ruleData.crowdCodeList)},
        { label: "是否在任务中心展示", value: _ruleData.toTask === 1 ? '展示' : '不展示' }
      ];
      const agentList = (_ruleData.agentInfoList || []).map(v => v.agentName);
      if (agentList.length > 0) {
        list.push({ label: "运营商", value: agentList.join(","), fullRow: true });
      }

      return list;
    });
    const richContent = computed(() => {
      return { label: "规则描述", value: ruleData.value.richContent }
    })

    const onlineTableProps = value => {
      return {
        data: value.flat(Infinity) || [],
        pagination: false,
        columns: OnlineTimeTableCols,
        size: "mini",
        headerCellStyle: { background: "#F5F4F2" },
        fit: true,
        highlightCurrentRow: true,
      }
    };
    const peakTableProps = value => {
      return {
      data: value.flat(Infinity) || [],
      pagination: false,
      columns: OnlineTimeTableCols,
      size: "mini",
      headerCellStyle: { background: "#F5F4F2" },
      fit: true,
      highlightCurrentRow: true,
      }
    };

    const open = ruleId => {
      loadRuleData(ruleId).then(data => {
        if (data) {
          ruleData.value = data;
          visible.value = true;
        }
      });
    };
    const getCrowdCodeName = list => {
      if (list && list.length) {
        return list.map(it => it.crowdName)
      }
      return ''
    }
    return {
      visible,
      ruleData,
      resetData,

      guaranteedMode,
      basicFormData,
      richContent,
      onlineTableProps,
      peakTableProps,

      open,
      showOrderCount: computed(() => guaranteedMode.value.includes(STRATEGY_INDEX__DAILY_ORDER_COUNT)),
      showOnlineTime: computed(() => guaranteedMode.value.includes(STRATEGY_INDEX__DAILY_ONLINE_TIME)),
      showPeakTime: computed(() => guaranteedMode.value.includes(STRATEGY_INDEX__DAILY_PEAK_TIME)),
    };
  },
});
</script>
<style lang="scss" module>
.sectionHeader {
  font-weight: bold;
  font-size: 16px;
  margin: 0 0 10px 0;
}

.sectionRow {
  font-size: 15px;
  line-height: 1.6;
}

.sectionRowLabel {
  font-weight: bold;
}
.ruleList {
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 5px;
}
.mt_20 {
  margin-top: 20px;
}
</style>
