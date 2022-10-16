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
              label-in-value
              :disabled="isEdit"
              @on-change="cityChange"
              @on-open-change="selectOpenChange"
            >
              <Option
                v-for="(item, index) in cityList"
                :key="index"
                :value="item.value"
              >{{item.label}}</Option>
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
              @on-change="operateTypeChange"
              @on-open-change="selectOpenChange"
            >
              <Option
                v-for="(item, index) in operateTypeEnum"
                :key="index"
                :value="item.value"
              >{{item.label}}</Option>
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
              label-in-value
              :disabled="isEdit"
            >
              <Option
                v-for="(item, index) in agentList"
                :key="index"
                :value="item.agentUuid"
              >{{item.agentName}}</Option>
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
              label-in-value
              :disabled="isEdit"
            >
              <Option
                v-for="(item, index) in productLineEnum"
                :key="index"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="指标名称：" prop="indexUuid">
            <Select
              v-model="addForm.indexUuid"
              class="input-width item-width"
              filterable
              :disabled="isEdit"
              @on-change="indicatorChange"
            >
              <Option
                v-for="(item, index) in indicatorList"
                :key="index"
                :value="item.uuid"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="指标说明：" prop="remark">
            <Input
              v-model="addForm.remark"
              type="textarea"
              :rows="4"
              :maxlength="500"
              class="textarea-con"
              placeholder="请输入"
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
          <FormItem label="考核得分：" prop="assessScore">
            <Input
              v-model="addForm.assessScore"
              class="item-width"
              :maxlength="15"
              placeholder="请输入"
              :disabled="isDetail"
              @on-keyup="toNumber"
            ></Input>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="得分说明：" prop="assessRemark">
            <Input
              v-model="addForm.assessRemark"
              type="textarea"
              :maxlength="2000"
              class="textarea-con2"
              :disabled="isDetail"
              placeholder="请输入"
            />
          </FormItem>
        </Row>
        <Row>
          <p v-if="!isDetail" class="subtitle">录入该指标考核中的明细项目，例如城市考核专项分为五个维度，可在此录入项目和得分</p>
          <p v-else class="subtitle">该指标考核中的明细项目</p>
        </Row>
        <Row v-if="!isDetail" :gutter="24" style="margin-top:12px">
          <Col span="9">
            <Input
              v-model="scoreName"
              :maxlength="32"
              placeholder="考核项名称"
              :disabled="isDetail"
            />
          </Col>
          <Col span="9">
            <Input
              v-model="scoreNum"
              :maxlength="32"
              placeholder="考核项实际达成"
              :disabled="isDetail"
            />
          </Col>
          <Col v-if="!isDetail" span="6">
            <Icon
              class="add-icon"
              size="24"
              type="ios-add-circle-outline"
              @click="addManagetItem"
            />
          </Col>
        </Row>
        <Row :gutter="24">
          <Col v-for="(item,index) in addForm.scoreList" :key="index" span="12" class="flex-row">
            <p class="txt">{{item.scoreName}}</p>
            <p class="txt">{{item.scoreNum}}</p>
            <Icon
              v-if="!isDetail"
              class="remove-icon"
              size="24"
              type="ios-remove-circle-outline"
              @click="removeManagetItem(index, item)"
            />
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button
          v-if="!isDetail"
          type="primary"
          :loading="submitLoading"
          @click="(e) => save()"
        >
          <span>确定</span>
        </Button>
        <Button v-if="!isDetail" type="primary" ghost @click="cancel">取消</Button>
        <Button v-if="isDetail" type="primary" ghost @click="$emit('close')">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { cityNewQueryAgentListService } from "_o/api/city-check";
import { tool } from "_o/api/baseMixin.js";
import { operateTypeEnum, productLineEnum } from "@/config";
import { createAgentService, updateAgentService } from "_o/api/settle/goal";
import { addFormRule } from "../fields"
import { freeze, findO } from "@/mixins/base";
import ModalMixin from "@/mixins/modal"
/*
新建/编辑考核目标
  1.字段说明：
  城市，必填，可多选，可选全部，选全部即为不限制城市；
  考核月份，必填，可多选；
  运营模式，必填，可多选，可选项为A、UP、带车加盟、巡网出租车；
  产品线，必填，可多选，可选项来源于资产平台产品线；
  运营商，必填，可多选，需联动城市和运营模式展示；
  指标名称，必填，单选，仅可选择自定义考核指标；
  指标说明，选择指标后带出展示不可修改；
  考核月份，必填，单选；
  考核分，必填，支持两位小数；
  2.新建提交成功后，根据上述条件，将对应数据入库；
  3.编辑目标时，除考核分字段可修改，其余字段均不可修改；
*/
export default {
  name: "custom-add",
  inject: ["getCityList", "getIndicatorList"],
  mixins: [tool, ModalMixin],
  props: {
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      operateTypeEnum,
      productLineEnum,
      submitLoading: false,
      // cityList: [],
      validateRules: freeze(addFormRule),
      addForm: {
        cityCodeList: [],
        agentUuid: [],
        businessType: [],
        indexUuid: "",
        assessTime: "", // 考核月份
        operateType: [], // 运营模式
        assessScore: "",
        remark: "",
        scoreRemark: "",
        scoreList: []
      },
      allowChange: false,
      agentList: [], // 运营商列表
      scoreName: "",
      scoreNum: ""
    };
  },
  computed: {
    indicatorList() {
      return this.getIndicatorList()
    },
    cityList() {
      return this.getCityList()
    },
    isEdit({ detail }) {
      return !!detail.uuid
    },
    title() {
      return this.isDetail ? "详情" : "编辑考核分"
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      if (!this.detail.uuid) return;
      // this.title = "编辑考核分"
      const { uuid, agentUuid, operateType, businessType, assessTime, cityCode, assessScore, indexUuid, assessRemark, assessDetail = [] } = this.detail
      const assessDetails = JSON.parse(assessDetail || "[]")
      this.addForm.uuid = uuid;
      this.addForm.cityCodeList = [cityCode]
      this.addForm.agentUuid = agentUuid;
      this.addForm.operateType = operateType?.split(",");
      this.addForm.assessTime = assessTime
      this.addForm.indexUuid = indexUuid
      this.addForm.businessType = businessType?.split(",")
      this.addForm.assessScore = assessScore;
      this.addForm.assessRemark = assessRemark;
      this.addForm.scoreList = assessDetails.map(v => {
        let r = {}
        Object.keys(v).forEach(it => {
          r.scoreName = it
          r.scoreNum = v[it]
        })
        return r
      })
      this.indicatorChange(indexUuid)
      this.getAgentList();
    },
    async save(t) {
      const valid = await this.$refs._form.validate();
      if (!valid) return
      const { agentUuid, operateType, businessType, assessTime, assessScore, indexUuid, scoreList, assessRemark } = this.addForm
      let p = {
        agentUuid: agentUuid.join(","),
        operateType: operateType.join(","),
        businessType: businessType.join(","),
        assessTime: this.$moment(assessTime).format("YYYY-MM"),
        indexUuid: indexUuid,
        assessScore,
        assessRemark,
        assessDetail: scoreList.map(v => {
          let vv = {}
          vv[v.scoreName] = v.scoreNum
          return vv
        })
      };
      let msg = "添加成功";
      let func = createAgentService;
      if (this.isEdit) {
        msg = "编辑成功"
        func = updateAgentService
        p.uuid = this.detail.uuid
      }
      const [err, data] = await this.toResult(func(p));
      if (err) {
        return;
      }
      this.$Message.success(msg);
      this.$emit("close", true);
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
    handleAddForm() {
      let tmpList = JSON.parse(JSON.stringify(this.optionList));
      for (let item of tmpList) {
        Object.keys(item).forEach((key) => {
          item[key] === "" && delete item[key];
        });
      }
      return tmpList;
    },
    isNumber(str){
      return /^[-\\+]?([0-9]+\\.?)?[0-9]+$/.test(str);
    },
    toNumber() {
      let val = this.addForm.assessScore
      let v = `${val}`.replace(/[^-\d\.]/g, "");
      if (v.length > 1 && v.endsWith("-")) {
        v = v.slice(0, v.length - 1)
      }
      console.log(this.isNumber(v))
      if (!this.isNumber(v) && (v !== "-")) {
        this.addForm.assessScore = ""
      }
      let vArr = v.split(".");
      if (vArr.length > 2) {
        v = vArr.slice(0, 2).join(".");
      }
      if (vArr[1] && vArr[1].length > 10) {
        v = Number(v).toFixed(10);
      }
      if (v > 100) {
        v = 100;
      } else if (v < 0) {
        // v = 0;
      }
      
      this.addForm.assessScore = v !== "" ? v : ""
    },
    async getAgentList() {
      const { cityCodeList, operateType } = this.addForm
      if (!cityCodeList.length || !operateType.length) return
      let p = {
        cityCodeList: cityCodeList,
        operationTypeList: operateType
      };
      if (cityCodeList.includes(-1)) {
        delete p.cityCodeList
      }
      const [err, data] = await this.toResult(cityNewQueryAgentListService(p));
      this.agentList = data || [];
      // this.$forceUpdate();
    },
    cityChange(v) {
      if (!this.allowChange) return
      const len = v.length;
      if (!len) return
      if (v[len - 1] - (-1) === 0) {
        this.addForm.cityCodeList = [-1]
      } else {
        let index = v.findIndex(it => it - (-1) === 0)
        if (index > -1) {
          this.addForm.cityCodeList.splice(index, 1)
        }
      }
      this.getAgentList()
    },
    operateTypeChange() {
      if (!this.allowChange) return
      this.getAgentList()
    },
    indicatorChange(v) {
      this.addForm.remark = findO(v, "uuid", this.indicatorList).remark;
    },
    selectOpenChange(v) {
      this.allowChange = v
    },
    addManagetItem() {
      if (!this.scoreName || !this.scoreNum) return this.$Message.info("请填写完整")
      this.addForm.scoreList.push({
        scoreName: this.scoreName,
        scoreNum: this.scoreNum
      })
      this.scoreName = ""
      this.scoreNum = ""
    },
    removeManagetItem(index, item) {
      this.addForm.scoreList.splice(index, 1)
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
/deep/ .textarea-con2 .ivu-input {
  width: 300px;
  height: 180px;
  resize: auto;
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
.opt-content {
  background-color: rgba(238, 238, 238, 0.3);
  position: relative;
  padding: 20px 0;
  margin: 0 40px 20px;

  .delete {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    z-index: 99;
    padding: 10px;
    &:hover {
      color: #2d8cf0;
    }
  }
}
.reg-text {
  color: #2d8cf0;
  margin: 0 8px;
  cursor: pointer;
}
.agent-list {
  margin-left: 160px;
  height: 160px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.a-l {
  margin: 0 6px 10px;
}
.item-width {
  width: 300px;
}

.opi {
  margin: 0 80px;
}
.title {
  line-height: 44px;
  font-weight: bold;
  font-size: 18px;
  border-bottom: 1px solid #ececec;
  margin-bottom: 28px;
}
.subtitle {
  line-height: 28px;
  font-weight: bold;
  font-size: 12px;
  border-bottom: 1px solid #ececec;
  margin-bottom: 12px;
}
.desc-con {
  width: 600px;
  margin-top: 20px;
}
.dd {
  margin-top: 10px;
}
.rela {
  position: relative;
}
._mask {
  z-index: 99;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  background-color: transparent;
}
.base_mask {
  z-index: 99;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  background-color: transparent;
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
.pr {
  position: relative;
}
.close-ic {
  position: absolute;
  right: -6px;
  top: -6px;
  border-radius: 50%;
  background-color: #bbb8b8;
  z-index: 9;
}
.rule-width {
  width: 60px;
}
.flex-row{
  display:flex;
  align-items:center;
  .txt {
    line-height: 48px;
    font-weight: bold;
    font-size: 12px;
    border-bottom: 1px solid #ececec;
    height:48px;
    padding: 0 12px
  }


  .remove-icon {
    display:block;
  }
}
</style>
