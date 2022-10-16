<template>
  <div>
    <Modal
      v-model="isShow"
      :width="800"
      :title="modalTitle"
      :mask-closable="false"
      class="add-strategy"
      @on-cancel="formReset()"
    >
      <Form class="top15" ref="adForm" :model="addData" :rules="ruleValidate" :label-width="120">
        <FormItem label="策略名称：" prop="strategyName">
          <span v-if="isDetail">{{addData.strategyName}}</span>
          <Input
            v-else
            style="width:360px"
            v-model="addData.strategyName"
            :maxlength="20"
            placeholder="请输入策略名称"
          />
          <span class="counter" v-if="isAdd">( {{ addData.strategyName ? addData.strategyName.length:0 }}/20 )</span>
        </FormItem>  
        <FormItem label="产品线：" prop="businessTypeList">
          <div v-if="!isAdd">
            <span>{{ businessInfo.map[addData.businessType] }}</span>
          </div>
          <Select
            v-else
            v-model="addData.businessTypeList"
            placeholder="请选择产品线"
            class="width200"
            multiple
            @on-change="changeBusiness"
          >
            <Option
              v-for="item in businessInfo.list"
              :key="item.value"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="城市：" prop="cityCodeList">
          <span v-if="!isAdd">{{addData.cityName}}</span>
          <Select
            v-else
            multiple
            filterable
            v-model="addData.cityCodeList"
            :disabled="addData.businessTypeList.length===0"
            placeholder="请选择城市"
            style="width:360px"
          >
            <Option v-for="item in cityList" :key="item.cityCode" :value="item.cityCode">{{item.cityName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="生效时间：" prop="effectiveTime">
          <span v-if="isDetail">{{addData.effectiveTime}}</span>
          <DatePicker
            v-else
            v-model="addData.effectiveTime"
            :editable="false"
            :options="optionsTime"
            type="datetime"
            placeholder="请选择生效时间"
            style="width: 200px"
          />
        </FormItem>
        <p class="box-tit">行程节点播报</p>
        <Divider class="box-divider"/>
        <!-- <FormItem label="APP开机：" prop="appStartContent">
          <Input
            v-model="addData.appStartContent"
            :disabled="isDetail"
            type="textarea"
            style="width:500px"
            :maxlength="100"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入播报内容"
          />
          <span class="counter" v-if="!isDetail">( {{ addData.appStartContent ? addData.appStartContent.length:0 }}/100 )</span>
        </FormItem> -->
        <FormItem label="APP开机：" prop="appStartType">
          <br>
          <span>播报内容:&nbsp;</span>
           <RadioGroup v-model="addData.appStartType" class="mb-3" @on-change="changeApp">
            <Radio :disabled="isDetail" :label="1" style="margin-right:15px;"> 文字录入 </Radio>
            <Radio :disabled="isDetail" :label="2" style="margin-right:15px;"> 语音上传 </Radio>
          </RadioGroup>
          <Input
            v-if="addData.appStartType===1"
            v-model="addData.appStartContent"
            :disabled="isDetail"
            type="textarea"
            style="width:500px"
            :maxlength="100"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入播报内容"
          />
          <span v-if="addData.appStartType===1 && !isDetail" class="counter">( {{ addData.appStartContent ? addData.appStartContent.length:0 }}/100 )</span>
            <uploadLookAll
              v-if="addData.appStartType===2"
              :uploadtitle="'上传音频'"
              :format="['mp3']"
              :defaultUrl="addData.appStartContent"
              :maxAudioSize="51200"
              :isShowUpload="!isDetail"
              style="margin-left:10px"
              @uploadSuccess="uploadAllSuccessApp"
            >
            </uploadLookAll>
        </FormItem>
        <!-- <FormItem label="司机上线：" prop="driverOnlineContent">
          <Input
            v-model="addData.driverOnlineContent"
            :disabled="isDetail"
            type="textarea"
            style="width:500px"
            :maxlength="100"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入播报内容"
          />
          <span class="counter" v-if="!isDetail">( {{ addData.driverOnlineContent ? addData.driverOnlineContent.length:0 }}/100 )</span>
        </FormItem> -->
         <FormItem label="司机上线：" prop="driverOnlineType">
          <br>
          <span>播报内容:&nbsp;</span>
           <RadioGroup v-model="addData.driverOnlineType" class="mb-3" @on-change="changeDriver">
            <Radio :disabled="isDetail" :label="1" style="margin-right:15px;"> 文字录入 </Radio>
            <Radio :disabled="isDetail" :label="2" style="margin-right:15px;"> 语音上传 </Radio>
          </RadioGroup>
          <Input
            v-if="addData.driverOnlineType===1"
            v-model="addData.driverOnlineContent"
            :disabled="isDetail"
            type="textarea"
            style="width:500px"
            :maxlength="100"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入播报内容"
          />
          <span v-if="addData.driverOnlineType===1 && !isDetail" class="counter">( {{ addData.driverOnlineContent ? addData.driverOnlineContent.length:0 }}/100 )</span>
            <uploadLookAll
              v-if="addData.driverOnlineType===2"
              :uploadtitle="'上传音频'"
              :format="['mp3']"
              :defaultUrl="addData.driverOnlineContent"
              :maxAudioSize="51200"
              :isShowUpload="!isDetail"
              style="margin-left:10px"
              @uploadSuccess="uploadAllSuccessDriver"
            >
            </uploadLookAll>
        </FormItem>
        <FormItem label="乘客已上车" class="ivu-form-item-required no-margin">
        </FormItem>
        <div class="two-box">
          <!-- <FormItem label="白天播报内容：" prop="amPassengerBoardedContent">
            <Input
              v-model="addData.amPassengerBoardedContent"
              :disabled="isDetail"
              type="textarea"
              style="width:450px"
              :maxlength="100"
              :autosize="{minRows: 3,maxRows: 5}"
              placeholder="请输入播报内容"
            />
            <span class="counter" v-if="!isDetail">( {{ addData.amPassengerBoardedContent ? addData.amPassengerBoardedContent.length:0 }}/100 )</span>
          </FormItem>
          <FormItem label="夜间播报内容：" prop="pmPassengerBoardedContent">
            <Input
              v-model="addData.pmPassengerBoardedContent"
              :disabled="isDetail"
              type="textarea"
              style="width:450px"
              :maxlength="100"
              :autosize="{minRows: 3,maxRows: 5}"
              placeholder="请输入播报内容"
            />
            <span class="counter" v-if="!isDetail">( {{ addData.pmPassengerBoardedContent ? addData.pmPassengerBoardedContent.length:0 }}/100 )</span>
          </FormItem> -->
          <FormItem label="白天播报内容：" prop="passengerBoardedType">
          <br>
           <RadioGroup v-model="addData.passengerBoardedType" class="mb-3" @on-change="changeDayAm">
            <Radio :disabled="isDetail" :label="1" style="margin-right:15px;"> 文字录入 </Radio>
            <Radio :disabled="isDetail" :label="2" style="margin-right:15px;"> 语音上传 </Radio>
          </RadioGroup>
          <Input
            v-if="addData.passengerBoardedType===1"
            v-model="addData.amPassengerBoardedContent"
            :disabled="isDetail"
            type="textarea"
            style="width:500px"
            :maxlength="100"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入播报内容"
          />
          <span v-if="addData.passengerBoardedType===1 && !isDetail" class="counter">( {{ addData.amPassengerBoardedContent ? addData.amPassengerBoardedContent.length:0 }}/100 )</span>
            <uploadLookAll
              v-if="addData.passengerBoardedType===2"
              :uploadtitle="'上传音频'"
              :format="['mp3']"
              :defaultUrl="addData.amPassengerBoardedContent"
              :maxAudioSize="51200"
              :isShowUpload="!isDetail"
              style="margin-left:10px"
              @uploadSuccess="uploadAllSuccessAm"
            >
            </uploadLookAll>
        </FormItem> 
        <FormItem label="夜间播报内容：" prop="pmPassengerBoardedType">
          <br>
           <RadioGroup  v-model="addData.pmPassengerBoardedType" class="mb-3" @on-change="changeDayPm">
            <Radio :disabled="isDetail" :label="1" style="margin-right:15px;"> 文字录入 </Radio>
            <Radio :disabled="isDetail" :label="2" style="margin-right:15px;"> 语音上传 </Radio>
          </RadioGroup>
          <Input
            v-if="addData.pmPassengerBoardedType===1"
            v-model="addData.pmPassengerBoardedContent"
            :disabled="isDetail"
            type="textarea"
            style="width:500px"
            :maxlength="100"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入播报内容"
          />
          <span v-if="addData.pmPassengerBoardedType===1 && !isDetail" class="counter">( {{ addData.pmPassengerBoardedContent ? addData.pmPassengerBoardedContent.length:0 }}/100 )</span>
            <uploadLookAll
              v-if="addData.pmPassengerBoardedType===2"
              :uploadtitle="'上传音频'"
              :format="['mp3']"
              :defaultUrl="addData.pmPassengerBoardedContent"
              :maxAudioSize="51200"
              :isShowUpload="!isDetail"
              style="margin-left:10px"
              @uploadSuccess="uploadAllSuccessPm"
            >
            </uploadLookAll>
        </FormItem>
        </div>
        <FormItem label="即将到达目的地：" prop="arriveDestination">
          <br>
          <span>播报内容:&nbsp;</span>
           <RadioGroup v-model="addData.arriveDestination" class="mb-3" @on-change="changeArrive">
            <Radio :disabled="isDetail" :label="1" style="margin-right:15px;"> 文字录入 </Radio>
            <Radio :disabled="isDetail" :label="2" style="margin-right:15px;"> 语音上传 </Radio>
          </RadioGroup>
          <Input
            v-if="addData.arriveDestination===1"
            v-model="addData.arriveDestinationContext"
            :disabled="isDetail"
            type="textarea"
            style="width:500px"
            :maxlength="100"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入播报内容"
          />
          <span v-if="addData.arriveDestination===1 && !isDetail" class="counter">( {{ addData.arriveDestinationContext ? addData.arriveDestinationContext.length:0 }}/100 )</span>
            <uploadLookAll
              v-if="addData.arriveDestination===2"
              :uploadtitle="'上传音频'"
              :format="['mp3']"
              :defaultUrl="addData.arriveDestinationContext"
              :maxAudioSize="51200"
              :isShowUpload="!isDetail"
              style="margin-left:10px"
              @uploadSuccess="uploadAllSuccessArrive"
            >
            </uploadLookAll>
            <br>
            距离目的地&nbsp;
           <span v-if="isDetail">{{addData.arriveDestinationMiles}}</span>
          <InputNumber
            v-else
            v-model="addData.arriveDestinationMiles"
            :precision="0"
            :min="1"
            :max="5000"
            placeholder="请输入1~5000的整数"
            style="width:150px;"
          ></InputNumber>&nbsp;米播报
        </FormItem>
        <!-- <FormItem label="行程结束：" prop="routeEndContent">
          <Input
            v-model="addData.routeEndContent"
            :disabled="isDetail"
            type="textarea"
            style="width:500px"
            :maxlength="100"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入播报内容"
          />
          <span class="counter" v-if="!isDetail">( {{ addData.routeEndContent ? addData.routeEndContent.length:0 }}/100 )</span>
        </FormItem> -->
        <FormItem label="行程结束：" prop="routeEndType">
          <br>
          <span>播报内容:&nbsp;</span>
           <RadioGroup v-model="addData.routeEndType" class="mb-3" @on-change="changeRoute">
            <Radio :disabled="isDetail" :label="1" style="margin-right:15px;"> 文字录入 </Radio>
            <Radio :disabled="isDetail" :label="2" style="margin-right:15px;"> 语音上传 </Radio>
          </RadioGroup>
          <Input
            v-if="addData.routeEndType===1"
            v-model="addData.routeEndContent"
            :disabled="isDetail"
            type="textarea"
            style="width:500px"
            :maxlength="100"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入播报内容"
          />
          <span v-if="addData.routeEndType===1 && !isDetail" class="counter">( {{ addData.routeEndContent ? addData.routeEndContent.length:0 }}/100 )</span>
            <uploadLookAll
              v-if="addData.routeEndType===2"
              :uploadtitle="'上传音频'"
              :format="['mp3']"
              :defaultUrl="addData.routeEndContent"
              :maxAudioSize="51200"
              :isShowUpload="!isDetail"
              style="margin-left:10px"
              @uploadSuccess="uploadAllSuccessRoute"
            >
            </uploadLookAll>
        </FormItem>
        <p class="box-tit">固定播报</p>
        <Divider  class="box-divider"/>
        <FormItem label="行程附加费提醒：" prop="travelSurchargeStatus" >
          <span v-if="isDetail">{{addData.travelSurchargeStatus===0?'关闭':'开启'}}</span>
          <RadioGroup v-else v-model="addData.travelSurchargeStatus" >
            <Radio :label="1" style="margin-right:15px;"> 开启 </Radio>
            <Radio :label="0" style="margin-right:15px;"> 关闭 </Radio>
          </RadioGroup>
          <p v-show="addData.travelSurchargeStatus===1">播报内容：已添加X元附加费</p>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="addSubmit()">确定</Button>
        <Button v-if="handleType!==3" type="text" @click="formReset()">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { ruleValidate, } from "./fields";
import { businessInfo } from "../fields";
import importFile from '_a/import-file/index.vue'
import {
  addStrategyVoice,
  editStrategyVoice,
  queryStrategyVoiceDetailByUuid,
  queryCityListByBusinessType
} from "_o/api/driver-broadcast";
import uploadLookAll from "../../upload-look-all"

const handleTypeMap = {
  1: {
    title: "新建策略语音配置",
    type: "新建"
  },
  2: {
    title: "编辑策略语音配置",
    type: "编辑"
  },
  3: {
    title: "策略语音配置详情",
    type: "详情"
  }
};

export default {
  name: "add-strategy-modal",
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
      isShow:false,
      ruleValidate,
      businessInfo,
      detaultAddData: {
        strategyName: '',
        businessTypeList: [],
        cityCodeList: [],
        effectiveTime: '',
        sendTimes: null,
        appStartContent: '',
        driverOnlineContent: '',
        amPassengerBoardedContent: '',
        pmPassengerBoardedContent: '',
        routeEndContent: '',
        travelSurchargeStatus: null,
        arriveDestinationMiles:null
      },
      addData: {
        businessTypeList: [],
        ...this.detaultAddData
      },
      cityList: [],
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
    };
  },
  components: {
    importFile,
    uploadLookAll
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
  methods: {
    // 获取详情
    getDetail(value) {
      let params = {
        uuid: this.uuid,
        type: this.type
      };
      queryStrategyVoiceDetailByUuid(params).then(res => {
        let data = res.data.data||{}
        data.businessTypeList = [data.businessType]
        data.cityCodeList = [data.cityCode]
        // 详情接口数据格式转为我们能用的格式
        this.addData = data
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
          params.effectiveTime = this.$moment(params.effectiveTime).format('YYYY-MM-DD HH:mm:ss')
          if (this.handleType === 2) params.uuid = this.uuid;
          // 数据按照api要求调整
          let axiosFun = this.isAdd ? addStrategyVoice : editStrategyVoice;
          if(!params.appStartContent){
            this.$Message.warning('APP开机播报内容不能为空')
            return
          } 
          if(!params.driverOnlineContent){
            this.$Message.warning('司机上线播报内容不能为空')
            return
          }   
          if(!params.amPassengerBoardedContent){
            this.$Message.warning('白天播报内容不能为空')
            return
          }  
          if(!params.pmPassengerBoardedContent){
            this.$Message.warning('夜间播报内容不能为空')
            return
          }  
          if(!params.arriveDestinationContext){
            this.$Message.warning('即将到达目的地播报内容不能为空')
            return
          } 
          if(!params.arriveDestinationMiles){
            this.$Message.warning('即将到达目的地公里数不能为空')
            return
          }  
          if(!params.routeEndContent){
            this.$Message.warning('行程结束播报不能为空')
            return
          }
          console.log(params)
          axiosFun(params).then(res => {
            that.$Message.success(`${handleTypeMap[this.handleType].type}成功！`);
            that.formReset(true);
          })
        }
      });
    },
    // isReload：是否重新加载列表页面数据
    formReset(isReload) {
      this.$refs["adForm"].resetFields();
      this.$emit("close", isReload);
    },
    // 切换产品线，清空城市
    changeBusiness(value) {
      this.addData.cityCodeList = [];
      let businessTypeList = this.addData.businessTypeList
      if(businessTypeList.length===0){
        return false
      }
      queryCityListByBusinessType({businessTypeList: businessTypeList}).then(res => {
        this.cityList = res.data.data||[]
      })
    },
    uploadAllSuccessApp(val){
      console.log('suc',val)
      this.$Message.success('上传成功')
      this.addData.appStartContent = val.fileUrl;
    },
    changeApp(val){
      this.addData.appStartContent = ""
    },  
    uploadAllSuccessDriver(val){
      console.log('suc',val)
      this.$Message.success('上传成功')
      this.addData.driverOnlineContent = val.fileUrl;
    },
    changeDriver(val){
      this.addData.driverOnlineContent = ""
    },  
    uploadAllSuccessAm(val){
      console.log('suc',val)
      this.$Message.success('上传成功')
      this.addData.amPassengerBoardedContent = val.fileUrl;
    },
    changeDayAm(val){
      this.addData.amPassengerBoardedContent = ""
    }, 
    uploadAllSuccessPm(val){
      console.log('suc',val)
      this.$Message.success('上传成功')
      this.addData.pmPassengerBoardedContent = val.fileUrl;
    },
    changeDayPm(val){
      this.addData.pmPassengerBoardedContent = ""
    },  
    uploadAllSuccessArrive(val){
      console.log('suc',val)
      this.$Message.success('上传成功')
      this.addData.arriveDestinationContext = val.fileUrl;
    },
    changeArrive(val){
      this.addData.arriveDestinationContext = ""
    }, 
     uploadAllSuccessRoute(val){
      console.log('suc',val)
      this.$Message.success('上传成功')
      this.addData.routeEndContent = val.fileUrl;
    },
    changeRoute(val){
      this.addData.routeEndContent = ""
    },
  },
  watch: {
    show() {
      this.isShow = this.show;
      if (this.isShow) {
        this.$refs["adForm"] && this.$refs["adForm"].resetFields();
        if(this.handleType !== 1)  this.getDetail();
        else this.addData = { businessTypeList: [],...this.detaultAddData }
      }
    }
  }
};
</script>
<style lang="less">
.add-strategy {
  .ivu-modal {
    top: 20px;
  }
  .multi-hei .ivu-select-selection{
    min-height: 62px;
  }
  .box-tit{
    font-size: 15px;
    color:#000;
    padding-left: 10px;
    &::before {
      display: inline-block;
      content: "";
      width: 3px;
      height: 15px;
      background: #2d8cf0;
      position: relative;
      left: -5px;
      top:1px;
    }
  }
  .box-divider{
    margin-top: 10px;
  }
  .no-margin.ivu-form-item{
    margin-bottom:0;
  }
  .two-box{
    margin-left: 50px;
    padding-top:20px;
    margin-bottom:24px;
    border:1px solid #ddd;
  }
  .mb-3{
    margin-bottom: 3px;
  }
}
</style>