<template>
  <div class="pay-content pr">
    <span class="aster" style="top: 4px; left: 78px">*</span>
    <div class="mt-40 tit">触达方式</div>
    <div class="radio-c flex-c">
      <CheckboxGroup v-model="touchType" style="width: 100%">
        <div class="flex-r mt-40">
          <div>
            <Checkbox :label="1"><span>短信通知</span></Checkbox>
          </div>
          <div class="flex-1">
            <!-- <Input
              v-model="smsContent"
              style="width: 450px"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入文案"
            /><span class="tot">{{smsContent.length}}字符/{{Math.ceil(smsContent.length/64)}}条</span> -->
            <Button @click="$emit('select')">选择模板</Button>
            <p v-if="template || smsContent" style="margin-top: 1em">{{template ? template.content : smsContent}}</p>
          </div>
        </div>
        <div class="flex-r mt-40">
          <div>
            <Checkbox :label="2"><span>push推送</span></Checkbox>
          </div>
          <div class="flex-1">
            <div class="flex-c">
              <div class="flex-r mb-10">
                <span class="tit-1">主标题</span>
                <Input
                  v-model="pushTitle"
                  style="width: 450px"
                  type="text"
                  :maxlength="200"
                  placeholder="请输入文案"
                />
              </div>
              <div class="flex-r mb-10">
                <span class="tit-1">副标题</span>
                <Input
                  v-model="pushSubTitle"
                  style="width: 450px"
                  type="text"
                  :maxlength="200"
                  placeholder="请输入文案"
                />
              </div>
              <div class="flex-r mb-10">
                <span class="tit-1">跳转链接</span>
                <Input
                  v-model="pushUrl"
                  style="width: 450px"
                  type="text"
                  :maxlength="200"
                  placeholder="请输入文案"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex-c mt-40">
          <div>
            <Checkbox :label="3"><span>奖励发放</span></Checkbox>
          </div>
          <div class="send-c">
            <div class="c-c">
              <div style="margin: auto">
                <div v-if="rewardName || subRewardName" class="add-c">
                  <span>{{ rewardName }}-{{ subRewardName }}</span>
                  <span class="swith-b" @click="selectReward">更换关联</span>
                </div>
                <div class="add-c" v-else>
                  <img
                    class="add-icon"
                    src="@/view/other-modules/assets/add_icon.png"
                    alt="新建"
                  />
                  <span @click="selectReward">关联奖励</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-c">
          <div>
            <Checkbox :label="4"><span>语音外呼</span></Checkbox>
          </div>
        </div>
      </CheckboxGroup>

      <div class="flex-r cc">
        <Checkbox v-model="check">未接通进行二次外呼</Checkbox>
        <span class="ml-20">二次外呼间隔</span>
        <Input
          v-model="intervalCallHour"
          style="width: 80px"
          :maxlength="10"
          placeholder=""
          @on-keyup="toNumber(intervalCallHour, 'intervalCallHour')"
        />
        <span>小时</span>
      </div>
    </div>
    <reward ref="_reward" @select="selectRow"></reward>
  </div>
</template>

<script>
import Reward from "./reward";

const dataKeyList = [
  "smsContent",
  "pushTitle",
  "pushSubTitle",
  "pushUrl",
  "rewardUuid",
  "subRewardUuid",
  "rewardName",
  "subRewardName",
  "intervalCallHour",
];
// 触达方式
export default {
  components: { Reward },
  props: {
    template: Object,
  },
  data() {
    return {
      touchType: [], // 1 短信通知 2 push推送 3奖励发放 4语音外呼
      smsContent: "", // 短信通知内容
      pushTitle: "", // 推送标题
      pushSubTitle: "", // 推送子标题
      pushUrl: "", // 推送跳转链接
      rewardUuid: "", //奖励uuid
      subRewardUuid: "", // 资奖励uuid
      rewardName: "", // 奖励名称
      subRewardName: "", // 子奖励名称
      intervalCallHour: "", // 间隔呼叫
      check: false, // 是否二次外呼
    };
  },
  methods: {
    init(p) {
      if (!p) return;
      Object.keys(p).forEach((key) => {
        this[key] = p[key];
      });
      this.check = !!p.intervalCallHour;
    },
    restore() {
      this.touchType = [];
      this.check = false;
      dataKeyList.forEach((k) => {
        this[k] = "";
      });
    },
    selectReward() {
      this.$refs._reward.init();
    },
    selectRow(row) {
      this.rewardName = row.grantRewardPackageName;
      this.subRewardName = row.subRewardName;
      this.rewardUuid = row.grantRewardPackageUuid;
      this.subRewardUuid = row.uuid;
    },
    toNumber(val, key) {
      let v = `${val}`.replace(/[^\d\.]/g, "");
      let vArr = v.split(".");
      if (vArr.length > 2) {
        v = vArr.slice(0, 2).join(".");
      }
      if (vArr[1] && vArr[1].length > 2) {
        v = (+v).toFixed(2);
      }
      this[key] = v;
    },
  },
};
</script>

<style scoped lang="less">
.radio-c {
  margin-left: 120px;
}
.tit {
  margin-left: 90px;
}
.flex-r {
  display: flex;
  flex-direction: row;
}
.flex-c {
  display: flex;
  flex-direction: column;
}
.mt-40 {
  margin-bottom: 40px;
}
.mr-20 {
  margin-right: 20px;
}
.ml-20 {
  margin-left: 20px;
}
.mb-10 {
  margin-bottom: 10px;
}
.flex-1 {
  flex: 1;
  span {
    line-height: 32px;
  }
}
.item-width {
  width: 160px;
}
.item-width-d {
  width: 320px;
}
.gap {
  margin: 0 20px;
}
.unit {
  display: inline-block;
  width: 30px;
  margin-left: 10px;
}
.send-c {
  margin-top: 10px;
  background-color: #fff;
  padding: 20px;
  height: 160px;
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  .c-c {
    flex: 1;
    height: 120px;
    border: 1px solid #dedede;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
  }
}
.tit-1 {
  display: inline-block;
  width: 60px;
  margin-right: 12px;
}
.cc {
  margin-top: 10px;
  padding: 20px;
  line-height: 32px;
  background-color: #fff;
}
.add-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
}
.add-c {
  cursor: pointer;
}
.swith-b {
  padding: 4px 8px;
  border: 1px solid #dedede;
  border-radius: 4px;
  font-size: 12px;
}
.flex-end {
  align-items: flex-end
}
.tot {
  color: #2d8cf0;
  margin-left: 16px;
}
</style>