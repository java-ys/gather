<template>
  <div>
    <Modal
      v-model="visible"
      title="城市考核模板"
      width="800"
      :mask-closable="false"
      :closable="false"
    >
      <Form ref="form" :model="detail" :label-width="150">
        <FormItem label="考核月份：">
          <span>{{ detail.assessTime | assessTimeF }}</span>
        </FormItem>
        <FormItem label="城市：">
          <span>{{ detail.cityVoList | cityFilter }}</span>
          <Row>
            <Col
              span="6"
              :key="index"
              v-for="(item, index) in detail.agentInfoCheckVoList.filter(
                (it) => it.checked
              )"
              ><Icon
                type="md-checkbox"
                style="font-size: 16px; margin-right: 4px"
              />{{ item.agentName }}</Col
            >
          </Row>
        </FormItem>
        <FormItem label="运营模式：">
          <span>{{ detail.operateTypeDesc }}</span>
        </FormItem>
        <FormItem label="产品线：">
          <span>{{ detail.businessTypeDesc }}</span>
        </FormItem>
        <FormItem label="审批流程：">
          <span>{{ ["推送城市", "推送运营商"][+detail.pushDimension] }}</span>
        </FormItem>
        <Divider />
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
          <div v-if="strategyType - 0 === 0">
            <Row>
              <FormItem label="分佣周期：" prop="">
                <RadioGroup
                  v-model="detail.cityAssessBasicCommissionVo.commissionCycle"
                  disalbed
                >
                  <Radio :label="1" disabled>月度</Radio>
                </RadioGroup>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="分佣维度：" prop="">
                <RadioGroup
                  v-model="
                    detail.cityAssessBasicCommissionVo.commissionDimension
                  "
                  disalbed
                >
                  <Radio :label="1" disabled>流水</Radio>
                </RadioGroup>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="统计维度：" prop="statisticsDimension">
                <RadioGroup
                  v-model="
                    detail.cityAssessBasicCommissionVo.statisticsDimension
                  "
                  disalbed
                >
                  <Radio :label="1" disabled>司机</Radio>
                  <Radio :label="2" disabled>运营商</Radio>
                </RadioGroup>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="分佣比例：" prop="">
                <RadioGroup
                  v-model="detail.cityAssessBasicCommissionVo.calMode"
                  disalbed
                >
                  <Radio :label="1" disabled>阶梯</Radio>
                  <Radio :label="2" disabled>非阶梯</Radio>
                  <Radio
                    :label="3"
                    disabled
                    v-if="
                      cityAssessBasicCommissionVo.statisticsDimension - 2 === 0
                    "
                    >浮动比例</Radio
                  >
                </RadioGroup>
              </FormItem>
            </Row>
            <FormItem
              label="考核标准:"
              prop=""
              v-if="cityAssessBasicCommissionVo.calMode - 3 !== 0"
            >
              <Row>
                <Col span="12">标准:</Col>
                <Col span="12">比例</Col>
              </Row>
              <Row v-if="cityAssessBasicCommissionVo.standard">
                <Col span="24">
                  <RadioGroup
                    v-model="cityAssessBasicCommissionVo.standard.way"
                    type="button"
                    disalbed
                  >
                    <Radio :label="0" disabled>百分比</Radio>
                    <Radio :label="1" disabled>数值</Radio>
                  </RadioGroup>
                </Col>
              </Row>
              <Row
                class-name="row-c"
                :key="index"
                v-for="(item, index) in cityAssessBasicCommissionVo.standard
                  .definition"
              >
                <Col span="12">
                  <span v-if="item.min !== ''">{{ item.min }}</span>
                  <span
                    v-if="
                      cityAssessBasicCommissionVo.standard.way - 1 !== 0 &&
                      item.min !== ''
                    "
                    >%</span
                  >
                  <span v-if="item.min !== ''">{{
                    item.minSign | singFmt
                  }}</span>
                  <span class="sym">X</span>
                  <span v-if="item.max !== ''">{{
                    item.maxSign | singFmt
                  }}</span>
                  <span v-if="item.max !== ''">{{ item.max }}</span>
                  <span
                    v-if="
                      cityAssessBasicCommissionVo.standard.way - 1 !== 0 &&
                      item.max !== ''
                    "
                    >%</span
                  >
                </Col>
                <Col span="12">
                  <Button :type="!item.isIndex ? 'primary' : 'default'"
                    >数值</Button
                  >
                  <Button :type="!!item.isIndex ? 'primary' : 'default'"
                    >指标</Button
                  >
                  <span>{{
                    !!item.isIndex ? item.subIndex.name : item.coefficient
                  }}</span>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="考核指标:"></FormItem>
            <Tabs :animated="false">
              <TabPane
                v-for="(it, key) in cityAssessIndexVoList"
                :key="key"
                class="opt-content"
                :label="it.name"
              >
                <indicator-detail :cData="handleRule(it)"></indicator-detail>
              </TabPane>
            </Tabs>
          </div>
          <div
            v-if="strategyType - 1 === 0"
            :key="index"
            class="opt-content"
            v-for="(
                  item, index
                ) in cityAssessBasicCommissionVo.cityAssessBasicDeductionVoList"
          >
            <deduct-detail :cData="handleRule(item)"></deduct-detail>
          </div>
          <div v-if="strategyType - 2 === 0">
            <CheckboxGroup v-model="checkAllGroup">
            <div
              :key="index"
              v-for="(item, index) in cityAssessAssistCommissionVoList"
            >
              <Checkbox
                :label="item.assistIndexUuid"
                class="check-box"
                disabled
              >{{ item.assistIndexName }}</Checkbox
              >
              <Row>
                <FormItem label="奖励周期：">
                  <RadioGroup v-model="item.commissionCycle">
                    <Radio :label="1" disabled>月度</Radio>
                  </RadioGroup>
                </FormItem>
              </Row>
              <Row>
                <FormItem label="奖励维度：">
                  <RadioGroup v-model="item.commissionDimension">
                    <Radio :label="1" disabled>流水</Radio>
                  </RadioGroup>
                </FormItem>
              </Row>
              <Row>
                <FormItem label="统计维度：">
                  <RadioGroup v-model="item.statisticsDimension">
                    <Radio :label="1" disabled>全国</Radio>
                    <Radio :label="2" disabled>城市</Radio>
                  </RadioGroup>
                </FormItem>
              </Row>
              <Row>
                <FormItem label="奖励比例：">
                  <RadioGroup v-model="item.calMode">
                    <Radio :label="1" disabled>阶梯</Radio>
                    <Radio :label="2" disabled>非阶梯</Radio>
                    <Radio :label="4" disabled>不限区间</Radio>
                  </RadioGroup>
                </FormItem>
              </Row>
              <FormItem
                label="考核标准:"
                prop=""
                v-if="item.calMode - 4 !== 0"
              >
                <Row>
                  <Col span="12">标准:</Col>
                  <Col span="12">比例</Col>
                </Row>
                <Row v-if="item.standard">
                  <Col span="24">
                    <RadioGroup
                      v-model="item.standard.way"
                      type="button"
                      disalbed
                    >
                      <Radio :label="0" disabled>百分比</Radio>
                      <Radio :label="1" disabled>数值</Radio>
                    </RadioGroup>
                  </Col>
                </Row>
              <Row
                class-name="row-c"
                :key="index"
                v-for="(itm, index) in item.standard.definition"
              >
                <Col span="12">
                  <span v-if="itm.min !== ''">{{ itm.min }}</span>
                  <span v-if="item.standard.way - 1 !== 0 && itm.min !== ''"
                    >%</span
                  >
                  <span v-if="itm.min !== ''">{{ itm.minSign | singFmt }}</span>
                  <span class="sym">X</span>
                  <span v-if="itm.max !== ''">{{ itm.maxSign | singFmt }}</span>
                  <span v-if="itm.max !== ''">{{ itm.max }}</span>
                  <span v-if="item.standard.way - 1 !== 0 && itm.max !== ''"
                    >%</span
                  >
                </Col>
                <Col span="12">
                  <Button :type="!itm.isIndex ? 'primary' : 'default'"
                    >数值</Button
                  >
                  <Button :type="!!itm.isIndex ? 'primary' : 'default'"
                    >指标</Button
                  >
                  <span>{{
                    !!itm.isIndex ? itm.subIndex.name : itm.coefficient
                  }}</span>
                </Col>
              </Row>
              </FormItem>
              <FormItem label=" " v-if="item.calMode - 4 === 0">
                <Row>
                  <Col span="12">区间:</Col>
                  <Col span="12">系数</Col>
                </Row>
                <Row>
                  <Col span="12">不限区间</Col>
                  <Col span="12">{{ item.standard.coefficient }} </Col>
                </Row>
              </FormItem>
              <Row>
                <FormItem label="奖励指标："> </FormItem>
                <div v-if="item.cityAssessAssistReissueVoList && item.cityAssessAssistReissueVoList.length">
                  <div
                    :key="key"
                    v-for="(it, key) in item.cityAssessAssistReissueVoList"
                    class="opt-content"
                  >
                    <indicator-detail :cData="handleRule(it)"></indicator-detail>
                  </div>
                </div>
              </Row>
            </div>
            </CheckboxGroup>
          </div>
        </div>

      </Form>
      <div slot="footer">
        <Button type="primary" ghost @click="cancel">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { freeze, isStr } from "@/mixins/base";
import IndicatorDeduct from "../../components/indicator-deduct";
import DeductDetail from "../sub/deduct-detail";
import IndicatorDetail from "../sub/indicator-detail";

export default {
  name: "city-detail",
  components: {
    IndicatorDeduct,
    DeductDetail,
    IndicatorDetail,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detailData: {
      type: Object,
      default: function () {
        return {
          cityAssessBasicCommissionVo: {
            // 主策略
            standard: JSON.stringify({
              way: "",
            }),
            cityAssessBasicDeductionVoList: [],
          },
          cityAssessAssistCommissionVoList: [], // 辅策略
          cityAssessIndexVoList: [], // 考核指标
        };
      },
    },
  },
  filters: {
    cityFilter(v) {
      return v?.map((it) => it.city).join(", ");
    },
    singFmt(val) {
      return val === "<=" ? "≤" : val === ">=" ? "≥" : val;
    },
    assessTimeF(v) {
      return `${v}`.replace(/(\d{4})(\d{2})/gi, "$1-$2");
    },
  },
  computed: {
    cityAssessIndexVoList({ detailData }) {
      return detailData.cityAssessIndexVoList;
    },
    cityAssessBasicCommissionVo({ detailData }) {
      let p = { ...detailData.cityAssessBasicCommissionVo };
      p.cityAssessBasicDeductionVoList = p.cityAssessBasicDeductionVoList.map(
        (it) => {
          try {
            it.indexRuleJson = JSON.parse(it.indexRuleJson);
          } catch {
            it.indexRuleJson = {};
          }
          return it;
        }
      );
      return p;
    },
    cityAssessAssistCommissionVoList({ detailData }) {
      return (
        detailData?.cityAssessAssistCommissionVoList?.map((item) => {
          item?.cityAssessAssistReissueVoList?.forEach((it) => {
            try {
              it.indexRuleJson = JSON.parse(it.indexRuleJson);
            } catch {
              it.indexRuleJson = {};
            }
          });
          item.standard = isStr(item.standard)
            ? JSON.parse(item.standard)
            : item.standard;
          return item;
        }) || []
      );
    },
  },
  data() {
    let { cityAssessBasicCommissionVo, cityAssessAssistCommissionVoList } = this.detailData;
    if (cityAssessBasicCommissionVo?.standard) {
      this.detailData.cityAssessBasicCommissionVo.standard = isStr(
        cityAssessBasicCommissionVo.standard
      )
        ? JSON.parse(cityAssessBasicCommissionVo.standard)
        : cityAssessBasicCommissionVo.standard;
    }
    return {
      detail: { ...this.detailData },
      strategyList: freeze(["主策略", "扣减项", "辅策略"]),
      strategyType: "0",
      checkAllGroup: cityAssessAssistCommissionVoList?.map(it => it.assistIndexUuid) || []
    };
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    strategyTypeChange(v) {
      this.strategyType = v;
    },
    handleRule(item) {
      if(item.parentFlag - 1 ===0) {
        item._subIndex = 0
      }
      return item
    }
  },
};
</script>

<style scoped lang="less">
.sym {
  margin: 0 10px;
}
.row-c {
  margin-bottom: 8px;
}

.opt-content {
  background-color: rgba(238, 238, 238, 0.3);
  position: relative;
  padding-bottom: 12px;
  margin: 0 40px;
}
.remark-con {
  width: 100%;
  min-height: 100px;
  border-radius: 4px;
  border: 1px solid #ececec;
  padding: 2px 10px;
}
.sub-con {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.sub-item {
  padding: 6px 10px;
  cursor: pointer;
  line-height: 22px;
  max-height: 90px;
  margin-right: 12px;
  margin-bottom: 12px;
  display: inline-block;
  background: #fff;
  width: 220px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  &.active {
    background-color: #2d8cf0;
    color: #fff;
  }
}

.but-c {
  margin-right: 12px;
}
.b-con {
  margin-left: 60px;
  margin-bottom: 10px;
}
.check-box {
  font-size: 16px;
  font-weight: bold;
  margin-left: 60px;
}
</style>
