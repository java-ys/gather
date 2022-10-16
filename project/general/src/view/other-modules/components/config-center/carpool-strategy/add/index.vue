<template>
  <div class="strategy-add">
    <Card class="strategy-card">
      <Form
        ref="addForm"
        class="top15"
        :model="addData"
        :rules="ruleValidate"
        :label-width="150"
      >
        <div class="class-tit bottom30">拼车策略</div>
        <div class="flex-box">
          <FormItem label="策略名称：" prop="ruleName" class="right50">
            <Input
              v-if="isDetail"
              :value="addData.ruleName"
              class="width200"
              disabled
            />
            <Input
              v-else
              v-model="addData.ruleName"
              class="width200"
              :maxlength="20"
              placeholder="请输入策略名称"
            />
          </FormItem>
          <FormItem
            label="策略命中城市："
            prop="provinceCityCode"
            class="right50"
          >
            <Input
              v-if="isDetail"
              :value="`${addData.provinceName || ''}/${addData.cityName || ''}`"
              style="width: 280px"
              disabled
            />
            <Cascader
              v-else
              v-model="addData.provinceCityCode"
              :data="provinceCityList"
              placeholder="请选择城市"
              trigger="hover"
              filterable
              style="width: 280px; display: inline-block"
              @on-change="handleCityChange"
              :disabled="isEdit ? true : false"
            ></Cascader>
          </FormItem>
          <FormItem
            label="策略生效日期："
            prop="effectiveTimeVO"
            class="right50"
          >
            <Input
              v-if="isDetail"
              :value="`${addData.effectiveTime || ''}～${addData.failureTime || ''}`"
              style="width: 300px;"
              disabled
            />
            <el-date-picker
              type="datetimerange"
              v-else
              v-model="addData.effectiveTimeVO"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="small"
              style="width: 370px"
              align="left"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              @change="chooseTime"
              :disabled="isEdit ? true : false"
            ></el-date-picker>
          </FormItem>
        </div>
        <div class="flex-box">
          <FormItem label="拼车场景：" prop="scene" class="right50">
            <Input
              v-if="isDetail"
              :value="carpoolSceneMap[addData.scene] || ''"
              class="width200"
              disabled
            />
            <Select
              v-else
              v-model="addData.scene"
              placeholder="选择拼车场景"
              class="width200"
              :clearable="true"
            >
              <Option
                v-for="item in carpoolScenes"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </div>
        <div class="class-tit bottom30">配置信息</div>
        <div
          class="single-config"
          v-for="(item, i) in addData.carpoolRuleInfoList"
          :key="i"
        >
          <StrategyConfig
            ref="strategyConfigForm"
            @delete-config="deleteConfig"
            :config="item"
            :isDetail="isDetail"
            :configIndex="i + 1"
          />
        </div>
        <Button
          v-if="!isDetail"
          type="primary"
          size="large"
          class="add-config"
          @click="addConfig"
        >
          增加配置
        </Button>
      </Form>
      <div v-if="!isDetail" class="footer-box">
        <Button
          type="primary"
          size="large"
          :loading="addLoading"
          @click="addSubmit('addForm')"
        >
          <span v-if="!addLoading">提交</span>
          <span v-else>提交中</span>
        </Button>
        <Button
          size="large"
          type="text"
          @click="formReset('addForm')"
          >取消</Button
        >
      </div>
      <div v-else class="footer-box">
        <Button
          type="primary"
          size="large"
          @click="close"
          >关闭</Button
        >
      </div>
    </Card>
  </div>
</template>
<script>
import { getWholeRegion } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";
import { ruleValidate } from "./fields";
import { carpoolScenes, carpoolSceneMap } from "../fields";
import StrategyConfig from "../components/strategyConfig.vue";
import { saveCarpoolStrategy, queryCarpoolDetail } from "_o/api/carpoolConfig.js";
export default {
  components: { StrategyConfig },
  data() {
    return {
      handleType: Number(this.$route.query.type),
      uuid: this.$route.params.uuid,
      addData: {
        ruleName: "", // 策略名称
        effectiveTime: "", // 策略生效开始日期
        failureTime: "", // 结束日期
        effectiveTimeVO: [],
        provinceCityCode: [],
        cityCode: "",
        carpoolRuleInfoList: [
          {
            carpoolFareType: null, // 乘客定价折扣
            carpoolSeatFares: [
              { seats: 1, discount: null }, // 1人位
              { seats: 2, discount: null }, // 2人位
              { seats: 0, discount: null }, // 未拼成
            ],
            driverCarpoolFareType: null,
            oneDiscount: null, // 1人位折扣
            twoDiscount: null, // 2人位折扣
            noDiscount: null, // 未拼成折扣
            driverCarpoolSeatFares: [
              { seats: 1, discount: null }, // 1人位
              { seats: 2, discount: null }, // 2人位
              { seats: 0, discount: null }, // 未拼成
            ],
            oneDiscountDriver: null, // 1人位折扣
            twoDiscountDriver: null, // 2人位折扣
            noDiscountDriver: null, // 未拼成折扣
            week: [], // 重复机制
            acceptRatio: null, // 接起率
            successRatio: null, // 拼成率
            passengerCarpool: null, // 乘客侧拼单上限
            driverCarpool: null, // 司机侧拼单上限
            carpoolMile: null, // 拼车单里程上限
            distanceRatio: null, // 绕路系数上限
            commonMileRatio: null, // 共乘里程占比下限
            redundancyTimes: [], // 订单冗余时长
            // 工作日、休息日
            workRestDayType: []
          },
        ], // 策略配置
      },
      singleConfig: {
        carpoolFareType: null,
        carpoolSeatFares: [
          { seats: 1, discount: null }, // 1人位
          { seats: 2, discount: null }, // 2人位
          { seats: 0, discount: null }, // 未拼成
        ],
        oneDiscount: null,
        twoDiscount: null,
        noDiscount: null, // 未拼成折扣
        week: [],
        workRestDayType: [],
        acceptRatio: null, // 接起率
        successRatio: null, // 拼成率
        passengerCarpool: null, // 乘客侧拼单上限
        driverCarpool: null, // 司机侧拼单上限
        carpoolMile: null, // 拼车单里程上限
        distanceRatio: null, // 绕路系数上限
        commonMileRatio: null, // 共乘里程占比下限
        redundancyTimes: [], // 订单冗余时长
      }, // 单个策略配置对象
      addLoading: false,
      carpoolScenes, // 拼车场景
      carpoolSceneMap,
      provinceCityList: [],
      cityNames: {},
    };
  },
  mounted() {
    this.getCityList();
    // 复制or编辑or详情
    if (!this.isAdd) {
      this.getCarpoolDetail();
    }
  },
  computed: {
    // 是否是详情
    isDetail() {
      return this.handleType === 3;
    },
    // 是否新增
    isAdd() {
      return this.handleType === 1;
    },
    // 是否编辑
    isEdit() {
      return this.handleType === 2;
    },
    // 是否复制
    isCopy() {
      return this.handleType === 4;
    },
    ruleValidate() {
      return this.isDetail ? null : ruleValidate;
    },
  },
  methods: {
    // 获取详情
    getCarpoolDetail() {
      queryCarpoolDetail({
        uuid: this.uuid
      }).then(res => {
        let d = res.data || {};
        if (200 === d.code) {
          let addData = d.data || {};
          // 初始化乘客定价折扣
          addData?.carpoolRuleInfoList?.forEach(carpool => {
            // 乘客 拼座
            carpool.oneDiscount = carpool.carpoolSeatFares[0].discount;
            carpool.twoDiscount = carpool.carpoolSeatFares[1].discount;
            carpool.noDiscount = carpool.carpoolSeatFares[2]?.discount || null

            // 司机拼座
            if(!carpool?.driverCarpoolSeatFares?.length) {
              carpool.driverCarpoolSeatFares = [{seats: 1, discount: 0}, {seats: 2, discount: 0}, {seats: 0, discount: 0}]
            }
            // 拼成1人位 拼成2人位 未拼成
            carpool.oneDiscountDriver = carpool.driverCarpoolSeatFares[0].discount || null;
            carpool.twoDiscountDriver = carpool.driverCarpoolSeatFares[1].discount || null;
            carpool.noDiscountDriver = carpool.driverCarpoolSeatFares[2]?.discount || null

            delete carpool.week
          });
          // 组装省市
          addData.provinceCityCode = [addData.provinceCode || "", addData.cityCode || ""];
          // 组装生效时间
          addData.effectiveTimeVO = [addData.effectiveTime || "", addData.failureTime || ""];
          this.addData = JSON.parse(JSON.stringify(addData));
        }
      });
    },
    // 获取城市列表
    getCityList() {
      getWholeRegion({}).then((res) => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data, "", "", "citys");
          let listCopy = JSON.parse(JSON.stringify(list));
          this.provinceCityList = listCopy;
          this.setCityNames();
        }
      });
    },
    // 存储城市名称
    setCityNames() {
      this.provinceCityList.forEach(province => {
        province.citys.forEach(city => {
          this.cityNames[city.cityID] = city.city || "";
        });
      });
    },
    handleCityChange(val) {
      this.addData.cityCode = val[1] || "";
    },
    /**
     * 生效日期
     */
    chooseTime(d = []) {
      if (d && d.length === 2) {
        this.addData.effectiveTime = d[0];
        this.addData.failureTime = d[1];
      } else {
        this.addData.effectiveTime = "";
        this.addData.failureTime = "";
      }
      // 单独校验生效日期
      this.$refs['addForm'].validateField('effectiveTimeVO');
    },
    /**
     * 删除当前配置
     */
    deleteConfig(index) {
      this.addData.carpoolRuleInfoList.splice(index - 1, 1);
    },
    /**
     * 校验子配置
     */
    async checkConfigForm() {
      let configValids = [];
      for (let i = 0; i < this.addData.carpoolRuleInfoList.length; i++) {
        let configFormValid = await this.$refs["strategyConfigForm"][
          i
        ].validForm();
        configValids.push(configFormValid);
      }
      return configValids;
    },
    /**
     * 校验时间段是否有重叠
     */
    isHasRepeatTime(data) {
      const startTimeArr = [];
      const endTimeArr = [];
      (data || []).map(function (item) {
        startTimeArr.push(item.startTime);
        endTimeArr.push(item.endTime);
      });
      const allStartTime = startTimeArr.sort();
      const allEndTime = endTimeArr.sort();
      let result = 0;
      for (let k = 1; k < allStartTime.length; k++) {
        if (allStartTime[k] < allEndTime[k - 1]) {
          result += 1;
        }
      }
      return result > 0;
    },
    /**
     * 提交
     */
    async addSubmit(name) {
      let addFormValid = await this.$refs[name].validate();
      let configValids = await this.checkConfigForm();
      let addData = JSON.parse(JSON.stringify(this.addData));
      console.log("策略数据====", addData);
      // 校验时间段开始时间需要小于结束时间
      let weekMap = {};
      addData.carpoolRuleInfoList.forEach((carpool, i) => {
        let timeValid = carpool.startTime && carpool.endTime;
        // 校验时间段
        if (timeValid && carpool.startTime >= carpool.endTime) {
          this.$message.error("策略时间段开始时间需要小于结束时间");
          configValids[i] = false;
        }
        // 校验乘客1，2人位折扣
        let seatFares = carpool.carpoolSeatFares || [];
        if (seatFares[0].discount && seatFares[1].discount && seatFares[0].discount > seatFares[1].discount) {
          this.$message.error("乘客定价折扣拼成1人位拼成价折扣需小于等于2人位拼成折扣");
          configValids[i] = false;
        }
        // 校验司机1, 2认为折扣
        let seatFaresDriver = carpool.driverCarpoolSeatFares || [];
        if (seatFaresDriver[0].discount && seatFaresDriver[1].discount && seatFaresDriver[0].discount > seatFaresDriver[1].discount) {
          this.$message.error("司机定价折扣拼成1人位拼成价折扣需小于等于2人位拼成折扣");
          configValids[i] = false;
        }
        // 存储重复机制时间段
        carpool.workRestDayType.forEach(w => {
          // 如果对象内没该key,则初始化
          if (!weekMap[w]) {
            weekMap[w] = [];
          }
          // 如果设置的时间有效，则存入对应的数组
          if (timeValid && carpool.startTime < carpool.endTime) {
            weekMap[w].push({
              startTime: carpool.startTime,
              endTime: carpool.endTime
            });
          }
        });
        // 乘客 拼不成实时计价, 删除未拼成入参
        if(carpool.carpoolFareType - 1 === 0) {
          carpool.carpoolSeatFares = carpool.carpoolSeatFares.filter(it => it.seats > 0)
        }
        // 司机 拼成一口价，拼不成实时计价
        if(carpool.driverCarpoolFareType - 81 === 0) {
          carpool.driverCarpoolSeatFares = carpool.driverCarpoolSeatFares.filter(it => it.seats > 0)
        } else if (carpool.driverCarpoolFareType - 83 === 0 || !carpool.driverCarpoolFareType) { // 拼成实时计费，拼不成实时计费 或没选择
          carpool.driverCarpoolSeatFares = []
        }
      });
      // 遍历存储的时间段数据
      let weekValues = Object.values(weekMap)
      let hasRepeatTime = false;
      for (let weekI = 0; weekI < weekValues.length; weekI++) {
        // 当数组长度>1时，意味着同一星期存在两个时间段，需要比较时间段有无交叉
        if (weekValues[weekI].length > 1) {
          hasRepeatTime = this.isHasRepeatTime(weekValues[weekI]);
        }
        // 如果存在交叉数据则推出循环
        if (hasRepeatTime) break;
      }
      // 存在交叉时间
      if (hasRepeatTime) {
        this.$message.error("策略时间段有重叠");
        return;
      }
      /*if (this.isHasRepeatTime(addData.carpoolRuleInfoList)) {
        this.$message.error("策略时间段有重叠");
        return;
      }*/
      // 表单验证通过
      if (addFormValid && configValids.indexOf(false) === -1) {
        // 如果是copy则删除uuid
        if (this.isCopy) {
          delete addData.uuid;
        }
        this.addLoading = true;
        saveCarpoolStrategy(addData).then(res => {
          this.addLoading = false;
          let d = res.data || {};
          if (200 === d.code) {
            this.$message.success("策略保存成功");
            this.$store.commit("setChangeTab", this.$route);
            this.$router.push({ name: "carpool-strategy" });
          } else {
            this.$message.error("策略保存失败");
          }
        }).catch(err => {
          this.addLoading = false;
        })
      }
    },
    /**
     * 取消
     */
    formReset(formRef) {
      this.$refs[formRef].resetFields();
      this.$store.commit("setChangeTab", this.$route);
      this.$router.push({ name: "carpool-strategy" });
    },
    /**
     * 关闭
     */
    close() {
      this.$store.commit("setChangeTab", this.$route);
      this.$router.push({ name: "carpool-strategy" });
    },
    /**
     * 增加配置
     */
    addConfig() {
      let singleConfig = JSON.parse(JSON.stringify(this.singleConfig));
      this.addData.carpoolRuleInfoList.push(singleConfig);
    },
  },
};
</script>
<style lang="less" scoped>
.strategy-add {
  .strategy-card {
    overflow: auto;
  }

  .single-config {
    width: 100%;
    height: auto;
  }

  .add-config {
    margin-top: 20px;
  }

  .footer-box {
    margin-top: 20px;
    margin-left: 60%;
  }
}
/deep/.flex-box {
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
}
</style>
