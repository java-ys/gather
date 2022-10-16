<template>
  <div>
    <Form
      ref="formValidate"
      :model="formItem"
      :label-width="136"
      :rules="ruleValidate"
    >
      <FormItem label="适用城市：" prop="cityCode">
        <Select
          v-model="formItem.cityCode"
          style="width: 400px"
          filterable
          placeholder="请选择城市"
          :disabled='leaveType == "X" || leaveType == "E"'
        >
          <Option
            v-for="(item, index) in cityList"
            :value="item.cityID || item.cityId"
            :key="index"
            >{{ item.city }}</Option
          >
        </Select>
      </FormItem>

    <div style="padding: 0 60px">
      <Tabs v-model="name1">
        <TabPane
          v-for="(item, index) in formItem.tabName"
          :label="item.name"
          :name="item.value"
          :key="index"
        >
          <div>
            <Checkbox v-model="item.enableFlag" :disabled='leaveType == "X"'>启用</Checkbox>
          </div>
          <div style="margin-top: 15px; margin-left: -27px;">

              <div style="display: flex">
                <FormItem label="自然月允许请假："
                  :prop="'tabName.' + index + '.monthLimit'"
									:rules="[{validator: validLast, trigger: 'blur'},
                          {validator: monthMax, trigger: 'blur'}]"
                  >
                  <Input
                    placeholder="请输入"
                    v-model="item.monthLimit"
                    :disabled='leaveType == "X" || !item.enableFlag'
                    style="width: 70px"
                    :maxlength="2"
                  />
                  天
                </FormItem>
                <FormItem>
                  <Checkbox v-model="item.monthOver" :disabled='leaveType == "X" || !item.enableFlag'>超额不允许申请</Checkbox>
                </FormItem>
              </div>
              <div style="display: flex">
                <FormItem label="年度允许请假："
                  :prop="'tabName.' + index + '.yearLimit'"
									:rules="[{validator: validLast, trigger: 'blur'},
                          {validator: yearMax, trigger: 'blur'}]"
                  >
                  <Input
                    placeholder="请输入"
                    v-model="item.yearLimit"
                    :disabled='leaveType == "X" || !item.enableFlag'
                    style="width: 70px"
                    :maxlength="3"
                  />
                  天
                </FormItem>
                <FormItem>
                  <Checkbox v-model="item.yearOver" :disabled='leaveType == "X" || !item.enableFlag'>超额不允许申请</Checkbox>
                </FormItem>
              </div>

          </div>
        </TabPane>
      </Tabs>
    </div>
    <div class="ivu-modal-footer">
			<Button
				type="text"
				size="large"
				style="margin-right: 8px"
				@click="closeChange()"
				>取消</Button
			>
			<Button
				type="primary"
				@click="handleSubmit()"
				size="large"
        v-if='leaveType != "X"'
				>确定</Button
			>
		</div>
    </Form>
  </div>
</template>
<script>
import { axiosSetCityList } from "_g/api/common.js";
import { addLeaveRule, detailLeaveRule, editLeaveRule  } from "_o/api/rest.js";
import { leaveTypeList } from "./index.js";

export default {
  props: {
    leaveType: {
			type: String,
			default: "A"
    },
    code: {
      type: String,
      default: ""
    },
    modal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formItem: {
        cityCode: "",
        tabName: []
      },
      name1: "1",
      cityList: [],
      parmes: {},
      ruleValidate: {
				cityCode: [
					{ required: true, message: "适用城市不能为空", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    modal(){
      this.name1 = "1"
      this.formItem.tabName = []
      this.formItem.cityCode = ""
      if(this.leaveType == "A"){
        for(let i=1; i<9; i++){
          let obj = {
            name: leaveTypeList(i),
            value: String(i),
            enableFlag: false,
            monthLimit: "",
            monthOver: false,
            yearLimit: "",
            yearOver: false
          }
          this.formItem.tabName.push({...obj})
        }
      }
      if(this.leaveType == "X" || this.leaveType == "E"){
        detailLeaveRule({cityCode: this.code}).then((res) =>{
          if(res.data.success) {
            for(let i=1; i< 9; i++){
              let obj = {
                name: leaveTypeList(i),
                value: String(i),
                enableFlag: false,
                monthLimit: "",
                monthOver: false,
                yearLimit: "",
                yearOver: false
              }
              this.formItem.tabName.push({...obj}) 
            }
            res.data.data.forEach(i => {
              this.formItem.cityCode = i.cityCode
              let obj = {
                name: leaveTypeList(i.leaveType),
                value: String(i.leaveType),
                enableFlag: i.enableFlag == 1? true : false,
                monthLimit: i.monthLimit ? String(i.monthLimit) : "",
                monthOver: i.monthOver == 0 ? true : false,
                yearLimit: i.yearLimit ? String(i.yearLimit) : "",
                yearOver: i.yearOver == 0 ? true : false,
                id: i.id
              }
              this.formItem.tabName.splice(i.leaveType-1,1,obj)
            })
            console.log("form--",this.formItem.tabName)
          }
        })
      }

    }
  },
  mounted() {
    this.getCityList();
    for(let i=1; i<9; i++){
      let name;
        switch(i){
          case 1:
            name = "事假"
            break
          case 2:
            name = "病假"
            break
          case 3:
            name = "婚假"
            break
          case 4:
            name = "丧假"
            break
          case 5:
            name = "产假"
            break
          case 6:
            name = "陪产假"
            break
          case 7:
            name = "年休假"
            break
          case 8:
            name = "事故假"
            break
        }
        let obj = {
          name: name,
          value: String(i),
          opening: false,
          monthLimit: "",
          monthOver: false,
          yearLimit: "",
          yearOver: false
        }
        this.formItem.tabName.push({...obj})
    }
  },
  methods: {
    // 获取城市列表
    getCityList() {
      axiosSetCityList({}).then(res => {
        if (res.data.success) {
          let cityList = res.data.data;
          this.cityList = cityList;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    // 正整数校验
    validLast(rule, val, callback) {
			const reg = /^[0-9]+$/;
			if (!reg.test(val) && val) {
				callback(new Error('请输入正整数'));
			} else {
				callback();
			}
    },
    monthMax(rule, val, callback){
			if (val && val > 31) {
				callback(new Error('不能超过31天'));
			} else {
				callback();
			}
		},
		yearMax(rule, val, callback){
			if (val && val > 365) {
				callback(new Error('不能超过365天'));
			} else {
				callback();
			}
		},
    // 提交
    handleSubmit(){
      this.$refs.formValidate.validate((valid) => {
				if (valid) {
          let rules = []
          let flag = false
          for(let i=0; i<this.formItem.tabName.length; i++){
            let item = this.formItem.tabName[i]
            let obj = {
              cityCode: this.formItem.cityCode,
              enableFlag: item.enableFlag ? 1 : 0,
              leaveType: item.value,
              monthLimit: item.monthLimit ? item.monthLimit : null,
              monthOver: item.monthOver ? 0 : 1,
              yearLimit: item.yearLimit ? item.yearLimit : null,
              yearOver: item.yearOver ? 0 : 1
            }
            if(item.enableFlag){
              flag = true
            }

            if((item.monthOver && !item.monthLimit) || (item.yearOver.monthOver && !item.yearLimit) || (item.enableFlag && !item.monthLimit && !item.yearLimit)){
                this.name1 = String(i+1)
                this.$Message.error('请填写请假天数!');
                return
            }
            if(this.leaveType == "E"){
              obj = Object.assign(obj, {id: item.id ? item.id : null})
            }
            if(item.enableFlag||item.monthLimit||item.yearLimit){
              rules.push({...obj})
            }
            
          }
          if(!flag){
            this.$Message.error('请至少启用一项规则!');
            return
          }
          //新增
          if(this.leaveType == "A"){
            let params = {
              addNewRules: [...rules]
            }
            addLeaveRule(params).then((res) =>{
              if(res.data.success) {
                this.$Message.success(res.data.msg);
                this.$emit("submitChange", 1);
              }
            })
          }
          //编辑
          if(this.leaveType == "E"){
            let params = {
              editRules: [...rules]
            }
            editLeaveRule(params).then((res) =>{
              if(res.data.success) {
                this.$Message.success(res.data.msg);
                this.$emit("submitChange");
              }
            })
          }

        } else {
					this.$Message.error('表单验证失败!');
        }
      })

    },
    // 取消
    closeChange() {
			if(this.leaveType != 'X') {
				this.$Modal.confirm({
					title: "确认取消？",
					onOk: () => {
						this.$emit("closeChange");
					}
				});
			}else {
				this.$emit("closeChange");
			}
    }
  }
};
</script>
<style lang="less">
  .ivu-input[disabled], fieldset[disabled] .ivu-input, .ivu-select-disabled .ivu-select-selection, .ivu-checkbox-disabled .ivu-checkbox-inner {
    background-color: transparent;
  }
</style>


