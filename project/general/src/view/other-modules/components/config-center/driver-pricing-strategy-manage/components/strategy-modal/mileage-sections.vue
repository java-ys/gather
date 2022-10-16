<!--
 * @Description:计乘比组件
 * @Author: sunqianqian
 * @Date: 2022-04-21 13:50:48
 * @LastEditors: sunqianqian
 * @LastEditTime: 2022-05-05 20:28:02
-->
<template>
  <div>
    <FormItem :label-width="80">
      <Checkbox
        v-if="isEdit"
        v-model="mileageRatioStatus"
        @on-change="changeStatus"
      >
        计乘比补偿(计费里程/(接程里程+计费里程))
      </Checkbox>
    </FormItem>
    <div v-if="distanceCompensateFare">
      <Card v-for="(item, k) in distanceCompensateFare" :key="`mileage_${k}`" style="width:100%;margin-top:10px">
        <div slot="title">
          <Row type="flex">
            <Col style="width:250px">
              <FormItem label="计费里程区间：" :label-width="110" :prop="`distanceCompensateFare.${k}.startDistance`" :rules="ruleValidate.startDistance">
                <InputNumber v-model="item.startDistance" :min="0" :max="999.99" :step="0.01" :disabled="!isEdit" style="width:120px" placeholder="起始区间" @on-blur="FormatNumber(item.startDistance, {
                  k1: 'distanceCompensateFare',
                  k2: 'startDistance',
                  index1: k,
                })"
                ></InputNumber>
              </FormItem>
            </Col>
            <span style="margin-top:8px">--</span>
            <Col style="width:160px">
              <FormItem :label-width="20" :prop="`distanceCompensateFare.${k}.endDistance`" :rules="ruleValidate.endDistance">
                <InputNumber v-model="item.endDistance" :min="0" :max="999.99" :step="0.01" :disabled="!isEdit" style="width:120px" placeholder="结束区间" @on-blur="FormatNumber(item.endDistance, {
                  k1: 'distanceCompensateFare',
                  k2: 'endDistance',
                  index1: k,
                })"
                >></InputNumber>
              </FormItem>
            </Col>
            <Col v-if="isEdit" style="width:80px">
              <Icon :size="22" color="green" class="add-btn" type="ios-add-circle-outline" @click="increaseMileage" />
              <Icon :size="22" color="red" class="reduce-btn" type="ios-remove-circle-outline" @click="reduceMileage(k)" />
            </Col>
          </Row>
        </div>
        <Row v-for="(it,kk) in item.distanceRatioList" :key="`ratio_${k}_${kk}`" type="flex" class="cell-bd">
          <Col style="width:230px">
            <FormItem label="计乘比区间：" :label-width="110" :prop="`distanceCompensateFare.${k}.distanceRatioList.${kk}.startRatio`" :rules="ruleValidate.startRatio">
              <InputNumber v-model="it.startRatio" :min="0" :max="100" :step="0.1" :disabled="!isEdit" style="width:100px" placeholder="起始区间" @on-blur="FormatNumber(it.startRatio, {
                k1: 'distanceCompensateFare',
                k2: 'distanceRatioList',
                k3: 'startRatio',
                index1: k,
                index2: kk
              }, 1)"
              ></InputNumber> %
            </FormItem>
          </Col>
          <span style="margin-top:8px">--</span>
          <Col style="width:150px">
            <FormItem :label-width="10" :prop="`distanceCompensateFare.${k}.distanceRatioList.${kk}.endRatio`" :rules="ruleValidate.endRatio">
              <InputNumber v-model="it.endRatio" :min="0" :max="100" :step="0.1" :disabled="!isEdit" style="width:100px" placeholder="结束区间" @on-blur="FormatNumber(it.endRatio, {
                k1: 'distanceCompensateFare',
                k2: 'distanceRatioList',
                k3: 'endRatio',
                index1: k,
                index2: kk
              }, 1)"
              ></InputNumber> %
            </FormItem>
          </Col>
          <Col style="width:220px">
            <FormItem label="补偿金额(元)" :label-width="100" :prop="`distanceCompensateFare.${k}.distanceRatioList.${kk}.compensateFare`" :rules="ruleValidate.compensateFare">
              <InputNumber v-model="it.compensateFare" :min="-100" :max="100" :step="0.01" :disabled="!isEdit" style="width:100px" placeholder="补偿金额" @on-blur="limitNumbertwo(it.compensateFare, {
                k1: 'distanceCompensateFare',
                k2: 'distanceRatioList',
                k3: 'compensateFare',
                index1: k,
                index2: kk
              })"
              ></InputNumber>
            </FormItem>
          </Col>
          <Col v-if="isEdit" style="width:80px">
            <Icon :size="22" color="green" class="add-btn" type="ios-add-circle-outline" @click="increaseRatio(item)" />
            <Icon :size="22" color="red" class="reduce-btn" type="ios-remove-circle-outline" @click="reduceRatio(item, kk)" />
          </Col>
        </Row>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "@vue/composition-api"
import { useValidateRules } from "./validate";
export default {
  name: "MileageSections",
  props: { distanceCompensateFare: Array, isEdit: Boolean },
  setup(props, { root, refs, emit }) {
    const mileageRatioStatus = ref(false)
    const ruleValidate = useValidateRules(props.distanceCompensateFare);

    watch(() => props.distanceCompensateFare, (v) => {
      mileageRatioStatus.value = v && v.length > 0 ? true : false;
    }, { immediate: true, deep: true })

    const increaseMileage = () => {
      if (props.distanceCompensateFare && props.distanceCompensateFare.length >= 20) {
        root.$Message.warning("最多可输入20个区间")
        return;
      }
      props.distanceCompensateFare.push({
        startDistance: null,
        endDistance: null,
        distanceRatioList: [{
          startRatio: null,
          endRatio: null,
          compensateFare: null
        }]
      })
    }
    const reduceMileage = (index) => {
      props.distanceCompensateFare.splice(index, 1)
    }
    const increaseRatio = (mileageSection) => {
      if (mileageSection.distanceRatioList && mileageSection.distanceRatioList.length >= 20) {
        root.$Message.warning("最多可输入20个区间")
        return;
      }
      mileageSection.distanceRatioList.push({
        startRatio: null,
        endRatio: null,
        compensateFare: null
      })
    }
    const reduceRatio = (mileageSection, index) => {
      mileageSection.distanceRatioList.splice(index, 1)
    }

    const changeStatus = (e) => {
      if (e) {
        if (props.distanceCompensateFare && props.distanceCompensateFare.length === 0) {
          increaseMileage();
        }
      } else {
        emit("update:distanceCompensateFare", [])
      }
    }

    const FormatNumber = (VauleNumber, obj, fixNum = 2) => {
      const { k2, k3, index1, index2 } = { ...obj };
      if (VauleNumber) {
        let newVal;
        if (fixNum === 2) {
          newVal = Number(VauleNumber.toString().match(/^\d+(?:\.\d{0,2})?/));
        } else if (fixNum === 1) {
          newVal = Number(VauleNumber.toString().match(/^\d+(?:\.\d{0,1})?/));
        }
        if (k3) {
          root.$set(props.distanceCompensateFare[index1][k2][index2], k3, newVal);
        } else if (k2) {
          root.$set(props.distanceCompensateFare[index1], k2, newVal);
        } else {
          root.$set(props.distanceCompensateFare, newVal);
        }
      }
    }
    const limitNumbertwo = (value, obj) => {
      const { k2, k3, index1, index2 } = { ...obj };
      if (value) {
        let newVal = !isNaN(value) ? String(value).replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3") : "";
        newVal = Number(newVal);
        root.$set(props.distanceCompensateFare[index1][k2][index2], k3, newVal);
      }
    }
    return {
      mileageRatioStatus,
      changeStatus,
      increaseMileage,
      reduceMileage,
      increaseRatio,
      reduceRatio,
      FormatNumber,
      limitNumbertwo,
      ruleValidate
    }
  }
}
</script>

<style lang="less" scoped>
.add-btn{
  cursor: pointer;
  font-weight: bold;
  margin-right:15px
}
.reduce-btn{
  cursor: pointer;
  font-weight: bold;
}
</style>