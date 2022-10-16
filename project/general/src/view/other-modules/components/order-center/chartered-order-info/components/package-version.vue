<!-- * @Descritption:
 * @Author: lvzhiyang
 * @Date: 2019-11-01 12:00:10
 * @LastEditors: lvzhiyang
 * @LastEditTime: 2019-11-01 19:25:48
 -->
<template>
  <div class="update-package-price" v-if="isShowPackage">
    <Form ref="formValidate" :model="formData" :label-width="140">
      <div class="flex-box">
        <FormItem label="所选城市 :">{{
          $store.state.record.wrapData.cityName
        }}</FormItem>
        <FormItem label="产品线 :">包车</FormItem>
        <FormItem label="套餐:">
          <span>{{ formData.wrap }}</span>
        </FormItem>
      </div>
      <div class="flex-box">
        <FormItem label="套餐名称 :">
          <span>{{ formData.wrapName }}</span>
        </FormItem>
        <FormItem label="套餐类型 :">
          <span>{{ packageTypeMap[formData.wrapType] }}</span>
        </FormItem>
        <FormItem label="生效时间 :" prop="effectiveTime">
          <span>{{ formData.time }}</span>
        </FormItem>
      </div>
      <div class="flex-box dash-bottom">
        <FormItem label="套餐里程（公里）:" v-if="formData.wrapType === 0">
          <span>{{ formData.wrapDistance }}</span>
        </FormItem>
        <FormItem label="套餐时长（分钟）:">
          <span>{{ formData.wrapTime }}</span>
        </FormItem>
        <FormItem
          label="套餐信用金比例（%）:"
          v-if="formData.wrapType === 0 && formData.wrapMarginRatio"
        >
          <span>{{ formData.wrapMarginRatio }}</span>
        </FormItem>
      </div>
    </Form>
    <div class="price-list">
      <h2 style="margin: 20px">车型等级:</h2>
      <Collapse accordion>
        <Panel
          v-for="(value, key) in formData.rentFareModelPriceDatas"
          :key="key"
        >
          <span>{{ carTypeMap[key] }}</span>
          <Button
            type="primary"
            size="small"
            @click="checkPrice(key)"
            style="margin-left:80px"
            >查看定价
          </Button>
          <div slot="content">
            <Card style="margin: 10px 0">
              <h3>
                {{ $store.state.record.wrapData.deparTime.substring(0, 10) }}
              </h3>
              <Form class="price-detail-box" :label-width="140">
                <FormItem label="套餐定价（元）：" class="list-label">
                  <span>{{ detailData1.packagePrice }}</span>
                </FormItem>
                <FormItem
                  label="里程费（元/公里）："
                  class="list-label"
                  v-if="formData.wrapType === 0 && detailData1.mileageCost"
                >
                  <span>{{ detailData1.mileageCost }}</span>
                </FormItem>
                <FormItem
                  label="时长费（元/分钟）："
                  class="list-label"
                  v-if="formData.wrapType === 0 && detailData1.timeCost"
                >
                  <span>{{ detailData1.timeCost }}</span>
                </FormItem>
                <FormItem
                  label="远途里程费（元/公里）："
                  class="list-label"
                  v-if="formData.wrapType === 0"
                >
                  <span>{{ detailData1.haulBackTripFare }}</span>
                </FormItem>
                <FormItem
                  label="远途里程（公里）："
                  class="list-label"
                  v-if="formData.wrapType === 0"
                >
                  <span>{{ detailData1.haulBackTrip }}</span>
                </FormItem>
                <FormItem label="回程费（元/公里）：" class="list-label">
                  <span>{{ detailData1.returnFee || "-" }}</span>
                </FormItem>
                <FormItem
                  label="免费等待时长（分钟）："
                  class="list-label"
                  v-if="formData.wrapType === 0"
                >
                  <span>{{ detailData1.freeWaitTime }}</span>
                </FormItem>
                <FormItem
                  label="超时等待费（元/分钟）："
                  class="list-label"
                  v-if="formData.wrapType === 0"
                >
                  <span>{{ detailData1.beyondWaitFare }}</span>
                </FormItem>
              </Form>
            </Card>
            <Card style="margin: 10px 0">
              <h3>
                {{
                  dateAdd($store.state.record.wrapData.deparTime).substring(
                    0,
                    10
                  )
                }}
              </h3>
              <Form class="price-detail-box" :label-width="140">
                <FormItem label="套餐定价（元）：" class="list-label">
                  <span>{{ detailData2.packagePrice }}</span>
                </FormItem>
                <FormItem
                  label="里程费（元/公里）："
                  class="list-label"
                  v-if="formData.wrapType === 0 && detailData2.mileageCost"
                >
                  <span>{{ detailData2.mileageCost }}</span>
                </FormItem>
                <FormItem
                  label="时长费（元/分钟）："
                  class="list-label"
                  v-if="formData.wrapType === 0 && detailData2.timeCost"
                >
                  <span>{{ detailData2.timeCost }}</span>
                </FormItem>
                <FormItem
                  label="远途里程费（元/公里）："
                  class="list-label"
                  v-if="formData.wrapType === 0"
                >
                  <span>{{ detailData2.haulBackTripFare }}</span>
                </FormItem>
                <FormItem
                  label="远途里程（公里）："
                  class="list-label"
                  v-if="formData.wrapType === 0"
                >
                  <span>{{ detailData2.haulBackTrip }}</span>
                </FormItem>
                <FormItem label="回程费（元/公里）：" class="list-label">
                  <span>{{ detailData2.returnFee || "-" }}</span>
                </FormItem>
                <FormItem
                  label="免费等待时长（分钟）："
                  class="list-label"
                  v-if="formData.wrapType === 0"
                >
                  <span>{{ detailData2.freeWaitTime }}</span>
                </FormItem>
                <FormItem
                  label="超时等待费（元/分钟）："
                  class="list-label"
                  v-if="formData.wrapType === 0"
                >
                  <span>{{ detailData2.beyondWaitFare }}</span>
                </FormItem>
              </Form>
            </Card>
          </div>
        </Panel>
      </Collapse>
    </div>
    <!--<div class="popView-footer-wrap">-->
    <!--  <Button size="large" type="text" style="margin-right: 8px;" @click="">取消</Button>-->
    <!--  <Button size="large" type="primary">确定</Button>-->
    <!--</div>-->
  </div>
</template>

<script>
import { axiosPackageDetail, packageRuleDetailQuery } from "_g/api/openCity";
import { packageTypeMap, carTypeMap } from "_g/config/status-map";
import "@/styles/cyk-style.css";

export default {
  props: ["value", "parentParams"],
  computed: {
    isShowPackage() {
      return !!this.$store.state.record.wrapData.wrapUuid;
    }
  },
  data() {
    return {
      //packageMap,
      packageTypeMap,
      carTypeMap, // 车型等级
      formData: {
        packagePriceList: [
          {
            carLevel: ""
          }
        ]
      }, // 包车套餐参数
      detailData1: {},
      detailData2: {}
    };
  },
  watch: {},
  mounted() {
    if (this.isShowPackage) {
      this.getDetail();
    }
  },
  methods: {
    // 查询套餐规则详情
    getDetail() {
      axiosPackageDetail({
        wrapUuid: this.$store.state.record.wrapData.wrapUuid || ""
      }).then(res => {
        this.formData = res.data.data;
      });
    },
    // 各个车型的定价信息
    checkPrice(key) {
      let data = {
        wrapUuid: this.$store.state.record.wrapData.wrapUuid || "",
        departTime: this.$store.state.record.wrapData.deparTime
          ? this.$store.state.record.wrapData.deparTime.substring(0, 10)
          : "",
        carLevel: key
      };
      let data2 = {
        wrapUuid: this.$store.state.record.wrapData.wrapUuid || "",
        departTime: this.dateAdd(
          this.$store.state.record.wrapData.deparTime
        ).substring(0, 10),
        carLevel: key
      };
      // 获取某一日期详情套餐价格
      packageRuleDetailQuery(data)
        .then(res => {
          this.detailData1 = res.data.data;
        })
        .catch();
      packageRuleDetailQuery(data2)
        .then(res => {
          this.detailData2 = res.data.data;
        })
        .catch();
    },
    // 日期加1
    dateAdd(startDate) {
      startDate = new Date(startDate);
      startDate = +startDate + 1000 * 60 * 60 * 24;
      startDate = new Date(startDate);
      let nextStartDate =
        startDate.getFullYear() +
        "-" +
        (startDate.getMonth() + 1) +
        "-" +
        startDate.getDate();
      return nextStartDate;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.update-package-price {
  max-height: 650px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0 20px;
}
.search-input {
  width: 200px;
  margin: 0 0 20px 20px;
}

.flex-box {
  display: flex;

  .ivu-form-item {
    width: 33%;
  }
}

.dash-bottom {
  border-bottom: 1px dashed #999;
  padding: 15px 0;
}

.price-list {
}

.priceItem {
  margin: 15px 0;
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

.price-detail-box {
  padding: 0 30px;
  display: flex;
  flex-wrap: wrap;
  .ivu-form-item {
    width: 33%;
  }
}
</style>
