<template>
  <div>
    <Form ref="formValidate" :model="params" :rules="ruleValidate" :label-width="180">
      <div class="flex-box">
        <FormItem label="所选城市 :">{{parentParams.cityName}}</FormItem>
        <FormItem label="业务线 :">{{typeModuleMap[parentParams.businessType]}}</FormItem>
      </div>
			<div class="flex-box">
				<FormItem label="车型等级 :" prop="carLevel">
					<span v-if="!addViewStatus">{{params.carLevel?carTypeMap[params.carLevel]:'暂无'}}</span>
					<Select
						v-if="addViewStatus && parentParams.businessType==4"
						v-model="params.carLevel"
						placeholder="请选择车型等级"
						style="width: 200px">
						<Option :value="1">经济型</Option>
					</Select>
					<Select
						v-if="addViewStatus && parentParams.businessType==2"
						v-model="params.carLevel"
						placeholder="请选择车型等级"
						style="width: 200px">
						<Option :value="2">舒适型</Option>
						<Option :value="3">行政型</Option>
						<Option :value="4">商务型</Option>
					</Select>
				</FormItem>
				<FormItem label="订单类型 :" prop="typeTime">
					<span v-if="!addViewStatus">{{typeTimeMap[params.typeTime]}}</span>
					<Select
						v-if="addViewStatus"
						v-model="params.typeTime"
						placeholder="请选择订单类型"
						style="width: 200px">
						<Option :value="1">实时</Option>
						<Option :value="2">预约</Option>
					</Select>
				</FormItem>
			</div>
      <div class="flex-box">
        <FormItem label="策略名称 :" prop="fareTypeNote">
          <span v-if="!addViewStatus" style="width:160px;display:inline-block">{{params.fareTypeNote}}</span>
          <Input
            v-if="addViewStatus"
            :maxlength="20"
            v-model="params.fareTypeNote"
            placeholder="请输入策略名称"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem label="生效时间 :" prop="effectiveTime" class="short-label">
          <span v-if="!addViewStatus" class="width200">{{params.effectiveTime}}</span>
          <DatePicker
            v-if="addViewStatus"
            v-model="params.effectiveTime"
            type="datetime"
            :editable="false"
            placeholder="请选择生效时间"
            style="width: 200px"
            @on-change="selectDate"
          ></DatePicker>
        </FormItem>
      </div>
      <!-- 起步费 -->
      <div class="check-box">
        <FormItem class="min-label" v-if="addViewStatus || params.startFareStatus">
          <Checkbox :disabled="!addViewStatus" v-model="params.startFareStatus">起步费</Checkbox>
        </FormItem>
        <div class="flex-box" style="padding-left:58px;" v-if="params.startFareStatus">
          <FormItem label="起步费(元):" prop="startFare" class="short-label right15">
            <span v-if="!addViewStatus" class="width100">{{params.startFare}}</span>
            <InputNumber
              style="width: 80px"
              v-if="addViewStatus"
              :min="0"
              :max="999.99"
              v-model="params.startFare"
              placeholder="请输入"
              @on-blur="FormatNumber(params.startFare,'startFare')"
            ></InputNumber>
          </FormItem>
          <FormItem label="起步里程（公里） :" prop="startTrip" class="short-label right15">
            <span v-if="!addViewStatus" class="width100">{{params.startTrip}}</span>
            <InputNumber
              style="width: 80px"
              v-if="addViewStatus"
              :min="0"
              :max="999.9"
              v-model="params.startTrip"
              placeholder="请输入"
              @on-blur="FormatNumber(params.startTrip,'startTrip',1)"
            ></InputNumber>
          </FormItem>
          <FormItem label="起步时长（分钟） :" prop="startDuration" class="short-label right15">
            <span v-if="!addViewStatus" class="width100">{{params.startDuration}}</span>
            <InputNumber
              style="width: 80px"
              v-if="addViewStatus"
              :min="0"
              :max="999"
              :precision="0"
              v-model="params.startDuration"
              placeholder="请输入"
            ></InputNumber>
          </FormItem>
        </div>
      </div>
      <!-- 最低消费 -->
      <div class="check-box">
        <FormItem class="min-label" v-if="addViewStatus||params.lowestFareStatus">
          <Checkbox :disabled="!addViewStatus" v-model="params.lowestFareStatus">最低消费</Checkbox>
        </FormItem>
        <div class="flex-box" style="padding-left:70px;" v-if="params.lowestFareStatus">
          <FormItem label="最低消费(元):" prop="lowestFare" class="short-label right15">
            <span v-if="!addViewStatus" class="width200">{{params.lowestFare}}</span>
            <InputNumber
              style="width: 80px"
              v-if="addViewStatus"
              :min="0"
              :max="999.99"
              v-model="params.lowestFare"
              placeholder="请输入"
              @on-blur="FormatNumber(params.lowestFare,'lowestFare')"
            ></InputNumber>
          </FormItem>
          <FormItem label="最低消费计算节点 :" prop="model" class="short-label">
            <span v-if="!addViewStatus" class="width200">{{params.model==1?'计算折扣矩阵前':params.model==2?'计算折扣矩阵后':''}}</span>
            <Select
              v-if="addViewStatus"
              v-model="params.model"
              placeholder="请选择"
              style="width: 200px">
              <Option :value="1">计算折扣矩阵前</Option>
              <Option :value="2">计算折扣矩阵后</Option>
            </Select>
          </FormItem>
        </div>
      </div>
      <!-- 里程时段 -->
      <Form
        class="flex-box rel-box"
        v-for="(item,index) in params.tripFare"
        :ref="'tripFare'+index"
        :model="item"
        :rules="tripValidate"
        :label-width="180"
        :key="index-100">
        <FormItem :label="'里程时段'+(index+1)+' ：'" prop="time">
          <span v-if="!addViewStatus" class="width200">{{item.startTime+'-'+item.endTime}}</span>
          <TimePicker
            class="right30"
            v-if="addViewStatus"
            v-model="item.time"
            :editable="false"
            type="timerange"
            placeholder="请选择时段"
            @on-change="tripTimeChange(index)"
            style="width: 168px">
          </TimePicker>
        </FormItem>
        <FormItem label="里程费（元/公里）：" prop="fare" class="list-label">
          <span v-if="!addViewStatus" class="width200">{{item.fare}}</span>
          <InputNumber
            style="width: 150px"
            v-if="addViewStatus"
            :min="0"
            :max="999.99"
            :step="0.01"
            v-model="item.fare"
            placeholder="请输入里程费"
            @on-blur="FormatNumber(item.fare,'tripFare,'+index+',fare')"
          ></InputNumber>
        </FormItem>
        <Icon v-if="index>0 && addViewStatus" @click="removeTrip(index)" class="remove-icon" type="ios-remove-circle-outline" />
      </Form>
      <Button v-if="addViewStatus" type="primary" size="small" @click="addTripItem" style="margin:0 0 20px 180px;">新增时段里程费</Button>
      <!-- 时长时段 -->
      <Form
        class="flex-box rel-box"
        v-for="(item,index) in params.timeFare"
        :ref="'timeFare'+index"
        :model="item"
        :rules="timeValidate"
        :label-width="180"
        :key="index">
        <FormItem :label="'时长时段'+(index+1)+' ：'" prop="time">
          <span v-if="!addViewStatus" class="width200">{{item.startTime+'-'+item.endTime}}</span>
          <TimePicker
            class="right30"
            v-if="addViewStatus"
            v-model="item.time"
            :editable="false"
            type="timerange"
            placeholder="请选择时段"
            @on-change="timeTimeChange(index)"
            style="width: 168px">
          </TimePicker>
        </FormItem>
        <FormItem label="时长费（元/分钟）：" prop="fare" class="list-label">
          <span v-if="!addViewStatus" class="width200">{{item.fare}}</span>
          <InputNumber
            style="width: 150px"
            v-if="addViewStatus"
            :min="0"
            :max="999.99"
            :step="0.01"
            @on-blur="FormatNumber(item.fare,'timeFare,'+index+',fare')"
            v-model="item.fare"
            placeholder="请输入时长费"
          ></InputNumber>
        </FormItem>
        <Icon v-if="index>0 && addViewStatus" @click="removeTime(index)" class="remove-icon" type="ios-remove-circle-outline" />
      </Form>
      <Button v-if="addViewStatus" type="primary" size="small" @click="addTimeItem" style="margin:0 0 20px 180px;">新增时段时长费</Button>
      
      <!-- 底部其他 -->
      <div class="flex-box">
        <FormItem label="远途里程（公里） :" prop="haulBackTrip">
          <span v-if="!addViewStatus" class="width200">{{params.haulBackTrip}}</span>
          <InputNumber
            style="width: 200px"
            v-if="addViewStatus"
            :min="0"
            :max="999"
            :precision="0"
            v-model="params.haulBackTrip"
            placeholder="请输入远途里程"
          ></InputNumber>
        </FormItem>
        <FormItem label="远途里程费（元/公里） :" prop="haulBackTripFare">
          <span v-if="!addViewStatus" class="width200">{{params.haulBackTripFare}}</span>
          <InputNumber
            style="width: 150px"
            v-if="addViewStatus"
            :min="0"
            :step="0.01"
            :max="999.99"
            @on-blur="FormatNumber(params.haulBackTripFare,'haulBackTripFare')"
            v-model="params.haulBackTripFare"
            placeholder="请输入远途里程费"
          ></InputNumber>
        </FormItem>
      </div>
      <FormItem label="夜间费（元/公里） :" prop="nightTripFare">
        <span v-if="!addViewStatus" class="width200">{{params.nightTripFare}}</span>
        <InputNumber
          style="width: 200px"
          v-if="addViewStatus"
          :min="0"
          :step="0.01"
          :max="999.99"
          @on-blur="FormatNumber(params.nightTripFare,'nightTripFare')"
          v-model="params.nightTripFare"
          placeholder="请输入夜间费"
        ></InputNumber>
      </FormItem>
      <div class="flex-box">
        <FormItem label="免费等待时长（分钟） :" prop="freeWaitTime">
          <span v-if="!addViewStatus" class="width200">{{params.freeWaitTime}}</span>
          <InputNumber
            style="width: 200px"
            v-if="addViewStatus"
            :min="0"
            :max="999"
            :precision="0"
            v-model="params.freeWaitTime"
            placeholder="请输入免费等待时长"
          ></InputNumber>
        </FormItem>
        <FormItem label="超时等待费（元/分钟） :" prop="beyondWaitFare">
          <span v-if="!addViewStatus" class="width200">{{params.beyondWaitFare}}</span>
          <InputNumber
            style="width: 150px"
            v-if="addViewStatus"
            :min="0"
            :max="999.99"
            :step="0.01"
            @on-blur="FormatNumber(params.beyondWaitFare,'beyondWaitFare')"
            v-model="params.beyondWaitFare"
            placeholder="请输入超时等待费"
          ></InputNumber>
        </FormItem>        
      </div>
      <div class="flex-box">
        <FormItem label="基础信息服务费（元） :" prop="basicInformationFee">
          <span v-if="!addViewStatus" class="width200">{{params.basicInformationFee}}</span>
          <InputNumber
            style="width: 200px"
            v-if="addViewStatus"
            :min="0"
            :step="0.01"
            :max="99.99"
            @on-blur="FormatNumber(params.basicInformationFee,'basicInformationFee')"
            v-model="params.basicInformationFee"
            placeholder="请输入基础信息服务费"
          ></InputNumber>
        </FormItem>        
      </div>
    </Form>
    <div class="popView-footer-wrap">
      <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
      <Button v-if="addViewStatus" size="large" type="primary" @click="commit(1)">确定</Button>
      <Button v-else size="large" type="primary" @click="commit(0)">确定</Button>
    </div>
  </div>
</template>

<script>
import { addPriceStrategy, priceStrategyDetail } from "_g/api/openCity";
import { typeTimeMap, typeModuleMap ,carTypeMap} from "_g/config/status-map";
import { hasTimesection } from '@/libs/tools.js'
// import { arrValueValidate } from '@/libs/validate'
import "@/styles/cyk-style.css";

export default {
  props: ["value", "parentParams"],
  data() {
    const effectiveTime = (rule, value, callback) => {
      let date = value || null;
      if (date === null) callback(new Error("请选择生效时间"));
      else {
        let timestamp = new Date(date).getTime();
        if (timestamp < Date.now()) {
          callback(new Error("生效时间不得小于当前时间"));
        } else callback();
      }
    };
    const validateNum = (rule, value, callback) => {
      if (value === null) callback(new Error("请填写内容"));
      else callback();
    };
    const timeListValidate = (rule, value, callback) => {
      let res = value.every(item=>{
        return item
      })
      if (!res) {
        callback(new Error("请输入内容"));
      }else if(value[0]==value[1]){
        callback(new Error('开始时段不可等于结束时段'))
      }else{
        // 时间交叉
        let timeList = this.params.timeFare
        // let temp = true
        let num = 0
        for (let i = 0; i < timeList.length; i++) {
          if (!hasTimesection(value, timeList[i].time)){
            num++
          }
        }
        if(num>1){
          callback(new Error('时段不可交叉'))
        }else{
          callback()
        }
      }
    }
    const tripListValidate = (rule, value, callback) => {
      let res = value.every(item=>{
        return item
      })
      if (!res) {
        callback(new Error("请输入内容"));
      }else if(value[0]==value[1]){
        callback(new Error('开始时段不可等于结束时段'))
      }else{
        // 时间交叉
        let tripList = this.params.tripFare
        // let temp = true
        let num = 0
        for (let i = 0; i < tripList.length; i++) {
          if (!hasTimesection(value, tripList[i].time)){
            num++
          }
        }
        if(num>1){
          callback(new Error('时段不可交叉'))
        }else{
          callback()
        }
      }
    }
    return {
      typeTimeMap,
      typeModuleMap,
      carTypeMap,
      addViewStatus: false, // true：新增  false：详情
      params: {}, // 定价策略参数
      initParams: {
        carLevel:'', // 车型等级
        typeTime: '', //订单类型
        fareTypeNote: "", //策略名称
        effectiveTime: "", //生效时间
        startFareStatus: false,//是否有起步费
        lowestFareStatus: false,//是否有最低消费
        startFare: null,//起步费
        startTrip: null,//起步里程
        startDuration: null,//起步时长
        lowestFare: null,//最低消费
        model: null,//最低消费计算节点
        tripFare: [
          {
            fare: null,
            time: '',
          }
        ],
        timeFare: [
          {
            fare: null,
            time: '',
          }
        ],
        beyondWaitFare: null,
        freeWaitTime: null,
        haulBackTrip: null,
        haulBackTripFare: null,
        nightTripFare: null,
        basicInformationFee: null
      },
      timeValidate: {
        time: [
          { required: true,type:'array',message:'请填写内容', trigger: "blur" },
          {required: true, validator: timeListValidate, trigger: 'change'}
        ],
        fare: [
          { required: true, type:'number',message:'请填写内容', trigger: "blur" }
        ]
      },
      tripValidate: {
        time: [
          { required: true,type:'array',message:'请填写内容', trigger: "blur" },
          {required: true, validator: tripListValidate, trigger: 'change'}
        ],
        fare: [
          { required: true, type:'number',message:'请填写内容', trigger: "blur" }
        ]
      },
      ruleValidate: {
        fareTypeNote: [
          { required: true, message: "请输入定价策略名称", trigger: "change" },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
            message: "仅支持中文英文和数字",
            trigger: "blur"
          }
        ],
        effectiveTime: [
          { required: true, validator: effectiveTime, trigger: "change" }
        ],
        carLevel: [
          { required: true, type:'number', message: "请选择车型等级", trigger: "change" }
        ],
        typeTime: [
          { required: true, type:'number', message: "请选择订单类型", trigger: "change" }
        ],
        startFare: [
          { required: true, type:'number',message:'请填写内容', trigger: "blur" }
        ],
        lowestFare: [
          { required: true, type:'number',message:'请填写内容', trigger: "blur" }
        ],
        startTrip: [
          { required: true, type:'number',message:'请填写内容', trigger: "blur" }
        ],
        model: [
          { required: true, type:'number',message:'请选择最低消费计算节点', trigger: "blur" }
        ],
        startDuration: [
          { required: true, type:'number',message:'请填写内容', trigger: "blur" }
        ],
        startDuratio: [
          { required: true, validator: validateNum, trigger: "change" }
        ],
        beyondWaitFare: [
          { required: true, validator: validateNum, trigger: "change" }
        ],

        freeWaitTime: [
          { required: true, validator: validateNum, trigger: "change" }
        ],

        haulBackTrip: [
          { required: true, validator: validateNum, trigger: "change" }
        ],
        haulBackTripFare: [
          { required: true, validator: validateNum, trigger: "change" }
        ],
        nightTripFare: [
          { required: true, validator: validateNum, trigger: "change" }
        ],
        premiumOneRate: [
          { required: true, validator: validateNum, trigger: "change" }
        ],
        premiumTwoRate: [
          { required: true, validator: validateNum, trigger: "change" }
        ]
      }
    };
  },
  watch: {
    value() {
      if (this.value) {
        if (this.parentParams.detailUuid === null) {
          // 新增定价
          this.addViewStatus = true;
          this.params = JSON.parse(JSON.stringify(this.initParams))
          this.resetForm()
        } else {
          // 定价详情
          this.addViewStatus = false;
          this.resetForm()
          this.getDetail();
        }
      }
    }
  },
  methods: {
    /*
     *@description: 格式化-保留一位小数
     *@modifyContent: 起步费起步里程由正整数，修改为保留一位小数
     *@author: wuxuan
     *@date: 2019-08-21 17:01:23
    */
    FormatNumber(VauleNumber,keyName,fixNum=2){
      if(VauleNumber){
        let newVal = parseFloat(VauleNumber.toFixed(fixNum))
        if(keyName.indexOf(',')>-1){
          let k = keyName.split(',')
          let k0 = k[0]
          let k1 = k[1]
          let k2 = k[2]
          this.$set(this.params[k0][k1],k2,newVal)
        }else{
          this.$set(this.params,keyName,newVal)
        }
      }
    },
    removeTrip(index){
      this.params.tripFare.splice(index,1)
    },
    removeTime(index){
      this.params.timeFare.splice(index,1)
    },
    resetForm(){
      this.$refs && this.$refs.formValidate && this.$refs.formValidate.resetFields();
      this.$refs.timeFare0 && this.$refs.timeFare0[0] && this.$refs.timeFare0[0].resetFields();
      this.$refs.tripFare0 && this.$refs.tripFare0[0] && this.$refs.tripFare0[0].resetFields();
      
    },
    addTripItem(){
      this.params.tripFare.push({
        fare: null,
        time: ''
      })
    },
    addTimeItem(){
      this.params.timeFare.push({
        fare: null,
        time: ''
      })
    },
    getDetail() {
      // 获取详情信息
      console.log("this.parentParams",this.parentParams)
      priceStrategyDetail({ uuid: this.parentParams.detailDriverUuid }).then(res => {
        this.params = res.data.data;
        console.log(this.params)
      });
    },
    selectDate(date) {
      this.params.effectiveTime = date;
    },
    tripTimeChange(index){
      let time = this.params.tripFare[index].time
      this.params.tripFare[index].startTime = time[0]
      this.params.tripFare[index].endTime = time[1]
    },
    timeTimeChange(index){
      let time = this.params.timeFare[index].time
      this.params.timeFare[index].startTime = time[0]
      this.params.timeFare[index].endTime = time[1]
    },
    validateTime(list,msg){
      let message = msg+'时段必须组成完整的00:00:00至23:59:59'
      // let len = list.length
      let isStart = false
      let isEnd = false
      let startHash = {}
      let endHash = {}
      list.forEach(item=>{
        if(item.startTime == '00:00:00'){
          isStart = true
        }
        if(item.endTime == '23:59:59'){
          isEnd = true
        }
        startHash[item.startTime] = item.startTime
        endHash[item.endTime] = item.endTime
      })
      if(!isStart || !isEnd){
        this.$Message.warning(message)
        return false
      }
      if(list.length===1){
        return true
      }
      let isFull = true
      list.forEach((item,index)=>{
        let startTime = item.startTime
        if(startTime!='00:00:00'){
          if(!endHash[startTime]){
            isFull = false
          }
        }
      })
      if(isFull){
        return true
      }else{
        this.$Message.warning(message)
        return false
      }
    },
    commit(temp) {
      if (temp) {
        let tripList = this.params.tripFare
        let timeList = this.params.timeFare
        let [isSuccess1, isSuccess2] = [false, true]
        this.$refs.formValidate.validate().then(status => {
          isSuccess1 = status
          return new Promise((resolve) => { resolve() })
        }).then(() => {
          tripList.forEach((item,index)=>{
            let key='tripFare'+index
            this.$refs[key][0].validate().then(status => {
              if(!status){
                isSuccess2 = false
              }
            });
          })
          timeList.forEach((item,index)=>{
            let key='timeFare'+index
            this.$refs[key][0].validate().then(status => {
              if(!status){
                isSuccess2 = false
              }
            });
          })
          return new Promise((resolve) => { resolve() })
        }).then(() => {
          if (isSuccess1 && isSuccess2) {
            let isTripSuccess = this.validateTime(tripList,'里程')
            if(!isTripSuccess){
              return false
            }
            let isTimeSuccess = this.validateTime(timeList,'时长')
            if(!isTimeSuccess){
              return false
            }
            if(!this.params.lowestFareStatus){
              this.params.lowestFare = null
              this.params.model = null
            }
            if(!this.params.startFareStatus){
              this.params.startFare = null
              this.params.startTrip = null
              this.params.startDuration = null
            }
            let params = { ...this.params };
            params = Object.assign(params, this.parentParams);
            params.typeTime = Number(params.typeTime);
            params.businessType = Number(params.businessType);
            addPriceStrategy(params).then(res => {
              this.$Message.success("新建成功");
              this.$emit("input", false);
              this.$emit("on-confirm");
            });
          }
        })
      } else {
        this.$emit("input", false);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.list-label {
  /deep/ .ivu-form-item-label {
    width: 160px !important;
  }
  /deep/ .ivu-form-item-content {
    margin-left: 160px !important;
  }
}
.short-label {
  /deep/ .ivu-form-item-label {
    width: 140px !important;
  }
  /deep/ .ivu-form-item-content {
    margin-left: 140px !important;
  }
}
.min-label {
  /deep/ .ivu-form-item-label {
    width: 108px !important;
  }
  /deep/ .ivu-form-item-content {
    margin-left: 108px !important;
  }
}
.label90 {
  /deep/ .ivu-form-item-label {
    width: 90px !important;
  }
  /deep/ .ivu-form-item-content {
    margin-left: 90px !important;
  }
}
.check-box {
  padding-left: 0;
}
.rel-box{
  position: relative;
}
.remove-icon{
  position: absolute;
  right:45px;
  top:7px;
  font-size: 20px;
  color:#e61f10;
  font-weight: bold;
  cursor: pointer;
}
</style>
