<template>
  <div class="rulestyle">
    <Modal v-model="showAdd"
      title="新增推荐奖励配置"
      width="1110"
      :mask-closable="false"
      :closable="false">
      <div class="showAdd-content">
        <Form ref="form" :model="addForm" :label-width="150" :rules="validateRules">
          <!-- 推荐奖励名称 -->
          <FormItem label="推荐奖励名称：" prop="ruleName">
            <Input
              v-model="addForm.ruleName"
              style="width: 220px;"
              :maxlength="15"
              placeholder="请输入推荐奖励名称"
            ></Input>
            <span class="counter">( {{ addForm.ruleName ? addForm.ruleName.length:0 }}/15 )</span>
          </FormItem>
          <!-- 省市 -->
          <FormItem label="省/市：" prop="city">
            <Cascader
              v-model="addForm.city"
              :data="cityList"
              filterable
              style="width: 220px;z-index: 99999"
              @on-change="getCitychange"
            ></Cascader>
          </FormItem>
          <!-- 有效时间 -->
          <FormItem label="有效时间：" class="ivu-form-item-required" prop="time">
            <DatePicker
              v-model="addForm.time"
              clearable
              separator=" 至 "
              type="daterange" 
              placeholder="请选择"
              :options="dateOptions"
              :editable="false"
              style="width: 220px">
            </DatePicker>
            <Alert class="left15 inline-box" style="margin-bottom:0" type="warning" show-icon>运营商奖励将在活动有效期结束后生成最终奖励数据</Alert>
          </FormItem>
          <!-- （推荐人类型为 运营商） -->
          <FormItem label="奖励条件：" prop="rewardEvent">
            <RadioGroup v-model="addForm.rewardEvent">
              <Radio v-for="item in rewardConditionsList" :key="item.value" :label="item.value" style="margin-right:15px;">{{item.label}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            v-if="addForm.rewardEvent===0||addForm.rewardEvent===1"
            :label="addForm.rewardEvent===0?'缴纳保证金时间':'绑车时间'" 
            prop="rewardDelay" 
            key="rewardDelay" 
            :style="{'margin-left':addForm.rewardEvent===0?'105px':'70px'}">
            >= 
            <InputNumber
              v-model="addForm.rewardDelay"
              :precision="0"
              :min="0"
              :max="999"
              placeholder="请输入"
              style="width:150px;"
            ></InputNumber>
            天
          </FormItem>
          <FormItem label="司机来源：" prop="driverOrigin">
            <CheckboxGroup v-model="addForm.driverOrigin" @on-change="changeOrigin">
              <Checkbox 
                v-for="item in driverOriginList" 
                :key="item.value" 
                :label="item.value"
                style="margin-right:15px;">{{item.label}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <Form
            v-for="(object,parentI) in addForm.operatorRewardDetailReqs"
            :ref="'originForm'+parentI"
            :model="object"
            :rules="validateRules"
            :label-width="150"
            :key="parentI-50"
            class="origin-form">
            <div class="rel-box">
              <FormItem :label="`${driverOriginPushMap[object.channelType]}奖励：`" prop="rewardType">
                <RadioGroup v-model="object.rewardType">
                  <Radio :label="0" style="margin-right:15px;">固定金额</Radio>
                  <span class="left15" style="color:#b2afaf;">每个司机达到入职条件，对运营商奖励</span>
                  <div class="top15">
                    <Radio :label="1">梯度奖励</Radio>
                  </div>
                </RadioGroup>
              </FormItem>
              <div class="flex-box leftlong" :class="{'show-right':object.rewardType===1}">
                <FormItem v-if="object.rewardType===0" label="奖励现金：" prop="cash">
                  <InputNumber
                    v-model="object.cash"
                    :min="0"
                    :max="9999999.99"
                    placeholder="请输入"
                    style="width:150px;"
                    @on-blur="formatNumber(false,'cash',object.cash,parentI)"
                  ></InputNumber> 
                  元/人
                </FormItem>
                <!-- 奖励上限 -->
                <div v-if="object.rewardType===0||object.rewardType===1" class="flex-box">
                  <FormItem label="奖励上限：" prop="rewardLimitType">
                    <Select v-model="object.rewardLimitType"
                      placeholder="请选择"
                      style="width:150px;"
                      @on-change="object.rewardLimit = null">
                      <Option :value="1">不限额度</Option>
                      <Option :value="2">限定额度</Option>
                    </Select>
                  </FormItem>
                  <FormItem v-if="object.rewardLimitType===2" prop="rewardLimit" class="no-left-margin">
                    <InputNumber
                      v-model="object.rewardLimit"
                      :min="0"
                      :max="9999999.99"
                      placeholder="请输入"
                      style="width:150px;"
                      @on-blur="formatNumber(false,'rewardLimit',object.rewardLimit,parentI)"
                    ></InputNumber> 
                    元
                  </FormItem>
                </div>
              </div>
            </div>
            <div v-if="object.rewardType===1">
              <Form
                v-for="(item,index) in object.rewardRuleReqs"
                :ref="'ladderForm'+object.channelType+index"
                :model="item"
                :rules="validateRules"
                :label-width="150"
                :key="String(object.channelType)+String(index)"
                style="position:relative;margin-left:66px;">
                <div class="flex-box">
                  <FormItem :label="`梯度${index+1}：`" prop="lowerLimit">
                    <InputNumber
                      v-model="item.lowerLimit"
                      :precision="0"
                      :min="0"
                      placeholder="请输入"
                      style="width:100px;"
                      @on-change="setIndex(parentI,index)"
                    ></InputNumber> 
                    <span class="between">———</span>
                  </FormItem>
                  <FormItem prop="upperLimit" class="no-left-margin">
                    <InputNumber
                      v-model="item.upperLimit"
                      :precision="0"
                      :min="0"
                      placeholder="请输入"
                      style="width:100px;"
                      @on-change="setIndex(parentI,index)"
                    ></InputNumber> 
                    <span> 人</span>
                  </FormItem> 
                  <FormItem label="奖励现金：" prop="cash">
                    <InputNumber
                      v-model="item.cash"
                      :min="0"
                      :max="9999999.99"
                      placeholder="请输入"
                      style="width:150px;"
                      @on-blur="formatNumber(index,'cash',item.cash,parentI)"
                    ></InputNumber> 
                    <span> 元/人</span>
                  </FormItem>
                </div>
                <Icon v-if="object.rewardRuleReqs.length>1" @click="removeTime(parentI,index)" class="remove-icon" type="ios-remove-circle-outline" />
                <Icon v-if="index===object.rewardRuleReqs.length-1 && object.rewardRuleReqs.length<5" @click="addTimeItem(parentI)" class="add-icon" type="ios-add-circle-outline" />
              </Form>
            </div>
          </Form>
          <!-- 活动规则 -->
          <FormItem label="活动规则：">
            <Input
              v-model="addForm.ruleContent"
              type="textarea"
              :rows="5"
              :maxlength="1000"
              placeholder="请输入..."
              style="width: 500px"
            />
            <span class="counter">( {{ addForm.ruleContent ? addForm.ruleContent.length:0 }}/1000 )</span>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" ghost @click="cancleAdd">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="confirmAdd">
          <span v-if="!submitLoading">确定</span>
          <span v-else>提交中...</span>
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { axiosAgentRuleAdd } from "_o/api/operator-carrier";
import { driverOriginList,driverOriginPushMap } from "_o/components/operator-center/agent-recruit-driver/status-map"
import {
  rewardConditionsList,
  validateRules,
  validTime
} from "./fields.js"

export default {
  name:"agent-reward-add",
  props: {
    showAdd: {
      type: Boolean,
      default: false
    },
    cityList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      validateRules:JSON.parse(JSON.stringify(validateRules)),
      driverOriginList,
      rewardConditionsList,
      driverOriginPushMap,
      addForm: {
        ruleName: '',
        city: [],
        time: [],
        ruleContent: '',
        rewardEvent: null,
        rewardDelay: null,
        driverOrigin: [],
        rewardType: null,
        rewardMoney: null,
        rewardLimitType: null,
        rewardLimit: null,
        operatorRewardDetailReqs:[]
      },
      newAddForm: {

      },
      submitLoading: false,
      dateOptions: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now()
        }
      },
      parentI:null,
      sonI:null,
      validNext:true
    };
  },
  mounted() {
    this.addForm.operatorRewardDetailReqs = []
    this.validateRules.upperLimit.push({ validator: this.upperValid })
    this.validateRules.lowerLimit.push({ validator: this.lowerValid })
    this.validateRules.time.push({ validator: validTime })
  },
  methods: {
    setIndex(parentI,sonI){
      this.parentI = parentI
      this.sonI = sonI
      this.validNext = true
    },
    lowerValid(rule, value, callback){
      let parentObject = this.addForm.operatorRewardDetailReqs[this.parentI]
      let key = `ladderForm${parentObject.channelType}${this.sonI}`

      let list = parentObject.rewardRuleReqs
      let now = list[this.sonI]
      let before = list[this.sonI-1]
      
      if(!before || !before.upperLimit){
        this.validNext && now.upperLimit && this.$refs[key][0].validateField('upperLimit')
        callback();
      }else{
        if(now.lowerLimit<=before.upperLimit){
          callback(new Error('应大于上一个阶梯上限'));
        }else{
          this.validNext && now.upperLimit && this.$refs[key][0].validateField('upperLimit')
          callback();
        }
      }
    },
    upperValid(rule, value, callback){
      let parentObject = this.addForm.operatorRewardDetailReqs[this.parentI]

      let list = parentObject.rewardRuleReqs
      let now = list[this.sonI]
      if(now.upperLimit<now.lowerLimit){
        callback(new Error('应不小于本阶梯下限'));
      }else{
        if(this.validNext && list[this.sonI+1] && list[this.sonI+1].lowerLimit){
          let key = `ladderForm${parentObject.channelType}${this.sonI+1}`
          this.sonI += 1
          this.$refs[key][0].validateField('lowerLimit')
        }
        callback();
      }
    },
    getCitychange(value, selectedData) {
      this.newAddForm.cityCode = value[1];
      this.newAddForm.provinceCode = value[0];
      this.newAddForm.cityName = selectedData[1].label;

    },
    // 取消新增
    cancleAdd() {
      this.$Modal.confirm({
        title: "是否确认取消推荐奖励配置？",
        onOk: () => {
          this.$refs.form.resetFields();
          this.$emit("close");
        }
      })
    },
    async validInnerForm(){
      let result = true
      if(this.$refs.originForm0){
        this.validNext = false
        await this.addForm.operatorRewardDetailReqs.forEach((object,parentI)=>{
          let key = `originForm${parentI}`
          this.$refs[key][0].validate().then(status => {
            if(!status){
              result = false
            }
          })
          this.parentI = parentI
          let sonKeyStart = `ladderForm${object.channelType}`
          if(this.$refs[`${sonKeyStart}0`] && this.$refs[`${sonKeyStart}0`][0]){
            object.rewardRuleReqs.forEach((item,index)=>{
              this.sonI = index
              let sonKey=`${sonKeyStart}${index}`
              this.$refs[sonKey][0].validate().then(status => {
                if(!status){
                  result = false
                }
              })
            })
          }
        })
      }
      return result
    },
    // 确认新增
    async confirmAdd() {
      // 大form校验
      let formValid = await this.$refs.form.validate(valid => {
        return valid
      });
      // originForm和originForm 校验
      let innerFormValid = await this.validInnerForm().then(res=>{
        return res
      })
      // 校验通过
      if(formValid && innerFormValid){
        this.$Modal.confirm({
          title: "是否确认完成推荐奖励配置？",
          onOk: () => {
            // common-公用部分组装
            let detailList = JSON.parse(JSON.stringify(this.addForm.operatorRewardDetailReqs))
            detailList.forEach(item=>{
              if(item.rewardLimitType ===1 ){
                item.rewardLimit = -1
              }
            })
            let params = {
              ruleName: this.addForm.ruleName,
              ruleContent: this.addForm.ruleContent,
              provinceCode: this.newAddForm.provinceCode,
              cityCode: this.newAddForm.cityCode,
              cityName: this.newAddForm.cityName,
              validTime: new Date(this.addForm.time[0]).getTime(),
              expireTime: new Date(this.addForm.time[1]).getTime(),
              rewardEvent: this.addForm.rewardEvent,
              rewardDelay: this.addForm.rewardDelay,
              operatorRewardDetailReqs: detailList
            }
            delete params.time
            delete params.city
            // 发送保存请求
            this.submitLoading = true
            axiosAgentRuleAdd(params).then(res => {
              this.submitLoading = false
              if (res.data.data) {
                this.$Message.warning(res.data.msg);
              } else {
                this.$Message.success("新建成功");
                this.$emit("confirmAdd");
              }
            }).catch(err=>{
              this.submitLoading = false
            })

          }
        });
      }
    },
    // 勾选司机来源
    changeOrigin(){
      let arr = this.addForm.driverOrigin
      let newDetailList = []
      // 已选中
      this.addForm.operatorRewardDetailReqs.forEach(item=>{
        let value = arr.find(value=>value===item.channelType)
        if(value > -1){
          newDetailList.push(item)
        }
      })
      // 新选中
      arr.forEach(value=>{
        let object = this.addForm.operatorRewardDetailReqs.find(item=>item.channelType===value)
        if(object===undefined){
          newDetailList.push({
            channelType: value,
            rewardLimitType: null,
            rewardLimit: null,
            rewardType: null,
            cash: null,
            rewardRuleReqs:[
              {
                lowerLimit: null,
                upperLimit: null,
                cash: null,
              }
            ]
          })
        }
      })
      this.addForm.operatorRewardDetailReqs.splice(0,10,...newDetailList) 

    },
    // 删除定时时间
    removeTime(parentI,index){
      this.addForm.operatorRewardDetailReqs[parentI].rewardRuleReqs.splice(index,1)
    },
    // 格式化数字为两位小数
    formatNumber(index,key,value,parentI) {
      let result = value
      let reg = /^\d+\.\d{3,}$/;
      if (reg.test(value)) {
        let number = value.toFixed(2) - 0
        result =  number;
      }
      if(index===false){
        this.$set(this.addForm.operatorRewardDetailReqs[parentI],key,result)
      }else{
        this.$set(this.addForm.operatorRewardDetailReqs[parentI].rewardRuleReqs[index],key,result)
      }
    },
    // 添加定时时间
    addTimeItem(index){
      this.addForm.operatorRewardDetailReqs[index].rewardRuleReqs.push({
        lowerLimit: null,
        upperLimit: null,
        cash: null
      })
    }
  }
};
</script>
<style lang="less">
.between{
  display:inline-block;
  margin:0 -10px 0 10px;
}
.remove-icon{
  position: absolute;
  left:800px;
  top:6px;
  font-size: 25px;
  color: #f55932;
  font-weight: bold;
  cursor: pointer;
}
.add-icon{
  position: absolute;
  left:850px;
  top:7px;
  font-size: 25px;
  color: #19be6b;
  cursor: pointer;
  font-weight: bold;
}
.rel-box{
  position: relative;
}
.show-right{
  position: absolute;
  top:50px;
  left:405px;
}
.leftlong{
  margin-left: 82px;
}
.origin-form{
  position:relative;
  margin-left:66px;
  &:not(:last-child){
    border-bottom:1px solid #efefef;
    margin-bottom: 15px;
  }
  
}
</style>
