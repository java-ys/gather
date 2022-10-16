<template>
	<div class="main">
		<div class="fl">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
				<FormItem label="推荐点名称：" prop="address" >
					<Input
						v-model="formItem.address"
            placeholder="请输入"
					></Input>
				</FormItem>
				<FormItem label="所属城市：" prop="cityCode" >
				<Select
            filterable
            v-model="formItem.cityCode"
            placeholder="请选择"
          	@on-change="cityChange"
          	@on-clear="cityClear"
          >
            <Option
							:key="index"
							:value="item.value"
							v-for="(item, index) in cityList">{{item.label}}</Option>
          </Select>
				</FormItem>
				<FormItem label="所属区县：" prop="adcode" >
					<Select
            filterable
            v-model="formItem.adcode"
            placeholder="请选择"
          >
            <Option
							:key="index"
							:value="item.value"
							v-for="(item, index) in areaInfoByCodeList">{{item.label}}</Option>
          </Select>
				</FormItem>
				<FormItem label="经度：" prop="lng" >
					<Input
						v-model="formItem.lng"
            @on-blur="lngChange"
            placeholder="请输入"
            :disabled="!item.new"
					></Input>
				</FormItem>
				<FormItem label="纬度：" prop="lat" >
					<Input
						v-model="formItem.lat"
            @on-blur="latChange"
            placeholder="请输入"
            :disabled="!item.new"
					></Input>
				</FormItem>
				<FormItem label="更新状态：" prop="isUpdate" >
					<RadioGroup v-model="formItem.isUpdate" type="button">
						<Radio :label="1">允许更新</Radio>
						<Radio :label="0">禁止更新</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="推荐点是否限停：" prop="noParking" >
					<RadioGroup v-model="formItem.noParking" type="button">
						<Radio :label="1">是</Radio>
						<Radio :label="0">否</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem v-if="formItem.noParking - 1 === 0" label="限停时长：" prop="parkingTime" >
					<Input
						v-model="formItem.parkingTime"
					></Input>
				</FormItem>
				<FormItem label="推荐点类型：" prop="sourceType" >
					<Select
            filterable
            v-model="formItem.sourceType"
            placeholder="请选择"
          >
            <Option
							:key="index"
							:value="item.value"
							v-for="(item, index) in sourceTypeList">{{item.label}}</Option>
          </Select>
				</FormItem>
				<FormItem label="状态：" prop="disable" >
					<RadioGroup v-model="formItem.disable" type="button">
						<Radio
						:key="index"
						:label="item.value"
						v-for="(item, index) in statusList">{{item.label}}</Radio>
					</RadioGroup>
				</FormItem>
			</Form>
			<div class="ivu-modal-footer">
				<Button
					type="default"
					size="large"
					style="margin-right: 8px"
					@click="closeChange()"
					>取消</Button
				>
				<Button
					type="primary"
					@click="handleSubmit()"
					size="large"
					>确定</Button
				>
			</div>
		</div>
		<div class="fr">
			<el-amap
				ref="map"
				vid="amapDemo"
				:plugin="plugin"
				class="amap-demo"
				:center="mapData.center"
				:zoom="mapData.zoom"
			>
				<el-amap-marker vid="component-marker" :position="mapData.center"></el-amap-marker>
			</el-amap>
		</div>
	</div>
</template>
<script>
import { recomPointUpdate, recomPointAdd } from "_o/api/recom-point.js";
import { sourceTypeList, statusList } from "./index"
import { freeze, pick } from "@/mixins/base";
import countyCity from "_g/mixins/countyCity";
import {
  getAreaInfoByCode
} from "_g/api/openCity"
const defaultLng = 116.405285
const defaultLat = 39.904989
let submitParams = {
	address: '', // 地址    required
	cityCode: "", // 城市编码 required
	adcode: "", // 区域编码 required
	lng: null, // 经度 required
	lat: null, // 纬度 required
	isUpdate: 0, // 更新状态 bool
	noParking: 0, // 是否限停 是:限停时间必填 否:限停时间为空 required bool
	parkingTime: "", // 限停时间
	sourceType: 4, // 来源  默认运营
	disable: 0, // 状态  默认生效 bool
}
export default {
	props: {
		item: {
			type: Object,
			default: () => {
				return {}
			}
		},
		modal: {
			type: Boolean,
			default: false
		}
	},
	mixins: [countyCity],
	data() {
		return {
			sourceTypeList: freeze(sourceTypeList),
			statusList: freeze(statusList),
			areaInfoByCodeList: [], // 区县列表
			formItem: {...submitParams},
			ruleValidate: {
				address: [
					{ required: true, message: "推荐点名称不能为空", trigger: "blur" },
				],
				cityCode: [
					{ required: true, message: "请选择城市" },
				],
				adcode: [
					{ required: true, message: "请选择区县" },
				],
				lng: [
					{ required: true, message: "请输入经度" },
				],
				lat: [
					{ required: true, message: "请输入纬度" },
				],
				parkingTime: [
					{ required: true, message: "请输入限停时长" },
				],
			},
			mapData: {
				center: [0, 0],
				zoom: 12
			},
			plugin: [{
				pName: 'ToolBar'
			}]
		}
	},
	watch: {
		modal(){
    	this.getAllCityList();
			if (!this.modal) {
				this.$refs.formValidate.resetFields();
				return
			}
			let maps = this.$refs.map.$$getInstance()
			maps.setZoom(12)
			let edit = !this.item.new
      window._aa = this.mapData
			if(!edit) {
				this.mapData.center = [defaultLng, defaultLat]
			} else {
				this.mapData.center = [Number(this.item.lng), Number(this.item.lat)]
				let {lng, lat,isUpdate, address, adcode,noParking, parkingTime,cityCode, sourceType, disable} = this.item
				let p = {
					address,
					lng: lng ? Number(lng).toFixed(6) : defaultLng,
					lat: lat ? Number(lat).toFixed(6) : defaultLat,
					isUpdate: isUpdate || 0,
					adcode,
					cityCode,
					sourceType: sourceType || 4,
					disable: typeof disable === 'boolean' ? +disable : 0,
					noParking: noParking || 0,
					parkingTime
				}
				Object.keys(p).forEach(key => {
					this.formItem[key] = p[key]
				})
				this.getAreaInfoByCode()
			}
		}
	},
	computed: {
		isEdit({ item }) {
			return !item.new
		},
		cityList({cascaderCityList}) {
			let arr = []
			cascaderCityList.forEach(d => {
				arr = [...arr, ...d.citys]
			})
			return arr
		}
	},
	methods: {
		cityChange(value, selectedData) {
			this.getAreaInfoByCode()
		},
		cityClear() {
			this.areaInfoByCodeList = []
		},
		closeChange() {
			this.$Modal.confirm({
				title: "确认取消？",
				onOk: () => {
					this.$emit("closeChange");
				}
			});
		},
		async getAreaInfoByCode() {
			if(!this.formItem.cityCode) return
      try {
        const res = await getAreaInfoByCode({ cityCode: this.formItem.cityCode });
        if (res.data.success) {
          this.areaInfoByCodeList = res.data.data.map((m) => {
            return {
              label: m.orgName,
              value: m.orgCode,
            };
          });
        }
      } catch (e) {}
    },
		handleSubmit(){
			this.$refs.formValidate.validate((valid) => {
				if (!valid) {
					// this.$Message.error('表单验证失败!');
					return
				}
				let { address, lng, lat,cityCode, adcode,
					sourceType, isUpdate, disable, noParking,
					parkingTime } = this.formItem
				let obj = {
					address,
					isUpdate: !!isUpdate,
					disable: !!disable,
					noParking: !!noParking,
					lng, lat,cityCode, adcode, sourceType,
          pointType: 1,
        }

        if(obj.noParking) {
					obj.parkingTime = parkingTime
				}
				let func = recomPointAdd
				if(this.isEdit ) {
					func = recomPointUpdate
					obj.poiId = this.item.poiId
				}
				func(obj).then(res => {
					this.$Message.success(res.data.msg)
					setTimeout(() => {
						this.$emit('submitChange')
					}, 1000)
				})
			})
		},
    lngChange() {
		  let { lng, lat} = this.formItem;
		  if(lng && lat) {
		    this.mapData.center = [lng, lat]
      }
    },
    latChange() {
      let { lng, lat} = this.formItem;
      if(lng && lat) {
        this.mapData.center = [lng, lat]
      }
    }
	},
}
</script>
<style lang="less" scoped>
.main{
	overflow: hidden;
	.fl{
		width: 40%;
		float: left;
	}
	.fr{
		width: 60%;
		float: right;
		padding-left: 30px;
		.amap-demo{
			width: 100%;
			height: 500px;
		}
	}
}
/deep/ .ivu-modal-footer{
	// margin-top: 230px;
}
/deep/ .amap-toolbar{
	left: inherit !important;
	top: inherit !important;
	right: 10px;
	bottom: 10px;
	.amap-pancontrol, .amap-locate, .amap-zoom-ruler{
		display: none !important;
	}
	.amap-zoom-plus, .amap-zoom-minus{
		margin: 10px;
	}
}
</style>
