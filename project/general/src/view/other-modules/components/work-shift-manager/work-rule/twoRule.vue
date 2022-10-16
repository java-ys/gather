<template>
  <div class="twoRuleStyle">
    <Form
      ref="formValidate"
      :model="formItem"
      :label-width="136"
      :rules="ruleValidate"
    >
    <FormItem label="适用城市：" prop="cityCode">
      <Select
        :disabled=" ruleType =='X' || ruleType =='E'  "
        v-model="formItem.cityCode"
        style="width: 200px"
        filterable
        placeholder="请选择城市"
      >
        <Option
          v-for="(item, index) in cityList"
          :value="item.cityID || item.cityId"
          :key="index"
          >{{ item.city }}</Option
        >
      </Select>
    </FormItem>
    <FormItem label="排班名称：" prop="shiftName">
      <Input
        v-model="formItem.shiftName"
        :disabled="ruleType=='X'"
        placeholder="请输入排班名称..."
        :maxlength="50"
        style="width: 200px"
      ></Input>
    </FormItem>
    <FormItem label="生效时间：" prop="effectiveTime">
      <DatePicker
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        v-model="formItem.effectiveTime"
        :disabled="ruleType=='X'"
        placeholder="请选择生效时间"
        style="width: 200px"
      ></DatePicker>
    </FormItem>
    <!-- <FormItem label="换班时段：" style="position: relative;">
      <span style="position: absolute;left: -82px; top: 10px;color: #ed4014;line-height: 1;font-size: 12px;font-family: SimSun;display: inline-block;">*</span>
      <div style="display: flex">
        <FormItem prop="changeStartTime">
          <TimePicker
            :disabled="ruleType=='X'"
            format="HH:mm"
            v-model="formItem.changeStartTime"
            placeholder="请选择"
            style="width: 112px"
          ></TimePicker>
        </FormItem>
        <span style="margin: 0 10px;">一</span>
        <FormItem  prop="changeEndTime">
           <TimePicker
            :disabled="ruleType=='X'"
            format="HH:mm"
            v-model="formItem.changeEndTime"
            placeholder="请选择"
            style="width: 112px"
          ></TimePicker>
        </FormItem>
      </div>
    </FormItem> -->
      <div v-for="(item, index) in formItem.data"  :key="index">
        <Form ref="wrapRef" :model="formItem" :label-width="95">
        <p style="margin-left: 30px;line-height: 40px;font-size: 16px;">班段规则{{ index + 1 }}：</p>
        <div style="margin-left: 30px">
          <Card style="width: 95%;margin-bottom: 20px;">
            <FormItem label="名称："  :prop="'data.' + index + '.ruleName'"
              style="margin-bottom: 20px"
              :rules="{
                required: true,
                message: '名称不能为空',
                trigger: 'blur'
              }">
              <Input
               :maxlength="50"
               :disabled="ruleType=='X'"
                v-model="item.ruleName"
                placeholder="请输入..."
                style="width: 200px"
              ></Input>
            </FormItem>
            <FormItem label="适用司机：" :prop="'data.' + index + '.driverTag'"
              style="margin-bottom: 20px"
              :rules="{
                required: true,
                message: '适用司机不能为空',
                trigger: 'change'
              }">
              <Select
                 :disabled=" (ruleType =='X' || ruleType =='E') && newCity "
                v-model="item.driverTag"
                style="width: 200px"
                placeholder="请选择"
              >
                <Option v-for="(item,index) in driverType" :value="item.itemcode"  :key="index">{{ item.itemvalue }}</Option>
              </Select>
            </FormItem>
             <FormItem label="切换时间点：" :prop="'data.' + index + '.cutTime'"
                  style="margin-bottom: 20px"  :rules="[{
                    required: true,
                    message: '时长不能为空',
                    trigger: 'change'
                  }]">
                  <div style="display: flex">
                    <TimePicker
                    format="HH:mm"
                    :disabled="ruleType=='X'"
                    v-model="item.cutTime"
                    placeholder="请选择"
                    style="width: 112px"
                  ></TimePicker>
                    
                  </div>
              
            </FormItem>
            <FormItem label="排班时段：" style="position: relative;margin-bottom: 0">
               <span style="position: absolute;left: -82px; top: 10px;color: #ed4014;line-height: 1;font-size: 12px;font-family: SimSun;display: inline-block;">*</span>
              <div style="display: flex;margin-bottom: 0">
                <FormItem :prop="'data.' + index + '.shiftStartTime'"
                  style="margin-bottom: 20px"
                  :rules="{
                    required: true,
                    message: '时间不能为空',
                    type: 'string',
                    trigger: 'change'
                  }">
                  <TimePicker
                    :disabled="ruleType=='X'"
                    format="HH:mm"
                    v-model="item.shiftStartTime"
                    placeholder="请选择"
                    style="width: 112px"
                  ></TimePicker>
                </FormItem>
                <span style="margin: 0 10px;">一</span>
                <FormItem class="myTime" :prop="'data.' + index + '.shiftEndTime'"
                  style="margin-bottom: 20px"
                  :rules="{
                    required: true,
                    message: '时间不能为空',
                    type: 'string',
                    trigger: 'change'
                  }">
                  <div class="new-date" :style="{borderColor: borcolor2[index].value && item.shiftEndTime == '' ? 'red':'#dcdee2'}">
                     <span v-if="(item.shiftStartTime&&item.shiftEndTime) && item.shiftStartTime>=item.shiftEndTime">次日</span>
                    <TimePicker
                      :disabled="ruleType=='X'"
                      v-model="item.shiftEndTime"
                      format="HH:mm"
                      placeholder="请选择"
                      style="width: 112px"
                      @on-change="verifyTimeChange(index,'value')"
                    ></TimePicker>
                  </div>
                </FormItem>
                
              </div>
            </FormItem>
            <FormItem label="换班时段：" style="margin-bottom: 0">
               <span style="position: absolute;left: -82px; top: 10px;color: #ed4014;line-height: 1;font-size: 12px;font-family: SimSun;display: inline-block;">*</span>
               <div style="display: flex">
              <FormItem
                :rules="{
                  required: true,
                  message: '时间不能为空',
                  type: 'string',
                  trigger: 'change'
                }"
              :prop="'data.' + index + '.changeStartTime'"
              style="margin-bottom: 20px">
                <TimePicker
                  :disabled="ruleType=='X'"
                  format="HH:mm"
                  v-model="item.changeStartTime"
                  placeholder="请选择"
                  style="width: 112px"
                ></TimePicker>
              </FormItem>
              <span style="margin: 0 10px;">一</span>
              <FormItem class="myTime" :prop="'data.' + index + '.changeEndTime'"
                  style="margin-bottom: 20px"
                  :rules="{
                    required: true,
                    message: '时间不能为空',
                    type: 'string',
                    trigger: 'change'
                  }">
                <div class="new-date ivu-form-item-error"  :style="{borderColor: borcolor2[index].cut && item.changeEndTime == '' ? 'red':'#dcdee2'}">
                  <span v-if="(item.changeStartTime&&item.changeEndTime) && item.changeStartTime>=item.changeEndTime">次日</span>
                  <TimePicker
                    :disabled="ruleType=='X'"
                    v-model="item.changeEndTime"
                    format="HH:mm"
                    placeholder="请选择"
                    style="width: 112px"
                    @on-change="verifyTimeChange(index,'cut')"
                  ></TimePicker>
                </div>
              </FormItem>
              <p style="margin-left: 10px"><span style="color: red">*</span>换班时段不能在两个班段规则的排班时间内</p>
               </div>
            </FormItem>         
            <FormItem label="高峰时段：" >
              <Form :model="item" ref="refChild1">
                <div
                  v-for="(value, inde) in item.peakTimeDetailsApiDtoList"
                  :key="inde"
                >
                    <div style="display: flex">
                      <FormItem
                      style="margin-bottom: 20px">
                        <TimePicker
                        :disabled="ruleType=='X'"
                          format="HH:mm"
                          v-model="value.peakStartTime"
                          placeholder="请选择"
                          style="width: 112px"
                        ></TimePicker>
                      </FormItem>
                      <span style="margin: 0 10px;">一</span>
                      <FormItem class="myTime">
                        <div class="new-date ivu-form-item-error"  >
                          <span v-if="(value.peakStartTime&&value.peakEndTime) && value.peakStartTime>=value.peakEndTime">次日</span>
                          <TimePicker
                            :disabled="ruleType=='X'"
                            v-model="value.peakEndTime"
                            format="HH:mm"
                            placeholder="请选择"
                            style="width: 112px"
                          ></TimePicker>
                        </div>
                      </FormItem>
                      <Button
                      type="primary"
                      size="small"
                      icon="md-add"
                      style="margin-left: 5px;height: 30px;margin-top: 3px"
                      v-if="inde == 0 && ruleType!='X'"
                      @click="addTime(index,inde)"
                    ></Button>
                    <Button
                      type="primary"
                      size="small"
                      icon="md-remove"
                      style="margin-left: 5px;height: 30px;margin-top: 3px"
                      v-if="inde != 0 && ruleType!='X'"
                     @click="delTime(index,inde)"
                    ></Button>
                  </div>
                </div>
              </Form>
            </FormItem>
            <FormItem label="时长要求：" style="position: relative;">
               <span style="position: absolute;left: -82px; top: 10px;color: #ed4014;line-height: 1;font-size: 12px;font-family: SimSun;display: inline-block;">*</span>
              <Row>
                <Col span="5">
                  <FormItem :prop="'data.' + index + '.onlineDuration'"
                  style="margin-bottom: 20px"
                  class="new-item"
                  :rules="[{
                    required: true,
                    message: '时长不能为空',
                    trigger: 'change'
                  },{validator: validLast,  trigger: 'blur' }]">
                    在线时长：<Input
                    :disabled="ruleType=='X'"
                      v-model="item.onlineDuration"
                      :maxlength="4"
                      placeholder="请输入..."
                      style="width: 80px"
                    ></Input>
                    分钟
                  </FormItem>
                </Col>
                <Col span="5">
                  <FormItem :prop="'data.' + index + '.peakDuration'"
                  style="margin-bottom: 20px"
                  class="new-item"
                  :rules="[{
                    required: true,
                    message: '时长不能为空',
                    trigger: 'change'
                  },{validator: validLast,  trigger: 'blur' }]">
                    高峰时长：<Input
                      :disabled="ruleType=='X'"
                      v-model="item.peakDuration"
                      :maxlength="4"
                      placeholder="请输入..."
                      style="width: 80px"
                    ></Input>
                     分钟
                  </FormItem>
                </Col>
                <Col span="5">
                  <FormItem :prop="'data.' + index + '.chargeDuration'"
                  style="margin-bottom: 20px"
                  class="new-item"
                  :rules="[{
                    required: true,
                    message: '时长不能为空',
                    trigger: 'change'
                  },{validator: validLast,  trigger: 'blur' }]">
                    计费时长：<Input
                      :disabled="ruleType=='X'"
                      v-model="item.chargeDuration"
                      :maxlength="4"
                      placeholder="请输入..."
                      style="width: 80px"
                    ></Input>
                     分钟
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="旷工规则：">
              <Form :model="item" ref="refChild2">
                <div>
                  <div
                   style="margin-bottom: 20px;"
                    v-for="(value, inde) in item.dutyDurationGradientApiDtoList"
                    :key="inde"
                  >
                    <FormItem>
                      <Row>
                        <Col span="6">
                          <FormItem
                            :prop="
                              'dutyDurationGradientApiDtoList.' +
                                inde +
                                '.intervalLvalue'
                            "
                            :rules="[{validator: validNumber,  trigger: 'blur' }]"
                          >
                            <Input
                              :disabled="ruleType=='X'"
                              v-model="value.intervalLvalue"
                              :maxlength="4"
                              placeholder="请输入"
                              style="width: 80px"
                            ></Input>
                            (小时)
                            <span style="margin-left: 15px">≤上线时长<</span>
                          </FormItem>
                        </Col>
                        <Col span="4">
                          <FormItem :prop="
                              'dutyDurationGradientApiDtoList.' +
                                inde +
                                '.intervalRvalue'
                            "
                            :rules=" [{validator: validNumber,  trigger: 'blur' }]">
                            <Input
                            :disabled="ruleType=='X'"
                            :maxlength="4"
                              v-model="value.intervalRvalue"
                              placeholder="请输入"
                              style="width: 80px"
                            ></Input>
                            (小时)
                            <span style="margin-left: 5px"></span>
                          </FormItem>
                        </Col>
                        <Col span="7">
                          <FormItem :prop="'dutyDurationGradientApiDtoList.' + inde + '.dutyDays' "
                          >
                            旷工：<Select
                            clearable
                            :disabled="ruleType=='X'"
                              v-model="value.dutyDays"
                              style="width: 80px"
                            >
                              <Option :value=1>1</Option>
                              <Option :value=0.5>0.5</Option>
                            </Select>
                            <span style="margin-left: 5px">天</span>
                          </FormItem>
                        </Col>
                        <Col span="4">
                          <Button
                            type="primary"
                            size="small"
                            icon="md-add"
                            style="margin-left: 5px;height: 30px;margin-top: 3px"
                            v-if="inde == 0  && ruleType !='X'"
                            @click="addRule('Z',index)"
                          ></Button>
                          <Button
                            type="primary"
                            size="small"
                            icon="md-remove"
                            style="margin-left: 5px;height: 30px;margin-top: 3px"
                            v-if="inde != 0  && ruleType !='X'"
                            @click="delRule('Z', index,inde)"
                          ></Button>
                        </Col>
                      </Row>
                    </FormItem>
                  </div>
                </div>
              </Form>
              <p style="border-bottom: 2px solid #eee;margin-bottom: 20px;padding-top: 15px;"></p>
              <Form :model="item" ref="refChild3">
                <div style="margin-top: 20px;">
                  <div
                  style="margin-bottom: 20px;"
                    v-for="(value, inde) in item.dutyDurationGradientApiDtoList2"
                    :key="inde"
                  >
                    <FormItem>
                      <Row>
                        <Col span="6">
                          <FormItem
                            :prop="
                              'dutyDurationGradientApiDtoList2.' +
                                inde +
                                '.intervalLvalue'
                            "
                            :rules="[{validator: validNumber,  trigger: 'blur' }]"
                          >
                            <Input
                              v-model="value.intervalLvalue"
                              :disabled="ruleType=='X'"
                              :maxlength="4"
                              placeholder="请输入"
                              style="width: 80px"
                            ></Input>
                            (小时)
                            <span style="margin-left: 15px">≤高峰时长<</span>
                          </FormItem>
                        </Col>
                        <Col span="4">
                          <FormItem :prop="
                              'dutyDurationGradientApiDtoList2.' +
                                inde +
                                '.intervalRvalue'
                            "
                            :rules="[{validator: validNumber,  trigger: 'blur' }]">
                            <Input
                              v-model="value.intervalRvalue"
                              :disabled="ruleType=='X'"
                              :maxlength="4"
                              placeholder="请输入"
                              style="width: 80px"
                            ></Input>
                            (小时)
                            <span style="margin-left: 5px"></span>
                          </FormItem>
                        </Col>
                        <Col span="7">
                          <FormItem :prop="
                        'dutyDurationGradientApiDtoList2.' + inde + '.dutyDays'
                          "
                          >
                            旷工：<Select
                            clearable
                              v-model="value.dutyDays"
                              :disabled="ruleType=='X'"
                              style="width: 80px"
                            >
                              <Option :value=1>1</Option>
                              <Option :value=0.5>0.5</Option>
                            </Select>
                            <span style="margin-left: 5px">天</span>
                          </FormItem>
                        </Col>
                        <Col span="4">
                          <Button
                            type="primary"
                            size="small"
                            icon="md-add"
                            style="margin-left: 5px;height: 30px;margin-top: 3px"
                            v-if="inde == 0 && ruleType!='X'"
                            @click="addRule('G',index)"
                          ></Button>
                          <Button
                            type="primary"
                            size="small"
                            icon="md-remove"
                            style="margin-left: 5px;height: 30px;margin-top: 3px"
                            v-if="inde != 0 && ruleType!='X'"
                            @click="delRule('G', index,inde)"
                          ></Button>
                        </Col>
                      </Row>
                    </FormItem>
                  </div>
                </div>
              </Form>
            </FormItem>
          </Card>
        </div>
        </Form>
      </div>
     </Form>
  </div>
</template>
<script>

export default {
  props: {
    formItem: {
      type: Object,
      default: {}
    },
    ruleType: {
      type: String,
      default: ''
    },
    cityList: {
      type: Array,
      default: [
      ]
    },
    borcolor2: {
      type: Array,
      default: [
      ]
    },
    newCity: {
      type:Boolean,
      default: true
    },
    driverType: {
      type: Array,
      default: [
      ]
    }
  },
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
    
    return {
      ruleValidate: {
        cityCode: [
          { required: true, message: "适用城市不能为空", trigger: "change" }
        ],
        driverTag: [
          {
            required: true,
            message: "适用司机不能为空",
            trigger: "change"
          }
        ],
        shiftName: [
          {
            required: true,
            message: "排班名称不能为空",
            trigger: "blur"
          }
        ],
        effectiveTime: [
          { required: true, validator: effectiveTime, trigger: "change" }
        ],
        shiftStartTime: [
          {
            required: true,
            type: "string",
            message: "时间不能为空",
            trigger: "change"
          }
        ],
        shiftEndTime: [
          {
            required: true,
            type: "string",
            message: "时间不能为空",
            trigger: "change"
          }
        ],
        changeStartTime: [
          {
            required: true,
            type: "string",
            message: "时间不能为空",
            trigger: "change"
          }
        ],
        changeEndTime: [
          {
            required: true,
            type: "string",
            message: "时间不能为空",
            trigger: "change"
          }
        ],
        cutTime: [
          {
            required: true,
            type: "string",
            message: "时间不能为空",
            trigger: "change"
          }
        ],
        onlineDuration: [
          {
            required: true,
            message: "时长不能为空",
            type: "number",
            trigger: "blur"
          }
        ],
        peakDuration: [
          {
            required: true,
            message: "时长不能为空",
            type: "number",
            trigger: "blur"
          }
        ],
        chargeDuration: [
          {
            required: true,
            message: "时长不能为空",
            type: "number",
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
      cutTimeValidLast(rule, value, callback){
        console.log(value)
        if( value > "05:00" ) {
          callback(new Error('切换时间点不得迟于五点'));
        }else {
          callback();
        }
      },
     validateTime(rule, val, callback) {
        if (val[0] == ''){
            callback(new Error('请选择时间'));
        } else if(val.length == 0){
          callback(new Error('时间不能为空'));
        }else{
            callback();
        }
    },
    validNumber (rule, val, callback)  {
      var reg=/(^[0-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,1}$)/
      if (!reg.test(val) && val){
          callback(new Error('请输入正确得数字,并最多保留一位小数'));
      } else {
          callback();
      }
    },
    validLast(rule, val, callback) {
        var reg = /^[0-9]+$/;
        if (!reg.test(val) && val) {
            callback(new Error('请输入正确的正整数'));
        } else {
            callback();
        }
    },
    getTime(index,inde) {
      let timelist = this.formItem.data[index].peakTimeDetailsApiDtoList[inde];
      timelist.peakEndTime = timelist.time[1];
      timelist.peakStartTime = timelist.time[0];
    },

    handleSubmit() {
      this.$refs["ruleChild"].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    getType(value) {
      this.types = value;
    },
    addTime(index) {
      let newDataTime =  this.formItem.data[index].peakTimeDetailsApiDtoList;
      for(let i = 0; i < newDataTime.length; i++) {
        if(newDataTime[i].peakStartTime&& newDataTime[i].peakEndTime) {
            if(newDataTime.length>1) {
              for(let k = 0; k < newDataTime.length; k++) {
                let __start = newDataTime[k].peakStartTime;
                let __end = newDataTime[k].peakEndTime;
                 for(let j = 0; j < newDataTime.length; j++) {
                    if( j > k) {
                      let __startNew =newDataTime[j].peakStartTime;
                      let __endNew = newDataTime[j].peakEndTime;
                      if (__startNew >= __end || __endNew <= __start) {

                      } else {
                        this.$Message.warning(`班段规则${index+1}高峰时段时间存在交叉`);
                        return false;
                      }
                    }
                  }
              }
            }

        }else {
          this.$Message.warning(`请填写班段规则${index+1}高峰时段开始/结束时间`);
          return false;
        }
      }
      newDataTime.push({
        peakStartTime: "",
        peakEndTime: "",
      });
    },
    delTime(index,inde) {
      this.formItem.data[index].peakTimeDetailsApiDtoList.splice(inde, 1);
    },
    addRule(type,index) {
      if (type == "Z") {
        let newData =  this.formItem.data[index].dutyDurationGradientApiDtoList;
        for(let i = 0; i < newData.length; i++) {
          if(newData[i].intervalLvalue&& newData[i].intervalRvalue) {
              if(newData.length>1) {
                for(let k = 0; k < newData.length; k++) {
                  let __start = Number(newData[k].intervalLvalue);
                  let __end = Number(newData[k].intervalRvalue);
                  if(__start < __end ) {
                     for(let j = 0; j < newData.length; j++) {
                      if( j > k) {
                        let __startNew = Number(newData[j].intervalLvalue);
                        let __endNew = Number(newData[j].intervalRvalue);
                        if (__startNew >= __end || __endNew <= __start ) {

                        } else {
                          this.$Message.warning(`班段规则${index+1}旷工规则维护不正确`);
                          return false;
                        }
                      }
                    }
                  }else {
                    this.$Message.warning(`班段规则${index+1}旷工规则维护不正确`);
                    return false
                  }

                }
              }else {
                if(Number(newData[i].intervalLvalue) >= Number(newData[i].intervalRvalue)) {
                  this.$Message.warning(`班段规则${index+1}旷工规则维护不正确`);
                  return false
                }
              }

          }else {
            this.$Message.warning(`请填写班段规则${index+1}旷工上线时长规则`);
            return false;
          }
        }
        newData.push({
          durationType: 1,
          intervalLvalue: '',
          intervalRvalue: '',
          dutyDays: ''
        });
      } else {
        let newData =  this.formItem.data[index].dutyDurationGradientApiDtoList2;
        for(let i = 0; i < newData.length; i++) {
          if(newData[i].intervalLvalue&& newData[i].intervalRvalue) {
              if(newData.length>1) {
                for(let k = 0; k < newData.length; k++) {
                  let __start = Number(newData[k].intervalLvalue);
                  let __end = Number(newData[k].intervalRvalue);
                  if(__start < __end ) {
                     for(let j = 0; j < newData.length; j++) {
                      if( j > k) {
                        let __startNew = Number(newData[j].intervalLvalue);
                        let __endNew = Number(newData[j].intervalRvalue);
                        if (__startNew >= __end || __endNew <= __start ) {

                        } else {
                          this.$Message.warning(`班段规则${index+1}旷工规则维护不正确`);
                          return false;
                        }
                      }
                    }
                  }else {
                    this.$Message.warning(`班段规则${index+1}旷工规则维护不正确`);
                    return false
                  }

                }
              }else {
                if(newData[i].intervalLvalue >= newData[i].intervalRvalue) {
                  this.$Message.warning(`班段规则${index+1}旷工规则维护不正确`);
                  return false
                }
              }

          }else {
            this.$Message.warning(`请填写班段规则${index+1}旷工上线时长规则`);
            return false;
          }
        }

        newData.push({
          durationType: 2,
          intervalLvalue: '',
          intervalRvalue: '',
          dutyDays: ''
        });
      }
    },
    delRule(type,index,inde) {
      if (type == "Z") {
        this.formItem.data[index].dutyDurationGradientApiDtoList.splice(inde, 1);
      } else {
        this.formItem.data[index].dutyDurationGradientApiDtoList2.splice(inde, 1);
      }
    },
    verifyTimeChange(index,value) {
      let data = this.formItem.data[index].shiftEndTime;
      if(value == 'value') {
        data = this.formItem.data[index].changeEndTime;
      }
      this.$emit('verifyTime',data,index,value)
    }
  }
};
</script>
<style lang="less">
.twoRuleStyle{
  .ivu-input[disabled]{
    background: none !important;
  }
}
.new-item {
  .ivu-form-item-error-tip{
    left: 60px;
  }
}
.myTime {

  .ivu-input {
    border: none;
    height: 28px;
    margin-top: -4px;
  }
  .name {
    margin: 0 10px;
    display: inline-block;
    width: 32px;
  }
  .ivu-input-prefix i,
  .ivu-input-suffix i {
    line-height: 20px;
  }
  .new-date {
    margin-top: 2px;
    display: inline-block;
    width: 100%;
    height: 32px;
    padding: 0 7px;
    font-size: 12px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
  }
  .ivu-date-picker-focused input {
    border: none;
    box-shadow: none !important;
  }
  input:focus {
    border: none;
    box-shadow: none !important;
  }
}
</style>