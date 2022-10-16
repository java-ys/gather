<template>
  <div>
    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
			<FormItem label="适用城市：" prop="cityCode" >
				<Select
					v-model="formItem.cityCode"
					style="width: 200px"
					filterable
					placeholder="请选择城市"
					:disabled="restType=='X'"
				>
					<Option
						v-for="(item, index) in cityList"
						:value="item.cityID || item.cityId"
						:key="index"
						>{{ item.city }}</Option
					>
				</Select>
			</FormItem>
			<FormItem :label-width="0">
				<div style="display:flex;">
					<FormItem style="margin-right: 10px;display:flex;" label="适用排班：" prop="shiftUuid">
						<Select
							v-model="formItem.shiftUuid"
							style="width: 200px"
							filterable
							:disabled="restType=='X'"
							placeholder="排班名称">
							<Option
								v-for="(item, index) in shiftList"
								@click.native="shiftChange(index)"
								:value="item.shiftUuid"
								:key="index"
								>{{ item.shiftName }}</Option>
						</Select>
					</FormItem>
					<FormItem v-if="douShiftList.length>1" prop="shiftRuleUuid">
						<Select
							v-model="formItem.shiftRuleUuid"
							style="width: 200px"
							filterable
							:disabled="restType=='X'"
							placeholder="排班名称">
							<Option
								v-for="(item, index) in douShiftList"
								:value="item.shiftRuleUuid"
								:key="index"
								@click.native="douShiftChange(index)"
								>{{ item.ruleName }}</Option>
						</Select>
					</FormItem>
				</div>
			</FormItem>
			<FormItem label="周休息天数：" prop="restDays">
				<Input
					v-model="formItem.restDays"
					:disabled="restType=='X'"
					placeholder="请输入周休息天数..."
					style="width: 200px"
					:maxlength="1"
				></Input>
			</FormItem>
			<FormItem label="周休息名额：" prop="restNum">
				<Input
					:value="parseInt(formItem.restDays) ? carDriverNum*parseInt(formItem.restDays) : 0"
					disabled
					style="width: 200px"
					:maxlength="50"
				></Input>
			</FormItem>
			<FormItem :label-width="0">
				<Row>
					<Col>
						<FormItem prop="weekRestRatio" class="week_ml" label="周休息名额比例：">
							<Input
								:disabled="restType=='X'"
								v-model="formItem.weekRestRatio"
								placeholder="请输入周休息名额比例..."
								style="width: 200px;"
								:maxlength="3"
							></Input>
							%
						</FormItem>
					</Col>
				</Row>
				<Row style="margin-top:10px; margin-left: 140px;">
					<Col span="1">
						<span style="margin-top:10px;display: inline-block;">其中</span>
					</Col>
					<Col span="23">
						<div style="display: flex;margin-top:10px; flex-direction: row;
							flex-wrap: wrap;">
							<div v-for="(item,index) in formItem.vacationWeekRestRatios" :key="index" style="margin-right: 10px">
								<FormItem style="margin-bottom: 10px"
									:prop="'vacationWeekRestRatios.' + index + '.ratio'"
            						:rules="[{validator: validLast, trigger: 'blur'},
											{ validator: ratioMax, trigger: 'blur'}]"
								>
									<span style="margin-left: 10px">{{"星期" + upper([item.dayOfWeek])}}</span>
									<Input
										:disabled="restType=='X'"
										v-model="item.ratio"
										placeholder="请输入..."
										style="width: 50px;margin-left: 10px"
										:maxlength="3"
									></Input>
									%
								</FormItem>
							</div>
						</div>
					</Col>
				</Row>
			</FormItem>
			<Form :label-width="145" class="lable_pt0" :model="formItem" ref="formValidateChild1">
				<FormItem label="特定日期休息名额比例：">
					<div style="display: flex; margin-bottom: 10px;"
					v-for="(item,index) in formItem.vacationSpecialRestRatios"
					:key="index">
						<FormItem prop="time">
							<DatePicker style="width: 110px"
								type="date" placeholder="日期"
								format="MM-dd"
								v-model="item.vacationDate"
								:options="dataFuture"
								:disabled="restType=='X'"
								@on-change="ratioTimeChange(index, formItem.vacationSpecialRestRatios)"
								></DatePicker>
						</FormItem>
						<FormItem style="margin-left: 10px"
							:prop="'vacationSpecialRestRatios.' + index + '.ratio'"
							:rules="[{validator: validLast, trigger: 'blur'},
									{ validator: ratioMax, trigger: 'blur'}]">
							<Input
								:disabled="restType=='X'"
								v-model="item.ratio"
								style="width: 50px"
								:maxlength="3"
							></Input>
							%
						</FormItem>
						<Button
							type="primary"
							size="small"
							icon="md-add"
							style="margin-left: 5px;height: 30px;margin-top: 3px"
							v-if="index == 0"
							:disabled="restType=='X'"
							@click="addTimeRatio(formItem.vacationSpecialRestRatios)"
							></Button>
						<Button
							type="primary"
							size="small"
							icon="md-remove"
							style="margin-left: 5px;height: 30px;margin-top: 3px"
							v-if="index != 0"
							:disabled="restType=='X'"
							@click="delTimeRatio(index, formItem.vacationSpecialRestRatios)"
							></Button>
					</div>
				</FormItem>
			</Form>
			<FormItem :label-width="0">
				<Row>
					<Col>
						<FormItem prop="weekLeaveRatio" class="week_ml" label="周请假名额比例：">
							<Input
								:disabled="restType=='X'"
								v-model="formItem.weekLeaveRatio"
								placeholder="请输入"
								style="width: 200px"
								:maxlength="3"
							></Input>
							%
						</FormItem>
					</Col>
				</Row>
				<Row style="margin-top:10px; margin-left:140px;">
					<Col span="1" >
						<span style="margin-top:10px;display: inline-block;">其中</span>
					</Col>
					<Col span="23">
						<div style="display: flex;margin-top:10px; flex-direction: row;
							flex-wrap: wrap;">
							<div
								v-for="(item,index) in formItem.vacationWeekLeaveRatios"
								:key="index"
								style="margin-right: 10px">
								<FormItem style="margin-bottom: 10px"
									:prop="'vacationWeekLeaveRatios.' + index + '.ratio'"
									:rules="[{validator: validLast, trigger: 'blur'},
											{ validator: ratioMax, trigger: 'blur'}]">
									<span style="margin-left: 10px">{{"星期" + upper([item.dayOfWeek])}}</span>
									<Input
										:disabled="restType=='X'"
										v-model="item.ratio"
										placeholder="请输入..."
										style="width: 50px;margin-left: 10px"
										:maxlength="3"
									></Input>
									%
								</FormItem>
							</div>
						</div>
					</Col>
				</Row>
			</FormItem>
			<Form :label-width="145" class="lable_pt0" :model="formItem" ref="formValidateChild2">
				<FormItem label="特定日期请假名额比例：">
					<div
						style="display: flex; margin-bottom: 10px;"
						v-for="(item,index) in formItem.vacationSpecialLeaveRatios"
						:key="index">
						<FormItem>
							<DatePicker type="date" placeholder="日期" style="width: 110px"
								:disabled="restType=='X'"
								format="MM-dd"
								v-model="item.vacationDate"
								:options="dataFuture"
								@on-change="ratioTimeChange(index, formItem.vacationSpecialLeaveRatios)"
								></DatePicker>
						</FormItem>
						<FormItem style="margin-left: 10px"
							:prop="'vacationSpecialLeaveRatios.' + index + '.ratio'"
							:rules="[{validator: validLast, trigger: 'blur'},
									{ validator: ratioMax, trigger: 'blur'},
									]">
							<Input
								:disabled="restType=='X'"
								v-model="item.ratio"
								style="width: 50px"
								:maxlength="3"
							></Input>
							%
						</FormItem>
						<Button
						type="primary"
						size="small"
						icon="md-add"
						style="margin-left: 5px;height: 30px;margin-top: 3px"
						v-if="index == 0"
						:disabled="restType=='X'"
						@click="addTimeRatio(formItem.vacationSpecialLeaveRatios)"
						></Button>
						<Button
						type="primary"
						size="small"
						icon="md-remove"
						style="margin-left: 5px;height: 30px;margin-top: 3px"
						v-if="index != 0"
						:disabled="restType=='X'"
						@click="delTimeRatio(index, formItem.vacationSpecialLeaveRatios)"
						></Button>
					</div>
				</FormItem>
			</Form>
		</Form>
		<div class="ivu-modal-footer">
			<Button
				type="text"
				size="large"
				style="margin-right: 8px"
				@click="closeChange('formValidate')"
				>取消</Button
			>
			<Button
				type="primary"
				@click="handleSubmit()"
				size="large"
				v-if="restType != 'X'"
				>确定</Button
			>
		</div>
  </div>
</template>
<script>
import { axiosSetCityList } from "_g/api/common.js";
import { restQueryShift, addRest, updateRest, detailRest } from "_o/api/rest.js";
export default {
	props: {
		restType: {
			type: String,
			default: "A"
		},
		id: {
			type: Number,
			default: null
		},
		modal: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			revision: 0,
			carDriverNum: 0,
			formItem: {
				cityCode: '',
				restDays: '',
				shiftUuid: '',
				shiftRuleUuid: '',
				weekRestRatio: '',
				weekLeaveRatio: '',
				// 非必填参数
				vacationWeekRestRatios: [],
				vacationWeekLeaveRatios: [],
				vacationSpecialRestRatios: [
					{
						vacationDate: '',
						ratio: '',
						month: null,
						dayOfMonth: null,
						id: null
					}
				],
				vacationSpecialLeaveRatios: [
					{
						vacationDate: '',
						month: null,
						dayOfMonth: null,
						ratio: '',
						id: null
					}
				]
			},
			ruleValidate: {
				cityCode: [
					{ required: true, message: "适用城市不能为空", trigger: "change" },
				],
				shiftUuid: [
					{ required: true, message: "适用排班不能为空", trigger: "change" },
				],
				shiftRuleUuid: [
					{ required: true, message: "适用排班不能为空", trigger: "change" },
				],
				restDays: [
					{ required: true, message: "周休息天数不能为空", trigger: "blur" },
					{ validator: this.validLast, trigger: 'blur'},
					{ validator: this.restDaysMax, trigger: 'blur'},
					{ validator: this.ratioMix, trigger: 'blur'}
				],
				weekRestRatio: [
					{ required: true, message: "周休息名额比例不能为空", trigger: "blur" },
					{ validator: this.validLast, trigger: 'blur'},
					{ validator: this.ratioMax, trigger: 'blur'},
					{ validator: this.ratioMix, trigger: 'blur'}
				],
				weekLeaveRatio: [
					{ required: true, message: "周请假名额比例不能为空", trigger: "blur" },
					{ validator: this.validLast, trigger: 'blur'},
					{ validator: this.ratioMax, trigger: 'blur'},
					{ validator: this.ratioMix, trigger: 'blur'}
				]
			},
			cityList: [],
			shiftList: [],
			douShiftList: [],
			//只可选择未来日期
			dataFuture: {
				disabledDate (date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			firstLog: true
		}
	},
	mounted() {
		this.getCityList();
	},
	watch: {
		modal(){
			this.$refs.formValidate.resetFields();
			this.$refs.formValidateChild1.resetFields();
			this.$refs.formValidateChild2.resetFields();
			this.firstLog = true
			if(this.restType == "X" || this.restType == "E"){
				detailRest({ id: this.id }).then((res) =>{
					if(res.data.success) {
						let data = res.data.data
						this.revision = data.revision
						this.carDriverNum = data.bindedCarDriverNumber
						this.formItem.cityCode = data.cityCode
						this.formItem.restDays = data.restDays ? String(data.restDays) : ""
						this.formItem.shiftUuid = data.shiftUuid
						this.formItem.shiftRuleUuid = data.shiftRuleUuid
						this.formItem.weekRestRatio = data.weekRestRatio ? String(data.weekRestRatio) : ""
						this.formItem.weekLeaveRatio = data.weekLeaveRatio ? String(data.weekLeaveRatio) : ""
						this.formItem.vacationWeekRestRatios = []
						this.formItem.vacationWeekLeaveRatios = []
						this.formItem.vacationSpecialRestRatios = []
						this.formItem.vacationSpecialLeaveRatios = []
						for(let i=1; i<8; i++){
							let objRest = {
								dayOfWeek: data.vacationWeekRestRatios[i-1] ? data.vacationWeekRestRatios[i-1].dayOfWeek : i,
								ratio: data.vacationWeekRestRatios[i-1] ? String(data.vacationWeekRestRatios[i-1].ratio) : '',
								id: data.vacationWeekRestRatios[i-1] ? data.vacationWeekRestRatios[i-1].id : null,
								revision: data.vacationWeekRestRatios[i-1] ? data.revision : null
							}
							this.formItem.vacationWeekRestRatios.push({...objRest})
							let objLeave = {
								dayOfWeek: data.vacationWeekLeaveRatios[i-1] ? data.vacationWeekLeaveRatios[i-1].dayOfWeek : i,
								ratio: data.vacationWeekLeaveRatios[i-1] ? String(data.vacationWeekLeaveRatios[i-1].ratio) : '',
								id: data.vacationWeekLeaveRatios[i-1] ? data.vacationWeekLeaveRatios[i-1].id : null,
								revision: data.vacationWeekRestRatios[i-1] ? data.revision : null
							}
							this.formItem.vacationWeekLeaveRatios.push({...objLeave})
						}
						if(data.vacationSpecialRestRatios.length == 0){
							this.formItem.vacationSpecialRestRatios.push({vacationDate: '', ratio: '', month: null, dayOfMonth: null})
						}else{
							data.vacationSpecialRestRatios.forEach(item => {

								let month = item.month&&item.month.toString().length == 2 ? item.month : "0"+item.month
								let dayOfMonth = item.dayOfMonth&&item.dayOfMonth.toString().length == 2 ? item.dayOfMonth : "0"+item.dayOfMonth
								let obj = {
									vacationDate: month + "-" + dayOfMonth,
									ratio: item.ratio,
									id: item.id,
									month: month,
									dayOfMonth: dayOfMonth,
									revision: item.id ? data.revision : null
								}
								this.formItem.vacationSpecialRestRatios.push({...obj})
							})
						}

						if(data.vacationSpecialLeaveRatios.length == 0){
							this.formItem.vacationSpecialLeaveRatios.push({vacationDate: '', ratio: '', month: null, dayOfMonth: null})
						} else {
							data.vacationSpecialLeaveRatios.forEach(item => {
								let month = item.month&&item.month.toString().length == 2 ? item.month : "0"+item.month
								let dayOfMonth = item.dayOfMonth&&item.dayOfMonth.toString().length == 2 ? item.dayOfMonth : "0"+item.dayOfMonth
								let obj = {
									vacationDate: month + "-" + dayOfMonth,
									ratio: item.ratio,
									id: item.id,
									month: month,
									dayOfMonth: dayOfMonth,
									revision: item.id ? data.revision : null
								}
								this.formItem.vacationSpecialLeaveRatios.push({...obj})
							})
						}
					}
				})
			} else {
				this.shiftList = []
				this.douShiftList = []
				this.carDriverNum = 0
				this.formItem.cityCode = ""
				this.formItem.restDays = ""
				this.formItem.shiftUuid = ""
				this.formItem.shiftRuleUuid = ""
				this.formItem.weekRestRatio = ""
				this.formItem.weekLeaveRatio = ""
				this.formItem.vacationWeekRestRatios = []
				this.formItem.vacationWeekLeaveRatios = []
				for( let i=1; i<8; i++){
					let obj = {dayOfWeek: i, ratio: ''}
					this.formItem.vacationWeekRestRatios.push({...obj})
					this.formItem.vacationWeekLeaveRatios.push({...obj})
				}
				this.formItem.vacationSpecialRestRatios = [
					{
						vacationDate: '',
						ratio: ''
					}
				]
				this.formItem.vacationSpecialLeaveRatios = [
					{
						vacationDate: '',
						ratio: ''
					}
				]

			}
		},
		// 适用城市
		'formItem.cityCode': {
			 handler(newVal, oldVal) {
				if(newVal){
					restQueryShift({cityCode: this.formItem.cityCode}).then((res) =>{
						if (res.data.success) {
							this.shiftList = res.data.data;
							if(this.restType == "X" && this.firstLog || this.restType == "E" && this.firstLog){
								this.firstLog = false
								this.shiftList.forEach((i, index) => {
									if(this.formItem.shiftUuid == i.shiftUuid){
										this.douShiftList = this.shiftList[index].shiftRuleVoList
										this.douShiftList.forEach((j, i) =>{
											if(this.formItem.shiftRuleUuid == j.shiftRuleUuid){
												this.carDriverNum = j.bindedCarDriverNumber ? j.bindedCarDriverNumber : 0
											}
										})
									}
								})
								return
							}
							this.formItem.shiftUuid = ""
							this.formItem.shiftRuleUuid = ""
							this.douShiftList = []
						} else {
							this.$Message.error(res.data.msg);
						}
					})
				}
			},
			deep: true
		},
	},
	methods: {
		 // 获取城市列表
		getCityList() {
			axiosSetCityList({}).then(res => {
				console.log(res.data)
				if (res.data.success) {
				this.cityList = res.data.data;
				} else {
				this.$Message.error(res.data.msg);
				}
			});
		},
		upper(n) {
			const reg = /(^[1-9]\d*$)/;
			n.forEach(i => {
				if (!reg.test(n)) {
					return '非法数字';
				}
			})
			let uppercase = '千百亿千百十万千百十个';
			let nLength = n.length;
			let newStr = '';
			if (uppercase.length - nLength < 0) {
				return '数字过长';
			}
			uppercase = uppercase.substr(uppercase.length - nLength);
			for (let i = 0; i < nLength; i++) {
				newStr += '零日一二三四五六'.charAt(n[i]) + uppercase.charAt(i);
			};
			newStr = newStr.substr(0, newStr.length - 1);
			return newStr;
		},
		// 添加特定日期休息请假名额比例
		addTimeRatio(list) {
			for(let i = 0; i < list.length; i++) {
				if(!list[i].vacationDate || !list[i].ratio) {
					this.$Message.warning("请填写特定名额比例");
					return false;
				}
			}
			list.push({
				vacationDate: "",
				ratio: ""
			});
		},
	  	delTimeRatio(index, list) {
			list.splice(index, 1);
		},
		ratioTimeChange(index, list){
			setTimeout(()=>{
				if(list[index].vacationDate){
					list[index].month = list[index].vacationDate.getMonth()+1
					list[index].dayOfMonth = list[index].vacationDate.getDate()
				}
				if(list.length > 1){
					for(let i = 0; i < list.length; i++) {
						if(i == index){
							continue;
						}
						let iDate = new Date(list[i].vacationDate)
						let indexDate = new Date(list[index].vacationDate)

						if(iDate.getTime() == indexDate.getTime()){
							list[index].vacationDate = ''
							list[index].month = null
							list[index].dayOfMonth = null
							this.$Message.warning("日期选择重复");
							return;
						}
					}
				}
			})
		},
		validLast(rule, val, callback) {
			const reg = /^[0-9]+$/;
			if (!reg.test(val) && val) {
				callback(new Error('请输入正确的正整数'));
			} else {
				callback();
			}
		},
		restDaysMax(rule, val, callback){
			if (val && val > 7) {
				callback(new Error('周休息天数不能大于7'));
			} else {
				callback();
			}
		},
		ratioMax(rule, val, callback){
			if (val && val > 100) {
				callback(new Error('比例值不能超过100'));
			} else {
				callback();
			}
		},
		ratioMix(rule, val, callback){
			if (val && val <1) {
				callback(new Error('不能小于1'));
			} else {
				callback();
			}
		},
		closeChange(name) {
			if(this.restType != 'X') {
				this.$Modal.confirm({
					title: "确认取消？",
					onOk: () => {
						this.$emit("closeChange");
					}
				});
			}else {
				this.$emit("closeChange");
			}
		},
		totalRatio(arr){
			let restAll = 0
			arr.forEach(function(i){
				if(i.ratio){
					restAll=restAll + parseInt(i.ratio)
				}
			})
			return restAll;
		},
		handleSubmit(){
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.$refs.formValidateChild1.validate((valid) => {
						if (valid){
							this.$refs.formValidateChild2.validate((valid) => {
								if (valid){
									let params = {
										cityCode: this.formItem.cityCode,
										restDays: parseInt(this.formItem.restDays),
										shiftUuid: this.formItem.shiftUuid,
										shiftRuleUuid: this.formItem.shiftRuleUuid,
										weekRestRatio: parseInt(this.formItem.weekRestRatio),
										weekLeaveRatio: parseInt(this.formItem.weekLeaveRatio),
										vacationWeekRestRatios: [],
										vacationWeekLeaveRatios: [],
										vacationSpecialRestRatios: [],
										vacationSpecialLeaveRatios: []
									}
									let restAll = this.totalRatio(this.formItem.vacationWeekRestRatios)
									let vacationAll = this.totalRatio(this.formItem.vacationWeekLeaveRatios)
									if(restAll > 0 && restAll != 100){
										this.$Message.error('周休息名额比例不等于1');
										return
									}
									if(restAll == 100){
										for(let i=0; i<this.formItem.vacationWeekRestRatios.length; i++){
											let item = this.formItem.vacationWeekRestRatios[i]
											let obj = {
												dayOfWeek: item.dayOfWeek,
												ratio: parseInt(item.ratio),
												id: item.id ? item.id : null,
												revision: item.revision ? item.revision : null
											}
											params.vacationWeekRestRatios.push({...obj})
											if(!this.formItem.vacationWeekRestRatios[i].ratio){
												this.$Message.error('请填写完整周休息名额比例');
												return
											}
										}
									}
									if(vacationAll > 0 && vacationAll != 100){
										this.$Message.error('周请假名额比例不等于1');
										return
									}
									if(vacationAll == 100){
										for(let i=0; i<this.formItem.vacationWeekLeaveRatios.length; i++){
											let item = this.formItem.vacationWeekLeaveRatios[i]
											let obj = {
												dayOfWeek: item.dayOfWeek,
												ratio: parseInt(item.ratio),
												id: item.id ? item.id : null,
												revision: item.revision ? item.revision : null
											}
											params.vacationWeekLeaveRatios.push({...obj})
											if(!this.formItem.vacationWeekLeaveRatios[i].ratio){
												this.$Message.error('请填写完整周请假名额比例');
												return
											}
										}
									}

									for(let i=0; i<this.formItem.vacationSpecialRestRatios.length; i++){
										let item = this.formItem.vacationSpecialRestRatios[i]
										if(item.vacationDate && !item.ratio || !item.vacationDate && item.ratio){
											this.$Message.error('请输入完整特定日期休息名额比例');
											return
										}
										if(item.vacationDate && item.ratio){
											let itemObj = {
												month: parseInt(item.month),
												dayOfMonth: parseInt(item.dayOfMonth),
												ratio: parseInt(item.ratio),
												id: item.id,
												revision: item.revision
											}
											params.vacationSpecialRestRatios.push({...itemObj})
										}
									}

									for(let i=0; i<this.formItem.vacationSpecialLeaveRatios.length; i++){
										let item = this.formItem.vacationSpecialLeaveRatios[i]
										if(item.vacationDate && !item.ratio || !item.vacationDate && item.ratio){
											this.$Message.error('请输入完整特定日期请假名额比例');
											return
										}
										if(item.vacationDate && item.ratio){
											let itemObj = {
												month: parseInt(item.month),
												dayOfMonth: parseInt(item.dayOfMonth),
												ratio: parseInt(item.ratio),
												id: item.id,
												revision: item.revision
											}
											params.vacationSpecialLeaveRatios.push({...itemObj})
										}
									}
									console.log(params)

									// 新增
									if(this.restType == "A"){
										addRest(params).then((res) =>{
											if(res.data.success) {
												this.$Message.success(res.data.msg);
												this.$emit("submitChange", 1);
											}
										})
									}
									// 编辑

									if(this.restType == "E"){
										params = Object.assign(params,{id: this.id, revision: this.revision})
										updateRest(params).then((res) =>{

											if(res.data.success) {
												this.$Message.success(res.data.msg);
												this.$emit("submitChange");
											}
										})
									}
								}else {
									this.$Message.error('表单验证失败!');
								}
							})
						} else {
							this.$Message.error('表单验证失败!');
						}
					})
				} else {
					this.$Message.error('表单验证失败!');
				}
			})
		},

		shiftChange(key){
			this.douShiftList = this.shiftList[key].shiftRuleVoList
			if(this.douShiftList.length < 2){
				this.carDriverNum = this.douShiftList[0].bindedCarDriverNumber
				this.formItem.shiftRuleUuid = this.douShiftList[0].shiftRuleUuid
			}
		},
		douShiftChange(key){
			this.douShiftList[key].bindedCarDriverNumber ? this.carDriverNum = this.douShiftList[key].bindedCarDriverNumber : this.carDriverNum = 0
		}
	},
}
</script>
<style lang="less">
  .ivu-input[disabled], fieldset[disabled] .ivu-input, .ivu-select-disabled .ivu-select-selection, .ivu-checkbox-disabled .ivu-checkbox-inner {
    background-color: transparent;
  }
  .week_ml .ivu-form-item-error-tip{
	  left: 140px;
  }
  .lable_pt0 .ivu-form-item-error-tip{
	  padding-top: 0;
  }
</style>
