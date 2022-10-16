<template>
  <div>
    <div :class="$style.formItemRow">
      <el-form-item
        label="时间段"
        label-width="100px"
        style="margin-right: 32px"
        required
        :error="timeRangeError"
      >
        <el-select
          v-model="timeRangeStart"
          :class="$style.rangeSelect"
          :clearable="false"
          @change="onRangeStartChange"
        >
          <el-option v-for="i in rangeStartOptions" :key="i" :value="i" :label="i + ':00:00'" />
        </el-select>
        &nbsp;~&nbsp;
        <el-select
          v-model="timeRangeEnd"
          :class="$style.rangeSelect"
          :clearable="false"
          @change="onRangeEndChange"
        >
          <el-option v-for="i in rangeEndOptions" :key="i" :value="i" :label="i + ':59:59'" />
        </el-select>
      </el-form-item>
      <el-button v-if="index > 0" size="mini" type="info" @click="onClickDel">-</el-button>
      <el-button size="mini" type="primary" @click="onClickAdd">+</el-button>
    </div>
    <div :class="$style.formItemRow">
      <el-form-item label="在线时长" label-width="100px" required :error="onlineDurationError">
        >=
        <el-input
          v-model="config.onlineDuration"
          :class="$style.bizInput"
          @blur="config.onlineDuration = config.onlineDuration.trim()"
        />
        小时
      </el-form-item>
      <el-form-item label="时段完单" label-width="100px" :error="durationOrderCountError">
        >=
        <el-input
          v-model="config.durationOrderCount"
          :class="$style.bizInput"
          @blur="config.durationOrderCount = config.durationOrderCount.trim()"
        />
        单
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from "@vue/composition-api";
import moment from "moment";
import {
  DEFAULT_RANGE_DATE,
  DEFAULT_RANGE_DATE__END_TIME,
  DEFAULT_RANGE_DATE__START_TIME,
  positiveIntegerValidate,
  positiveValidate,
} from "./useBiz";

export default {
  name: "OnlineTimeConfigRow",
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
    configName: {
      type: String,
      default: () => (""),
    },
    index: Number,
  },
  setup: (props, { emit }) => {
    const timeRangeStart = ref(null);
    const timeRangeEnd = ref(null);
    const rangeStartOptions = Array.from({ length: 24 }, (v, index) => index);
    const rangeEndOptions = computed(() => rangeStartOptions.filter(v => v >= timeRangeStart.value));
    const updatePropConfig = () => {
      if (timeRangeStart.value == null) {
        props.config.startTime = null;
      } else {
        props.config.startTime = new Date(`${DEFAULT_RANGE_DATE} ${DEFAULT_RANGE_DATE__START_TIME}`);
        props.config.startTime.setHours(timeRangeStart.value || 0);
      }
      if (timeRangeEnd.value == null) {
        props.config.endTime = null;
      } else {
        props.config.endTime = new Date(`${DEFAULT_RANGE_DATE} ${DEFAULT_RANGE_DATE__END_TIME}`);
        props.config.endTime.setHours(timeRangeEnd.value || 0);
      }
    };
    const onRangeStartChange = v => {
      if (timeRangeEnd.value < v) {
        timeRangeEnd.value = null;
      }
      updatePropConfig();
    };
    const onRangeEndChange = () => {
      updatePropConfig();
    };
    watch(() => props.config, v => {
      if (v.startTime == null) {
        timeRangeStart.value = null;
      } else {
        const startTime = moment(v.startTime, 'HH:mm:ss').toDate();
        timeRangeStart.value = startTime.getHours();
      }
      if (v.endTime == null) {
        timeRangeEnd.value = null;
      } else {
        const endTime = moment(v.endTime, 'HH:mm:ss').toDate();
        timeRangeEnd.value = Math.min(endTime.getHours(), 23);
      }
    }, { immediate: true });

    const onClickDel = () => {
      emit("del", props.configName);
    };
    const onClickAdd = () => {
      emit("add", props.configName);
    };

    const timeRangeError = computed(() => {
      if (timeRangeEnd.value == null || timeRangeStart.value == null) return "请选择时间段";
      return null;
    });

    const onlineDurationError = computed(() => {
      if (timeRangeEnd.value == null || timeRangeStart.value == null) return null;
      if (props.config.onlineDuration === "") return "请输入在线时长";
      const err = positiveValidate({
        defaultMessage: "请输入0-24的整数,允许保留一位小数",
        min: 0,
        max: 24,
      }, props.config.onlineDuration);
      if (err) return err;
      const duration = timeRangeEnd.value - timeRangeStart.value + 1;
      if (duration < props.config.onlineDuration) return "在线时长不可超过时间段时间";
      return null;
    });
    const durationOrderCountError = computed(() => {
      if (props.config.durationOrderCount === "") return null;
      return positiveIntegerValidate({
        defaultMessage: "请输入大于0的整数",
        min: 0,
      }, props.config.durationOrderCount);
    });

    const isValidatePassForSubmit = computed(() => {
      return !(timeRangeError.value || onlineDurationError.value || durationOrderCountError.value)
    })

    return {
      timeRangeStart,
      timeRangeEnd,
      rangeStartOptions,
      rangeEndOptions,
      timeRangeError,
      onlineDurationError,
      durationOrderCountError,
      onRangeStartChange,
      onRangeEndChange,
      onClickDel,
      onClickAdd,

      isValidatePassForSubmit,
    };
  },
};
</script>
<style lang="scss" module>
.formItemRow {
  & > * {
    display: inline-block;
  }
}

.bizInput {
  display: inline-block;
  width: 160px !important;
}

.rangeSelect {
  display: inline-block;
  width: 120px !important;
}
</style>
