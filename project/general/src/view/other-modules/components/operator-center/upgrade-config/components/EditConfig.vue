<template>
  <Modal :value="visible" width="900" :title="title" @on-cancel="handleCancel">
    <Form ref="form" inline :model="form" :rules="rules">
      <FormItem prop="upCarLevelStrategyName" label="策略名称">
        <Input
          v-model="form.upCarLevelStrategyName"
          placeholder="请输入策略名称"
          :maxlength="20"
        />
      </FormItem>
      <FormItem prop="cityCode" label="策略命中城市">
        <Select
          v-model="form.cityCode"
          placeholder="请选择策略命中城市"
          filterable
          :disabled="!!detail"
          style="width: 140px"
        >
          <Option
            v-for="item in cityList"
            :key="item.label + '_edit'"
            :value="item.value"
            :label="item.label"
          />
        </Select>
      </FormItem>
      <FormItem prop="effectiveTime" label="策略生效日期">
        <DatePicker
          v-model="form.effectiveTime"
          :disabled="!!detail"
          type="datetimerange"
          split-panels
          placeholder="请选择策略生效日期"
          :options="pickerOptions"
          style="width: 300px"
        />
      </FormItem>
      <FormItem label="业务线" prop="expandBizLine">
        <Select
          v-model="form.expandBizLine"
          placeholder="请选择"
          :style="{
            width: '180px'
          }"
        >
          <Option
            v-for="item in businessGradeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </Select>
      </FormItem>
      <Row>
        <FormItem label="订单类型" prop="typeTime">
          <Select
            v-model="form.typeTime"
            placeholder="请选择"
            :style="{
              width: '180px'
            }"
          >
            <Option
              v-for="item in orderType"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </Select>
        </FormItem>
        <FormItem label="订单渠道" prop="channel">
          <Select
            v-model="form.channel"
            placeholder="请选择"
            :style="{
              width: '180px'
            }"
            @on-change="channelChange"
          >
            <Option
              v-for="item in orderChannel"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </Select>
        </FormItem>
        <FormItem label="渠道类型" prop="sources">
          <Select
            v-model="form.sources"
            placeholder="请选择"
            multiple
            :style="{
              width: '226px'
            }"
          >
            <Option
              v-for="item in channelList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </Select>
        </FormItem>
        <FormItem label="策略优先级" prop="priority">
          <Select
            v-model="form.priority"
            placeholder="请选择"
            :style="{
              width: '180px'
            }"
          >
            <Option
              v-for="item in policyPriority"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </Select>
        </FormItem>
      </Row>
      <Card
        v-for="(item, index) in form.upCarLevelPeriods"
        :key="index"
        class="card-content"
      >
        <div slot="title" class="card-title">
          <span>配置{{ index + 1 }}</span>
          <span>
            <Icon
              v-if="form.upCarLevelPeriods.length - 1 === index"
              class="icon-handle"
              type="ios-add"
              :size="30"
              @click="addConfigList"
            />
            <Icon
              v-if="form.upCarLevelPeriods.length > 1"
              class="icon-handle"
              type="ios-close"
              :size="30"
              @click="deleteConfigList(index)"
            />
          </span>
        </div>
        <ConfigItem
          :ref="`ref_${index}`"
          :value="item"
          v-bind="form"
          :car-type-list="carTypeList"
          :week-list="weekList"
        />
      </Card>
    </Form>
    <div slot="footer">
      <Button :loading="submitLoading" type="primary" @click="handleSubmit">
        确定
      </Button>
    </div>
    <Spin v-if="loading" fix />
  </Modal>
</template>

<script>
import ConfigItem from "./ConfigItem";
import moment from "moment";
import intersection from "lodash/intersection";
import { mapState } from "vuex";
import { freeze } from "@/mixins/base";
import {getInChannel, getOutChannel} from "../service"
import {
  policyPriority,
  orderType,
  orderChannel,
  formRules,
  props
} from "../fields";

const day_seconds = 24 * 3600 * 1000;
export default {
  name: "edit-config",
  components: {
    ConfigItem
  },
  props,
  data() {
    return {
      form: {},
      channelList: [],
      policyPriority: freeze(policyPriority),
      orderType: freeze(orderType),
      orderChannel: freeze(orderChannel),
      rules: freeze(formRules),
      pickerOptions: freeze({
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - day_seconds;
        }
      })
    };
  },
  computed: {
    ...mapState({
      businessGradeList: state => state.common.businessGradeList
    }),
    title() {
      return `${this.detail ? "编辑" : "添加"}升舱策略`;
    }
  },
  watch: {
    visible(val, oldVal) {
      if (!val && oldVal) {
        const { upCarLevelPeriods } = this.form;
        this.$refs.form.resetFields();
        upCarLevelPeriods.forEach((item, index) => {
          this.$refs[`ref_${index}`][0].$refs.form.resetFields();
        });
        this.channelList = []
      }
      if(val) {
        this.channelList = []
      }
    },
    detail: {
      handler(val) {
        if (val) {
          let {
            upCarLevelStrategyName,
            cityCode,
            effectiveTimeStart,
            effectiveTimeEnd,
            upCarLevelPeriods,
            upCarLevelStrategyExtend,
            expandBizLine,
            typeTime
          } = val;
          upCarLevelPeriods = upCarLevelPeriods.map(item => {
            const { periodBegin, periodEnd, oldCarLevel, ...others } = item;
            return {
              ...others,
              periodTime: [periodBegin, periodEnd],
              oldCarLevel: oldCarLevel.split(","),
            };
          });
          this.form = {
            upCarLevelStrategyName,
            cityCode,
            typeTime,
            priority: 0,
            effectiveTime: [effectiveTimeStart, effectiveTimeEnd],
            upCarLevelPeriods,
            expandBizLine,
            ...(upCarLevelStrategyExtend || {})
          };
          let s = this.form?.sources
          this.form.sources = typeof s === 'string' ? s.split(",") : (s || [])
          this.setChannelList(this.form.channel)

          return;
        }
        this.form = {
          cityCode: "",
          effectiveTime: [],
          priority: 0,
          sources: [],
          // 策略名称
          upCarLevelStrategyName: "",
          upCarLevelPeriods: [
            {
              // 策略时间段
              periodTime: [],
              // 重复机制
              week: [],
              newCarLevelOrdersInHexagon: "",
              oldCarLevelOrdersInHexagon: "",
              upCarLevelOdds: "",
              // 下单车型
              oldBizType: "",
              oldCarLevel: [],
              // 目标车型
              newCarLevel: "",
              driverFareModel: 0,
              copies: [],
              // 是否弹出升舱弹窗
              need2Pop: 0,
            }
          ]
        };
      },
      immediate: true
    }
  },
  methods: {
    addConfigList() {
      this.form.upCarLevelPeriods.push({
        // 策略时间段
        periodTime: [],
        // 重复机制
        week: [],
        newCarLevelOrdersInHexagon: "",
        oldCarLevelOrdersInHexagon: "",
        upCarLevelOdds: "",
        oldBizType: "",
        // 被升舱车型
        oldCarLevel: "",
        newCarLevel: "",
        // 升舱车型
        driverFareModel: 0,
        copies: [],
        need2Pop: 0,
      });
    },
    deleteConfigList(idx) {
      this.$Modal.confirm({
        content: "确认删除该配置？",
        onOk: () => {
          this.form.upCarLevelPeriods.splice(idx, 1);
          this.$Message.success("已删除该配置");
        }
      });
    },
    handleCancel() {
      this.$emit("close");
    },
    async handleSubmit() {
      let valid = await this.$refs.form.validate();
      if (!valid) return;
      const bool = await this.validConfig(); // 校验配置子组件
      if(!bool) return
      let [bo, msg] = this.validNewCarLevel()
      if (!bo) {
        this.$Message.error(msg)
        return
      }

      const params = this.getSubmitParams();
      if (this.detail) {
        params.uuid = this.detail.uuid;
      }

      this.$emit("submit", params)
    },
    getSubmitParams() {
      const {
        cityCode,
        upCarLevelStrategyName,
        effectiveTime,
        upCarLevelPeriods,
        priority,
        expandBizLine,
        typeTime,
        channel,
        sources
      } = this.form;
      let baseParams = {
        upCarLevelStrategyName,
        cityCode,
        effectiveStartTime: moment(effectiveTime[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        effectiveEndTime: moment(effectiveTime[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        expandBizLine,
        typeTime,
        upCarLevelStrategyExtend: {
          priority,
          channel,
          sources:sources.join(","),
        }
      };
      return {
        ...baseParams,
        upCarLevelPeriods: upCarLevelPeriods.map((item, index) => {
          const { periodTime, oldCarLevel, ...others } = item;
          const d = this.$refs[`ref_${index}`][0]?.inOrderTypeNameList;
          return {
            periodBegin: periodTime[0],
            periodEnd: periodTime[1],
            ...others,
            oldCarLevel: oldCarLevel.join(","),
            pasFarePriority: d?.map((item, ix) => ({
              sort: ix,
              oldCarLevel: item.value,
              oldCarName: item.label
            }))
          };
        })
      };
    },
    // validSubmit() {
    //   const { upCarLevelPeriods } = this.form;
    //   let isValid = true;
    //   console.log(upCarLevelPeriods, 'upCarLevelPeriods')
    //   // 判断下单车型
    //   if (isValid) {
    //     const obj = {};
    //     //driverFareModel periodTime
    //     upCarLevelPeriods.forEach(item => {
    //       if (obj[item.oldCarLevel]) {
    //         obj[item.oldCarLevel].push(item);
    //       } else {
    //         obj[item.oldCarLevel] = [item];
    //       }
    //     });
    //     if(!this.validNewCarLevel()) {
    //       return
    //     }
    //
    //     console.log("map1", obj);
    //     const sameCarList = Object.keys(obj);
    //     const isSameBilling = (prev, next) => {
    //       return prev.driverFareModel === next.driverFareModel;
    //     };
    //     // 判断时间段是否有交集
    //     const isTimeIntersection = (startList, endList) => {
    //       for (let i = 1; i < startList.length; i++) {
    //         if (startList[i] <= endList[i - 1]) {
    //           this.$Message.error("策略时间段有重复");
    //           isValid = false;
    //           return;
    //         }
    //       }
    //     };
    //     // 判断两个车型是否有冲突
    //     const isTwoCarConflict = (car1, car2) => {
    //       if (isSameBilling(car1, car2)) {
    //         const startList = [
    //           moment(`2000-01-01 ${car1.periodTime[0]}`).valueOf(),
    //           moment(`2000-01-01 ${car2.periodTime[0]}`).valueOf()
    //         ].sort();
    //         const endList = [
    //           moment(`2000-01-01 ${car1.periodTime[1]}`).valueOf(),
    //           moment(`2000-01-01 ${car2.periodTime[1]}`).valueOf()
    //         ].sort();
    //         console.log("123123", intersection(car1.week, car2.week));
    //         if (intersection(car1.week, car2.week).length !== 0) {
    //           isTimeIntersection(startList, endList);
    //         }
    //       }
    //     };
    //
    //     // 判断下单车型相同的配置是否 大于两条
    //     for (let i = 0; i < sameCarList.length; i++) {
    //       const key = sameCarList[i];
    //       for (let j = 0; j < obj[key].length; j++) {
    //         for (let k = j + 1; k < obj[key].length; k++) {
    //           // 判断两个配置中，计费规则是否相同
    //           console.log("wewewe", obj[key]);
    //           if (obj[key][k]) {
    //             isTwoCarConflict(obj[key][j], obj[key][k]);
    //           }
    //
    //           if (!isValid) return;
    //         }
    //       }
    //     }
    //   }
    //   return isValid;
    // },
    // 校验目标车型
    // 同策略类型下，同时段，目标车型不能出现重复，重复提示：目标车型有重复配置
    // 校验: 当策略类型相同 重复机制有重叠 策略时间段有重叠 目标车型不能相同, 给出提示
    validNewCarLevel() {
      const { upCarLevelPeriods } = this.form;
      let _newCarLevel = []; // 目标车型
      let _driverFareModel = []; // 策略类型
      let _periodTime = []; // 策略时间段
      let _week = []; // 重复机制
      upCarLevelPeriods.forEach(item => {
        _newCarLevel.push(item.newCarLevel);
        _week.push(item.week);
        _driverFareModel.push(item.driverFareModel);
        _periodTime.push(item.periodTime.map(time => (time.split(':').join(""))));
      });
      let len = _driverFareModel.length;
      let bo = true
      for(let i = 0; i < len; i++) {
        for(let j = i + 1; j < len; j++) {
          let modelSame = _driverFareModel[i] === _driverFareModel[j];
          let weekIntersection = _week[i].length + _week[j].length > [...new Set([..._week[i], ..._week[j]])].length; // 重复机制有交集
          let periodTimeIntersection = this.timeIntersection(_periodTime[i], _periodTime[j]);
          let carSame = _newCarLevel[i] === _newCarLevel[j];
          if(modelSame && weekIntersection && periodTimeIntersection && carSame) { // 策略相同
            bo = false
            return [false, "目标车型有重复配置"]
          }
        }
      }
      return [true]
    },
    channelChange(v) {
      this.form.sources = []
      this.setChannelList(v)
    },
    async setChannelList(v) {
      let func = [getInChannel, getOutChannel];
      if(!func[v]) return
      const {data} = await func[v]();
      if(data.success) {
        this.channelList = data.data.map(item => ({
          label: item.sourseName,
          value: `${item.sourseValue}`
        }));
      }
    },
    // 00:00:00 - 23:59:59
    timeIntersection(date1, date2) {
      if(date1.filter(Boolean).length < 2 || date2.filter(Boolean).length < 2) {
        return false
      }
      return !(date2[1] < date1[0] || date2[0] > date1[1])
    },
    async validConfig() {
      let list = this.form.upCarLevelPeriods.map((it, index) => {
        return this.$refs[`ref_${index}`][0]?.validForm()
      })
      const validList = await Promise.all(list)
      return validList.every(Boolean)
    }
  }
};
</script>

<style scoped lang="less">
.card-content {
  margin-bottom: 20px;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-handle {
  cursor: pointer;
}
</style>
