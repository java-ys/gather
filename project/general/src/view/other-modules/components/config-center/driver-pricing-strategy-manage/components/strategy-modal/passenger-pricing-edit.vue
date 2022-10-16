<template>
  <div>
    <Row>
      <Col span="11">
        <Card>
          <p slot="title">乘客定价策略</p>
          <div>
            <UpdatePrice
              ref="updateprice"
              v-model="value"
              :type="type"
              :parentParams="parentParams"
              :area-info-by-code-list="areaInfoByCodeList"
              :hidden-confirm="true"
              :hidden-validate="true"
            >
            </UpdatePrice>
          </div>
        </Card>
      </Col>
      <Col span="11" offset="2">
        <Card>
          <p slot="title">司机定价策略</p>
          <div v-show="type === 'detail' && !parentParams.relationStrategyUuid">
            暂无司机定价策略
          </div>
          <div v-show="!(type === 'detail' && !parentParams.relationStrategyUuid)">
            <UpdatePriceDriver
              ref="updatepricedriver"
              v-model="value"
              :type="type"
              :parentParams="driverParams"
              :area-info-by-code-list="areaInfoByCodeList"
              :hidden-confirm="true"
              :hidden-validate="true"
            >
            </UpdatePriceDriver>
          </div>
        </Card>
      </Col>

    </Row>
    <div class="popView-footer-wrap" style="justify-content:center;">
      <Button
        size="large"
        type="text"
        style="margin-right: 8px"
        @click="commit(0)"
      >
        取消
      </Button>
      <Button
        v-if="type !== 'detail'"
        size="large"
        type="primary"
        @click="commit(1)"
      >
        确定
      </Button>
      <Button v-else size="large" type="primary" @click="commit(0)">
        确定
      </Button>
    </div>
  </div>
</template>

<script>
import {
  addPriceStrategyList,
} from "_g/api/openCity";
import UpdatePrice from "./update-price.vue"
import UpdatePriceDriver from "./update-price-driver.vue"
export default {
  name: "passenger-pricing-eidt",
  components: {
    UpdatePriceDriver,
    UpdatePrice,
  },
  props: [
    "value",
    "parentParams",
    "areaInfoByCodeList",
    "type",
    "popPriceViewStatusDriver",
    "passengerPricingUuid"
  ],
  data() {
    return {
      driverParams: {},
      isLoading:false
    }
  },

  watch: {
    value(v) {
      if (v) {
        this.driverParams = { ...this.parentParams, consumerType: 2, detailUuid: this.parentParams.relationStrategyUuid }
      } else {
        this.driverParams = {};
      }
    }
  },
  methods: {
    commit(temp) {
      if (temp) {
          this.submit();
      } else {
        this.$emit("input", false);
      }
    },
    async submit() {
      let dataTypeMap = {
        expandBizLine: '业务线',
        areaType: '行政区类型',
        areaCodes: '区县',
        businessType: '产品线',
        carLevel: '车型等级',
        typeTime: '订单类型',
        workRestDayList: '定价适应时间',
        effectiveTime: '生效时间',
        startFareStatus:"起步费",
        startTrip: '起步里程',
        startDuration: '起步时长',
      }
      let canSubmit = true;
      let updatepriceResult = await this.$refs.updateprice.commit(1)
      let updatepricedriverResult = await this.$refs.updatepricedriver.commit(1)
      if (updatepriceResult && updatepricedriverResult) {
        for (const k in dataTypeMap) {
          if (updatepriceResult.areaType==1&&k=="areaCodes") {
            continue;
          }
          if (updatepriceResult.startFareStatus==false&&(k=="startTrip"||k=="startDuration")) {
            continue;
          }
          if (JSON.stringify(updatepriceResult[k])!==JSON.stringify(updatepricedriverResult[k])) {
            this.$Message.warning(`请保持${dataTypeMap[k]}一致`);
            canSubmit = false;
            break;
          }
        }
        if (canSubmit) {
          if (!this.isLoading) {
            this.isLoading = true;
            addPriceStrategyList([updatepriceResult, updatepricedriverResult]).then((res) => {
              this.$Message.success("新建成功");
              this.$emit("input", false);
              this.$emit("on-confirm");
              this.isLoading = false;
            }).catch(()=>{
              this.isLoading = false;
            })
          }else{
            this.$Message.warning(`正在提交请稍等`);
          }
        }
      }
    }
  }
}
</script>

<style lang="" scoped>

</style>