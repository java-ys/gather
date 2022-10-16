<template>
  <div class="forceRest_wrap_inner">
    <p class="modal-p-title">
      <span class="red">*</span>短时策略
    </p>
    <div class="restline">
      <span style="margin-right: 8px;">
        累计服务时长满
      </span>
      <FormItem
        label=""
        :label-width="0"
        prop="servOfflineQuota"
      >
        <Input
          v-model="restModelData.servOfflineQuota"
          :disabled="restDisabled"
          placeholder="请输入整数"
          style="width: 100px"
        />
      </FormItem>
      <span style="margin-left: 8px;">
        小时，则强制下线
      </span>
      <FormItem
        label=""
        :label-width="0"
        prop="servOfflineDura"
      >
        <Input
          v-model="restModelData.servOfflineDura"
          :disabled="restDisabled"
          placeholder="请输入整数"
          style="width: 100px"
        />
      </FormItem>
      <span style="margin-left: 8px;">
        分钟。
      </span>
    </div>
    <div class="restline">
      <span style="margin-right: 8px;">
        累计服务时长满
      </span>
      <FormItem
        label=""
        :label-width="0"
        prop="servAlarmQuota"
      >
        <Input
          v-model="restModelData.servAlarmQuota"
          :disabled="restDisabled"
          placeholder="请输入整数"
          style="width: 100px"
        />
      </FormItem>
      <span style="margin-left: 8px;">
        小时，则每
      </span>
      <FormItem
        label=""
        :label-width="0"
        prop="servAlarmInterval"
      >
        <Input
          v-model="restModelData.servAlarmInterval"
          :disabled="restDisabled"
          placeholder="请输入整数"
          style="width: 100px"
        />
      </FormItem>                <span style="margin-left: 8px;">
        分钟推送一次强制下线提醒，共计推送
      </span>
      <FormItem
        label=""
        :label-width="0"
        prop="servAlarmTimes"
      >
        <Input
          v-model="restModelData.servAlarmTimes"
          :disabled="restDisabled"
          placeholder="请输入整数"
          style="width: 100px"
        />
      </FormItem>
      <span style="margin-left: 8px;">
        次
      </span>
    </div>
    <div class="restline">
      <span style="margin-right: 8px;">
        服务间隔时长满
      </span>
      <FormItem
        label=""
        :label-width="0"
        prop="servResetQuota"
      >
        <Input
          v-model="restModelData.servResetQuota"
          :disabled="restDisabled"
          placeholder="请输入整数"
          style="width: 100px"
        />
      </FormItem>
      <span style="margin-left: 8px;">
        分钟，累计服务时长重新计算。
      </span>
    </div>
    <br />
    <p class="modal-p-title">
      <span class="red">*</span>长时策略
    </p>
    <div class="restline">
      <span style="margin-right: 8px;">
        累计计费时长满
      </span>
      <FormItem
        label=""
        :label-width="0"
        prop="chargeOfflineQuota"
      >
        <Input
          v-model="restModelData.chargeOfflineQuota"
          :disabled="restDisabled"
          placeholder="请输入整数"
          style="width: 100px"
        />
      </FormItem>
      <span style="margin-left: 8px;">
        小时，则强制下线
      </span>
      <FormItem
        label=""
        :label-width="0"
        prop="chargeOfflineDura"
      >
        <Input
          v-model="restModelData.chargeOfflineDura"
          :disabled="restDisabled"
          placeholder="请输入整数"
          style="width: 100px"
        />
      </FormItem>
      <span style="margin-left: 8px;">
        小时。
      </span>
    </div>
    <div class="restline">
      <span style="margin-right: 8px;">
        单次下线时间满
      </span>
      <FormItem
        label=""
        :label-width="0"
        prop="chargeResetQuota"
      >
        <Input
          v-model="restModelData.chargeResetQuota"
          :disabled="restDisabled"
          placeholder="请输入整数分钟数"
          style="width: 100px"
        />
      </FormItem>
      <span style="margin-left: 8px;">
        小时，累计计费时长重新计算。
      </span>
    </div>
    <p class="modal-p-title">
      <span class="red">*</span>周策略
    </p>
    <div class="restline">
      <span style="margin-right: 8px;">
        当周累计计费时长满
      </span>
      <FormItem
        label=""
        prop="weekOfflineQuota"
        :label-width="0"
      >
        <Input
          v-model="restModelData.weekOfflineQuota"
          :disabled="restDisabled"
          placeholder="请输入整数"
          style="width: 100px"
        />
      </FormItem>
      <span style="margin-left: 8px;">
        小时，则当周强制下线。强制下线前
      </span><FormItem
        label=""
        prop="weekOfflineDura"
        :label-width="0"
      >
        <Input
          v-model="restModelData.weekOfflineDura"
          :disabled="restDisabled"
          placeholder="请输入整数"
          style="width: 100px"
        />
      </FormItem>
      <span style="margin-left: 8px;">
        分钟，系统推送强制下线提醒。
      </span>
    </div>
    <p class="modal-p-title">
      <span class="red">*</span>预约单冲突策略
    </p>
    <div class="restline">
      <span style="margin-right: 8px;">
        如司机有预约用车时间在未来
      </span><FormItem
        label=""
        prop="reserveThreVal"
        :label-width="0"
      >
        <Input
          v-model="restModelData.reserveThreVal"
          :disabled="restDisabled"
          placeholder="请输入整数"
          style="width: 100px"
        />
      </FormItem>
      <span style="margin-left: 8px;">
        分钟内的预约单，则不强制下线。
      </span>
    </div>
  </div>
</template>

<script>
/**
 * @Desc: m2-web-general
 * @Author: zhangke
 * @CreateTime: 2020/5/24 10:08
 */
export default {
  name: "restWrap",
  props: {
    restModelData: {
      type: Object,
      default() {
        return {}
      }
    },
    restDisabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

.modal-p-title {
  width: 100px;
  padding-right: 10px;
  text-align: right;
}

.modal-p-title .red {
  color: red;
  font-weight: bold;
}

.forceRest_wrap_inner .ivu-form-item {
  display: inline-block;
}

.forceRest_wrap_inner .restline {
  line-height: 34px;
  margin-left: 100px;
}
</style>
