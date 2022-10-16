<template>
  <div>
    <Modal
      v-model="visible"
      :title="title"
      width="900"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="_form"
        :model="addForm"
        :label-width="150"
        :rules="validateRules"
      >
        <FormItem label="模板标题：" prop="title">
          <Input
            v-model="addForm.title"
            class="item-width"
            :maxlength="15"
            placeholder="请输入指标名称"
          ></Input>
        </FormItem>
        <Row>
          <FormItem label="考核月份：" prop="assessTime">
            <DatePicker
              v-model="addForm.assessTime"
              type="month"
              class="item-width"
              multiple
              placeholder="请选择月份"
              format="yyyy-MM"
              :editable="false"
            >
            </DatePicker>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="城市：" prop="cityUuidList">
            <Select
              v-model="addForm.cityUuidList"
              class="input-width item-width"
              filterable
              multiple
              @on-change="cityChange"
            >
              <Option value="-1">不限</Option>
              <Option
                v-for="(item, index) in cityList"
                :value="item.cityID + '-' + item.cityUuid"
                :key="index"
                >{{ item.city }}</Option
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
              @on-change="operateTypeChange"
            >
              <Option value="-1">不限</Option>
              <Option
                v-for="(item, index) in operateTypeEnum"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row v-if="agentList.length">
          <FormItem label="运营商：" prop="agentUuidList">
            <Select
              v-model="addForm.agentUuidList"
              placeholder="请选择"
              class="item-width"
              multiple
              filterable
              @on-change="agentChange"
            >
              <Option value="-1">不限</Option>
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
              placeholder="请选择"
              class="item-width"
              multiple
              @on-change="businessTypeChange"
            >
              <Option value="-1">不限</Option>
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
          <FormItem label="审批流程：" prop="pushDimension">
            <RadioGroup v-model="addForm.pushDimension">
              <Radio :label="1">推送运营商</Radio>
              <Radio :label="0">推送城市</Radio>
            </RadioGroup>
          </FormItem>
        </Row>
        <Row>
          <span class="regula-ico">*</span>
          <FormItem label="管理条例：" prop="">
            <Button @click="selectRegulation">请选择管理条例</Button>
            <span class="reg-text">{{ regulationSelect.title }}</span>
          </FormItem>
        </Row>
        <Divider />
        <!--        主/辅策略-->
        <div>
          <div class="b-con">
            <Button
              class="but-c"
              :key="index"
              v-for="(item, index) in strategyList"
              :type="strategyType - index === 0 ? 'primary' : 'default'"
              @click="strategyTypeChange(index)"
              >{{ item }}</Button
            >
          </div>
          <div>
            <div v-show="isMainStrategy(strategyType)">
              <commission
                :cData="detail.cityAssessBasicCommissionVo || undefined"
                ref="_commission_main"
              ></commission>
              <!--              考核指标-->
              <div>
                <Row>
                  <FormItem label="考核指标：" prop="">
                    <Row type="flex" justify="space-between">
                      <Button @click="selectIndicator" type="info"
                        >添加考核指标</Button
                      >
                      <span v-if="optionList.length" class="all-s"
                        >指标考核总占比: {{ allProportion }} %</span
                      >
                    </Row>
                  </FormItem>
                </Row>
              </div>
              <!--      已选择的指标列表-->
              <Tabs :animated="false" :value="currentOption" @on-click="setOptionTab">
                <TabPane
                  v-for="(it, key) in optionList"
                  :key="it.indexUuid"
                  class="opt-content"
                  :label="it.name"
                  :name="it.name"
                >
                  <div class="delete">
                    <span
                      v-if="!it.groupIndexUuid"
                      @click="addShareIndicator(key)"
                      class="share-but"
                    >添加共享考核指标</span>
                    <span @click="deleteIndicator(key)">删除</span>
                  </div>
                  <div :class="!it.groupIndexUuid ? 'con-c' : ''">
                    <indicator-com
                      ref="_indicator_"
                      :cData="it"
                      @proportion-change="proportionChange"
                    ></indicator-com>
                  </div>
                </TabPane>
              </Tabs>
            </div>
            <!--            辅策略-->
            <div v-show="isDeputyStrategy(strategyType)">
              <deputy-com
                ref="_deputy_com"
                :list="detail.cityAssessAssistCommissionVoList || undefined"
              ></deputy-com>
            </div>

            <div v-show="isDeduct(strategyType)">
              <!--        扣减指标-->
              <div>
                <Row>
                  <FormItem label="扣减事项：" prop="">
                    <Row type="flex" justify="space-between">
                      <Button @click="selectDeductIndicator" type="error"
                      >添加扣减</Button
                      >
                    </Row>
                  </FormItem>
                </Row>
                <div
                  :key="it.uuid || it.indexUuid"
                  v-for="(it, key) in deductionList"
                  class="opt-content"
                >
                  <div class="delete" style="top: 2px">
                    <span @click="deleteDeductIndicator(key)">删除</span>
                  </div>
                  <indicator-deduct
                    :ref="'_indicator_deduct_' + (it.uuid || it.indexUuid)"
                    :cData="it"
                  ></indicator-deduct>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>

      <div slot="footer">
        <Button type="primary" :loading="submitLoading" @click="save">
          <span>保存</span>
        </Button>
        <Button type="primary" :loading="submitLoading" @click="saveAndCommit">
          <span>保存并生成运营考核模板</span>
        </Button>
        <Button type="primary" ghost @click="(e) => cancel()">取消</Button>
      </div>
    </Modal>
    <!--    条例-->
    <regulation
      v-if="regulationShow"
      :visible="regulationShow"
      @close="regulationClose"
    ></regulation>
    <!--    考核指标-->
    <indicator
      v-if="indicatorShow"
      :visible="indicatorShow"
      :extra-params="indicatorParams"
      @close="indicatorClose"
    ></indicator>
    <!--    共享指标-->
    <indicator-single
      v-if="indicatorSingleShow"
      :visible="indicatorSingleShow"
      :editable="false"
      :extra-params="indicatorSingleParams"
      @close="indicatorSingleClose"
    ></indicator-single>
  </div>
</template>

<script>
import { freeze } from "@/mixins/base";
import {
  cityCopyService,
  cityNewQueryAgentListService,
  citySaveService,
  citySubmitAndCommitService,
  cityUpdateService,
} from "_o/api/city-check";
import { tool } from "_o/api/baseMixin.js";
import { operateList } from "../../tool/config";
import { productLineEnum, operateTypeEnum, tacticsEnum } from "@/config";
import { formAddRule } from "../fields";
import Regulation from "./regulation";
import Indicator from "./indicator";
import IndicatorSingle from "./indicator-single";
import Commission from "../../components/commission";
import IndicatorCom from "../../components/indicator"; // 指标
import IndicatorDeduct from "../../components/indicator-deduct"; // 扣减事项
import DeputyCom from "./deputy.vue"; // 辅策略
import ModalMixin from "@/mixins/modal";
import baseMixin from "../mixin/base";
import ShareMixin from "../mixin/share";
import DeputyMixin from "../mixin/deputy.js";
import DeductMixin from "../mixin/select-deduct";
import indicatorMixin from "../mixin/select-indicator";
import paramsMixin from "../mixin/params";

/*
indexRuleJson:
非父指标是个 对象 {
  definition: [standard...],
  way: 0
}
父指标是个 数组
[
  {
    childIndexId: "",
    childIndexName: "",
    indexRule: {
      definition: [standard...],
      way: 0
    }
]

 cityAssessAssistCommissionVoList, // 辅策略
    -cityAssessAssistReissueVoList 辅策略的奖励指标
  cityAssessBasicCommissionVo // 主策略
    -cityAssessBasicDeductionVoList 主策略的扣减指标
  cityAssessIndexVoList 考核指标
*/
const NO_LIMIT_VALUE = -1; //  不限的枚举值

export default {
  name: "city-model-add",
  components: {
    Regulation,
    Indicator,
    Commission,
    IndicatorCom,
    IndicatorDeduct, // 扣减事项
    IndicatorSingle,
    DeputyCom,
  },
  mixins: [
    tool,
    ModalMixin,
    baseMixin,
    ShareMixin,
    DeputyMixin,
    DeductMixin,
    indicatorMixin,
    paramsMixin,
  ],
  inject: ["getCityList"],
  computed: {
    cityList() {
      return this.getCityList();
    },
  },
  data() {
    return {
      deputyModel: [],
      checkAllGroup: [],
      indicatorParams: {
        classify: "", // 6 扣减指标 入参
      },
      allProportion: 0, // 考核指标总占比
      submitLoading: false,
      addForm: {
        id: "", // 城市考核模板id ,
        businessType: [], // 产品线
        pushDimension: "", // 审批流程
        title: "", // 模板标题
        assessTime: [], // 考核月份
        agentUuidList: [], // 运营商uuid
        cityUuidList: [], // 城市uuid  3位短码
        operateType: [], // 运营模式
        regulationUuid: "", // 管理条例uuid
        cityAssessIndexDTOList: [], // 指标列表
      },
      agentList: [], // 运营商列表
      indicatorList: [], // 已选择的考核指标
      regulationSelect: {}, // 已选择的管理条例

      regulationShow: false,
      indicatorShow: false,
      validateRules: formAddRule,
      operateList,
      productLineEnum,
      operateTypeEnum,
      tacticsEnum,
      title: "新建考核标准",

      strategyType: "0",
      strategyList: freeze(["主策略", "扣减项", "辅策略"]),
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      if (!this.detail.id) return;
      this.title = this.detail._type ? "复制考核标准" : "编辑考核标准";

      let {
        cityAssessIndexVoList,
        regulationName,
        agentInfoCheckVoList,
        cityAssessBasicCommissionVo,
        cityAssessAssistCommissionVoList = [],
      } = this.detail;
      this.setAddForm();

      this.regulationSelect.title = regulationName;
      this.optionList = cityAssessIndexVoList;
      this.agentList = agentInfoCheckVoList;
      if (cityAssessAssistCommissionVoList?.length) {
        cityAssessAssistCommissionVoList.forEach((item) => {
          if (item?.cityAssessAssistReissueVoList?.length) {
            item.cityAssessAssistReissueVoList.forEach((it) => {
              it.id = it.indexUuid
              it.name = it.indexName
              if (it.parentFlag == 1) {
                it._subIndex = 0
              }
              try {
                it.indexRuleJson = JSON.parse(it.indexRuleJson);
              } catch {
                it.indexRuleJson = {};
              }
            });
          }
        });
      }
      this.deductionList =
        cityAssessBasicCommissionVo?.cityAssessBasicDeductionVoList?.map(
          (it) => {
            it.id = it.indexUuid
            it.name = it.indexName
            try {
              it.indexRuleJson = JSON.parse(it.indexRuleJson);
            } catch {
              it.indexRuleJson = {};
            }
            if(it.parentFlag - 1 === 0) {
              it._subIndex = 0
            }
            return it;
          }
        ) || [];
      // iview bug: select 多选  赋值 v-model 会触发 on-change事件
      // this.getAgentList();
      this.getAllProportion();
    },
    async save() {
      const valid = await this.$refs._form.validate();
      console.log(valid, "valid");
      if (!valid) return;
      let mainCommissionParams = {} // 主策略
      if (this.$refs._commission_main) {
        const [commissionValid, mainCommission] = await this.$refs._commission_main.valid();
        console.log(commissionValid, "mainValid");
        if (!commissionValid) return;
        mainCommissionParams = {...mainCommission}
          if(mainCommissionParams.basicCommissionDTO) {
            mainCommissionParams.basicCommissionDTO.basicDeductionDTOList = this.getDeductParams() // 扣减指标
          }
      }
      let assistCommissionParams = {} // 辅策略
      const [assistValid, assistList] = await this.getAssistParams();
      console.log(assistValid, "assistValid");
      if (!assistValid) return;
      assistCommissionParams.assistCommissionDTOList = assistList
      let p = await this.getCommitParams();
       p = {...p, ...mainCommissionParams, ...assistCommissionParams}
      // console.log(p);
      // console.log(p.assistCommissionDTOList);
      // return; // todo
      // fix 去除城市,没有去除已选中的运营商
      let arF = [];
      p.agentUuidList?.forEach((agentUuid) => {
        if (
          this.agentList.find(
            (it) =>
              it.agentUuid === agentUuid || agentUuid - NO_LIMIT_VALUE === 0
          )
        ) {
          arF.push(agentUuid);
        }
      });
      p.agentUuidList = arF;
      if (!this.validForm(p)) {
        return;
      }

      let msg = "新建成功";
      let func = citySaveService;

      if (this.detail._type) {
        func = cityCopyService;
        msg = "复制成功";
        p.id = this.detail.id;
      } else if (this.detail.id) {
        msg = "更新成功";
        func = cityUpdateService;
        p.id = this.detail.id;
      } else {
        delete p.id;
      }

      const [err, data] = await this.toResult(func(p));
      if (err) {
        return;
      }
      this.$Message.success(msg);
      this.$emit("close", true);
    },
    async saveAndCommit() {
      const valid = await this.$refs._form.validate();
      if (!valid) return;
      let mainCommissionParams = {} // 主策略
      if (this.$refs._commission_main) {
        const [commissionValid, mainCommission] = await this.$refs._commission_main.valid();
        if (!commissionValid) return;
        mainCommissionParams = {...mainCommission}
        if(mainCommissionParams.basicCommissionDTO) {
          mainCommissionParams.basicCommissionDTO.basicDeductionDTOList = this.getDeductParams() // 扣减指标
        }
      }
      let assistCommissionParams = {} // 辅策略
      const [assistValid, assistList] = await this.getAssistParams();
      // console.log(assistValid, "assistValid");
      if (!assistValid) return;
      assistCommissionParams.assistCommissionDTOList = assistList;

      let p = await this.getCommitParams();
      p = {...p, ...mainCommissionParams, ...assistCommissionParams}

      // fix 去除城市,没有去除已选中的运营商
      let arF = [];
      p.agentUuidList?.forEach((agentUuid) => {
        if (
          this.agentList.find(
            (it) =>
              it.agentUuid === agentUuid || agentUuid - NO_LIMIT_VALUE === 0
          )
        ) {
          arF.push(agentUuid);
        }
      });
      p.agentUuidList = arF;

      if (!this.validForm(p)) {
        return;
      }

      if (this.detail.id) {
        p.id = this.detail.id;
      } else {
        delete p.id;
      }
      if (this.detail._type) {
        //  复制生产运营考核模板 不传id
        delete p.id;
      }
      const [err, data] = await this.toResult(citySubmitAndCommitService(p));
      if (err) {
        return;
      }
      this.$Message.success("生成考核模板成功");
      this.$emit("close", true);
    },
    validForm(p) {
      let msg = "";
      if (!p.regulationUuid) {
        msg = "请选择管理条例";
      }
      let ps = p.cityAssessIndexDTOList;
      if (ps) {
        let ar = ps.map((it) => it.proportion);
        if (!ar.every((it) => !!it)) {
          msg = "考核指标占比不得为空";
        }
      }
      if (msg) {
        this.$Message.error(msg);
        return;
      }
      return true;
    },
    cancel() {
      this.$Modal.confirm({
        title: `是否确认取消${this.title}？`,
        onOk: () => {
          this.$emit("close");
        },
      });
    },
    cityChange(v) {
      let len = v.length;
      if (!len) {
        this.agentList = [];
        return;
      }
      if (v[len - 1] - NO_LIMIT_VALUE === 0) {
        this.addForm.cityUuidList = ["-1"];
      } else {
        let index = v.findIndex((it) => it - NO_LIMIT_VALUE === 0);
        if (index > -1) {
          this.addForm.cityUuidList.splice(index, 1);
        }
      }

      if (this.addForm.operateType?.length) {
        this.getAgentList();
      }
    },
    agentChange(v) {
      let len = v.length;
      if (!len) return;
      if (v[len - 1] - NO_LIMIT_VALUE === 0) {
        this.addForm.agentUuidList = ["-1"];
      } else {
        let index = v.findIndex((it) => it - NO_LIMIT_VALUE === 0);
        if (index > -1) {
          this.addForm.agentUuidList.splice(index, 1);
        }
      }
    },
    operateTypeChange(v) {
      let len = v.length;
      if (v[len - 1] - NO_LIMIT_VALUE === 0) {
        this.addForm.operateType = ["-1"];
      } else {
        let index = v.findIndex((it) => it - NO_LIMIT_VALUE === 0);
        if (index > -1) {
          this.addForm.operateType.splice(index, 1);
        }
      }
      if (
        this.addForm.cityUuidList.length &&
        this.addForm.operateType?.length
      ) {
        this.getAgentList();
      }
    },
    indicatorClose(list) {
      this.indicatorShow = false;
      if (!list.length) return;
      let selected = list.map((it) => this.adjustIndicator(it));
      let isDeduct = this.indicatorParams.classify - 6 === 0;
      if (isDeduct) {
        this.setDeductionList(selected);
      } else {
        this.setOptionList(selected);
      }
    },
    selectRegulation() {
      this.regulationShow = true;
    },
    regulationClose(d) {
      this.regulationShow = false;
      this.regulationSelect = d;
      this.addForm.regulationUuid = d.uuid;
    },
    async getAgentList() {
      const { cityUuidList, operateType } = this.addForm;
      let p = {};
      if (!operateType.some((it) => it - NO_LIMIT_VALUE === 0)) {
        p.operateTypeList = operateType;
      }
      if (!cityUuidList.includes("-1")) {
        p.cityCodeList = cityUuidList.map((it) => {
          let [code] = it.split("-");
          return code;
        });
      }
      // 包含 不限 -1 的时候 不入参
      const [err, data] = await this.toResult(cityNewQueryAgentListService(p));
      this.agentList = data || [];
      this.$forceUpdate();
    },
    businessTypeChange(v) {
      let len = v.length;
      if (len) {
        if (v[len - 1] - NO_LIMIT_VALUE === 0) {
          this.addForm.businessType = ["-1"];
        } else {
          let index = v.findIndex((it) => it - NO_LIMIT_VALUE === 0);
          if (index > -1) {
            this.addForm.businessType.splice(index, 1);
          }
        }
      }
    },
    proportionChange() {
      let sum = 0;
      let refs = this.getIndicatorRef();
      if (refs?.length) {
        refs.forEach((rf) => {
          const { proportion } = rf.getData().it;
          if (+proportion > 0) {
            sum += +proportion;
          }
        });
        this.allProportion = sum;
      }
    },
    getAllProportion() {
      let sum = 0;
      this.optionList.forEach((op) => {
        let n = +op.proportion;
        if (n > 0) {
          sum += n;
        }
      });
      this.allProportion = sum;
    },
    strategyTypeChange(v) {
      this.strategyType = v;
      if (v - 1 === 0) {
        this.getDeputyList();
      }
    },
    // json字符串转json
    adjustIndicator(it) {
      let isParent = it.parentFlag - 1 === 0; // 是父指标
      let rule = {};
      try {
        rule = JSON.parse(it.standard);
      } catch {
        rule = isParent ? [] : {};
      }
      let r = {
        ...it,
        name: it.name,
        remark: it.remark,
        proportion: "",
        indexUuid: it.uuid,
        indexRuleJson: isParent ? [].concat(rule) : { ...rule },
      };

      if (isParent) {
        r.parentFlag = it.parentFlag;
        r._subIndex = 0;
      }
      return r;
    },
    setAddForm() {
      let {
        id,
        title,
        assessTime,
        regulationUuid,
        cityVoList,
        operateType,
        agentInfoCheckVoList,
        businessType,
        pushDimension,
      } = this.detail;

      this.addForm.id = id;
      this.addForm.title = title;
      this.addForm.assessTime = assessTime.split(",");

      this.addForm.cityUuidList =
        cityVoList.map((it) => {
          if (it.cityID > NO_LIMIT_VALUE) {
            return it.cityID + "-" + it.uuid;
          }
          return `${it.cityID}`;
        }) || [];
      this.addForm.operateType = operateType.split(",") || [];
      this.addForm.agentUuidList = agentInfoCheckVoList
        .filter((it) => it.checked)
        .map((it) => it.agentUuid); // 运营商uuid
      this.addForm.businessType = businessType?.split(",") || [];
      this.addForm.pushDimension = pushDimension;
      this.addForm.regulationUuid = regulationUuid;
    },
  },
};
</script>

<style scoped lang="less">
@import "./add.less";
</style>
