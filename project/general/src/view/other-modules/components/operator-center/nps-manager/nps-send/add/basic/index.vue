<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
    <FormItem label="名称" prop="configName">
      <Input v-model.trim="formValidate.configName" placeholder="输入20个字以内" style="width: 180px"></Input>
    </FormItem>

    <FormItem label="生效时间" prop="etime">
      <DatePicker
        confirm
        v-model="formValidate.etime"
        type="daterange"
        format="yyyy-MM-dd"
        :editable="false"
        placeholder="请选择生效时间"
        style="width: 200px"
        :options="options"
        @on-change="selectDate"
      ></DatePicker>
    </FormItem>

    <FormItem label="发放周期" prop="pushCycleType">
      <Select
        v-model="formValidate.pushCycleType"
        clearable
        style="width:180px"
      >
        <Option
          v-for="(value, key) in sendModeMap"
          :key="key"
          :value="Number(key)"
        >
          {{ value }}
        </Option>
      </Select>
    </FormItem>

    <FormItem label="推送时间" prop="pushCycleTime">
      <TimePicker 
        confirm
        v-model="formValidate.pushCycleTime"
        type="time"
        format="HH:mm:ss"
        :editable="false"
        placeholder="请选择日期"
        style="width: 180px"
      ></TimePicker >
    </FormItem>

    <FormItem label="是否使用问卷沉默设置" prop="silentFlag" style="width: 350px">
      <RadioGroup v-model="formValidate.silentFlag">
        <Radio :label="1">是</Radio>
        <Radio :label="0">否</Radio>
      </RadioGroup>
    </FormItem>
  </Form>
</template>

<script>
import { sendModeMap } from "../../../fields";

export default {
  name: "basic",
  props: {
    formValidate: {
      type: Object,
      default: {}
    }
  },
  data () {
    const validateEtime = (rule, value, callback) => {
        if (!value[0]) {
            callback(new Error('生效时间不能为空'));
        } else {
            callback();
        }
    };
    return {
      sendModeMap: sendModeMap,
      ruleValidate: {
        configName: [
          { required: true, message: '名称不能为空', trigger: 'blur'},
          { type: 'string', max: 20, message: '请输入20个字符以内', trigger: 'blur' }
        ],
        etime: [
          { validator: validateEtime, required: true, message: '生效时间不能为空', trigger: 'blur'},
        ],
        pushCycleType: [
          { type: "number", required: true, message: '发送周期不能为空', trigger: 'change'},
        ],
        pushCycleTime: [
          { required: true, message: '推送时间不能为空', trigger: 'change'},
        ],
        silentFlag: [
          { type: "number", required: true, message: '沉默设置不能为空', trigger: 'change'},
        ],
      },
      options: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      }
    }
  },
  methods: {

    dataChange() {
      // 直接把数据发送给父组件
      this.$emit('update', this.formValidate);
    },
    selectDate (val) {
      this.formValidate.etime = val
    }
  }
}
</script>

