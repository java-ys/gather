<template>
  <div class="oneRuleStyle">
     <Form
      ref="formValidate"
      :model="formItem"
      :label-width="136"
      :rules="ruleValidate"
    >
     <FormItem label="适用城市：" prop="cityCode" >
      <Select
        :disabled=" ruleType =='X' || ruleType =='E'"
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
    <FormItem label="适用司机：" prop="driverTag">
      <Select
        v-model="formItem.driverTag"
        :disabled=" (ruleType =='X' || ruleType =='E') && newCity "
        style="width: 200px"
        placeholder="请选择"
      >
        <Option v-for="(item,index) in driverType" :value="item.itemcode"  :key="index">{{ item.itemvalue }}</Option>
      </Select>
    </FormItem>
    <FormItem label="排班名称："  prop="shiftName">
      <Input
        v-model="formItem.shiftName"
        :disabled="ruleType=='X'"
        placeholder="请输入排班名称..."
        style="width: 200px"
        :maxlength="50"
      ></Input>
    </FormItem>
    <FormItem label="生效时间：" prop="effectiveTime">
      <DatePicker
        type="datetime"
        :disabled="ruleType=='X'"
        v-model="formItem.effectiveTime"
        placeholder="请选择生效时间"
        style="width: 200px"
      ></DatePicker>
    </FormItem>
    <FormItem label="切换时间点：" prop="cutTime" >
      <div style="display: flex">
        <TimePicker
       :disabled="ruleType=='X'"
        format="HH:mm"
        v-model="formItem.cutTime"
        placeholder="请选择"
        style="width: 112px"
      ></TimePicker>
      <span style="margin-left: 10px">
         *切换时间点不得迟于03:00
        </span>
      </div>
      
    </FormItem>
    <FormItem label="排班时段：" style="position: relative;" >
       <span style="position: absolute;left: -82px; top: 10px;color: #ed4014;line-height: 1;font-size: 12px;font-family: SimSun;display: inline-block;">*</span>
      <div style="display: flex">
        <FormItem prop="shiftStartTime">
          <TimePicker
           :disabled="ruleType=='X'"
            format="HH:mm"
            v-model="formItem.shiftStartTime"
            placeholder="请选择"
            style="width: 112px"
          ></TimePicker>
        </FormItem>
        <span style="margin: 0 10px;">一</span>
        <FormItem class="myTime" prop="shiftEndTime" >
          <div class="new-date ivu-form-item-error"  :style="{borderColor: borcolor && formItem.shiftEndTime == '' ? 'red':'#dcdee2'}">
            <span v-if="(formItem.shiftStartTime&&formItem.shiftEndTime) && formItem.shiftStartTime>=formItem.shiftEndTime">次日</span>
            <TimePicker
             :disabled="ruleType=='X'"
              v-model="formItem.shiftEndTime"
              format="HH:mm"
              placeholder="请选择"
              style="width: 112px"
              @on-change="verifyTimeChange"
            ></TimePicker>
          </div>
        </FormItem>
      </div>
     
    </FormItem>
    
    <FormItem label="高峰时段：">
      <Form :model="formItem" ref="formValidateChild">
        <div
          v-for="(item, index) in formItem.peakTimeDetailsApiDtoList"
          :key="index"
        >
            <div style="display: flex">
              <FormItem :prop="'peakTimeDetailsApiDtoList.' + index + '.peakStartTime'"
              style="margin-bottom: 20px">
                <TimePicker
                :disabled="ruleType=='X'"
                  format="HH:mm"
                  v-model="item.peakStartTime"
                  placeholder="请选择"
                  style="width: 112px"
                ></TimePicker>
              </FormItem>
              <span style="margin: 0 10px;">一</span>
              <FormItem class="myTime" :prop="'peakTimeDetailsApiDtoList.' + index + '.peakEndTime'">
                <div class="new-date ivu-form-item-error"  >
                  <span v-if="(item.peakStartTime&&item.peakEndTime) && item.peakStartTime>=item.peakEndTime">次日</span>
                  <TimePicker
                    :disabled="ruleType=='X'"
                    v-model="item.peakEndTime"
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
              v-if="index == 0 && ruleType!='X'"
              @click="addTime"
            ></Button>
            <Button
              type="primary"
              size="small"
              icon="md-remove"
              style="margin-left: 5px;height: 30px;margin-top: 3px"
              v-if="index != 0 && ruleType!='X'"
              @click="delTime(index)"
            ></Button>
          </div>
         </div>
      </Form>
    </FormItem>
    <FormItem label="时长要求：" style="position: relative;">
      <span style="position: absolute;left: -82px; top: 10px;color: #ed4014;line-height: 1;font-size: 12px;font-family: SimSun;display: inline-block;">*</span>
      <Row>
        <Col span="5">
          <FormItem prop="onlineDuration"  class="new-item">
            在线时长：<Input
             :disabled="ruleType=='X'"
             :maxlength="4"
              v-model="formItem.onlineDuration"
              placeholder="请输入..."
              style="width: 80px"
            ></Input>
            分钟
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem prop="peakDuration"  class="new-item">
            高峰时长：<Input
             :disabled="ruleType=='X'"
             :maxlength="4"
              v-model="formItem.peakDuration"
              placeholder="请输入..."
              style="width: 80px"
            ></Input>
            分钟
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem prop="chargeDuration"  class="new-item">
            计费时长：<Input
             :disabled="ruleType=='X'"
             :maxlength="4"
              v-model="formItem.chargeDuration"
              placeholder="请输入..."
              style="width: 80px"
            ></Input>
            分钟
          </FormItem>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="旷工规则：" >
      <Card style="width:680px">
        <Form :model="formItem" ref="ruleChild">
          <div>
            <div
              style="margin-bottom: 20px;"
              v-for="(item, index) in formItem.dutyDurationGradientApiDtoList"
               :key="index"
            >
              <FormItem>
                <Row>
                  <Col span="8">
                    <FormItem
                      :prop="
                        'dutyDurationGradientApiDtoList.' +
                          index +
                          '.intervalLvalue'
                      "
                      :rules="[
                          {validator: validNumber,  trigger: 'blur' }
                        ]">
                      <Input
                       :disabled="ruleType=='X'"
                       :maxlength="4"
                        v-model="item.intervalLvalue"
                        placeholder="请输入"
                        style="width: 80px"
                      ></Input>
                      (小时)
                      <span style="margin-left: 15px">≤上线时长<</span>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <FormItem
                      :prop="
                        'dutyDurationGradientApiDtoList.' +
                          index +
                          '.intervalRvalue'
                      "
                      :rules="[{validator: validNumber,  trigger: 'blur' }]"
                    >
                      <Input
                       :disabled="ruleType=='X'"
                        v-model="item.intervalRvalue"
                        :maxlength="4"
                        placeholder="请输入"
                        style="width: 80px"
                      ></Input>
                       (小时)
                      <span style="margin-left: 5px"></span>
                    </FormItem>
                  </Col>
                  <Col span="7">
                    <FormItem
                    class="new-item2 "
                      :prop="
                        'dutyDurationGradientApiDtoList.' + index + '.dutyDays'
                      "

                    >
                      旷工：
                      <Select v-model="item.dutyDays" clearable :disabled="ruleType=='X'" style="width: 80px">
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
                      v-if="index == 0 && ruleType!='X'"
                      @click="addRule('Z')"
                    ></Button>
                    <Button
                      type="primary"
                      size="small"
                      icon="md-remove"
                      style="margin-left: 5px;height: 30px;margin-top: 3px"
                      v-if="index != 0 && ruleType!='X'"
                      @click="delRule('Z', index)"
                    ></Button>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </div>
        </Form>
        <p
          style="border-bottom: 2px solid #eee;margin-bottom: 20px;padding-top: 15px"
        ></p>
        <Form :model="formItem" ref="ruleChild2">
          <div style="margin-top: 20px;">
            <div
             
              v-for="(item, index) in formItem.dutyDurationGradientApiDtoList2"
               :key="index"
            >
              <FormItem>
                <Row>
                  <Col span="8">
                    <FormItem
                      :prop="
                        'dutyDurationGradientApiDtoList2.' +
                          index +
                          '.intervalLvalue'
                      "
                      :rules="[{validator: validNumber,  trigger: 'blur' }]"
                    >
                      <Input
                       :disabled="ruleType=='X'"
                        v-model="item.intervalLvalue"
                        placeholder="请输入"
                        :maxlength="4"
                        style="width: 80px"
                      ></Input>
                       (小时)
                      <span style="margin-left: 15px">≤高峰时长<</span>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <FormItem
                      :prop="
                        'dutyDurationGradientApiDtoList2.' +
                          index +
                          '.intervalRvalue'
                      "
                      :rules="[{validator: validNumber,  trigger: 'blur' }]"
                    >
                      <Input
                       :disabled="ruleType=='X'"
                       :maxlength="4"
                        v-model="item.intervalRvalue"
                        placeholder="请输入"
                        style="width: 80px"
                      ></Input>
                       (小时)
                      <span style="margin-left: 5px"></span>
                    </FormItem>
                  </Col>
                  <Col span="7">
                    <FormItem
                      :prop="
                        'dutyDurationGradientApiDtoList2.' + index + '.dutyDays'
                      "
                      class="new-item2"
                    >
                      旷工：<Select v-model="item.dutyDays" clearable  :disabled="ruleType=='X'" style="width: 80px">
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
                      v-if="index == 0 && ruleType!='X'"
                      @click="addRule('G')"
                    ></Button>
                    <Button
                      type="primary"
                      size="small"
                      icon="md-remove"
                      style="margin-left: 5px;height: 30px;margin-top: 3px"
                      v-if="index != 0 && ruleType!='X'"
                      @click="delRule('G', index)"
                    ></Button>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </div>
        </Form>
      </Card>
    </FormItem>
    </Form>
  </div>
</template>
<style lang="less">
.oneRuleStyle{
  .ivu-input[disabled]{
    background: none !important;
  }
}
.new-item {
  .ivu-form-item-error-tip{
    left: 60px;
  }
}

.new-item2 {
  .ivu-form-item-error-tip{
    left: 37px;
  }
}
.myTime {
  .ivu-select-disabled .ivu-select-selection{
    background: none!important;
  }
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
  .new-date:hover {
    border-color: #57a3f3;
    outline: 0;
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
<script>
import { timeFormat } from "@/libs/util"
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
      default: []
    },
    borcolor: {
      type:Boolean,
      default: false
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
    const cutTimeValidLast = (rule, value, callback) => {
      console.log(value)
      if( value > "05:00" ) {
        callback(new Error('切换时间点不得迟于五点'));
      }else {
        callback();
      }
    };
   
    return {
      options: {
        disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      formData: {},
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
            trigger: "change",
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
            validator: this.validLast,
            trigger: 'blur'
          },
          {
            required: true,
            message: "时长不能为空",
            trigger: "blur"
          }
        ],
        peakDuration: [
          {
            required: true,
            message: "时长不能为空",
            trigger: "blur"
          },{
            validator: this.validLast,
            trigger: 'blur'
          }
        ],
        chargeDuration: [
          {
            required: true,
            message: "时长不能为空",
            trigger: "blur"
          },{
            validator: this.validLast,
            trigger: 'blur'
          }
        ]
      },
      timeData: []
    };
  },
  mounted() {
    this.formData = this.formItem;
  },
  methods: {
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
    validateTime(rule, val, callback) {
        if (val[0] == ''){
            callback(new Error('请选择时间'));
        } else if(val.length == 0){
          callback(new Error('时间不能为空'));
        }else{
            callback();
        }
    },
    verifyTimeChange(value) {
      this.$emit('verifyTime',value)
    },
    addTime() {
      let newDataTime = this.formData.peakTimeDetailsApiDtoList;
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
                        this.$Message.warning("高峰时段时间存在交叉");
                        return false;
                      }
                    }
                  }
              }
            }
        }else {
          this.$Message.warning("请填写高峰时段起始时间");
          return false;
        }
      }
      newDataTime.push({
        peakStartTime: "",
        peakEndTime: "",
      });
    },
    addRule(type) {
      if (type == "Z") {
        let newData = this.formData.dutyDurationGradientApiDtoList;
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
                        if (__startNew >=__end || __endNew <= __start) {

                        } else {
                          this.$Message.warning("旷工规则维护不正确");
                          return false;
                        }
                      }
                    }
                  }else {
                    this.$Message.warning("旷工规则维护不正确");
                    return false
                  }
                }
              }else {

                if(Number(newData[i].intervalLvalue) >= Number(newData[i].intervalRvalue)) {
                  this.$Message.warning("旷工规则维护不正确");
                  return false
                }
              }

          }else {
            this.$Message.warning("请填写旷工上线时长规则");
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
        let newData = this.formData.dutyDurationGradientApiDtoList2;
        for(let i = 0; i < newData.length; i++) {
          if(newData[i].intervalLvalue&& newData[i].intervalRvalue) {
              if(newData.length>1) {
                for(let k = 0; k < newData.length; k++) {
                  let __start = Number(newData[k].intervalLvalue);
                  let __end = Number(newData[k].intervalRvalue);
                  if(__start < __end ) {
                     for(let j = 0; j < newData.length; j++) {
                      if( j > k) {
                        let __startNew =Number(newData[j].intervalLvalue);
                        let __endNew = Number(newData[j].intervalRvalue);
                        if (__startNew >=__end || __endNew <= __start) {

                        } else {
                          this.$Message.warning("旷工规则维护不正确");
                          return false;
                        }
                      }
                    }
                  }else {
                    this.$Message.warning("旷工规则维护不正确");
                    return false
                  }

                }
              }else {
                if(Number(newData[i].intervalLvalue) >= Number(newData[i].intervalRvalue)) {
                  this.$Message.warning("旷工规则维护不正确");
                  return false
                }
              }

          }else {
            this.$Message.warning("请填写旷工上线时长规则");
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
    delRule(type, index) {
      if (type == "Z") {
        this.formData.dutyDurationGradientApiDtoList.splice(index, 1);
      } else {
        this.formData.dutyDurationGradientApiDtoList2.splice(index, 1);
      }
    },
    delTime(index) {
      this.formData.peakTimeDetailsApiDtoList.splice(index, 1);
    },

  }
};
</script>
