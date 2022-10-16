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
        :model="formData"
        :label-width="100"
        :rules="validateRules"
      >
        <!-- 基础信息 -->
        <div class="rela">
          <div class="base_mask"></div>
          <Row>
            <FormItem label="考核月份：" prop="assessTime">
              <DatePicker
                v-model="formData.assessTime"
                type="month"
                class="item-width"
                placeholder="请选择月份"
                format="yyyy-MM"
                multiple
                :editable="false"
                :disalbed="isCityConfirm || isHeadConfim || disabled"
              >
              </DatePicker>
            </FormItem>
          </Row>

          <Row>
            <span
              style="
                position: absolute;
                top: 10px;
                left: 80px;
                color: #ed4014;
                line-height: 1;
                font-size: 12px;
                font-family: SimSun;
                display: inline-block;
              "
            >*</span>

            <FormItem label="运营商：" prop="">
              <Select
                v-model="agent"
                class="input-width item-width"
                filterable
                multiple
                label-in-value
                :disalbed="isCityConfirm || isHeadConfim || disabled"
              >
                <Option
                  v-for="(item, index) in agentList"
                  :key="index"
                  :value="item.agentUuid"
                >{{item.agentName}}
                </Option>
              </Select>
            </FormItem>
          </Row>
          <FormItem label="运营模式：" prop="">
            <Select
              v-model="formData.operateType"
              placeholder="请选择"
              class="item-width"
              multiple
              :disabled="disabled"
            >
              <Option value="-1">不限</Option>
              <Option
                v-for="(item, index) in operateTypeEnum"
                :key="index"
                :value="item.value"
              >{{item.label}}
              </Option>
            </Select>
          </FormItem>
          <Row>
            <FormItem label="产品线：" prop="businessType">
              <Select
                v-model="formData.businessType"
                placeholder="请选择"
                class="item-width"
                multiple
                @on-change="businessTypeChange"
              >
                <Option value="-1">不限</Option>
                <Option
                  v-for="(item, index) in productLineEnum"
                  :key="index"
                  :value="item.value"
                >{{item.label}}
                </Option>
              </Select>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="审批流程：" prop="pushDimension">
              <RadioGroup v-model="formData.pushDimension">
                <Radio :label="1">推送运营商</Radio>
                <Radio :label="0">推送城市</Radio>
              </RadioGroup>
            </FormItem>
          </Row>
        </div>
        <Row>
          <span
            style="
              position: absolute;
              top: 10px;
              left: 68px;
              color: #ed4014;
              line-height: 1;
              font-size: 12px;
              font-family: SimSun;
              display: inline-block;
            "
          >*</span>
          <FormItem label="管理条例：" prop="">
            <div class="rela">
              <div
                v-if="(!(isNotSubmit || isHeadConfim) || isFinish) && !isChange"
                class="base_mask"
              ></div>
              <Row>
                <Button type="primary" @click="selectRegulation">请选择管理条例
                </Button>
                <Upload
                  ref="_uploadFile"
                  style="margin-left: 10px; display: inline-block"
                  :headers="header"
                  :format="format"
                  :on-format-error="formatError"
                  :action="actionUrl"
                  :data="uploadFiles"
                  :show-upload-list="false"
                  :before-upload="(res) => beforeUpload(res)"
                  :on-success="(res) => uploadSuccess(res)"
                  :on-error="(err) => uploadError(err)"
                >
                  <Button type="primary">上传自定义PDF文件</Button>
                  <!-- <Button
                :loading="uploadLoading"
                type="primary"
                :disabled="isDetail"
              >
                <span v-if="!uploadLoading">{{ addData.broadcast.disableBroadcastUrlName ? '重新上传': '上传音频' }}</span>
                <span v-else>上传中...</span></Button> -->
                </Upload>
              </Row>
            </div>
            <!-- :href="regulationSelect.fileUrl" -->

            <span class="reg-text" @click="toFile">{{regulationSelect.title}}</span>
          </FormItem>
        </Row>
        <Divider />
        <div>
          <div class="b-con">
            <Button
              v-for="(item, index) in strategyList"
              :key="index"
              class="but-c"
              :type="strategyType - index === 0 ? 'primary' : 'default'"
              @click="strategyTypeChange(index)"
            >{{item}}
            </Button>
          </div>
          <div>
            <div v-show="isMainStrategy(strategyType)">
              <commission
                ref="_commission_main"
                :cData="detail.agentAssessBasicCommissionVo || undefined"
              ></commission>
              <div>
                <div class="rela">
                  <div
                    v-if="(!(isNotSubmit || isHeadConfim) || isFinish) && !isChange"
                    class="base_mask"
                  ></div>
                  <Row>
                    <FormItem label="考核指标：" prop="">
                      <Button
                        :disabled="disabled"
                        type="info"
                        @click="selectIndicator"
                      >添加考核指标
                      </Button>
                    </FormItem>
                  </Row>
                </div>

                <Tabs :animated="false" :value="currentOption" @on-click="setOptionTab">
                  <TabPane
                    v-for="(it, key) in optionList"
                    :key="key"
                    class="opt-content"
                    :label="it.name"
                    :name="it.name"
                  >
                    <div class="delete">
                      <span @click="deleteIndicator(key)">删除</span>
                    </div>
                    <Form v-model="it.optData" :label-width="100">
                      <FormItem label="考核指标：" prop="">
                        <span>{{it.name}}</span>
                      </FormItem>
                      <!--待城市确认考核占比不能修改 -->
                      <FormItem label="考核占比：" prop="">
                        <Input
                          v-model="it.proportion"
                          style="width: 240px"
                          :maxlength="9"
                          placeholder="请输入考核占比"
                          :disabled="isFinish || (toDone && isCityConfirm)"
                          @on-keyup="toNumber(it.proportion, key)"
                        ></Input>
                        %
                      </FormItem>
                      <!-- 子指标展示 -->
                      <FormItem v-if="it.parentFlag - 1 === 0" label="" prop="">
                        <div class="sub-con">
                          <div
                            v-for="(item, index) in it.indexRuleJson"
                            :key="item.childIndexId"
                            :class="{ active: index - it._subIndex === 0 }"
                            class="sub-item pr"
                            @click="subTargetClick(index, it)"
                          >
                            <Icon
                              v-if="!(isCityConfirm || isFinish)"
                              class="close-ic"
                              type="ios-close"
                              size="16"
                              @click.stop="deleteSubTarget(index, it)"
                            ></Icon>
                            {{item.childIndexName}}
                          </div>
                        </div>
                      </FormItem>
                      <div class="rela">
                        <div
                          v-if="(isCityConfirm || isFinish) && !isChange"
                          class="base_mask"
                        ></div>
                        <FormItem
                          v-if="it.parentFlag - 1 === 0"
                          label="考核规则:"
                          prop=""
                        >
                          <Row>
                            <Col span="16">阶梯标准:</Col>
                            <Col span="8">系数</Col>
                          </Row>
                          <Row>
                            <Col span="24">
                              <RadioGroup
                                v-model="
                                  it.indexRuleJson[+it._subIndex].indexRule.way
                                "
                                type="button"
                              >
                                <Radio v-show="it.indexRuleJson[+it._subIndex].indexRule.way == 0" :label="0">百分比</Radio>
                                <Radio v-show="it.indexRuleJson[+it._subIndex].indexRule.way == 1" :label="1">数值</Radio>
                              </RadioGroup>
                            </Col>
                          </Row>
                          <br />
                          <Row
                            v-for="(item, index) in it.indexRuleJson[
                              +it._subIndex
                            ].indexRule.definition"
                            :key="index"
                            class-name="row-c"
                          >
                            <Col span="14">
                              <Input
                                v-model="item.min"
                                class="rule-width"
                                :maxlength="10"
                                placeholder=""
                                :disabled="disabled"
                                @on-keyup="toNum(item.min, 'min', item)"
                              ></Input>
                              <span
                                v-if="
                                  `${
                                    it.indexRuleJson[+it._subIndex].indexRule.way
                                  }` === '0'
                                "
                              >%</span>
                              <Select
                                v-model="item.minSign"
                                class="rule-width"
                                :disabled="disabled"
                              >
                                <Option key="1" value=">">></Option>
                                <Option key="2" value="<"><</Option>
                                <Option key="3" value="=">=</Option>
                                <Option key="4" value="<="><=</Option>
                                <Option key="5" value=">=">>=</Option>
                              </Select><span class="sym">X</span>
                              <Select
                                v-model="item.maxSign"
                                class="rule-width"
                                :disabled="disabled"
                              >
                                <Option key="1" value=">">></Option>
                                <Option key="2" value="<"><</Option>
                                <Option key="3" value="=">=</Option>
                                <Option key="4" value="<="><=</Option>
                                <Option key="5" value=">=">>=</Option>
                              </Select>
                              <Input
                                v-model="item.max"
                                class="rule-width"
                                :maxlength="10"
                                placeholder=""
                                :disabled="disabled"
                                @on-keyup="toNum(item.max, 'max', item)"
                              ></Input>
                              <span
                                v-if="
                                  `${
                                    it.indexRuleJson[+it._subIndex].indexRule.way
                                  }` === '0'
                                "
                              >%</span>
                            </Col>
                            <Col span="10">
                              <Button
                                :type="item.isIndex ? 'default' : 'primary'"
                                @click="typeChange(0, item)"
                              >数值</Button>
                              <Button
                                :type="item.isIndex ? 'primary' : 'default'"
                                class="gap-1"
                                @click="typeChange(1, item)"
                              >指标</Button>
                              <Input
                                v-if="!item.isIndex"
                                v-model="item.coefficient"
                                style="width: 100px"
                                :maxlength="99"
                                placeholder=""
                                :disabled="disabled"
                              ></Input>
                              <Button
                                v-else
                                style="width: 100px;"
                                @click="selectRowIndicator(item)"
                              >
                                <span style="display: inline-block; width: 80px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{item.subIndex ? item.subIndex.name : "请选择"}}</span>
                              </Button>
                              <Icon
                                v-if="
                                  it.indexRuleJson[+it._subIndex].indexRule
                                    .definition &&
                                    it.indexRuleJson[+it._subIndex].indexRule
                                      .definition.length > 1
                                "
                                class="remove-icon"
                                size="24"
                                type="ios-remove-circle-outline"
                                @click="
                                  removeSubItem(
                                    index,
                                    it.indexRuleJson[+it._subIndex].indexRule
                                      .definition
                                  )
                                "
                              />
                              <Icon
                                class="add-icon"
                                size="24"
                                type="ios-add-circle-outline"
                                @click="
                                  addSubItem(
                                    it.indexRuleJson[+it._subIndex].indexRule
                                      .definition,
                                    key
                                  )
                                "
                              />
                            </Col>
                          </Row>
                        </FormItem>
                        <FormItem v-else label="考核规则:" prop="">
                          <Row>
                            <Col span="16">阶梯标准:</Col>
                            <Col span="8">系数</Col>
                          </Row>
                          <Row>
                            <Col span="24">
                              <RadioGroup
                                v-model="it.indexRuleJson.way"
                                type="button"
                              >
                                <Radio v-show="it.indexRuleJson.way == 0" :label="0">百分比</Radio>
                                <Radio v-show="it.indexRuleJson.way == 1" :label="1">数值</Radio>
                              </RadioGroup>
                            </Col>
                          </Row>
                          <br />
                          <Row
                            v-for="(item, index) in it.indexRuleJson.definition"
                            :key="index"
                            class-name="row-c"
                          >
                            <Col span="14">
                              <Input
                                v-model="item.min"
                                class="rule-width"
                                :maxlength="10"
                                placeholder=""
                                :disabled="disabled"
                                @on-keyup="toNum(item.min, 'min', item)"
                              ></Input>
                              <span v-if="`${it.indexRuleJson.way}` === '0'">%</span>
                              <Select
                                v-model="item.minSign"
                                class="rule-width"
                                :disabled="disabled"
                              >
                                <Option key="1" value=">">></Option>
                                <Option key="2" value="<"><</Option>
                                <Option key="3" value="=">=</Option>
                                <Option key="4" value="<="><=</Option>
                                <Option key="5" value=">=">>=</Option>
                              </Select><span class="sym">X</span>
                              <Select
                                v-model="item.maxSign"
                                class="rule-width"
                                :disabled="disabled"
                              >
                                <Option key="1" value=">">></Option>
                                <Option key="2" value="<"><</Option>
                                <Option key="3" value="=">=</Option>
                                <Option key="4" value="<="><=</Option>
                                <Option key="5" value=">=">>=</Option>
                              </Select>
                              <Input
                                v-model="item.max"
                                class="rule-width"
                                :maxlength="10"
                                placeholder=""
                                :disabled="disabled"
                                @on-keyup="toNum(item.max, 'max', item)"
                              ></Input>
                              <span v-if="`${it.indexRuleJson.way}` === '0'">%</span>
                            </Col>
                            <Col span="10">
                              <Button
                                :type="item.isIndex ? 'default' : 'primary'"
                                @click="typeChange(0, item)"
                              >数值</Button>
                              <Button
                                :type="item.isIndex ? 'primary' : 'default'"
                                class="gap-1"
                                @click="typeChange(1, item)"
                              >指标</Button>
                              <Input
                                v-if="!item.isIndex"
                                v-model="item.coefficient"
                                style="width: 100px"
                                :maxlength="99"
                                placeholder=""
                                :disabled="disabled"
                              ></Input>
                              <Button
                                v-else
                                style="width: 100px;"
                                @click="selectRowIndicator(item)"
                              >
                                <span style="display: inline-block; width: 80px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{item.subIndex ? item.subIndex.name : "请选择"}}</span>
                              </Button>
                              <Icon
                                v-if="
                                  it.indexRuleJson.definition &&
                                    it.indexRuleJson.definition.length > 1
                                "
                                class="remove-icon"
                                size="24"
                                type="ios-remove-circle-outline"
                                @click="removeItem(index, item, key)"
                              />
                              <Icon
                                class="add-icon"
                                size="24"
                                type="ios-add-circle-outline"
                                @click="addItem(index, key)"
                              />
                            </Col>
                          </Row>
                        </FormItem>
                      </div>
                      <FormItem label="考核说明：" prop="remark">
                        <Input
                          v-model="it.remark"
                          type="textarea"
                          :rows="4"
                          :maxlength="500"
                          class="textarea-con"
                          placeholder="请输入"
                          :readonly="disabled || isCityConfirm || isFinish"
                        />
                      </FormItem>
                      <FormItem
                        v-if="it.targetFlag - 1 === 0"
                        label="目标设置："
                        prop=""
                      >
                        <Input
                          v-model="it.assessTarget"
                          style="width: 240px"
                          :maxlength="5"
                          placeholder="请输入目标值"
                        ></Input>
                      </FormItem>
                    </Form>
                  </TabPane>
                </Tabs>



              </div>
            </div>
          </div>
          <!--        扣减指标-->
          <div v-show="isDeduct(strategyType)">
            <Row>
              <FormItem label="扣减事项：" prop="">
                <Row type="flex" justify="space-between">
                  <Button type="error" @click="selectDeductIndicator">添加扣减</Button>
                </Row>
              </FormItem>
            </Row>
            <div
              v-for="(it, key) in deductionList"
              :key="it.uuid || it.indexUuid"
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
          <div v-show="isDeputyStrategy(strategyType)">
            <div>
              <deputy-com
                ref="_deputy_com"
                listKey="agentAssessAssistReissueVoList"
                :list="detail.agentAssessAssistCommissionVoList || undefined"
              ></deputy-com>
            </div>
          </div>
        </div>
      </Form>

      <div v-if="dataProcess.length" class="opi">
        <p class="title">流程处理记录</p>
        <Table border :columns="columnsProcess" :data="dataProcess"></Table>
      </div>
      <div style="height: 40px"></div>
      <div v-if="isNotSubmit || isCityConfirm || isHeadConfim" class="opi">
        <p class="title">处理意见</p>
        <Row v-if="toDone && isHeadConfim" type="flex" style="margin: 20px 0">
          <RadioGroup v-model="idea">
            <Radio label="1">提交到运营商</Radio>
            <Radio label="0">提交到城市</Radio>
          </RadioGroup>
        </Row>
        <!-- <p class="dd">即将流向: {{ detail.flowStatus | statusFilter }}</p> -->
        <Input
          v-model="formData.proposal"
          type="textarea"
          class="desc-con"
          placeholder="请输入处理意见"
          :disabled="isFinish"
        />
      </div>
      <!-- </div> -->
      <!-- 底部按钮 -->
      <div v-if="(doned || isChange) && !detail.isView" slot="footer">
        <Button v-if="!isChange" type="error" :loading="submitLoading" @click="invalid">
          <span>作废</span>
        </Button>
        <Button
          v-if="isChange && !detail.isView"
          type="info"
          :loading="submitLoading"
          @click="(e) => save(1)"
        >
          <span>{{isChange ? '保存' : '暂存'}}</span>
        </Button>
        <Button
          v-if="isNotSubmit && !detail.isView"
          type="primary"
          :loading="submitLoading"
          @click="(e) => save()"
        >
          <span>提交</span>
        </Button>
        <Button type="primary" ghost @click="cancel">取消</Button>
      </div>
      <div v-if="toDone || detail.isView" slot="footer">
        <Button
          v-if="!isFinish && !detail.isView"
          type="primary"
          :loading="submitLoading"
          @click="(e) => save()"
        >
          <span>提交</span>
        </Button>
        <Button type="primary" ghost @click="cancel">{{detail.isView ? '关闭' : '取消'}}</Button>
      </div>
    </Modal>
    <!-- 管理条例 -->
    <regulation
      v-if="regulationShow"
      :visible="regulationShow"
      @close="regulationClose"
    ></regulation>
    <!-- 考核指标 -->
    <indicator
      v-if="indicatorShow"
      :visible="indicatorShow"
      :extra-params="indicatorParams"
      @close="indicatorClose"
    ></indicator>
  </div>
</template>

<script>
import { cityQueryAgentListService } from "_o/api/city-check";
import {
  flowApproveService,
  flowCancelService,
  flowDetailService,
  flowListService,
  flowHoldService,
  flowPageService,
  flowSubmitService,
  flowSubmitBatchService,
} from "_o/api/assess";
import { tool } from "_o/api/baseMixin.js";
import Regulation from "./regulation";
import Indicator from "./indicator";
import { getToken } from "@/libs/util.js";
import { statusList, columnsProcess } from "../fields";
import oss from "@/mixins/oss";
import Commission from "../../components/commission";
import { freeze } from "@/mixins/base";
import deputyMixin from "../../city/mixin/deputy";
import selectDeduct from "../../city/mixin/select-deduct";
import enumMixin from "../mixin/enum";
import fileMixin from "../mixin/file";
import paramsMixin from "../mixin/params";
import DeductMixin from "../mixin/select-deduct";
import indicatorMixin from "../mixin/select-indicator";

import IndicatorDeduct from "../../components/indicator-deduct";
import DeputyCom from "../../city/components/deputy";
import IndicatorCom from "../../components/indicator";
/*
月份/运营商/考核模式 不能修改

考核流程管理里面  未提交有4个按钮

其他在待办流程里面处理
其他项:
  未提交状态：都可修改
  待城市确认状态：只能修改考核占比
  待总部审核状态：都可修改
  运营商确认状态：不可修改，可确认或驳回 (运营商平台)
*/

const standard = {
  coefficient: "", // 系数
  max: "", // 范围大值
  maxSign: "", // 范围结束条件符号
  min: "", // 范围小值
  minSign: "", // 范围开始条件符号
};

export default {
  name: "league-model-add",
  components: {
    Regulation,
    Indicator,
    Commission,
    IndicatorDeduct,
    DeputyCom,
    IndicatorCom,
    DeductMixin,
  },
  filters: {
    statusFilter(v) {
      let f = statusList.find((it) => it.value === v);
      return f ? f.label : "";
    },
  },
  mixins: [
    tool,
    oss,
    deputyMixin,
    selectDeduct,
    enumMixin,
    fileMixin,
    paramsMixin,
    indicatorMixin,
  ],
  props: {
    title: {
      type: String,
      default: "编辑考核标准及管理条例"
    }
  },
  data() {
    return {
      indicatorParams: {
        classify: "", // 6 扣减指标 入参
      },
      columnsProcess,
      dataProcess: [], // 流程处理记录
      submitLoading: false,
      idea: "",
      formData: {
        id: "", // 城市考核模板id ,
        assessTime: [], // 考核日期
        submitAgentAssessIndexReqList: [], // 指标列表
        operateType: "", // 运营模式
        regulationUuid: "", // 管理条例uuid
        proposal: "", // 处理意见
        regulationFilePath: "",
        bizCode: "",
      },

      currentOption: "",
      optionList: [], // 指标列表

      agent: "", // 选中的运营商
      agentList: [], // 运营商列表

      indicatorList: [], // 已选择的考核指标
      regulationSelect: {
        title: "",
        fileUrl: "",
      }, // 已选择的管理条例

      regulationShow: false, // 管理条例是否显示
      indicatorShow: false, // 考核指标是否显示

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
      const {
        flowRecordVoList,
        agentUuid,
        regulationName,
        regulationFileUrl,
        agentName,
      } = this.detail;
      this.setFormData();
      this.dataProcess = flowRecordVoList;
      this.agent = agentUuid;
      this.regulationSelect.title = regulationName;
      this.regulationSelect.fileUrl = regulationFileUrl;
      this.setStrategy();
      if (this.detail.finish) {
        this.agentList = [{
          agentName,
          agentUuid
        }];
      } else {
        this.getAgentList();
      }
    },
    setFormData() {
      const {
        id,
        bizCode,
        assessTime,
        regulationUuid,
        agentAssessIndexVoList,
        operateType,
        businessType,
        pushDimension,
      } = this.detail;
      this.formData.id = id;
      this.formData.bizCode = bizCode;
      this.formData.assessTime = assessTime.split(",");
      this.formData.regulationUuid = regulationUuid;
      this.formData.submitAgentAssessIndexReqList = this.optionList =
        agentAssessIndexVoList;
      this.formData.operateType =
        `${operateType}` === "-1" ? [operateType] : operateType?.split(",");
      this.formData.businessType = businessType?.split(",");
      this.formData.pushDimension = pushDimension;
    },
    // 主辅策略参数
    setStrategy() {
      const {
        agentAssessAssistCommissionVoList,
        agentAssessBasicCommissionVo,
      } = this.detail;

      this.deductionList =
        agentAssessBasicCommissionVo?.agentAssessBasicDeductionVoList?.map(
          (it) => {
            it.id = it.indexUuid
            it.name = it.indexName
            try {
              it.indexRuleJson = JSON.parse(it.indexRuleJson);
            } catch {
              it.indexRuleJson = {};
            }
            if (it.parentFlag - 1 === 0) {
              it._subIndex = 0
            }
            return it;
          }
        ) || [];
      // 辅策略
      if (agentAssessAssistCommissionVoList?.length) {
        agentAssessAssistCommissionVoList.forEach((item) => {
          if (item?.agentAssessAssistReissueVoList?.length) {
            item.agentAssessAssistReissueVoList.forEach((it) => {
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
    },
    async save(t) {
      // this.$refs._form.validate(async (valid) => {
      // if (!valid) return;
      // });
      let otherParams = await this.getCommitParams();
      let p = {
        ...this.formData,
        // submitAgentAssessIndexReqList: this.handleAddForm(),
        ...otherParams,
      };

      if (!p.regulationFilePath) {
        delete p.regulationFilePath;
      }
      if (!p.regulationUuid) {
        delete p.regulationUuid;
      }
      let msg = t ? "暂存成功" : "提交成功";
      let func = flowSubmitService;
      p.flowStatus = this.detail.flowStatus;
      p.taskId = this.detail.rowData.taskId || undefined;
      if (this.toDone) {
        func = flowApproveService;
        // 城市提交都是2, 城市只有通过; 合作伙伴和运营商(运营商平台有驳回和确认两个按钮)有2个选项
        p.result = this.isCityConfirm ? "2" : this.idea - 1 === 0 ? "2" : "3";
      } else if (t) {
        func = flowHoldService;
      }
      // console.log(p, 11);
      // return;
      if (!this.checkItem(p)) {
        return;
      }
      // regulationFilePath 也上传文件uuid
      if (p.regulationFilePath) {
        p.regulationFilePath = this.regulationFileUuid;
      }
      // console.log(p) // todo
      // console.log(p.agentAssessBasicCommissionReq) //
      // console.log(p.agentAssessAssistCommissionReqList) //
      // return
      const [err, data] = await this.toResult(func(p));
      if (err) {
        return;
      }
      this.$Message.success(msg);
      this.$emit("close", true);
    },
    checkItem(p) {
      if (!p.assessTime) {
        this.$Message.error("请选择月份");
        return false;
      }

      if (!this.optionList.every((it) => !!it.proportion)) {
        this.$Message.error("请输入考核占比");
        return false;
      }
      let lst = p.submitAgentAssessIndexReqList?.filter(
        (it) => it.targetFlag - 1 === 0
      );
      if (lst?.length > 0) {
        if (lst.some((it) => !it.assessTarget || it.assessTarget <= 0)) {
          this.$Message.error("请输入目标设置");
          return false;
        }
      }
      return true;
    },
    cancel() {
      if (!this.isNotSubmit || this.detail.isView) {
        this.$emit("close");
        return;
      }
      this.$Modal.confirm({
        title: "是否确认取消编辑考核标准及管理条例？",
        onOk: () => {
          // this.$refs._form.resetFields();
          this.$emit("close");
        },
      });
    },
    handleAddForm() {
      let tmpList = JSON.parse(JSON.stringify(this.optionList));
      for (let item of tmpList) {
        Object.keys(item).forEach((key) => {
          item[key] === "" && delete item[key];
        });
      }
      return tmpList;
    },
    toNumber(val, index) {
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
      this.optionList[index].proportion = v !== "" ? v : "";
    },
    toNum(val, key, item) {
      return;
      let v = `${val}`;
      v = `${val}`.replace(/[^\d\.-]/g, "");
      let vArr = v.split(".");
      if (vArr.length > 2) {
        v = vArr.slice(0, 2).join(".");
      }
      if (vArr[1] && vArr[1].length > 6) {
        v = Number(v).toFixed(6);
      }
      item[key] = v;
      // this.formData.standard.definition[index][key] = v;
    },
    removeItem(index, item, key) {
      if (
        this.optionList[key].indexRuleJson.definition.length === 1 ||
        this.disabled
      ) {
        return;
      }
      this.optionList[key].indexRuleJson.definition.splice(index, 1);
    },
    addItem(index, key) {
      if (
        this.optionList[key].indexRuleJson.definition.length >= 5 ||
        this.disabled
      ) {
        return;
      }
      this.optionList[key].indexRuleJson.definition.push({
        ...standard,
      });
    },
    // 父指标删除 阶梯标准
    removeSubItem(index, list) {
      if (list.length - 1 === 0) {
        return;
      }
      list.splice(index, 1);
    },
    // 父指标添加 阶梯标准
    addSubItem(list) {
      if (list.length >= 5) {
        return;
      }
      list.push({ ...standard });
    },
    deleteIndicator(key) {
      if (this.isCityConfirm) return;
      this.optionList.splice(key, 1);
    },
    setOptionTab(name) {
      this.currentOption = name;
    },
    selectRegulation() {
      this.regulationShow = true;
    },
    selectIndicator() {
      this.indicatorShow = true;
      this.indicatorParams = {};
    },
    async regulationClose(d) {
      this.regulationShow = false;
      this.regulationSelect.title = d.fileName || "";
      this.regulationSelect.fileUrl = "";
      if (d.fileUrl) {
        const [, v] = await this.getOssFile({ uuid: d.fileUrl });
        this.regulationSelect.fileUrl = v;
      }
      this.formData.regulationUuid = d.uuid;
    },
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
    async getAgentList() {
      let p = { cityCodeList: [this.detail.cityCode] };
      const [err, data] = await this.toResult(cityQueryAgentListService(p));
      this.agentList = data || [];
    },
    async invalid() {
      await new Promise((resolve) => this.$Modal.confirm({
        title: "请再次确认是否作废该审批流程，作废后不可恢复！",
        onOk: resolve,
      }));
      let p = {
        id: this.detail.id,
      };
      const [err, data] = await this.toResult(flowCancelService(p));
      if (err) {
        return;
      }
      this.$Message.success(`作废成功`);
      this.$emit("close", true);
    },
    removeDuplicate(list, uniqueKey) {
      let map = new Map();
      for (let item of list) {
        if (!map.has(item[uniqueKey])) {
          map.set(item[uniqueKey], item);
        }
      }
      return [...map.values()];
    },
    // 子指标切换显示
    subTargetClick(i, item) {
      item._subIndex = i;
      this.$forceUpdate();
    },
    // 删除子指标
    deleteSubTarget(i, json) {
      let list = json.indexRuleJson;
      if (list.length === 1) {
        this.$Message.error("最少保留一个子指标!");
        return;
      }
      // 当前选中索引是数组最后一个元素
      if (json._subIndex - i === 0 && list.length - i === 1) {
        json._subIndex = i - 1;
      }
      list.splice(i, 1);
    },
    businessTypeChange(v) {
      let len = v.length;
      if (len) {
        if (v[len - 1] - -1 === 0) {
          this.formData.businessType = ["-1"];
        } else {
          let index = v.findIndex((it) => it - -1 === 0);
          if (index > -1) {
            this.formData.businessType.splice(index, 1);
          }
        }
      }
    },
    strategyTypeChange(v) {
      this.strategyType = v;
      if (v - 1 === 0) {
        this.getDeputyList();
      }
    },
  },
};
</script>

<style scoped lang="less">
@import "./add.less";
</style>
