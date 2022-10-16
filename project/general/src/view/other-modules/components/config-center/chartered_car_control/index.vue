<!--
 * @Descritption: 包车策略管理
 * @Author: lvzhiyang
 * @Date: 2019/11/2
 * @LastEditors: lvzhiyang
 * @LastEditTime: 2019-11-02 16:45:46
 -->
<template>
	<div class="chartered_car_control">
		<Button type="primary" size="large" @click="editFn">{{charteredForm.uuid?'编辑':'新增'}}</Button>
		<div class="row">
			包车时间范围限制：
			<div v-if="editStatus">
				从当前时间：
				<Select v-model="paramForm.startHours" placeholder="请选择" style="width: 100px;">
					<Option v-for="item in startHoursList" :value="item" :key="item">{{item}}</Option>
				</Select>
				小时后至
				<Select v-model="paramForm.endHours" placeholder="请选择" style="width: 100px;">
					<Option v-for="item in endHoursList" :value="item" :key="item">{{item}}</Option>
				</Select>
				小时
			</div>
			<div v-else>
				<div v-if="charteredForm.startHours && charteredForm.endHours">
					从当前时间：<b>{{charteredForm.startHours}}</b>小时后至<b>{{charteredForm.endHours}}</b>小时
				</div>
				<div v-else style="margin-left: 20px"><b>暂无</b></div>
			</div>
		</div>
		<div class="row">
			包车必须开启免密支付:
			<div v-if="editStatus">
				<i-switch size="large"  v-model="paramForm.openPay" :true-value="1" :false-value="0" style="margin-left: 20px">
					<span slot="open">开启</span>
					<span slot="close">关闭</span>
				</i-switch>
			</div>
			<div v-else style="margin-left: 20px">
				<b>{{charteredForm.openPay?'开启':'关闭'}}</b>
			</div>
		</div>
		<div class="footer" v-if="editStatus">
			<Button type="primary" size="large" @click="saveFn()">保存</Button>
			<Button size="large" @click="editStatus=false">取消</Button>
		</div>
	</div>
</template>
<script>
  import {addPackageOperation, updatePackageOperation,queryPackageOperation} from '_o/api/configData.js'

  export default {
    name: "charteredCarControl",
    components: {},
    data() {
      return {
        editStatus: false,
        charteredForm: {},
        paramForm: {
          startHours:1,
          endHours:168,
				}
      };
    },
		computed:{
      startHoursList(){
        let arr = []
				for(let i =1;i<=12;i++){
				  arr.push(i)
				}
				arr = [...arr,24,48]
				return arr
			},
      endHoursList(){
        let arr = []
				let arr2 = []
        for(let i =1;i<=12;i++){
          arr.push(i)
        }
				for(let i=24;i<=720;i=i+24){
          arr2.push(i)
				}
				arr = [...arr,...arr2]
				return arr
			}
		},
    created() {},
    mounted() {
      this.queryFn()
    },
    methods: {
      queryFn() {
        queryPackageOperation().then(res => {
          this.charteredForm = res.data.data?res.data.data:{}
        })
      },
      editFn() {
        this.editStatus = true
        this.paramForm = JSON.parse(JSON.stringify(this.charteredForm))
        if(!this.paramForm.startHours) this.paramForm.startHours =1
        if(!this.paramForm.endHours) this.paramForm.endHours =168
        if(!this.paramForm.openPay) this.paramForm.openPay = 0
      },
      // 保存提交
      saveFn() {
        if(this.paramForm.startHours>=this.paramForm.endHours){
          this.$Message.error('开始时间必须小于结束时间');
          return false
        }
        this.$Modal.confirm({
          title: "确认",
          content: "<p>确认保存业务配置么？</p>",
          onOk: () => {
            let params = {
              startHours: this.paramForm.startHours,
              endHours: this.paramForm.endHours,
              openPay: this.paramForm.openPay,
              uuid:this.paramForm.uuid,
            }
            //调用新增接口，新增配置
						if(this.paramForm.uuid){
              updatePackageOperation(params).then(res => {
                this.editStatus = false
                this.$Message.success(res.data.msg);
                this.queryFn()
              }).catch(() => {
                this.editStatus = false
              });
						}else {
              addPackageOperation(params).then(res => {
                this.editStatus = false
                this.queryFn()
                this.$Message.success(res.data.msg);
              }).catch(() => {
                this.editStatus = false
              });
            }
          },
          onCancel: () => {

          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
	.row {
		display: flex;
		align-items: center;
		margin: 30px 0;
		
		/*span,*/
		/*button {*/
		/*	display: inline-block;*/
		/*	width: 60px;*/
		/*	line-height: 30px;*/
		/*	margin: 0 10px;*/
		/*	cursor: pointer;*/
		/*	text-align: center;*/
		/*}*/
		
		.ivu-input-number {
			margin: 0 20px;
		}
	}
	
	.footer {
		margin-top: 200px;
		display: flex;
		justify-content: center;
		
		button {
			margin: 0 10px;
		}
	}
</style>



