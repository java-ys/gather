<!--
 * @Descritption:
 * @Author: lvzhiyang
 * @Date: 2019-11-01 12:00:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-10-25 21:34:26
 -->
<template>
  <div class="update-package-price">
    <Form ref="formValidate" :model="params" :rules="ruleValidate" :label-width="180">
      <div class="flex-box">
        <FormItem label="所选城市 :">{{parentParams.cityName}}</FormItem>
        <FormItem label="业务线 :">包车</FormItem>
      </div>
      <div class="flex-box">
        <FormItem label="运营模式 :" prop="operationMode">
          UP模式
          <!--          <span v-if="!addViewStatus">UP模式</span>-->
          <!--          <Select v-if="addViewStatus" v-model="params.operationMode" >-->
          <!--            <Option label="UP模式" value="0"></Option>-->
          <!--          </Select>-->
        </FormItem>
        <FormItem label="司机类型 :" prop="driverTypes">
          <!--          <span v-if="!addViewStatus">UP司机</span>-->
          <!--          <Select v-if="addViewStatus" v-model="params.driverTypes" multiple>-->
          <!--            <Option label="UP司机" value="0"></Option>-->
          <!--          </Select>-->
        </FormItem>
      </div>
      <div class="flex-box between">
        <FormItem v-if="addViewStatus" label="司机包车定价占比（%）:" prop="driverFareDiscount">
          <span v-if="!addViewStatus">{{params.driverFareDiscount}}</span>
          <InputNumber
            v-if="addViewStatus"
            v-model="params.driverFareDiscount"
            style="width: 200px"
            :min="0.01"
            :step="0.01"
            :max="100"
            placeholder="请输入"
            @on-blur="FormatNumber(params.driverFareDiscount,'driverFareDiscount')"
          ></InputNumber>
        </FormItem>
      </div>
      <div class="flex-box between">
        <FormItem label="生效时间 :" prop="effectiveTime">
          <span v-if="!addViewStatus" class="width200">{{params.effectiveTime}}</span>
          <DatePicker v-if="addViewStatus" v-model="params.effectiveTime" type="datetime" :editable="false"
                      placeholder="请选择生效时间" style="width: 200px" @on-change="selectDate"
          ></DatePicker>
        </FormItem>
      </div>
      <div class="flex-box between">
        <FormItem label="备注：" prop="remark">
          <span v-if="!addViewStatus" class="width150">{{params.remark}}</span>
          <Input v-if="addViewStatus" v-model="params.remark" type="textarea" :autosize="{ minRows: 2,maxRows: 5 }" placeholder="请输入备注" />
        </FormItem>
      </div>
    </Form>
    <div class="popView-footer-wrap">
      <Button size="large" type="text" style="margin-right: 8px;" @click="commit(0)">取消</Button>
      <Button v-if="addViewStatus" size="large" type="primary" @click="commit(1)">确定</Button>
      <Button v-else size="large" type="primary" @click="commit(0)">确定</Button>
    </div>
  </div>
</template>

<script>
import {
  axiosPackageDriverDetail,
  deletePackageDriverStrategy,
  stopPackageDriverStrategy, axiosPackageDriverSave
} from "_g/api/openCity";
import { hasTimesection } from "@/libs/tools.js";
import "@/styles/cyk-style.css";

export default {
  props: ["value", "parentParams"],
  data() {
    const effectiveTime = (rule, value, callback) => {
      let date = value || null;
      if (date === null) { callback(new Error("请选择生效时间")); }
      else {
        let timestamp = new Date(date).getTime();
        let today = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        if (timestamp < today) {
          callback(new Error("生效时间不得早于明天"));
        } else { callback(); }
      }
    };
    const validateNum = (rule, value, callback) => {
      if (value === null) callback(new Error("请填写内容"));
      else callback();
    };
    const remark = (rule, value, callback) => {
      if (value) {
        if (value.length > 20) {
          callback(new Error("字数不可超过20字"))
        } else { callback() }
      } callback()
    };
    return {
      hackReset: false,
      params: {}, // 包车套餐参数
      addViewStatus: false, // true：新增  false：详情
      initParams: {
        operationMode: "2", // 运营模式 2: UP模式
        driverTypes: [50], // 司机类型支持多选。  50:UP司机
        extendBizType: "2",
        carLevel: "", // 车型等级
        typeTime: "2", // 订单类型
        fareTypeNote: "", // 策略名称
        effectiveTime: "", // 生效时间
        driverFareDiscount: null,
        remark: "",
      },
      ruleValidate: {
        driverFareDiscount: [
          { required: true, validator: validateNum, trigger: "change" }
        ],
        remark: [{
          validator: remark, trigger: "change"
        }],
        effectiveTime: [
          { required: true, validator: effectiveTime, trigger: "change" }
        ]
      },
    };
  },
  watch: {
    value() {
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
  },
  mounted() {

  },
  methods: {
    /* 格式相关 -----------------------------S */
    // 日期格式化
    formatDate(v) {
      let month = (v.getMonth() + 1) < 10 ? `0${v.getMonth() + 1}` : (v.getMonth() + 1)
      let day = (v.getDate()) < 10 ? `0${v.getDate()}` : (v.getDate())
      return v.getFullYear() + "-" + month + "-" + day
    },
    // 数字输入格式化
    FormatNumber(VauleNumber, keyName, fixNum = 2) {
      if (VauleNumber) {
        let newVal = parseFloat(VauleNumber.toFixed(fixNum))
        if (keyName.indexOf(",") > -1) {
          let k = keyName.split(",")
          let k0 = k[0]
          let k1 = k[1]
          let k2 = k[2]
          this.$set(this.params[k0][k1], k2, newVal)
        } else {
          this.$set(this.params, keyName, newVal)
        }
      }
    },

    /* 日历-初始化相关 -------------------------S */
    // 获取套餐详情信息
    getDetail() {
      axiosPackageDriverDetail({ uuid: this.parentParams.detailUuid }).then(res => {
        this.params = res.data.data;
      });
    },

    /* Form ---------------------------------S */
    // 重置表单
    resetForm() {
      this.$refs &&
        this.$refs.formValidate &&
        this.$refs.formValidate.resetFields();
    },
    selectDate(date) {
      this.params.effectiveTime = date;
    },
    // 提交配置
    commit(temp) {
      if (temp) {
        let [isSuccess1, isSuccess2] = [false, true];
        this.$refs.formValidate
          .validate()
          .then(status => {
            isSuccess1 = status;
            return new Promise(resolve => {
              resolve();
            });
          })
          .then(() => {
            if (isSuccess1 && isSuccess2) {
              let params = {
                ...this.params,
                ...this.parentParams,
                bizLine: 2
              };
              axiosPackageDriverSave(params).then(res => {
                this.$Message.success("新建成功");
                this.$emit("input", false);
                this.$emit("on-confirm");
                this.$forceUpdate()
              });
            }
          });
      } else {
        this.$emit("input", false);
      }
    }
    /* Form ---------------------------------E */
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.search-input {
		width: 200px;
		margin: 0 0 20px 20px;
	}

	.dot-box {
		padding: 20px 20px 0 0;
		margin-bottom: 20px;
		border: 1px dashed #666;

		&:first-of-type {
			border: none;
		}
	}

	.between {
		display: flex;
		justify-content: space-between;
	}

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

	.rel-box {
		position: relative;
	}

	.remove-icon {
		position: absolute;
		right: 5px;
		top: 5px;
		font-size: 20px;
		color: #e61f10;
		font-weight: bold;
		cursor: pointer;
	}

	/*套餐日历*/
	.price_box {
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.price_box.selected {
		background: #c6e2ff;
	}

	.price-detail-box {
		padding: 0 30px;
		display: flex;
		flex-wrap: wrap;

		.ivu-form-item {
			width: 33%;
		}
	}
</style>
