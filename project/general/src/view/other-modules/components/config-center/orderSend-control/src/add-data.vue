<template>
  <div>
    <Form
      ref="addTemplate"
      :model="addParams"
      label-position="left"
      :label-width="150"
      :rules="rules"
    >
      <FormItem
        label="运力渠道："
        prop="transportId"
      >
        <Select
          v-model="addParams.transportId"
          style="width: 210px"
          placeholder="请选择"
          :disabled="type === 'edit'"
        >
          <Option
            v-for="item in statusMap"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        v-if="type === 'add'"
        label="所属城市："
        prop="cityUuids"
      >
        <TreeInput
          v-model="addParams.cityUuids"
          :data="allCities"
          placeholder="请选择城市"
          @on-change="change"
        ></TreeInput>
      </FormItem>
      <div v-else>
        所属城市:{{ addParams.cityName }}
      </div>
      <FormItem
        label="产品线："
        prop="businessTypes"
      >
        <Select
          v-model="addParams.businessTypes"
          style="width: 210px"
          :disabled="type === 'edit'"
          placeholder="请选择"
          multiple
        >
          <Option
            v-for="item in productMap"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="优先级系数："
        prop="priorityFactor"
      >
        <Input
          v-model="addParams.priorityFactor"
          style="width: 210px"
          placeholder="请输入"
        ></Input>
        <div>限制输入0.1-2.0的数值。数值越小，则优先级越高</div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { productLine, dropList, transportMap } from "./filed";
import TreeInput from "_a/tree-input/tree-input.vue";
export default {
  name: "add-data",
  components: {
    TreeInput
  },
  props: {
    allCities: {
      type: Array,
      default: () => []
    },
    addParams: {
      type: Object,
      default: () => {
        return {
          transportId: "",
          cityUuids: [],
          businessTypes: "",
          priorityFactor: ""
        };
      }
    },
    type: {
      type: String,
      default: "add"
    }
  },
  data() {
    return {
      productMap: dropList(productLine),
      statusMap: dropList(transportMap),
      rules: {
        cityUuids: [
          {
            type: "array",
            required: true,
            message: "请选择城市",
            trigger: "change"
          }
        ],
        businessTypes: [{ required: true, message: "请选择产品线" }],
        transportId: [{ required: true, message: "请选择运力渠道" }],
        priorityFactor: [
          {
            required: true,
            message: "仅限输入大于等于0.1，小于等于2.0的数值。支持1位小数。",
            pattern: /(^[0-1]{1}\.[1-9]{1}$)|(^[1-2]{1}$)/
          }
        ]
      },
      loading: false,
      options: [],
      companyName: ""
    };
  },
  methods: {
    change(value) {
      this.addParams.cityUuids = value;
      this.$refs.addTemplate.validateField("cityUuids");
    }
  }
};
</script>

<style></style>
