<template>
  <div class="change-car-base">
    <Row>
      <Col>
      <span class="title">基本信息</span>
      </Col>
    </Row>
    <Row>
      <Col span="4">
      <span>姓名: {{info.driverName}}</span>
      </Col>
      <Col span="4">
      <span>手机号: {{info.driverPhone}}</span>
      </Col>
      <Col span="4">
      <span>城市: {{info.cityName}}</span>
      </Col>
      <Col span="6">
      <span>运营商名称: {{info.agentName}}</span>
      </Col>
      <Col span="6">
      <span>换车申请时间: {{info.applyTime}}</span>
      </Col>
    </Row>
    <Row>
      <Col span="4">
      <span>换车原因: {{info.changeCarReason}}</span>
      </Col>
      <Col span="4">
        <span>车辆所有人: {{info.newVehicleOwner}}</span>
      </Col>
      <Col span="4">
        <span>使用性质: {{info.newVehicleUseCharacter | getUseType}}</span>
      </Col>
      <Col span="6">
        <span>注册日期: {{info.newVehicleRegistrationDate | filterValidity}}</span>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col>
      <span class="title">原车辆信息</span>
      </Col>
    </Row>
    <Row>
      <Col span="5">
      <span>车辆VIN: {{info.originalVehicleVin}}</span>
      </Col>
      <Col span="5">
      <span>车牌号: {{info.originalVehiclePlateNum}}</span>
      </Col>
      <Col span="5">
      <span>发动机号: {{info.originalVehicleEngine}}</span>
      </Col>
      <Col span="5">
      <span>检验有效期: {{info.originalVehicleTermOfValidity | filterValidity}}</span>
      </Col>
      <Col span="5">
      <span>品牌车系车型: {{`${info.originalVehicleBrand}${info.originalCarLevelName}${info.originalCarLevelType}`}}</span>
      </Col>
      <Col span="5">
      <span>车身颜色: {{info.originalVehicleColor}}</span>
      </Col>
    </Row>
    <Divider />

    <Row>
      <Col>
      <span class="title">新车辆信息</span>
      </Col>
    </Row>
    <Row>
      <Col span="5">
      <span>车辆VIN: {{info.newVehicleVin}}</span>
      </Col>
      <Col span="5">
      <span>车牌号: {{info.newVehiclePlateNum}}</span>
      </Col>
      <Col span="5">
      <span>发动机号: {{info.newVehicleEngine}}</span>
      </Col>
      <Col span="5">
      <span>检验有效期: {{info.newVehicleTermOfValidity | filterValidity}}</span>
      </Col>
      <Col span="5">
      <span>品牌车系车型: {{`${info.newVehicleBrand}${info.newCarLevelName}${info.newCarLevelType}`}}</span>
      </Col>
      <Col span="5">
      <span>车身颜色: {{info.newVehicleColor}}</span>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col span="8">
      <p>行驶证（首页）：</p>
      <div class="img-container">
        <img :src="driverIdFrontImg">
      </div>
      </Col>
      <Col span="8">
      <p>行驶证（副页）：</p>
      <div class="img-container">
        <img :src="driverIdEndImg">
      </div>
      </Col>
      <Col span="8">
      <p>行驶证（副页）背面：</p>
      <div class="img-container">
        <img :src="driverIdEndBackImg">
      </div>
      </Col>
    </Row>
    <Row>
      <Col span="8">
      <p>车辆照片：</p>
      <div class="img-container">
        <img :src="carImg">
      </div>
      </Col>
      <Col span="8">
      <p>车辆识别码照片：</p>
      <div class="img-container">
        <img :src="carIdImg">
      </div>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col>
      <span class="title">网约车车证</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
      <span>网约车车证资格证号: {{info.newVehicleCertificateCarNo}}</span>
      </Col>
      <Col span="8">
      <p>网约车车证照片：</p>
      <div class="img-container">
        <img :src="webCarIdImg">
      </div>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <span>网约车车证发证机构: {{info.newVehicleCertificateOrgan}}</span>
      </Col>
      <Col span="8">
        <span>网约车车证有效期始: {{info.newVehicleCertificateValidityStartTime | filterValidity}}</span>
      </Col>
      <Col span="8">
        <span>网约车车证有效期止: {{info.newVehicleCertificateValidityEndTime | filterValidity}}</span>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col>
      <span class="title">车辆商业险保单</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
      <p>车辆商业险保单照片</p>
      <div class="img-container">
        <img :src="carSecreImg">
      </div>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col>
      <span class="title">操作记录</span>
      </Col>
    </Row>
    <Table
      :columns="tableColumns"
      :data="tableList"
    >
    </Table>
  </div>
</template>

<script>
import { tableTitle } from "./fields.js";
import { queryChangeCarOrderDetail } from "_o/api/joinwithcar-exchange.js";
import { getImgUrlByUuid } from "_o/api/work-order/common.js";
// import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  filters: {
    filterValidity(value) {
      let tmp = ""
      if (value) {
        tmp = value.split(" ")[0]
      }
      return tmp
    },
    getUseType(v) {
      let t = ["", "营运", "非营运"];
      return t[+v]
    }
  },
  data() {
    return {
      tableColumns: tableTitle(this),
      tableList: [],
      info: {},
      imgVisible: false,
      driverIdEndImg: "", // 行驶证副本照片
      driverIdFrontImg: "", // 行驶证正本照片
      driverIdEndBackImg:"",
      carIdImg: "", // 车辆识别码照片
      carImg: "", // 车辆照片
      webCarIdImg: "", // 运输证
      carSecreImg: ""// 车辆商业保单
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // ...mapActions(["handleAddUuid", "handleDelUuid"]),
    getData() {
      let data = { changeCarOrderUuid: this.$route.query.changeCarOrderUuid };
      //
      queryChangeCarOrderDetail(data).then(res => {
        // console.log(res)
        if (res.data.success) {
          // this.handleDelUuid();
          this.info = res.data.data;
          this.tableList = this.info.recordList
          this.handleAllImg(this.info.relationImgList)
          this.$emit("getInfo", this.info)
          // let uuid = this.info.uuid;
          // console.log(uuid)
          // this.handleAddUuid(uuid);
        } else {
          this.$Message.error("读取数据出错");
        }
      });
    },
    handleAllImg(imgList) {
      // "图片类型 1-车辆照片; 2-车辆识别码照片; 3-行驶证正本照片; 4-行驶证副本照片; 5-运输证; 6-车辆商业保单;",
      let imgNamelist = {
        1: "carImg",
        2: "carIdImg",
        3: "driverIdFrontImg",
        4: "driverIdEndImg",
        5: "webCarIdImg",
        6: "carSecreImg",
        7: "driverIdEndBackImg"
      }
      imgList.forEach(item => {
        let key_ = imgNamelist[item.imgType]
        if (key_) {
          getImgUrlByUuid({ "uuid": item.imgUuid }).then(res => {
            console.log("this[key_] ", this[key_])
            this[key_] = res.data.data
          })
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.change-car-base{
  padding:16px ;
  .img-container{
    padding: 10px;
    img{
      width: 100%;
    }
  }
}
.title {
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 16px;
  display: block;
  &::before{
    content: ' ';
    width: 3px!important;
    height: 16px;
    background: #515a6e;
    display: block;
    float: left;
    margin-right: 10px;
  }
}
.ivu-col {
  padding: 3px;
}

</style>
