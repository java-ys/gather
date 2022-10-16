<template>
  <Form v-if="showBasic" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
    <FormItem label="名称" prop="configName">
      <Input v-model.trim="formValidate.configName" placeholder="输入20个字以内" style="width: 180px"></Input>
    </FormItem>

    <FormItem label="生效时间" prop="etime">
      <DatePicker
        v-model="formValidate.etime"
        confirm
        type="daterange"
        format="yyyy-MM-dd"
        :editable="false"
        placeholder="请选择生效时间"
        style="width: 200px"
        :options="options"
        @on-change="selectDate"
      ></DatePicker>
    </FormItem>
    <FormItem
      label=""
      prop="userType"
      style="width: 350px"
    >
      <RadioGroup
        v-model="formValidate.userType"
        @on-change="changeUserType"
      >
        <Radio
          v-for="(value, key) in personGroupMap"
          :key="key"
          :label="Number(key)"
        >
          {{value}}
        </Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      label="问卷"
      style="width: 350px"
      prop="questionnaire"
    >
      <Select
        v-model="formValidate.questionnaire"
        multiple
        clearable
        style="width:150px"
        @on-change="handleNpsSelectChange"
      >
        <Option
          v-for="(item, index) in npsList"
          :key="index"
          :value="item.questionnaireId"
        >
          {{item.questionnaireName}}
        </Option>
      </Select>
    </FormItem>
  </Form>
</template>

<script>
import { sendModeMap, personGroupMap } from "../../../fields";
import { queryNPSNoPage } from "_o/api/nps/app.js";
export default {
  name: "basic",
  props: {
    formValidate: {
      type: Object,
      default: {}
    }
  },
  data() {
    const validateEtime = (rule, value, callback) => {
      if (!value[0]) {
        callback(new Error("生效时间不能为空"));
      } else {
        callback();
      }
    };
    const validateUserType = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择用户类型"));
      } else {
        callback();
      }
    };
    const validateQuestionnaire = (rule, value, callback) => {
      if (value && value.length) {
        callback();
      } else {
        callback(new Error("问卷列表不能为空"));
      }
    };
    return {
      showBasic: false,
      personGroupMap: personGroupMap,
      sendModeMap: sendModeMap,
      ruleValidate: {
        configName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { type: "string", max: 20, message: "请输入20个字符以内", trigger: "blur" }
        ],
        etime: [
          { validator: validateEtime, required: true, message: "生效时间不能为空", trigger: "blur" },
        ],
        questionnaire: [
          { validator: validateQuestionnaire, required: true, trigger: "blur" }
        ],
        userType: [
          { validator: validateUserType, trigger: "blur" },
        ],
      },
      options: {
        disabledDate(date) {
          // return date && date.valueOf() < Date.now();
        }
      },
      npsList: [],
    }
  },
  mounted() {
    this.queryNPSNoPage()
  },
  methods: {
    changeUserType() {
      this.queryNPSNoPage()
    },
    // 获取所有问卷
    queryNPSNoPage() {
      let params = {
        userType: this.formValidate.userType
      }
      queryNPSNoPage(params).then(res => {
        if (res.data.success) {
          this.npsList = res.data.data || []

          console.log("formValidate", this.formValidate)
          this.showBasic = true
        }
      })
    },
    handleNpsSelectChange(value) {
      // if()
      let tempSelected = []
      for (let item of value) {
        let itemFilter = this.npsList.find(ele => {
          return ele.questionnaireId === item;
        });
        tempSelected.push({
          questionnaireId: itemFilter.questionnaireId,
          questionnaireName: itemFilter.questionnaireName,
          numLimit: 999999
        })
      }
      this.formValidate.questionDistributeList = tempSelected
    },
    dataChange() {
      // 直接把数据发送给父组件
      this.$emit("update", this.formValidate);
    },
    selectDate(val) {
      this.formValidate.etime = val
    }
  }
}
</script>

