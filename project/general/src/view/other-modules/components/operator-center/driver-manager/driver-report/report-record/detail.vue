<template>
    <div>
        <Card class="pd-lf-10" :style="{marginTop:'10px'}">
            <Row>
                <Col>
                    <span class="title">基本信息</span>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="6">
                    <LabelItem label=" 城市：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.driverReportDetailVo.agentCityName}}</span>
                    </LabelItem>
                </Col>
                <Col span="6">
                    <LabelItem label=" 运营商：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.driverReportDetailVo.agentName}}</span>
                    </LabelItem>
                </Col>
                <Col span="6">
                    <LabelItem label=" 司机姓名：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.driverReportDetailVo.driverName}}</span>
                    </LabelItem>
                </Col>
                <Col span="6">
                    <LabelItem label=" 司机手机号：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.driverReportDetailVo.driverPhone}}</span>
                    </LabelItem>
                </Col>
            </Row>
        </Card>
        <Card class="pd-lf-10" :style="{marginTop:'10px'}">
            <Row>
                <Col>
                    <span class="title">报备详情</span>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="6">
                    <LabelItem label=" 订单号：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.driverReportDetailVo.orderNo}}</span>
                    </LabelItem>
                </Col>
                <Col span="6">
                    <LabelItem label=" 报备类型：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.driverReportDetailVo.specificTypeDesc}}</span>
                    </LabelItem>
                </Col>
                <Col span="6">
                    <LabelItem label=" 报备时间：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.driverReportDetailVo.reportTime}}</span>
                    </LabelItem>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="24">
                    <LabelItem label=" 报备详情：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.driverReportDetailVo.reportDesc}}</span>
                    </LabelItem>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="24">
                    <LabelItem label=" 司管批注：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.driverReportDetailVo.annotationDesc}}</span>
                    </LabelItem>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="24">
                    <LabelItem label=" 报备照片：">
                        <div class="demo-upload-list" v-for="item in reportDetailInfo.driverReportDetailVo.reportEnclosureVoList">
                            <img :src="item.fileUrl">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.fileUrl)"></Icon>
                            </div>
                        </div>
                    </LabelItem>
                </Col>
            </Row>
        </Card>
         <Card class="pd-lf-10" :style="{marginTop:'10px'}">
            <Row>
                <Col>
                    <span class="title">关联订单基本信息</span>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="8">
                    <LabelItem label=" 订单业务线："> 
                        <span class="fc-000 ft-sz-16">{{businessTypeList[reportDetailInfo.orderDetail.businessType]}}</span>
                    </LabelItem>
                </Col>
                <Col span="8">
                    <LabelItem label=" 订单类型：">
                        <span class="fc-000 ft-sz-16">{{typeTimeList[reportDetailInfo.orderDetail.typeTime]}}</span>
                    </LabelItem>
                </Col>
                <Col span="8">
                    <LabelItem label=" 车牌号：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.orderDetail.plateNum}}</span>
                    </LabelItem>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="8">
                    <LabelItem label=" 车型：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.orderDetail.carModel}}</span>
                    </LabelItem>
                </Col>
                <Col span="8">
                    <LabelItem label=" 司机姓名：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.orderDetail.driverName}}</span>
                    </LabelItem>
                </Col>
                <Col span="8">
                    <LabelItem label=" 司机手机号：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.orderDetail.driverPhone}}</span>
                    </LabelItem>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="8">
                    <LabelItem label=" 出发地：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.orderDetail.originAddress}}</span>
                    </LabelItem>
                </Col>
                <Col span="8">
                    <LabelItem label=" 目的地：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.orderDetail.destAddress}}</span>
                    </LabelItem>
                </Col>
                <Col span="8">
                    <LabelItem label=" 下单时间：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.orderDetail.createTime}}</span>
                    </LabelItem>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="8">
                    <LabelItem label=" 到达上车地点时间：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.orderDetail.driverArriveTime}}</span>
                    </LabelItem>
                </Col>
                <Col span="8">
                    <LabelItem label=" 乘客上车时间：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.orderDetail.passengerArriveTime}}</span>
                    </LabelItem>
                </Col>
                <Col span="8">
                    <LabelItem label=" 达到目的地时间：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.orderDetail.arriveDestTime}}</span>
                    </LabelItem>
                </Col>
            </Row>
        </Card>
        <Card class="pd-lf-10" :style="{marginTop:'10px'}" v-if="reportDetailInfo.complaintDetailVoList && reportDetailInfo.complaintDetailVoList.length>0">
            <Row>
                <Col>
                    <span class="title">关联工单信息</span>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="8">
                    <LabelItem label=" 一级工单类型：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.complaintDetailVoList[0].firstOrderName}}</span>
                    </LabelItem>
                </Col>
                <Col span="8">
                    <LabelItem label=" 二级工单类型：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.complaintDetailVoList[0].secondOrderName}}</span>
                    </LabelItem>
                </Col>
                <Col span="8">
                    <LabelItem label=" 三级工单类型：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.complaintDetailVoList[0].thirdOrderName}}</span>
                    </LabelItem>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="24">
                    <LabelItem label=" 投诉时间：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.complaintDetailVoList[0].complaintTime}}</span>
                    </LabelItem>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="24">
                    <LabelItem label=" 投诉内容：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.complaintDetailVoList[0].complaintContent}}</span>
                    </LabelItem>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="24">
                    <LabelItem label=" 客服处理状态：">
                        <span class="fc-000 ft-sz-16">{{responsibilityStatusList[reportDetailInfo.complaintDetailVoList[0].responsibilityStatus]}}</span>
                    </LabelItem>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span="24">
                    <LabelItem label=" 处理结果：">
                        <span class="fc-000 ft-sz-16">{{reportDetailInfo.complaintDetailVoList[0].violationContent}}</span>
                    </LabelItem>
                </Col>
            </Row>
        </Card>
        <div style="text-align:center;margin:30px 0">
            <Button type="primary" @click="closeDetail">关闭</Button>
        </div>
        <Modal title="预览" v-model="visible">
            <img :src="previewImg" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
import LabelItem from '_a/search-item/labelItem'
export default {
	data() {
		return {
            visible:false,
            previewImg:'',
            businessTypeList:{
                2:"专享",
                4:"快享"
            },
            typeTimeList:{
                1:"实时",
                2:"预约"
            },
            responsibilityStatusList:{
                0:"未处理",
                0:"已判责",
            }
    	};
    },
    props:{
        reportDetailInfo:{
            type:Object,
            default:{}
        }
    },
    components: {
      LabelItem
    },
    mounted() {
    
    },
    methods: {
        closeDetail(){
            this.$emit("on-close")
        },
        handleView (name) {
            this.previewImg = name;
            this.visible = true;
        },
    }
};
</script>
<style lang="less" scoped>
.title {
    font-weight: 700;
    font-size: 16px;
    color: #000000;
}
.fc-000 {
    color: #000;
}
.pd-lf-10 {
    padding-left: 10px;
}
.ft-sz-16 {
    font-size: 16px;
}
.pd-top-20 {
    padding-top: 20px;
}
.demo-upload-list {
  text-align: center;
  line-height: 72px;
  overflow: hidden;
  position: relative;
  height: 72px;
  width: 72px;
  display: flex;
  float: left;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
}
.demo-upload-list img {
  width: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  // margin: 0 2px;
}
</style>
