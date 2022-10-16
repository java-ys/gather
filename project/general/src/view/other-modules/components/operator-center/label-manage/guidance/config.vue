<!--
 * @Descritption: 条件配置
 * @Author: wucf
 * @Date: 2020-05-08 15:03:28
 * @LastEditors: wucf
 * @LastEditTime: 2020-05-08 19:54:58
 -->
<template>
  <Form
    ref="formInline"
    :model="form"
    :label-width="170"
    :rules="rules"
  >
    <!-- 评价时间 -->
    <FormItem
      label="引导弹窗开关："
      prop="type"
    >
      <RadioGroup v-model="form.type">
        <Radio :label="1">
          开启
        </Radio>
        <Radio :label="2">
          关闭
        </Radio>
      </RadioGroup>
    </FormItem>
    <!-- 应用版本 -->
    <FormItem
      label="时间间隔（天）："
      prop="timeInterval"
    >
      <InputNumber
        v-model="form.timeInterval"
        :min="1"
        :max="365"
        :disabled="form.type === 2"
      ></InputNumber>
    </FormItem>
    <!-- 评价类型 -->
    <div label="评价类型：">
      <span class="pj-label">用户评价：</span>
      <FormItem
        label="司机"
        prop="driverRatingStar"
        :label-width="55"
        style="display:inline-block"
      >
        <InputNumber
          v-model="form.driverRatingStar"
          :min="1"
          :max="5"
          :disabled="form.type === 2"
        ></InputNumber>
      </FormItem>
      <FormItem
        label="平台"
        prop="platformRatingStar"
        :label-width="55"
        style="display:inline-block"
      >
        <InputNumber
          v-model="form.platformRatingStar"
          :min="1"
          :max="5"
          :disabled="form.type === 2"
        ></InputNumber>
      </FormItem>
      <FormItem
        label="车辆"
        prop="vehicleRatingStar"
        :label-width="55"
        style="display:inline-block"
      >
        <InputNumber
          v-model="form.vehicleRatingStar"
          :min="1"
          :max="5"
          :disabled="form.type === 2"
        ></InputNumber>
      </FormItem>
    </div>
    <!-- 评价用户 -->
    <FormItem
      label="用户群："
      prop="category"
    >
      <RadioGroup v-model="form.category">
        <Radio
          :label="1"
          :disabled="form.type === 2"
        >
          全部用户
        </Radio>
        <Radio
          :label="2"
          :disabled="form.type === 2"
        >
          部分用户
        </Radio>
      </RadioGroup>
      <div v-show="form.category === 2">
        <Select
          v-model="form.userGroupCode"
          class="select-item"
          filterable
          :disabled="form.type === 2"
        >
          <Option
            v-for="(item, index) in groupList"
            :key="index"
            :value="item.userGroupCode"
            @click.native="changeGroup(item)"
          >
            {{ item.userGroupName }}
          </Option>
        </Select>
      </div>
    </FormItem>
  </Form>
</template>

<script>
import { queryEvaluationConfig, queryEvaluationGroupList } from "_o/api/evalution";

export default {
  data() {
    return {
      form: {
        type: 2,
        timeInterval: null,
        driverRatingStar: null,
        platformRatingStar: null,
        vehicleRatingStar: null,
        category: 1
      },
      groupList: [],
      rules: {
        timeInterval: [{ required: true, message: "不能为空" }],
        driverRatingStar: [{ required: true, message: "不能为空" }],
        platformRatingStar: [{ required: true, message: "不能为空" }],
        vehicleRatingStar: [{ required: true, message: "不能为空" }]
      }
    };
  },
  created() {
    this.init();
    this.getGroupList()
  },
  methods: {
    // 点击确定触发
    comfirmHander() {
      return new Promise(resolve => {
        this.$refs["formInline"].validate(validate => {
          if (validate) {
            resolve(this.form);
          }
        });
      });
    },
    // 获取群组
    getGroupList() {
      queryEvaluationGroupList({}).then(res => {
        if (res.data.success) {
          this.groupList = res.data.data.list
        }
      })
    },
    changeGroup(i) {
      this.form.userGroupName = i.userGroupName
    },
    // 初始化
    init() {
      queryEvaluationConfig({}).then(res => {
        let data = res.data.data && res.data.data[0];
        if (data) {
          this.form = {
            id: data.id,
            type: data.type,
            timeInterval: Number(data.timeInterval),
            driverRatingStar: data.driverRatingStar,
            platformRatingStar: data.platformRatingStar,
            vehicleRatingStar: data.vehicleRatingStar,
            category: data.category,
            userGroupCode: data.userGroupCode,
            userGroupName: data.userGroupName
          };
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.select-item {
  width: 200px;
}

.pj-label {
  text-align: right;
  width: 160px;
  height: 32px;
  line-height: 32px;
  display: inline-block;
}
</style>
