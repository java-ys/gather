<template>
  <div>
    <Modal
      v-model="visible"
      :title="title"
      width="700"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="_form"
        :model="addForm"
        :label-width="150"
        :rules="validateRules"
      >
        <Row>
          <FormItem label="城市：" prop="cityCodeList">
            <Select
              v-model="addForm.cityCodeList"
              class="input-width item-width"
              filterable
              multiple
              :disabled="isEdit"
              @on-change="cityChange"
              @on-open-change="selectOpenChange"
            >
              <Option
                v-for="(item, index) in cityList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="运营模式：" prop="operateType">
            <Select
              v-model="addForm.operateType"
              placeholder="请选择"
              class="item-width"
              multiple
              :disabled="isEdit"
              @on-open-change="selectOpenChange"
              @on-change="operateTypeChange"
            >
              <Option
                v-for="(item, index) in operateTypeEnum"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="运营商：" prop="agentUuid">
            <Select
              v-model="addForm.agentUuid"
              class="input-width item-width"
              filterable
              multiple
              :disabled="isEdit"
              label-in-value
            >
              <Option
                v-for="(item, index) in agentList"
                :value="item.agentUuid"
                :key="index"
                >{{ item.agentName }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="产品线：" prop="businessType">
            <Select
              v-model="addForm.businessType"
              class="input-width item-width"
              filterable
              multiple
              :disabled="isEdit"
              label-in-value
            >
              <Option
                v-for="(item, index) in productLineEnum"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="指标名称：" prop="indexUuid">
            <Select
              v-model="addForm.indexUuid"
              class="input-width item-width"
              filterable
              @on-change="indicatorChange"
              :disabled="isEdit"
            >
              <Option
                v-for="(item, index) in indicatorList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="指标说明：" prop="remark">
            <Input
              type="textarea"
              v-model="addForm.remark"
              :rows="4"
              :maxlength="500"
              class="textarea-con"
              readonly
              placeholder=""
              :disabled="isEdit"
            />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="考核月份：" prop="assessTime">
            <DatePicker
              v-model="addForm.assessTime"
              type="month"
              class="item-width"
              placeholder="请选择月份"
              format="yyyy-MM"
              :editable="false"
              :disabled="isEdit"
            >
            </DatePicker>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="目标设定：" prop="assessTarget">
            <Input
              v-model="addForm.assessTarget"
              class="item-width"
              :maxlength="15"
              placeholder="请输入"
              @on-keyup="toNumber()"
            ></Input>
          </FormItem>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" :loading="submitLoading" @click="(e) => save()">
          <span>确定</span>
        </Button>
        <Button type="primary" ghost @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { cityNewQueryAgentListService } from "_o/api/city-check";
import {
  createAgentTargetService,
  updateAgentTargetService,
} from "_o/api/settle/goal.js";
import { tool } from "_o/api/baseMixin.js";
import { addFormRule } from "../fields";
import { freeze } from "@/mixins/base";
import { operateTypeEnum, productLineEnum } from "@/config";
import ModalMixin from '@/mixins/modal'
/*
新建/编辑考核目标
  1.字段说明：
  城市，必填，可多选，可选全部，选全部即为不限制城市；
  运营模式，必填，可多选，可选项为A、UP、带车加盟、巡网出租车；
  产品线，必填，可多选，可选项来源于资产平台产品线；
  运营商，必填，可多选，需联动城市和运营模式展示；
  指标名称，必填，单选，仅可选择自定义考核指标；
  指标说明，选择指标后带出展示不可修改；
  考核月份，必填，单选；
  考核月份，必填，可多选；
  考核分，必填，支持两位小数；
  2.新建提交成功后，根据上述条件，将对应数据入库；
  3.编辑目标时，除考核分字段可修改，其余字段均不可修改；
*/

export default {
  name: "goal-add",
  inject: ["getCityList", "getIndicatorList"],
  mixins: [tool, ModalMixin],
  computed: {
    indicatorList() {
      return this.getIndicatorList();
    },
    cityList() {
      return this.getCityList();
    },
    isEdit({ detail }) {
      return !!detail.uuid;
    },
  },
  data() {
    return {
      title: "添加考核目标",
      submitLoading: false,
      validateRules: freeze(addFormRule),
      operateTypeEnum,
      productLineEnum,
      addForm: {
        cityCodeList: [],
        agentUuid: [],
        businessType: [],
        indexUuid: "",
        assessTime: "", // 考核月份
        operateType: [], // 运营模式
        assessTarget: "",
        remark: "",
      },
      allowChange: false,
      agentList: [], // 运营商列表
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      if (!this.detail.uuid) return;
      this.title = "编辑考核目标";
      const {
        uuid,
        agentUuid,
        operateType,
        businessType,
        assessTime,
        cityCode,
        assessTarget,
        indexUuid,
      } = this.detail;
      let p =  {
        uuid,
        assessTime,
        indexUuid,
        assessTarget,
        cityCodeList: [cityCode],
        operateType:operateType?.split(","),
        agentUuid:agentUuid?.split(","),
        businessType:businessType?.split(","),
      }

      Object.assign(this.addForm, p);
      this.indicatorChange(indexUuid);
      this.getAgentList();
    },
    async save() {
      const valid = await this.$refs._form.validate();
      if (!valid) return;
      const {
        agentUuid,
        operateType,
        businessType,
        assessTime,
        assessTarget,
        indexUuid,
      } = this.addForm;
      let p = {
        agentUuid: agentUuid.join(","),
        operateType: operateType.join(","),
        businessType: businessType.join(","),
        assessTime: this.$moment(assessTime).format("YYYY-MM"),
        indexUuid,
        assessTarget,
      };
      let msg = "添加成功";
      let func = createAgentTargetService;
      if (this.isEdit) {
        msg = "编辑成功";
        func = updateAgentTargetService;
        p.uuid = this.detail.uuid;
      }
      // console.log(p, 11);
      // return;
      const [err, data] = await this.toResult(func(p));
      if (err) {
        return;
      }
      this.$Message.success(msg);
      this.$emit("close", true);
      this.$refs._form.resetFields();
    },
    cancel() {
      this.$Modal.confirm({
        title: `是否确认取消${this.title}？`,
        onOk: () => {
          // this.$refs._form.resetFields();
          this.$emit("close");
        },
      });
    },
    toNumber() {
      let val = this.addForm.assessTarget;
      let v = `${val}`.replace(/[^\d\.]/g, "");
      let vArr = v.split(".");
      if (vArr.length > 2) {
        v = vArr.slice(0, 2).join(".");
      }
      if (vArr[1] && vArr[1].length > 6) {
        v = Number(v).toFixed(6);
      }
      if (v > 100) {
        v = 100;
      } else if (v < 0) {
        // v = 0;
      }
      this.addForm.assessTarget = v !== "" ? v : "";
    },
    async getAgentList() {
      const { cityCodeList, operateType } = this.addForm;
      if (!cityCodeList.length || !operateType.length) return;
      let p = {
        cityCodeList: cityCodeList,
        operationTypeList: operateType,
      };
      if (cityCodeList.includes(-1)) {
        delete p.cityCodeList;
      }
      const [err, data] = await this.toResult(cityNewQueryAgentListService(p));
      this.agentList = data || [];
      // this.$forceUpdate();
    },
    cityChange(v) {
      if(!this.allowChange) return
      const len = v.length;
      if (!len) return;
      if (v[len - 1] - -1 === 0) {
        this.addForm.cityCodeList = [-1];
      } else {
        let index = v.findIndex((it) => it - -1 === 0);
        if (index > -1) {
          this.addForm.cityCodeList.splice(index, 1);
        }
      }
      this.getAgentList();
    },
    operateTypeChange() {
      if(!this.allowChange) return
      this.getAgentList();
    },
    indicatorChange(v) {
      if (!v) return;
      let f = this.indicatorList.find((it) => it.value === v);
      this.addForm.remark = f?.remark || '';
    },
    selectOpenChange(v) {
      this.allowChange = v
    }
  },
};
</script>

<style scoped lang="less">
/deep/ textarea.ivu-input {
  height: 140px;
  resize: none;
}
/deep/ .textarea-con .ivu-input {
  height: 180px;
  resize: none;
}
.textarea-con {
  width: 310px;
  padding-right: 12px;
}
.sym {
  margin: 0 10px;
}
.row-c {
  margin-bottom: 8px;
}
.a-l {
  margin: 0 6px 10px;
}
.item-width {
  width: 300px;
}
</style>
