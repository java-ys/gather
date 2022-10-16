<template>
  <div>
    <Modal
      v-model="isShow"
      :width="750"
      :title="modalTitle"
      :mask-closable="false"
      class="add-timing"
      @on-cancel="formReset"
    >
      <Form
        ref="adForm"
        class="top15"
        :model="addData"
        :rules="ruleValidate"
        :label-width="90"
      >
        <FormItem
          label="策略名称："
          prop="strategyName"
        >
          <span v-if="isDetail">{{ addData.strategyName }}</span>
          <Input
            v-else
            v-model="addData.strategyName"
            style="width:360px"
            :maxlength="20"
            placeholder="请输入策略名称"
          />
          <span
            v-if="isAdd"
            class="counter"
          >( {{ addData.strategyName ? addData.strategyName.length:0 }}/20 )</span>
        </FormItem>
        <FormItem
          label="产品线："
          prop="businessType"
        >
          <div v-if="!isAdd">
            <span>{{ businessInfo.map[addData.businessType] }}</span>
          </div>
          <Select
            v-else
            v-model="addData.businessType"
            placeholder="请选择产品线"
            class="width200"
            @on-change="changeBusiness"
          >
            <Option
              v-for="item in businessInfo.list"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          label="城市："
          prop="cityCodeList"
        >
          <span v-if="!isAdd">{{ addData.cityNameList && addData.cityNameList.join(' / ') }}</span>
          <TreeInput
            v-else
            v-model="addData.cityCodeList"
            :data="cityList"
            placeholder="请选择城市"
            :disabled="!addData.businessType"
            inputWidth="400px"
            @on-change="getAgentList"
          ></TreeInput>
        </FormItem>
        <FormItem
          label="播报时段："
          prop="sendTime"
        >
          <span v-if="isDetail">{{ addData.sendTime && addData.sendTime.join(' 至 ') }}</span>
          <el-date-picker
            v-else
            v-model="addData.sendTime"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :picker-options="optionsTime"
            :clearable="false"
            :editable="false"
            size="small"
            style="width: 360px"
            align="left"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="chooseTime"
          />
        </FormItem>
        <FormItem
          label="发送频次："
          prop="sendFrequency"
        >
          <span v-if="isDetail">{{ addData.sendFrequency===2?'一次性播报':'每天播报' }}</span>
          <RadioGroup
            v-else
            v-model="addData.sendFrequency"
          >
            <Radio
              :label="1"
              style="margin-right:15px;"
            >
              每天播报
            </Radio>
            <Radio
              :label="2"
              style="margin-right:15px;"
            >
              一次性播报
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          v-if="addData.sendFrequency"
          label="播报时间点："
          prop="sendTimepoint"
          :label-width="100"
        >
          <TimePicker
            v-if="addData.sendFrequency===1 && !isDetail"
            v-model="addData.sendTimepoint"
            confirm
            type="time"
            placement="bottom-end"
            placeholder="请选择播报时间点"
            style="width: 150px"
          ></TimePicker>
          <DatePicker
            v-if="addData.sendFrequency===2 && !isDetail"
            v-model="addData.sendTimepoint"
            type="datetime"
            confirm
            placeholder="请选择播报时间点"
            style="width: 200px"
          ></DatePicker>
          <span v-if="isDetail">{{ addData.sendTimepoint }}</span>
        </FormItem>
        <FormItem
          label="车辆状态："
          prop="carStatusList"
        >
          <div v-if="isDetail">
            <span v-show="addData.productLineType===1">全部</span>
            <span
              v-for="(val, index) in addData.carStatusList"
              :key="val"
            >
              {{ carStatusMap[val] }}{{ index == addData.carStatusList.length - 1 ? "" : " / " }}
            </span>
          </div>
          <CheckboxGroup
            v-else
            v-model="addData.carStatusList"
            @on-change="handleCarStatus"
          >
            <Checkbox
              :label="0"
              style="margin-right:15px;"
            >
              全部
            </Checkbox>
            <Checkbox
              v-for="item in carStatusList"
              :key="item.value"
              :label="item.value"
              style="margin-right:15px;"
            >
              {{ item.label }}
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem
          label="播报对象："
          prop="broadcastObj"
        >
          <span v-if="isDetail">{{ targetMap[addData.broadcastObj] }}</span>
          <RadioGroup
            v-else
            v-model="addData.broadcastObj"
            @on-change="changeTarget"
          >
            <Radio
              v-for="item in targetList"
              :key="item.value"
              :label="item.value"
              style="margin-right:15px;"
            >
              {{ item.label }}
            </Radio>
          </RadioGroup>
        </FormItem>
        <!-- 对象选择车牌号 -->
        <FormItem
          v-if="addData.broadcastObj===1"
          key="carNumContent"
          prop="carNumContent"
        >
          <Input
            v-model="addData.carNumContent"
            type="textarea"
            style="width:450px"
            :disabled="isDetail"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入车牌号(苏Axxxxx)，英文逗号隔开"
          />
          <import-file
            v-if="!isDetail"
            class="right15"
            btnText="批量导入车牌"
            :importFileUrl="uploadUrl"
            :toDownTemplateUrl="carNumTemplateUrl"
            :data="{type:2}"
            baseUrlName="_baseUrl4Crm"
            otherMsg="最多导入5000条数据"
            successMsg="导入成功！已将数据添加至输入框"
            size="small"
            @on-success="getUpFile"
          >
          </import-file>
        </FormItem>
        <!-- 对象选择vin -->
        <FormItem
          v-if="addData.broadcastObj===2"
          key="vinContent"
          prop="vinContent"
        >
          <Input
            v-model="addData.vinContent"
            type="textarea"
            style="width:450px"
            :disabled="isDetail"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入车辆vin码，英文逗号隔开"
          />
          <import-file
            v-if="!isDetail"
            btnText="批量导入vin码"
            :importFileUrl="uploadUrl"
            :toDownTemplateUrl="vinTemplateUrl"
            :data="{type:1}"
            baseUrlName="_baseUrl4Crm"
            otherMsg="最多导入5000条数据"
            successMsg="导入成功！已将数据添加至输入框"
            size="small"
            @on-success="getUpFile"
          >
          </import-file>
        </FormItem>
        <!-- 对象选择运营商 -->
        <FormItem
          v-if="addData.broadcastObj===3"
          key="agentUuidList"
          prop="agentUuidList"
          class="multi-hei"
        >
          <Select
            v-model="addData.agentUuidList"
            multiple
            :disabled="isDetail"
            style="width:450px;"
          >
            <Option
              v-for="item in agentList"
              :key="item.agentUuid"
              :value="item.anentUuid"
            >
              {{ item.anentName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          label="播报内容："
          prop="broadcastType"
        >
          <RadioGroup v-model="addData.broadcastType">
            <Radio
              :disabled="isDetail"
              :label="1"
              style="margin-right:15px;"
            >
              文字录入
            </Radio>
            <Radio
              :disabled="isDetail"
              :label="2"
              style="margin-right:15px;"
            >
              语音上传
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          v-if="addData.broadcastType===1"
          key="voiceContent"
          prop="voiceContent"
        >
          <Input
            v-model="addData.voiceContent"
            :disabled="isDetail"
            type="textarea"
            style="width:500px"
            :maxlength="100"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入播报内容"
          />
          <span
            v-if="addData.broadcastType===1 && !isDetail"
            class="counter"
          >( {{ addData.voiceContent ? addData.voiceContent.length:0 }}/100 )</span>
        </FormItem>
        <FormItem v-if="addData.broadcastType===2">
          <uploadLookAll
            :uploadtitle="uploadtitle"
            :format="['mp3']"
            :defaultUrl="addData.voiceUrl"
            :maxAudioSize="51200"
            :isShowUpload="!isDetail"
            style="margin-left:10px"
            @uploadSuccess="uploadAllSuccess"
          >
          </uploadLookAll>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="addSubmit"
        >
          确定
        </Button>
        <Button
          v-if="handleType!==3"
          type="text"
          @click="formReset"
        >
          取消
        </Button>
      </div>
    </Modal>
    <import-fail-modal
      :show="isImportFail"
      :info="importFailInfo"
      @close="isImportFail=false"
    >
    </import-fail-modal>
  </div>
</template>
<script>
import { ruleValidate, carStatusMap, carStatusList, targetMap, targetList } from "./fields";
import { businessInfo } from "../fields";
import importFile from "_a/import-file/index.vue"
import { cpLabelValue } from "@/libs/tools"
import importFailModal from "../../../components/import-fail-modal";
import uploadLookAll from "../../upload-look-all"
import {
  addTimedVoice,
  editTimedVoice,
  queryTimedVoiceDetailByUuid,
  queryTimedCityListByBusinessType,
  queryAgentListByCityCode
} from "_o/api/driver-broadcast"
import TreeInput from "_a/tree-input/tree-input.vue";

const handleTypeMap = {
  1: {
    title: "新建定时语音配置",
    type: "新建"
  },
  2: {
    title: "编辑定时语音配置",
    type: "编辑"
  },
  3: {
    title: "定时语音配置详情",
    type: "详情"
  }
};
const carNumTemplateUrl = "/download/driver_voice_platenum.xlsx"
const vinTemplateUrl = "/download/driver_voice_vin.xlsx"
const uploadUrl = "/driver/voice/batchUploadVinOrPlateNumExcel"

export default {
  name: "add-timing-modal",
  components: {
    importFile,
    importFailModal,
    TreeInput,
    uploadLookAll
  },
  props: {
    show: {
      type: Boolean
    },
    uuid: {},
    handleType: {
      default: 1
    },
  },
  data() {
    return {
      isShow: false,
      ruleValidate,
      businessInfo,
      carStatusList,
      carStatusMap,
      targetMap,
      targetList,
      uploadUrl,
      vinTemplateUrl,
      carNumTemplateUrl,
      detaultAddData: {
        strategyName: "",
        businessType: "",
        cityCodeList: [],
        sendTime: [],
        sendFrequency: null,
        carStatusList: [0],
        broadcastObj: null,
        carNumContent: "",
        vinContent: "",
        voiceContent: "",
        agentUuidList: [],
      },
      addData: {
        ...this.detaultAddData
      },
      cityList: [],
      agentList: [],
      uploadParams: {},
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      importFailInfo: {},
      isImportFail: false,
      uploadtitle: "上传音频"
    };
  },
  computed: {
    // 是否是详情
    isDetail() {
      return this.handleType === 3;
    },
    // 是否是新建
    isAdd() {
      return this.handleType === 1;
    },
    // 弹窗标题
    modalTitle() {
      return handleTypeMap[this.handleType].title;
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
      if (this.isShow) {
        this.$refs["adForm"].resetFields();
        this.addData.sendTime = []
        this.addData.carNumContent = ""
        this.addData.vinContent = ""
        if (this.handleType !== 1) this.getDetail();
        else this.addData = { ...this.detaultAddData }
      }
    }
  },
  methods: {
    chooseTime(date) {
      this.addData.sendTime = date;
    },
    // 获取详情
    getDetail(value) {
      let params = {
        uuid: this.uuid
      };
      queryTimedVoiceDetailByUuid(params).then(res => {
        let data = res.data.data || {}
        // 详情接口数据格式转为我们能用的格式
        data.sendTime = [data.startTimeBroadcast, data.endTimeBroadcast]
        data.businessType = String(data.businessType)
        // 车牌/vin/运营商
        if (data.plateNumList) data.carNumContent = data.plateNumList.join(",")
        if (data.vinList) data.vinContent = data.vinList.join(",")
        if (data.agentVoList) data.agentUuidList = data.agentVoList.map(item => item.anentUuid)
        this.addData = data
        let { sendTimepoint, sendFrequency } = this.addData
        if (sendFrequency === 2) {
          sendTimepoint = sendTimepoint.slice(0, 4) + "-" +
          sendTimepoint.slice(4, 6) + "-" +
          sendTimepoint.slice(6, 8) +
          sendTimepoint.slice(8)
        }
        this.addData = {
          ...this.addData,
          sendTimepoint
        }
        if (data.agentVoList) this.getAgentList()
      })
    },
    // 新建&编辑-提交
    addSubmit() {
      if (this.isDetail) {
        this.formReset();
        return false;
      }
      this.$refs["adForm"].validate(valid => {
        if (valid) {
          let that = this;
          let params = JSON.parse(JSON.stringify(this.addData))
          if (this.handleType === 2) params.uuid = this.uuid;

          params.startTimeBroadcast = this.$moment(params.sendTime[0]).format("YYYY-MM-DD HH:mm:ss")
          params.endTimeBroadcast = this.$moment(params.sendTime[1]).format("YYYY-MM-DD HH:mm:ss")
          delete params.sendTime
          // 处理播报时间点格式
          if (params.sendFrequency === 2) {
            params.sendTimepoint = this.$moment(params.sendTimepoint).format("YYYY-MM-DD HH:mm:ss").replace(/-/g, "")
          }
          params.plateNumList = params.carNumContent.split(",")
          params.vinList = params.vinContent.split(",")
          delete params.carNumContent
          delete params.vinContent
          // 数据按照api要求调整
          let axiosFun = this.isAdd ? addTimedVoice : editTimedVoice
          // 播报内容处理
          if (params.broadcastType === 2 && !params.voiceUrl) {
            this.$Message.warning("请上传播报音频")
            return
          }
          if (params.broadcastType === 1) {
            delete params.voiceUrl
          }
          if (params.broadcastType === 2) {
            delete params.voiceContent
          }
          console.log(params)
          axiosFun(params).then(res => {
            let resData = res.data.data || {}
            if (resData.existsUnusual === 1) {
              this.importFailInfo = {
                isLink: false,
                params: {
                  broadcastObj: resData.broadcastObj,
                  unusualList: resData.unusualList
                },
                msg: res.data.msg,
                url: "/driver/voice/exportTimedVoiceUnusualList",
                baseUrl: "/crm-web-api"
              }
              this.isImportFail = true
            } else {
              that.$Message.success(`${handleTypeMap[this.handleType].type}成功！`);
              that.formReset(true);
            }
          })
        }
      });
    },
    // isReload：是否重新加载列表页面数据
    formReset(isReload) {
      this.$refs["adForm"].resetFields();
      this.$emit("close", isReload);
    },
    // 产品线切换时触发，全部产品线和其他互斥
    handleCarStatus(val) {
      let length = val.length;
      if (val[length - 1] === 0) {
        this.addData.carStatusList = [0];
      } else {
        val.forEach((v, k) => {
          if (v === 0) val.splice(k, 1);
        });
        this.addData.carStatusList = val;
      }
    },
    // 切换产品线，清空城市
    changeBusiness(value) {
      this.addData.cityCodeList = [];
      if (!value) {
        return false
      }
      queryTimedCityListByBusinessType({ businessTypeList: [value] }).then(res => {
        let resList = res.data.data || []
        if (resList.length > 0) {
          resList.forEach(item => {
            item.title = item.cityName
            item.value = item.cityCode
          })
          this.cityList = [
            {
              value: "1",
              title: "全选",
              expand: true,
              children: resList
            }
          ]
        } else {
          this.cityList = []
        }
      })
    },
    getAgentList() {
      if (this.isAdd) this.$refs.adForm.validateField("cityCodeList");
      if ((this.addData.cityCodeList && 　this.addData.cityCodeList.length === 0) || this.addData.broadcastObj !== 3) {
        this.agentList = []
        return false
      }
      queryAgentListByCityCode({ cityCodeList: this.addData.cityCodeList }).then(res => {
        this.agentList = res.data.data || []
      })

    },
    getUpFile(resData) {
      let data = resData.data
      if (this.addData.broadcastObj === 1) {
        let list = data.plateNumList
        if (list.length > 0 && this.addData.carNumContent) this.addData.carNumContent += ","
        this.addData.carNumContent += list.join(",")
        this.$refs.adForm.validateField("carNumContent");
      } else {
        let list = data.vinList
        if (list.length > 0 && this.addData.vinContent) this.addData.vinContent += ","
        this.addData.vinContent += list.join(",")
        this.$refs.adForm.validateField("vinContent");
      }
    },
    changeTarget(value) {
      this.addData.carNumContent = ""
      this.addData.vinContent = ""
      this.addData.agentUuidList = []
      if (value === 3) {
        if (this.addData.cityCodeList.length === 0) {
          this.agentList = []
          this.$Message.warning("请先选择城市")
        }
        else { this.getAgentList(false) }
      }
    },
    uploadAllSuccess(val) {
      console.log("suc", val)
      this.$Message.success("上传成功")
      this.addData.voiceUrl = val.fileUrl;
      this.uploadtitle = "重新上传"
    }
  }
};
</script>
<style lang="less">
.add-timing {
  .ivu-modal {
    top: 20px;
  }
  .multi-hei .ivu-select-selection {
    min-height: 62px;
  }
  .ivu-select-dropdown {
    max-height: 400px;
    overflow: auto;
  }
}
</style>
