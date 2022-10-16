<!--
 * @Descritption: 搜索
 * @Author: wucf
 * @Date: 2020-05-08 15:03:28
 * @LastEditors: wucf
 * @LastEditTime: 2020-05-08 16:27:52
 -->
<template>
  <Form ref="formInline" inline :model="formInline" :label-width="80">
    <!-- 评价时间 -->
    <FormItem label="评价时间：" prop="timeArray">
      <DatePicker
        v-model="formInline.timeArray"
        type="datetimerange"
        placeholder="请选择评价时间范围"
        format="yyyy/MM/dd"
        class="select-item"
        clearable
      ></DatePicker>
    </FormItem>
    <!-- 应用版本 -->
    <FormItem label="应用版本：" prop="appVersionList">
      <Select
        v-model="formInline.appVersionList"
        placeholder="请选择应用版本"
        class="select-item"
        multiple
        clearable
      >
        <!-- <Option :value="0" disabled>
          <div class="select-appvision" @click.stop="">
            <Checkbox v-model="versionCheckAll">
              &nbsp;N项
            </Checkbox>
          </div>
        </Option> -->
        <Option
          v-for="item in appVersionList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.name }}
        </Option>
      </Select>
    </FormItem>
    <!-- 评价类型 -->
    <FormItem label="评价类型：" prop="type">
      <Select
        v-model="formInline.type"
        placeholder="请选择评价类型"
        class="select-item"
        clearable
      >
        <Option :value="1">
          好评
        </Option>
        <Option :value="2">
          差评
        </Option>
      </Select>
    </FormItem>
    <!-- 评价用户 -->
    <FormItem label="评价用户：" prop="evaluateUser">
      <Input
        v-model="formInline.evaluateUser"
        placeholder="请输入手机号码"
        class="select-item"
        clearable
      />
    </FormItem>
    <FormItem>
      <Button type="primary" style="margin-right:15px" @click="confirmHander">
        查询
      </Button>
      <Button @click="cancelHander">
        清空
      </Button>
    </FormItem>
  </Form>
</template>

<script>
import { queryAppVersionList } from "_o/api/evalution.js";

export default {
  data() {
    let nowDate = new Date();
    nowDate.setDate(nowDate.getDate() - 30);

    return {
      formInline: {
        timeArray: [nowDate, new Date()],
        appVersionList: [],
        type: "",
        evaluateUser: ""
      },
      appVersionList: [],
      versionCheckAll: false
    };
  },
  created() {
    this.getAppVersion();
  },
  methods: {
    // 获取app列表
    getAppVersion() {
      queryAppVersionList({
        dicKey: "app_passenger_version"
      }).then(res => {
        let result = res.data;
        this.appVersionList = result.data.map(item => {
          return {
            name: item.appVersion,
            value: item.appVersion
          };
        });
      });
    },
    getSubmitData() {
      let model = {
        ...{
          startTime: this.formInline.timeArray[0],
          endTime: this.formInline.timeArray[1]
        },
        ...this.formInline
      };

      delete model.timeArray;
      for (let key in model) {
        if (!model[key]) {
          delete model[key];
        }
      }

      if (
        Array.isArray(model.appVersionList) &&
        model.appVersionList.length === 0
      ) {
        delete model.appVersionList;
      }
      return model;
    },
    confirmHander() {
      let model = {
        ...{
          startTime: this.formInline.timeArray[0],
          endTime: this.formInline.timeArray[1]
        },
        ...this.formInline
      };

      delete model.timeArray;
      for (let key in model) {
        if (!model[key]) {
          delete model[key];
        }
      }

      if (
        Array.isArray(model.appVersionList) &&
        model.appVersionList.length === 0
      ) {
        delete model.appVersionList;
      }

      this.$emit("on-search", model);
    },
    cancelHander() {
      this.$refs.formInline.resetFields();
      this.$set(this.formInline, "timeArray", []);
      this.$emit("on-reset");
    }
  }
};
</script>

<style scoped lang="less">
.select-item {
  width: 200px;
}
.select-appvision {
  color: #333;
}
</style>
