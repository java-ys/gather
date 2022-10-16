<template>
  <div class="change-car-base">
    <Row>
      <Col>
        <span class="title">车辆基本信息</span>
      </Col>
    </Row>
    <Row>
      <Col span="6">
        <span>车架号: {{ info.vin }}</span>
      </Col>
      <Col span="6">
        <span
          :class="{
            hightip: originData.plateNum && originData.plateNum.isUpdated
          }"
        >车牌号: {{ info.plateNum }}</span
        >
      </Col>
      <Col span="6">
        <span
          :class="{
            hightip:
              originData.carLevelText && originData.carLevelText.isUpdated
          }"
        >品牌车系车型: {{ info.carLevelText }}</span
        >
      </Col>
      <Col span="6">
        <span
          :class="{
            hightip: originData.engineNo && originData.engineNo.isUpdated
          }"
        >发动机号: {{ info.engineNo }}</span
        >
      </Col>
    </Row>
    <Row>
      <Col span="6">
        <span
          :class="{
            hightip: originData.carColor && originData.carColor.isUpdated
          }"
        >车身颜色: {{ info.carColor }}</span
        >
      </Col>
      <Col span="6">
        <span
          :class="{
            hightip:
              originData.termOfValidity && originData.termOfValidity.isUpdated
          }"
        >检验有效期: {{ info.termOfValidity | filterValidity }}</span
        >
      </Col>
    </Row>
    <Row>
      <Col span="6">
        <span>车辆所有人: {{ info.vehicleOwner }}</span>
      </Col>
      <Col span="6">
        <span>使用性质: {{ info.vehicleUseCharacter | getUseType }}</span>
      </Col>
      <Col span="6">
        <span>注册日期: {{ info.vehicleRegistrationDate | timeStampToYMD }}</span>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col>
        <span class="title">车辆照片</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <p
          :class="{
            hightip:
              originData.vehicleImgUrl && originData.vehicleImgUrl.isUpdated
          }"
        >
          车辆照片：
        </p>
        <div class="img-container">
          <img :src="vehicleImgUrl" />
        </div>
      </Col>
      <Col span="8">
        <p
          :class="{
            hightip:
              originData.vehicleCodeImgUrl &&
              originData.vehicleCodeImgUrl.isUpdated
          }"
        >
          车辆识别码照片：
        </p>
        <div class="img-container">
          <img :src="vehicleCodeImgUrl" />
        </div>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col>
        <span class="title">证件照片</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <p
          :class="{
            hightip:
              originData.vehicleDrivingFrontUrl &&
              originData.vehicleDrivingFrontUrl.isUpdated
          }"
        >
          行驶证（首页）：
        </p>
        <div class="img-container">
          <img :src="vehicleDrivingFrontUrl" />
        </div>
      </Col>
      <Col span="8">
        <p
          :class="{
            hightip:
              originData.vehicleDrivingReverseUrl &&
              originData.vehicleDrivingReverseUrl.isUpdated
          }"
        >
          行驶证（副页）：
        </p>
        <div class="img-container">
          <img :src="vehicleDrivingReverseUrl" />
        </div>
      </Col>
      <Col span="8">
        <p
          :class="{
            hightip:
              originData.vehicleDrivingBackUrl &&
              originData.vehicleDrivingBackUrl.isUpdated
          }"
        >
          行驶证（副页）背面：
        </p>
        <div class="img-container">
          <img :src="vehicleDrivingBackUrl" />
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <span>网约车车证资格证号: {{ info.vehicleTransportTaxCode }}</span>
      </Col>
      <Col span="8">
        <p
          :class="{
            hightip:
              originData.vehicleTransportUrl &&
              originData.vehicleTransportUrl.isUpdated
          }"
        >
          网约车车证照片：
        </p>
        <div class="img-container">
          <img :src="vehicleTransportUrl" />
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <span>网约车车证发证机构: {{ info.vehicleLicenseOrgan }}</span>
      </Col>
      <Col span="8">
        <span>网约车车证有效期始: {{ info.vehicleLicenseValidityStartTime | timeStampToYMD }}</span>
      </Col>
      <Col span="8">
        <span>网约车车证有效期止: {{ info.vehicleLicenseValidityEndTime | timeStampToYMD }}</span>
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
        <p
          :class="{
            hightip:
              originData.vehicleInsureImgUrl &&
              originData.vehicleInsureImgUrl.isUpdated
          }"
        >
          车辆商业险保单照片
        </p>
        <div class="img-container">
          <img :src="vehicleInsureImgUrl" />
        </div>
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col>
        <span class="title">操作记录</span>
      </Col>
    </Row>
    <VTable
      style="margin-top: 20px"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableList"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </VTable>
  </div>
</template>

<script>
import { tableTitle } from "./fields.js";
import { queryDetailById, pageOfAuditQuery } from "_o/api/vehicle-edit.js";
import { getImgUrlByUuid } from "_o/api/work-order/common.js";
import {timeFormat} from "@/libs/util"
// import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  filters: {
    filterValidity(value) {
      let tmp = "";
      if (value) {
        tmp = value?.split(" ")[0];
      }
      return tmp;
    },
    timeStampToYMD(v) {
      if(!v) return ""
      return timeFormat(v, "yyyy-MM-dd")
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
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [20, 30, 50, 100],
      info: {},
      originData: {},
      imgVisible: false,
      vehicleDrivingReverseUrl: "", // 行驶证副本照片
      vehicleDrivingFrontUrl: "", // 行驶证正本照片
      vehicleCodeImgUrl: "", // 车辆识别码照片
      vehicleImgUrl: "", // 车辆照片
      vehicleTransportUrl: "", // 运输证
      vehicleInsureImgUrl: "", // 车辆商业保单
      vehicleDrivingBackUrl: "" // 行驶证副本背面
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // ...mapActions(["handleAddUuid", "handleDelUuid"]),
    getData() {
      let data = { id: this.$route.query.changeCarOrderUuid };
      //
      queryDetailById(data).then(res => {
        if (res.data.success) {
          const resData = this.handleDetailData(res.data.data);
          console.log(resData)
          console.log(res.data.data)
          this.info = resData;
          this.originData = res.data.data;
          this.originData.carLevelText = {
            isUpdated:
              res.data.data.carBrandId.isUpdated ||
              res.data.data.carLevelId.isUpdated ||
              res.data.data.carSeriesId.isUpdated
          };
          this.handleAllImg(this.info);
          this.$emit("getInfo", this.info);
          this.getRecord(this.info.id);
        } else {
          this.$Message.error("读取数据出错");
        }
      });
    },
    handleDetailData(data) {
      let resData = {};
      Object.keys(data).forEach(it => {
        if (typeof data[it] === "object") {
          resData[it] = data[it].value;
        } else {
          resData[it] = data[it];
        }
      });
      resData.carLevelText =
        resData.carBrand + "-" + resData.carSeries + "-" + resData.carLevel;
      return resData;
    },
    getRecord() {
      // 等借口
      pageOfAuditQuery({
        id: Number(this.$route.query.changeCarOrderUuid),
        currentPage: this.current,
        pageSize: this.pageSize
      }).then(res => {
        if (res.data.success) {
          this.tableList = res.data.data.list;
          this.total = res.data.data.totalCount;
        }
      });
    },
    handleAllImg(data) {
      // "图片类型 1-车辆照片; 2-车辆识别码照片; 3-行驶证正本照片; 4-行驶证副本照片; 5-运输证; 6-车辆商业保单;7-行驶证副页背面",
      const relationImgList = [
        "vehicleImgUrl",
        "vehicleCodeImgUrl",
        "vehicleDrivingFrontUrl",
        "vehicleDrivingReverseUrl",
        "vehicleDrivingBackUrl",
        "vehicleTransportUrl",
        "vehicleInsureImgUrl"
      ];
      for (let item of relationImgList) {
        if (data[item]) {
          getImgUrlByUuid({ uuid: data[item] }).then(res => {
            this[item] = res.data.data;
          });
        }
      }
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getRecord();
    },
    changePage(val) {
      this.current = val;
      this.getRecord();
    }
  }
};
</script>
<style lang="less" scoped>
.change-car-base {
  padding: 16px;
  .img-container {
    padding: 10px;
    img {
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
  &::before {
    content: " ";
    width: 3px !important;
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
.hightip {
  color: red;
}
</style>
