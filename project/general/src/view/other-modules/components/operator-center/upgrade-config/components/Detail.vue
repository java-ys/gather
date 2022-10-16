<template>
  <Modal
    :value="visible"
    width="780"
    title="升舱策略"
    @on-cancel="handleCancel"
  >
    <div
      slot="footer"
    >
      <Button
        v-if="detail && detail.strategyStatus === 1"
        type="primary"
        @click="handleEdit"
      >
        编辑
      </Button>
    </div>
    <div
      v-if="detail"
    >
        <Row>
        <Col span="4" class="paragraph-item-1">
          <p>策略名称：</p>
          <em>{{detail.upCarLevelStrategyName}}</em>
        </Col>
        <Col span="4" class="paragraph-item-1">
          <p>策略命中城市：</p>
          <em>{{cityName}}</em>
        </Col>
        <Col span="10" class="paragraph-item-1">
          <p>策略生效时间：</p>
          <em>{{detail.effectiveTimeStart}} ~ {{detail.effectiveTimeEnd}}</em>
        </Col>
        <Col span="6" class="paragraph-item-1">
          <p>业务线：</p>
          <em>{{getBusinessName(detail.expandBizLine)}}</em>
        </Col>
        </Row>
      <div style="height: 20px;"></div>
        <Row>
          <Col span="4" class="paragraph-item-1">
            <p>订单类型：</p>
            <em>{{typeTimeName}}</em>
        </Col>
          <Col span="4" class="paragraph-item-1">
            <p>订单渠道：</p>
            <em>{{channelName}}</em>
          </Col>
          <Col span="10" class="paragraph-item-1">
            <p>渠道类型：</p>
            <Select
              v-model="detail.upCarLevelStrategyExtend.sources"
              placeholder="请选择"
              multiple
              disabled=""
              :style="{
              width: '226px'
            }"
            >
              <Option
                v-for="item in channelList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </Select>
          </Col>
        <Col span="6" class="paragraph-item-1">
          <p>优先级：</p>
          <em>{{getPriority((detail.upCarLevelStrategyExtend && detail.upCarLevelStrategyExtend.priority) || 0)}}</em>
        </Col>
        </Row>
      <div style="height: 20px;"></div>

      <Card
        v-for="(item, index) in detail.upCarLevelPeriods"
        :key="index"
        class="card-content"
      >
        <div
          slot="title"
          class="card-title"
        >
          <span>配置{{index + 1}}</span>
        </div>
        <div class="paragraph">
          <div class="paragraph-item">
            <span>策略类型：</span>
            <em>{{item.driverFareModel | driverFareModelF}}</em>
          </div>
          <div class="paragraph-item">
            <span>司机侧计费标准：</span>
            <em>{{item.driverFareModel | driverFareModelName}}</em>
          </div>
        </div>
        <div class="paragraph">
          <div class="paragraph-item">
            <span>策略时间段：</span>
            <em>{{item.periodBegin}}-{{item.periodEnd}}</em>
          </div>
          <div class="paragraph-item">
            <span>重复机制：</span>
            <em>{{getWeekName(item.week)}}</em>
          </div>
        </div>

        <div class="paragraph">
          <div class="paragraph-item">
            <span>下单车型六边形订单积占超过：</span>
            <em>{{item.oldCarLevelOrdersInHexagon || ""}}</em>
          </div>
          <div class="paragraph-item">
            <span>目标车型六边形订单积占小于：</span>
            <em>{{item.newCarLevelOrdersInHexagon || ""}}</em>
          </div>
        </div>

        <div class="paragraph">
          <div class="paragraph-item">
            <span>车型变更概率：</span>
            <em>{{item.upCarLevelOdds || ""}}%</em>
          </div>
        </div>

        <div class="paragraph">
          <div class="paragraph-item">
            <span>下单车型：</span>
            <em>{{getOldCarNameList(item.oldCarLevel).join(", ")}}</em>
          </div>
          <div class="paragraph-item">
            <span>下单车型计费优先级：<span class="e-x">数字越小优先级越高</span></span>
            <ul class="li-ll">
              <li :key="index" v-for="(item, index) in getOldCarNameList(item.oldCarLevel)"
              >
                <Icon type="ios-menu" size="16" class="sort-icon" /><span class="lev"><span class="e-i">{{index + 1}}.</span>{{ item }}</span></li>
            </ul>
          </div>
        </div>
        <div class="paragraph">
          <div class="paragraph-item">
            <span>目标车型：</span>
            <em>{{getCarName(item.newCarLevel)}}</em>
          </div>
        </div>

        <div
          class="paragraph"
        >
          <div class="paragraph-item">
            <span>是否弹出升舱弹窗：</span>
            <em>{{item.need2Pop | need2PopF}}</em>
          </div>
        </div>
        <div
          v-if="item.need2Pop === 1"
          class="paragraph"
        >
          <div class="paragraph-item">
            <span>乘客端升舱弹窗提醒文案：</span>
            <em
              v-for="(t, index) in item.copies"
              :key="index"
            >
              {{t}}
            </em>
          </div>
        </div>
      </Card>
    </div>
    <Spin
      v-if="loading"
      fix
    />
  </Modal>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {getInChannel, getOutChannel} from "../service";
import {
  orderType,
  orderChannel,
  chargingStandard,
  policyPriority,
  need2PopList
} from "../fields";
export default {
  data(){
    return {
      channelList: []
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: null
    },
    cityList: {
      type: Array,
      default: () => []
    },
    cityMap: {
      type: Object,
      default: () => ({})
    },
    carTypeList: {
      type: Array,
      default: () => []
    },
    weekList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    detail(v) {
      if(v) {
        let { detail } = this;
        if(detail?.upCarLevelStrategyExtend) {
          let du = detail.upCarLevelStrategyExtend;
          this.detail.upCarLevelStrategyExtend.sources = du?.sources.split(",")
          this.setChannelList(du?.channel)
        }
      }
    }
  },
  filters: {
    need2PopF(v) {
      let f = need2PopList.find(it => it.value - v === 0)
      return f? f.label: ""
    },
    driverFareModelF(v) {
      let f = policyPriority.find(it => it.value - v === 0)
      return f? f.label: ""
    },
    driverFareModelName(v) {
      return chargingStandard[v]
    },
  },
  computed: {
    ...mapState({
      bizTypeList: state => state.common.bizTypeList,
      businessGradeList: (state) => {
        return state.common.businessGradeList
      },
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
    typeTimeName({detail}) {
      let v = detail.typeTime
      let f = orderType.find(it => it.value - v === 0)
      return f?.label || ""
    },
    channelName({detail}) {
      let v = detail.upCarLevelStrategyExtend.channel
      let f = orderChannel.find(it => it.value - v === 0)
      return f?.label || ""
    },
    cityName() {
      if (this.detail?.cityCode) {
        const city = this.detail.cityCode.split(",")
        const result = []
        city.forEach(code => {
          result.push(this.cityMap[code])
        })

        return result.join(",")
      }
      return ""
    },
  },
  methods: {
    async setChannelList(v) {
      let func = [getInChannel, getOutChannel];
      if(!func[v]) return
      const {data} = await func[v]();
      if(data.success) {
        this.channelList = data.data.map(item => ({
          label: item.sourseName,
          value: `${item.sourseValue}`
        }));
      }
    },
    getPriority(value) {
      if (value === 0) return "按被升舱车型定价优先"
      if (value === 1) return "按升舱车型定价优先"
      return ""
    },
    getWeekName(arr) {
      return arr.map(code => {
        let name = ""
        this.weekList.some(item => {
          if (item.value === code) {
            name = item.label
            return true
          }
          return false
        })

        return name
      }).join(",")
    },
    handleCancel() {
      this.$emit("close")
    },
    getCarName(code) {
      const [productKey, carKey] = code.split("#")
      const { productKeyValue, carLevelKeyValue } = this.businessGradeName
      const productName = productKeyValue[productKey] || "" // 产品线
      // const carName = carLevelKeyValue[productCarLevel[1]] || ""
      let carName = ''; // 车型
      let carList = this.bizTypeList.find(it => it.value - productKey === 0)
      if(carList?.children?.length) {
        let f = carList.children.find(it => it.value - carKey === 0)
        carName = f?.label
      }
      return `${productName}-${carName}`
    },
    getBusinessName(val) {
      const { businessKeyValue } = this.businessGradeName
      return businessKeyValue[val] || ""
    },
    getOldCarNameList(n) {
      let list = n?.split(",");
      return list?.map(item => {
        return this.getCarName(item)
      }) || [];
    },
    handleEdit() {
      this.$emit("edit", this.detail.uuid)
    }
  }
}
</script>

<style scoped lang="less">
.paragraph {
  display: flex;
}
.paragraph-item-1 {
  p {
    font-weight: bold;
    font-size: 14px;
  }

  em {
    font-style: normal;
    font-size: 12px;
  }
}
.paragraph-item {
  width: 250px;
  display: flex;
  flex-direction: column;
  margin: 0 10px 10px;
  flex: 1;

  span {
    font-weight: bold;
    font-size: 14px;
  }

  em {
    font-style: normal;
    font-size: 12px;
  }

  .e-x {
    margin-left: 40px;
    color: #999;
    font-size: 12px;
  }
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  margin-bottom: 20px;
}

.li-ll {
  font-size: 12px;
  li {
    height: 20px;
    line-height: 20px;
  }
}
.lev {
  margin-left: 6px;
}
.sort-icon {
  position: relative;
  bottom: 1px;
  color: #afacac;
}
.sort-title {
  font-size: 12px;
  margin-bottom: 6px !important;
}

.e-i {
  margin-right: 4px;
}
</style>
