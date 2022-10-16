<!--
 * @Descritption:
 * @Author: lvzhiyang
 * @Date: 2019-11-01 12:00:10
 * @LastEditors: lvzhiyang
 * @LastEditTime: 2019-11-01 19:25:48
 -->
<template>
	<div class="update-package-price">
		<Form ref="formValidate" :model="params" :rules="ruleValidate" :label-width="180">
			<div class="flex-box">
				<FormItem label="所选城市 :">{{parentParams.cityName}}</FormItem>
				<FormItem label="产品线 :">包车</FormItem>
			</div>
			<div class="flex-box between">
				<FormItem label="套餐:" prop="wrap">
					<span v-if="!addViewStatus">{{params.wrap}}</span>
					<Select v-if="addViewStatus" v-model="params.wrap" placeholder="请选择套餐" style="width: 200px">
						<Option v-for="item in wrapList" :key="item" :value="'套餐'+item">套餐{{item}}</Option>
					</Select>
				</FormItem>
			</div>
			<div class="flex-box between">
				<FormItem label="套餐名称 :" prop="wrapName">
					<span v-if="!addViewStatus" style="width:80px;display:inline-block">{{params.wrapName}}</span>
					<Input v-if="addViewStatus" :maxlength="30" v-model="params.wrapName" placeholder="请输入套餐名称"
								 style="width: 200px"/>
				</FormItem>
			</div>
			<div class="flex-box between">
				<FormItem label="套餐类型 :" prop="wrapType">
					<span v-if="!addViewStatus">{{packageTypeMap[params.wrapType]}}</span>
					<Select v-if="addViewStatus" v-model="params.wrapType" placeholder="请选择套餐类型" style="width: 200px">
						<Option :value="0">起步价套餐</Option>
						<Option :value="1">一口价套餐</Option>
					</Select>
				</FormItem>
			</div>
			<div class="flex-box between">
				<FormItem label="生效时间 :" prop="effectiveTime">
					<span v-if="!addViewStatus" class="width200">{{params.time}}</span>
					<DatePicker v-if="addViewStatus" v-model="params.effectiveTime" type="datetime" :editable="false"
											placeholder="请选择生效时间" style="width: 200px" @on-change="selectDate"></DatePicker>
				</FormItem>
			</div>
			<div class="flex-box between">
				<FormItem label="套餐里程（公里）:" prop="wrapDistance" v-if="params.wrapType===0">
					<span v-if="!addViewStatus" class="width100">{{params.wrapDistance}}</span>
					<InputNumber style="width: 200px" v-if="addViewStatus" :min="0.01" :max="999.99" :step="0.01"
											 v-model="params.wrapDistance"
											 placeholder="请输入"
											 @on-blur="FormatNumber(params.wrapDistance,'params','wrapDistance')"></InputNumber>
				</FormItem>
			</div>
			<div class="flex-box between">
				<FormItem label="套餐时长（分钟）:" prop="wrapTime">
					<span v-if="!addViewStatus" class="width100">{{params.wrapTime}}</span>
					<InputNumber style="width: 200px" v-if="addViewStatus" :min="1" :max="1440" :precision="0"
											 v-model="params.wrapTime" placeholder="请输入"></InputNumber>
				</FormItem>
			</div>
			<div class="flex-box between" v-if="params.wrapType===0">
				<FormItem label="套餐信用金比例（%）:" prop="wrapMarginRatio" v-if="addViewStatus">
					<InputNumber style="width: 200px" :min="1" :max="1000" :step="1" :precision="0"
											 v-model="params.wrapMarginRatio" placeholder="请输入"></InputNumber>
				</FormItem>
				<FormItem label="套餐信用金比例（%）:" v-if="!addViewStatus && params.wrapMarginRatio">
					<span class="width100">{{params.wrapMarginRatio}}</span>
				</FormItem>
			</div>
			<Form class="rel-box dot-box" :ref="'gradeValidate'+index" :model="item" :rules="ruleValidate"
						v-for="(item,index) in params.packagePriceList" :label-width="180" :key="index-100">
				<FormItem label="车型等级:" prop="carLevel">
					<Select v-if="addViewStatus"
									v-model="item.carLevel"
									:disabled="!params.wrap || !params.wrapName || params.wrapType===''
													|| (params.wrapType===0&&!params.wrapDistance) || !params.effectiveTime || !params.wrapTime"
									placeholder="请选择车型等级"
									style="width: 200px">
						<Option v-for="(v,index) in carLevelList" :value="v.value" :disabled="v.disabled" :key="index">{{v.label}}
						</Option>
					</Select>
					<Button
						:disabled="!item.carLevel || (params.wrapType===0 && !params.wrapDistance)"
						type="primary" size="small"
						@click="editPrice(item.carLevel,index)"
						style="margin-left:50px">编辑定价
					</Button>
				</FormItem>
				<Icon v-if="index>0 && addViewStatus" @click="removeTrip(item.carLevel,index)" class="remove-icon"
							type="ios-remove-circle-outline"/>
			</Form>
			<Form v-if="!addViewStatus" style="margin-left: 100px">
				<div style="padding: 15px 0;border-top: 1px dashed #999">车型等级:</div>
				<FormItem v-for="(value,key) in params.rentFareModelPriceDatas" :key="key">
					{{carTypeMap[key]}}
					<Button
						type="primary" size="small"
						@click="checkPrice(key)"
						style="margin-left:50px">查看定价
					</Button>
				</FormItem>
			</Form>
			<Button v-if="addViewStatus" style="margin-left: 80px" type="primary" size="small" @click="addTripItem()">
				新增车型等级
			</Button>
		</Form>
		<div class="popView-footer-wrap">
			<Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
			<Button v-if="addViewStatus" size="large" type="primary" @click="commit(1)">确定</Button>
			<Button v-else size="large" type="primary" @click="commit(0)">确定</Button>
		</div>
		<Modal
			:width="950"
			:styles="{top: '20px'}"
			:title="carTypeMap[nowCarLeval]"
			v-model="openEditDrawer"
			:closable="false"
			:mask-closable="false">
			<a-calendar v-if="hackReset" style="margin: 10px;border-bottom: 1px dashed #999" :validRange="timeRange()">
				<div
					slot="dateCellRender"
					slot-scope="dateValue"
					@click="getSelectDates(dateValue)"
					:class="selectedList.includes(formatDate(dateValue._d))?'price_box selected':'price_box'">
					<b class="price" v-if="addViewStatus">￥{{getDatePrice(dateValue)}}</b>
					<b class="price" v-else>￥{{detailPriceList.includes(formatDate(dateValue._d))?getDeatilPrice(dateValue):
																	getDatePrice(dateValue)}}</b>
				</div>
			</a-calendar>
			<Form class="rel-box dot-box" v-model="priceForm" :rules="ruleValidate" ref="dateValidate">
				<div v-if="addViewStatus">
					<div v-if="selectedList.length">
						<!-- row2 -->
						<div class="flex-box">
							<FormItem label="套餐定价（元）：" prop="packagePrice" class="list-label">
								<InputNumber style="width: 120px" :min="1" :max="99999" :step="1" :precision="0"
														 v-model="priceForm.packagePrice" placeholder="请输入套餐定价"
														 @on-blur="FormatNumber(priceForm.packagePrice,'priceForm','packagePrice',0)"></InputNumber>
							</FormItem>
							<FormItem label="里程费（元/公里）：" prop="mileageCost" class="list-label" v-if="params.wrapType===0">
								<InputNumber style="width: 120px" :min="0.01" :max="99.99" :step="0.01" v-model="priceForm.mileageCost"
														 placeholder="请输入里程费"
														 @on-blur="FormatNumber(priceForm.mileageCost,'priceForm','mileageCost')"></InputNumber>
							</FormItem>
							<FormItem label="时长费（元/分钟）：" prop="timeCost" class="list-label" v-if="params.wrapType===0">
								<InputNumber style="width: 120px" :min="0.01" :max="99.99" :step="0.01" v-model="priceForm.timeCost"
														 placeholder="请输入时长费"
														 @on-blur="FormatNumber(priceForm.timeCost,'priceForm','timeCost')"></InputNumber>
							</FormItem>
						</div>
						<!-- row3 -->
						<div class="flex-box">
							<FormItem label="远途里程费（元/公里）：" prop="haulBackTripFare" class="list-label" v-if="params.wrapType===0">
								<InputNumber style="width: 120px" :min="0" :max="99.99" :step="0.01"
														 v-model="priceForm.haulBackTripFare"
														 placeholder="请输入远途里程费"
														 @on-blur="FormatNumber(priceForm.haulBackTripFare,'priceForm','haulBackTripFare')"></InputNumber>
							</FormItem>
							<FormItem label="远途里程（公里）：" prop="haulBackTrip" class="list-label" v-if="params.wrapType===0">
								<InputNumber style="width: 120px" :min="0" :max="999" :step="1"
														 v-model="priceForm.haulBackTrip" placeholder="请输入远途里程"
														 @on-blur="FormatNumber(priceForm.haulBackTrip,'priceForm','haulBackTrip',0)"></InputNumber>
							</FormItem>
							<FormItem label="回程费（元/公里）：" prop="returnFee" class="list-label" v-if="params.wrapType===0">
								<InputNumber style="width: 120px" :min="0" :max="99.99" :step="0.01" v-model="priceForm.returnFee"
														 placeholder="请输入回程费"
														 @on-blur="FormatNumber(priceForm.returnFee,'priceForm','returnFee',2)"></InputNumber>
							</FormItem>
						</div>
						<!-- row4 -->
						<div class="flex-box">
							<FormItem label="免费等待时长（分钟）" prop="freeWaitTime" class="list-label" v-if="params.wrapType===0">
								<InputNumber style="width: 120px" :min="0" :max="999" :step="1"
														 v-model="priceForm.freeWaitTime" placeholder="请输入免费等待时长"
														 @on-blur="FormatNumber(priceForm.freeWaitTime,'priceForm','freeWaitTime',0)"></InputNumber>
							</FormItem>
							<FormItem label="超时等待费（元/分钟）：" prop="beyondWaitFare" class="list-label" v-if="params.wrapType===0">
								<InputNumber style="width: 120px" :min="0" :max="99.99" :step="0.01" v-model="priceForm.beyondWaitFare"
														 placeholder="请输入超时等待费"
														 @on-blur="FormatNumber(priceForm.beyondWaitFare,'priceForm','beyondWaitFare')"></InputNumber>
							</FormItem>
						</div>
					</div>
				</div>
				<div v-else>
					<div v-if="detailForm.packagePrice">
						<!-- row2 -->
						<div class="price-detail-box">
							<FormItem label="套餐定价（元）：" class="list-label">
								<span>{{detailForm.packagePrice}}</span>
							</FormItem>
							<FormItem label="里程费（元/公里）：" class="list-label" v-if="params.wrapType===0 && detailForm.mileageCost">
								<span>{{detailForm.mileageCost}}</span>
							</FormItem>
							<FormItem label="时长费（元/分钟）：" class="list-label" v-if="params.wrapType===0 && detailForm.timeCost">
								<span>{{detailForm.timeCost}}</span>
							</FormItem>
							<FormItem label="远途里程费（元/公里）：" class="list-label" v-if="params.wrapType===0">
								<span>{{detailForm.haulBackTripFare}}</span>
							</FormItem>
							<FormItem label="远途里程（公里）：" class="list-label" v-if="params.wrapType===0">
								<span>{{detailForm.haulBackTrip}}</span>
							</FormItem>
							<FormItem label="回程费（元/公里）：" class="list-label" v-if="params.wrapType===0">
								<span>{{detailForm.returnFee || '-'}}</span>
							</FormItem>
							<FormItem label="免费等待时长（分钟）：" class="list-label" v-if="params.wrapType===0">
								<span>{{detailForm.freeWaitTime}}</span>
							</FormItem>
							<FormItem label="超时等待费（元/分钟）：" class="list-label" v-if="params.wrapType===0">
								<span>{{detailForm.beyondWaitFare}}</span>
							</FormItem>
						</div>
					</div>
				</div>
			</Form>
			<div class="popView-footer-wrap">
				<Button size="large" type="text" @click="saveDatePrice(0)" style="margin-right: 8px;">取消</Button>
				<Button v-if="addViewStatus && selectedList.length" size="large" type="primary" style="margin-right: 8px;"
								@click="saveDatePrice(1)">
					保存当前
				</Button>
				<Button v-if="addViewStatus" size="large" type="success" @click="saveDatePrice(2)">保存全部</Button>
				<Button v-else size="large" type="primary" @click="saveDatePrice(0)">确定</Button>
			</div>
			<div slot="footer"></div>
		</Modal>
	</div>
</template>

<script>
  //import {packageMap} from '../index'
  import {axiosPackageSave, axiosPackageDetail, axiosDefaultPrice, packageRuleDetailQuery} from "_g/api/openCity";
  import {packageTypeMap, carTypeMap} from "_g/config/status-map";
  import {hasTimesection} from "@/libs/tools.js";
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
        if (value === '') {
          callback(new Error('请输入'));
        } else {
          callback();
        }
      };
      return {
        hackReset: false,
        //packageMap,
        packageTypeMap,
        carTypeMap, // 车型等级
        openEditDrawer: false,
        curDate: new Date(),
        curYear: new Date().getFullYear(),
        curMonth: new Date().getMonth() + 1,
        carLevelList: [
          {value: 1, label: '经济型'},
          {value: 2, label: '舒适型'},
          {value: 3, label: '行政型'},
          {value: 4, label: '商务型'}
        ],
        addViewStatus: false, // true：新增  false：详情
        params: {
          packagePriceList: [
            {
              carLevel: ''
            }
          ]
        }, // 包车套餐参数
        initParams: {
          wrap: '', // 套餐
          wrapType: '', // 套餐类型
          wrapName: "", //策略名称
          effectiveTime: "", //生效时间
          wrapDistance: null,
          wrapTime: null,
          wrapMarginRatio: null,
          packagePriceList: [
            {
              carLevel: ''
            }
          ]
        },
        ruleValidate: {
          wrapName: [
            {required: true, message: "请输入套餐名称", trigger: "change"},
            {
              pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
              message: "仅支持中文英文和数字",
              trigger: "blur"
            }
          ],
          effectiveTime: [
            {required: true, validator: effectiveTime, trigger: "change"}
          ],
          wrap: [
            {
              required: true,
              type: "string",
              message: "请选择套餐",
              trigger: "change"
            }
          ],
          wrapType: [
            {
              required: true,
              type: "number",
              message: "请选择套餐类型",
              trigger: "change"
            }
          ],
          wrapDistance: [
            {
              required: true,
              type: "number",
              message: "请填写套餐里程",
              trigger: "blur"
            }
          ],
          wrapTime: [
            {
              required: true,
              type: "number",
              message: "请填写套餐时长",
              trigger: "blur"
            }
          ],
          startDuratio: [
            {required: true, validator: validateNum, trigger: "change"}
          ],
          beyondWaitFare: [
            {required: true, validator: validateNum, trigger: "change"}
          ],
          freeWaitTime: [
            {required: true, validator: validateNum, trigger: "change"}
          ],
          haulBackTrip: [
            {required: true, validator: validateNum, trigger: "change"}
          ],
          haulBackTripFare: [
            {required: true, validator: validateNum, trigger: "change"}
          ],
          premiumOneRate: [
            {required: true, validator: validateNum, trigger: "change"}
          ],
          premiumTwoRate: [
            {required: true, validator: validateNum, trigger: "change"}
          ],
          packagePrice: [
            {required: true, validator: validateNum, trigger: "change"}
          ],
          timeCost: [
            {required: true, validator: validateNum, trigger: "change"}
          ],
          mileageCost: [
            {required: true, validator: validateNum, trigger: "change"}
          ],
          returnFee: [
            {required: false, validator: validateNum, trigger: "change"}
          ],
          carLevel: [
            {required: true, type: "number", message: "请选择车型等级", trigger: "change"}
          ]
        },
        priceForm: {
          packagePrice: null,
          timeCost: null,
          mileageCost: null,
          haulBackTrip: null,
          haulBackTripFare: null,
          returnFee: null,
          freeWaitTime: null,
          beyondWaitFare: null
        },
        // 日历相关
        selectedList: [],
        wrapList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        datePriceMap: {},
        defaultData: {},
        nowCarLeval: 1,//当前编辑定价的车级等级
        nowIndex: 0,//当前编辑定价的车级等级
        editPackagePriceList: [],
        savePackagePriceList: [],
        detailPriceList: [], // 详情套餐价格

        detailForm: {}
      };
    },
    watch: {
      value() {
        if (this.value) {
          if (this.parentParams.addViewStatus === false) {
            // 定价详情
            this.addViewStatus = false;
            this.getDetail();
            this.resetForm();
            this.savePackagePriceList = []
          } else {
            // 新增定价
            this.addViewStatus = true;
            this.params = JSON.parse(JSON.stringify(this.initParams));
            this.resetForm();
            this.savePackagePriceList = []
          }
        }
      }
    },
    mounted() {
      this.getDefaultDate()
    },
    methods: {
      /* 格式相关 -----------------------------S*/
      // 当前日期前后6个月限制
      timeRange() {
        let curYear = new Date().getFullYear()
        let curMonth = new Date().getMonth() + 1
        let minMonth = null, maxMonth = null, minYear = null, maxYear = null
        if (curMonth <= 6) {
          minYear = curYear - 1
          minMonth = 5 + curMonth
          maxYear = curYear
          maxMonth = 5 + curMonth
        }
        if (curMonth >= 7) {
          minYear = curYear
          minMonth = curMonth - 7
          maxYear = curYear + 1
          maxMonth = curMonth - 7
        }
        return [this.$moment({years: minYear, months: minMonth}), this.$moment({years: maxYear, months: maxMonth})]
      },
      // 日期格式化
      formatDate(v) {
        let month = (v.getMonth() + 1) < 10 ? `0${v.getMonth() + 1}` : (v.getMonth() + 1)
        let day = (v.getDate()) < 10 ? `0${v.getDate()}` : (v.getDate())
        return v.getFullYear() + '-' + month + '-' + day
      },
      // 数字输入格式化
      FormatNumber(VauleNumber, objName = 'params', keyName, fixNum = 2) {
        if (VauleNumber) {
          let newVal = parseFloat(VauleNumber.toFixed(fixNum));
          this.$set(this[objName], keyName, newVal);
        } else {
          if (keyName === 'packagePrice') {
            this.$set(this[objName], keyName, 1);
          } else if (keyName === 'mileageCost' || keyName === 'timeCost' || keyName === 'wrapDistance') {
            this.$set(this[objName], keyName, 0.01);
          } else {
            this.$set(this[objName], keyName, 0);
          }
        }
      },
      // 浮点数相乘
      accMul(arg1, arg2) {
        let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
          m += s1.split(".")[1].length;
        } catch (e) {
        }
        try {
          m += s2.split(".")[1].length;
        } catch (e) {
        }
        let num = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        return num;
      },
      // 浮点数相加并且取整数
      accAdd(arg1, arg2) {
        let r1, r2, m, c;
        try {
          r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
          r1 = 0;
        }
        try {
          r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
          r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
          let cm = Math.pow(10, c);
          if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
          } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
          }
        } else {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", ""));
        }
        return parseInt((arg1 + arg2) / m);
      },
      /* 格式相关 ------------------------------E*/

      /* 日历-初始化相关 -------------------------S*/
      // 获取套餐详情信息
      getDetail() {
        axiosPackageDetail({wrapUuid: this.parentParams.wrapUuid}).then(res => {
          this.params = res.data.data;
        });
      },
      // 获取各个车型等级的默认价格
      getDefaultDate() {
        axiosDefaultPrice({}).then(res => {
          let data = res.data.data || []
          let map = {}
          data.forEach(item => {
            let obj = {...item}
            delete obj.carLevel
            map[item.carLevel] = obj
          })
          this.defaultData = map
        });
      },
      // 渲染日历的默认价格
      getDatePrice(value) {
        let date = this.formatDate(value._d) + this.nowCarLeval
        // 一口价 (算法：时长×时长费)
        let levelData = this.defaultData[this.nowCarLeval]
        if (this.params.wrapType === 1) {
          return this.datePriceMap[date] ? this.datePriceMap[date] : levelData ? parseInt(this.accMul(levelData.timeCost, this.params.wrapTime)) : null
        }
        // 起步价 (算法：套餐的里程×默认的里程费+套餐的时长×默认的时长费)
        else {
          return this.datePriceMap[date] ? this.datePriceMap[date] : levelData ?
            this.accAdd(this.accMul(levelData.mileageCost, this.params.wrapDistance), this.accMul(levelData.timeCost, this.params.wrapTime)) : null
        }
      },
      // 点击特定日期
      getSelectDates(value) {
        // 新增模式
        if (this.addViewStatus) {
          if (value._d <= new Date()) {
            this.$Message.error('只能选择从次日开始的日期')
            return false
          }
          if (value._d.getMonth() == new Date().getMonth() - 5) {
            this.$Message.error('只能选择当前月后6个月的日期')
            return false
          }
          let date = this.formatDate(value._d)
          if (!this.selectedList.includes(date)) {
            this.selectedList.push(date)
          }
          else {
            if(this.selectedList.length===2){
              this.selectedList = []
						}else {
              this.selectedList.splice(this.selectedList.findIndex(item => item === date), 1)
						}
          }
          // 单选
          if (this.selectedList.length === 1) {
            let selectDate = this.selectedList[0]
            let key = selectDate + this.nowCarLeval
            if (this.datePriceMap[key]) {
              this.editPackagePriceList.forEach(item => {
                if (item.date === selectDate) {
                  this.priceForm = {...item}
                }
              })
            } else {
              let result = this.defaultData[this.nowCarLeval]
              this.priceForm = {...result}
            }
            this.priceForm.packagePrice = this.getDatePrice(value)
          }
          // 多选
          else {
            for (let key in this.priceForm) {
              // 一口价
              if (this.params.wrapType === 1) {
                this.priceForm = {
                  packagePrice: 1,
                  returnFee: this.defaultData[this.nowCarLeval] ? this.defaultData[this.nowCarLeval].returnFee : 1
                }
              }
              // 起步价
              else {
                this.priceForm[key] = this.defaultData[this.nowCarLeval] ? this.defaultData[this.nowCarLeval][key] : 1
                this.priceForm.packagePrice = 1
              }
            }
          }
        }
        // 详情模式
        else {
          let data = {
            wrapUuid: this.params.wrapUuid,
            departTime: this.formatDate(value._d),
            carLevel: this.nowCarLeval
          }
          this.selectedList[0] = this.formatDate(value._d)
          // 获取某一日期详情套餐价格
          packageRuleDetailQuery(data).then(res => {
            this.detailForm = res.data.data
          }).catch()
        }
      },
      // 点击编辑套餐按钮
      editPrice(value, index) {
        this.hackReset = true
        this.openEditDrawer = true
        this.nowCarLeval = value
        this.nowIndex = index
        this.editPackagePriceList = this.savePackagePriceList.filter(item => {
          return item.carLevel === this.nowCarLeval
        })
        for (let key in this.priceForm) {
          this.priceForm[key] = null
        }
      },
      // 点击查看套餐详情按钮
      checkPrice(key) {
        this.hackReset = true
        this.detailForm = {}
        this.openEditDrawer = true
        this.nowCarLeval = key
        this.detailPriceList = this.params.rentFareModelPriceDatas[this.nowCarLeval].rentFareModelPriceDtos.map(item => {
          return item.date
        })
      },
      /* 日历-初始化相关 -------------------------E*/

      /* 日历-编辑相关 S*/
      // 在详情模式下查询特定日期的日历价格
      getDeatilPrice(value) {
        const priceList = this.params.rentFareModelPriceDatas[this.nowCarLeval].rentFareModelPriceDtos
        let date = this.formatDate(value._d)
        let packagePrice = priceList.find(item => item.date == date).packagePrice
        return packagePrice
      },
      // 清空选中日期
      resetSelectDates() {
        this.selectedList = []
      },
      // 点击保存/取消编辑套餐价窗口
      saveDatePrice(temp) {
        if (temp === 1) {
          //this.priceForm
          let params = {
            ...this.priceForm,
            carLevel: this.nowCarLeval,
          }
          let list = []
          this.editPackagePriceList.forEach((item, index) => {
            if (!this.selectedList.includes(item.date)) {
              list.push(item)
              let key = item.date + this.nowCarLeval
              this.datePriceMap[key] = item.packagePrice
            }
          })
          this.selectedList.forEach(date => {
            list.push({...params, date: date})
            let key = date + this.nowCarLeval
            this.datePriceMap[key] = params.packagePrice
          })
          this.editPackagePriceList = list
          this.resetSelectDates()
        } else if (temp === 2) {
          // 保存到暂存列表
          let arr = []
          this.savePackagePriceList.forEach(item => {
            let res = this.editPackagePriceList.find(son => {
              return item.carLevel === son.carLevel && item.date === son.date
            })
            if (!res) {
              arr.push(item)
            }
          })
          this.editPackagePriceList.forEach(obj => {
            arr.push(obj)
          })
          this.savePackagePriceList = arr
          this.openEditDrawer = false
          this.hackReset = false
          this.resetSelectDates()
        } else {
          // 如果只是暂存 没有保存（savePackagePriceList为空数组） 下次打开重置数据 否则不重置
          if (!this.savePackagePriceList.length) {
            this.datePriceMap = {}
          }
          this.hackReset = false
          this.openEditDrawer = false
          this.resetSelectDates()
        }
      },
      /* 日历-编辑相关 E*/

      /* Form ---------------------------------S*/
      // 重置表单
      resetForm() {
        this.selectedList = []
        this.$refs &&
        this.$refs.formValidate &&
        this.$refs.formValidate.resetFields();
        this.carLevelList.forEach(item => {
          item.disabled = false
        })
      },
      // 新增一个车型等级
      addTripItem() {
        let tripList = this.params.packagePriceList;
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
            tripList.forEach((item, index) => {
              let key = "gradeValidate" + index;
              this.$refs[key][0].validate().then(status => {
                if (!status) {
                  isSuccess2 = false;
                }
              });
            });
            return new Promise(resolve => {
              resolve();
            });
          })
          .then(() => {
            if (isSuccess1 && isSuccess2) {
              this.params.packagePriceList.push(
                {
                  carLevel: ''
                }
              );
              this.carLevelList.forEach(item => {
                if (this.params.packagePriceList.findIndex(v => v.carLevel === item.value) > -1) {
                  item.disabled = true
                }
              })
            }
          })
      },
      // 移除车型等级
      removeTrip(level, index) {
        this.params.packagePriceList.splice(index, 1);
        this.carLevelList.forEach(item => {
          if (item.value == level) {
            item.disabled = false
          }
        })
      },
      selectDate(date) {
        this.params.effectiveTime = date;
      },
      // 提交配置
      commit(temp) {
        if (temp) {
          let tripList = this.params.packagePriceList;
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
              tripList.forEach((item, index) => {
                let key = "gradeValidate" + index;
                this.$refs[key][0].validate().then(status => {
                  if (!status) {
                    isSuccess2 = false;
                  }
                });
              });
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
                let defaultPriceList = [] // 默认定价的车型列表
                let hasPriceList = [] // 有配置价格的车型列表
                this.savePackagePriceList.forEach(item => {
                  hasPriceList.push({carLevel: item.carLevel})
                })
								// 如果用户不为某一车型配置特定价格
                defaultPriceList = tripList.filter(item => !hasPriceList.some(ele => ele.carLevel === item.carLevel));
                params.packagePriceList = this.savePackagePriceList.concat(defaultPriceList)
                if (params.wrapType === 1) delete params.wrapDistance
                axiosPackageSave(params).then(res => {
                  this.selectedList = []
                  this.datePriceMap = {}
                  this.$Message.success("新建成功");
                  this.$emit("input", false);
                  this.$emit("on-confirm");
                  this.$forceUpdate()
                });
              }
            });
        } else {
          this.datePriceMap = {}
          this.savePackagePriceList = []
          this.$emit("input", false);
        }
      }
      /* Form ---------------------------------E*/
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
