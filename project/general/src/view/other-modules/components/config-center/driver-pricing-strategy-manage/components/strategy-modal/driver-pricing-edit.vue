<template>
  <div>
    <Row>
      <Col span="11">
        <Card>
          <p slot="title">司机定价策略</p>
          <div>
            <UpdatePriceDriver
              ref="updatepricedriver"
              v-model="value"
              :type="type"
              :parentParams="parentParams"
              :area-info-by-code-list="areaInfoByCodeList"
              :hidden-confirm="true"
              @on-confirm="confirm"
              @on-close="close"
              @on-related="relatedPassenger"
            >
            </UpdatePriceDriver>
          </div>
        </Card>
      </Col>
      <Col span="11" offset="2">
        <Card>
          <p slot="title">乘客定价策略</p>
          <div>
            <UpdatePrice
              v-if="popPriceViewStatus"
              ref="updateprice"
              v-model="popPriceViewStatus"
              type="detail"
              :parentParams="passengerParams"
              :area-info-by-code-list="areaInfoByCodeList"
              :hidden-confirm="true"
            >
            </UpdatePrice>
          </div>
        </Card>
      </Col>
    </Row>
    <div class="popView-footer-wrap" style="justify-content: center">
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
import UpdatePrice from "./update-price.vue"
import UpdatePriceDriver from "./update-price-driver.vue"
import {
  addPriceStrategy
} from "_g/api/openCity";
export default {
  name: "driver-pricing-eidt",
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
      passengerParams: {},
      popPriceViewStatus: false,
    }
  },
  watch: {
    value(v) {
      if (v) {
        if (this.parentParams.relationStrategyUuid) {
          // this.passengerParams.detailUuid = this.parentParams.relationStrategyUuid;
          this.passengerParams = { ...this.parentParams, detailUuid: this.parentParams.relationStrategyUuid, consumerType: 1 }
          this.popPriceViewStatus = true;
        }
      } else {
        this.passengerParams = {};
        this.popPriceViewStatus = v;
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
      let params = await this.$refs.updatepricedriver.commitBefore(1);
      console.log(params, "kkk===kkk")
      if (params) {
        this.$Modal.confirm({
          title: "请确认",
          content: "确定要保存当前司机定价策略吗",
          okText: "确认",
          cancelText: "取消",
          onOk: async () => {
            addPriceStrategy(params).then((res) => {
              this.$Message.success("新建成功");
              this.$emit("input", false);
            });
          }
        })

      }
    },
    relatedPassenger(data) {
      this.popPriceViewStatus = false;
      if (data) {
        this.$nextTick(() => {
          this.passengerParams = { ...this.parentParams, detailUuid: data.uuid, consumerType: 1 }
          this.popPriceViewStatus = true;
        })
      }

    },
    confirm() {
      this.$emit("input", false);
      this.$emit("on-confirm")
    },
    close() {
      this.$emit("input", false);
    }
  }
}
</script>

<style lang="" scoped></style>
