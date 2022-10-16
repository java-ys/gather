<template>
  <div class="popView" v-show="popView">
    <div class="ivu-modal-mask"></div>
    <div class="popView-wrap" :style="{ top: top + 'px' }">
      <div class="popView-content" :style="{ width: width + 'px' }">
        <div
          class="popView-title-wrap"
          :style="{ width: width + 'px', top: top + 'px' }"
        >
          <span class="popView-title">{{ title }}</span>
          <div class="popView-icon">
            <Icon class="close-icon" type="md-close" @click="commit(0)" />
          </div>
        </div>
        <div class="popView-body-wrap policemodalstyle">
          <Form
            ref="formValidate"
            :model="floatParams"
            :label-width="200"
            :rules="ruleUser"
          >
            <FormItem label="城市：" prop="cityDtos">
              <Select
                v-model="floatParams.cityDtos"
                multiple
                :disabled="invalidEditor || updateType!==1"
                style="width:300px"
                placeholder="请选择城市"
                filterable
                :max-tag-count="10"
              >
<!--                编辑和详情展示全国-->
                <Option v-if="updateType - 3 === 0 || updateType - 2 === 0" key="-1" value="1">全国</Option>
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
              <Button
                size="small"
                type="primary"
                v-if="updateType - 1 === 0"
                v-lazy-click="{ fn: selectAll, }"
              >全选</Button
              >
              <Button
                v-if="updateType - 1 === 0 && floatParams.cityDtos && floatParams.cityDtos.length"
                size="small"
                type="primary"
                v-lazy-click="{ fn: clearAll, }"
              >清空</Button
              >
            </FormItem>
            <div class="input-item">
              <div class="item-field">
                高速路桥费
              </div>
              <div></div>
              <FormItem label="同城限额标准:" :required="true">
                <Row>
                  上路基价+每公里收费标准*实际行驶里程
                </Row>
                <Row>
                  <Col span="4">
                    <FormItem prop="sameCityHighSpeedFeeBasicPrice">
                      <Input
                        :min="0.1"
                        v-model="floatParams.sameCityHighSpeedFeeBasicPrice"
                        :disabled="invalidEditor "
                        placeholder="请输入"
                        style="vertical-align:top;width:100%"
                        :number="true"
                      ></Input>
                    </FormItem>
                  </Col>
                  <Col span="1">
                    <div class="center">
                      +
                    </div>
                  </Col>
                  <Col span="4">
                    <div class="flex">
                      <FormItem prop="sameCityHighSpeedFeeEveryMile">
                        <Input
                          v-model="floatParams.sameCityHighSpeedFeeEveryMile"
                          :disabled="invalidEditor"
                          placeholder="请输入"
                          style="vertical-align:top;width:100%"
                          :number="true"
                        ></Input
                      ></FormItem></div
                  ></Col>
                  <Col span="5">*实际行驶里程</Col>
                </Row>
              </FormItem>
              <FormItem label="跨城限额标准:" :required="true">
                <Row>
                  上路基价+每公里收费标准*实际行驶里程
                </Row>
                <Row>
                  <Col span="1">
                    <div class="center">
                      2*(
                    </div>
                  </Col>
                  <Col span="4">
                    <FormItem prop="crossCityHighSpeedFeeBasicPrice">
                      <Input
                        :min="0.1"
                        v-model="floatParams.crossCityHighSpeedFeeBasicPrice"
                        :disabled="invalidEditor"
                        placeholder="请输入"
                        style="vertical-align:top;width:100%"
                        :number="true"
                      ></Input>
                    </FormItem>
                  </Col>
                  <Col span="1">
                    <div class="center">
                      +
                    </div>
                  </Col>
                  <Col span="4">
                    <div class="flex">
                      <FormItem prop="crossCityHighSpeedFeeEveryMile">
                        <Input
                          :min="0.1"
                          v-model="floatParams.crossCityHighSpeedFeeEveryMile"
                          :disabled="invalidEditor"
                          placeholder="请输入"
                          style="vertical-align:top;width:100%"
                          :number="true"
                        ></Input
                      ></FormItem></div
                  ></Col>
                  <Col span="5">*实际行驶里程)</Col>
                </Row>
              </FormItem>
            </div>
            <!-- 其他费 -->
            <div class="input-item">
              <div class="item-field">
                其他费
              </div>
              <FormItem
                label="同一司机单日添加次数"
                :label-width="200"
                prop="otherFeeTimesEveryDay"
              >
                <Input
                  v-model="floatParams.otherFeeTimesEveryDay"
                  :disabled="invalidEditor"
                  placeholder="请输入"
                  style="width:300px;vertical-align:top;"
                  :maxlength="10"
                  @on-keyup="toNumber(floatParams.otherFeeTimesEveryDay, 'otherFeeTimesEveryDay')"
                ></Input>
              </FormItem>
              <FormItem
                label="同一司机单日添加总额"
                :label-width="200"
                prop="otherFeeTotalEveryDay"
              >
                <Input
                  v-model="floatParams.otherFeeTotalEveryDay"
                  :disabled="invalidEditor"
                  placeholder="请输入"
                  style="width:300px;vertical-align:top;"
                  :maxlength="10"
                  @on-keyup="toDecimal(floatParams.otherFeeTotalEveryDay, 'otherFeeTotalEveryDay')"
                ></Input>
              </FormItem>
              <FormItem
                label="单笔订单添加金额"
                :label-width="200"
                prop="otherFeeTotalEveryOrder"
              >
                <Input
                  :min="0.1"
                  v-model="floatParams.otherFeeTotalEveryOrder"
                  :disabled="invalidEditor"
                  placeholder="请输入"
                  style="width:300px;vertical-align:top;"
                  :maxlength="10"
                  @on-keyup="toDecimal(floatParams.otherFeeTotalEveryOrder, 'otherFeeTotalEveryOrder')"
                ></Input>
              </FormItem>
            </div>
            <!-- 其他费 -->
<!--            <div class="input-item">-->
<!--              <div class="item-field">-->
<!--                路桥费-->
<!--              </div>-->
<!--              <FormItem-->
<!--                label="单笔订单添加金额"-->
<!--                :label-width="200"-->
<!--                prop="roadBridgeFee"-->
<!--              >-->
<!--                <Input-->
<!--                  :min="0.1"-->
<!--                  v-model="floatParams.roadBridgeFee"-->
<!--                  :disabled="invalidEditor"-->
<!--                  placeholder="请输入"-->
<!--                  style="width:300px;vertical-align:top;"-->
<!--                  :number="true"-->
<!--                ></Input>-->
<!--              </FormItem>-->
<!--            </div>-->
            <!-- 停车费 -->
            <div class="input-item">
              <div class="item-field">
                停车费
              </div>
              <FormItem label="停车费:" :required="true">
                <Row>
                  <Col span="13">到达乘客上车点与订单结束时间差向上取整 *</Col>
                  <Col span="4">
                    <FormItem prop="parkCarFeeEveryHour">
                      <Input
                        v-model="floatParams.parkCarFeeEveryHour"
                        :disabled="invalidEditor"
                        placeholder="请输入"
                        style="vertical-align:top;width:100%"
                      ></Input>
                    </FormItem>
                  </Col>
                  <Col span="3">
                    <div class="center">
                      元/小时
                    </div>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="附件（发票相关说明）" :required="true">
                <Row>
                  <Col span="20">
                    <FormItem prop="attachments">
                      <UploadImg
                        :defaultList="floatParams.attachments"
                        :action="actionUrl"
                        :maxUpLoadCount="4"
                        :multiFile="true"
                        :params="params"
                        @on-upsuccess="getImgObj"
                        :isDetail="invalidEditor"
                      >
                      </UploadImg>
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="备注">
                <Row>
                  <Col span="15">
                    <FormItem prop="remark">
                      <Input
                        v-model="floatParams.remark"
                        type="textarea"
                        placeholder="请输入"
                        :disabled="invalidEditor"
                      ></Input>
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </Form>
          <div class="popView-footer-wrap" v-if="!invalidEditor">
            <Button
              size="large"
              type="text"
              @click="commit(0)"
              style="margin-right: 8px;"
              >取消</Button
            >
            <Button
              size="large"
              type="primary"
              v-lazy-click="{ fn: commit, params: { params: 1 } }"
              >确定</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import "@/styles/cyk-style.css";
import {
  addCarrier,
  editCarrier,
  getCarrierInfo
} from "_o/api/operator-carrier";
import { surchargeSave, surchargeUpdate } from "_o/api/configData.js";
import { timeFormat } from "@/libs/util";
import UploadImg from "./v-upload/v-upload.vue";
import config from "@/config/config";
const isDev = process.env.NODE_ENV === "development";
const baseUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro;
export default {
  components: {
    UploadImg
  },
  props: {
    popView: Boolean,
    width: Number,
    top: {
      default: 100,
      type: Number
    },
    title: {
      default: "新建弹窗",
      type: String
    },
    uuid: {
      default: "",
      type: String
    },
    updateType: {
      default: 1,
      type: Number
    },
    cityList: {
      default: () => {
        return [];
      },
      type: Array
    },
    invalidEditor: {
      default: false,
      type: Boolean
    },
    floatParams: {}
  },
  data() {
    const validateRequireArrFn = (rule, value, callback = () => {}) => {
      if (value && value.length) {
        callback();
      } else {
        callback(new Error("城市不能为空"));
      }
    };
    const validateRequireArrAttachmentFn = (rule, value, callback = () => {}) => {
      if (value && value.length) {
        callback();
      } else {
        callback(new Error("附件发票相关说明不能为空"));
      }
    };
    const requiredValidatedFn = (tips = "不能为空") => {
      const that = this;
      return (rule, value, callback) => {
        if (value) {
          callback();
        } else {
          callback(new Error(tips));
        }
      };
    };

    const validLessThan = (bounder=999)=>(rule, value, callback)=>{
      if (Number(value)<=999) {
          callback();
      } else {
        callback(new Error(`最高上限${bounder}`));
      }
    }
    return {
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      params:{ imgType: 1 },
      ruleUser: {
        cityDtos: [
          {
            required: true,
            type: "array",
            message: "请选择城市",
            trigger: "change",
            validator: validateRequireArrFn("cityDtos", "城市不能为空")
          }
        ],
        sameCityHighSpeedFeeBasicPrice: [
          {
            required: true,
            trigger: "blur",
            // validator: sameCityHighSpeedFeeBasicPrice
            validator: requiredValidatedFn("上路基价不能为空")
          },
          {
            trigger: "blur",
            validator: validLessThan(999)
          }
        ],
        sameCityHighSpeedFeeEveryMile: [
          {
            required: true,
            trigger: "blur",
            // validator: sameCityHighSpeedFeeEveryMile
            validator: requiredValidatedFn("每公里收费标准不能为空")
          },
           {
            trigger: "blur",
            validator: validLessThan(999)
          }
        ],
        crossCityHighSpeedFeeBasicPrice: [
          {
            required: true,
            trigger: "blur",
            // validator: sameCityHighSpeedFeeEveryMile
            validator: requiredValidatedFn("上路基价不能为空")
          }, {
            trigger: "blur",
            validator: validLessThan(999)
          }
        ],
        crossCityHighSpeedFeeEveryMile: [
          {
            required: true,
            trigger: "blur",
            // validator: sameCityHighSpeedFeeEveryMile
            validator: requiredValidatedFn("每公里收费标准不能为空")
          },
           {
            trigger: "blur",
            validator: validLessThan(999)
          }
        ],
        // otherFeeTimesEveryDay: [
        //   {
        //     required: true,
        //     trigger: "blur",
        //     // validator: sameCityHighSpeedFeeEveryMile
        //     validator: requiredValidatedFn("单日添加次数不能为空")
        //   },
        //    {
        //     trigger: "blur",
        //     validator: validLessThan(10)
        //   }
        // ],
        // otherFeeTotalEveryDay: [
        //   {
        //     required: true,
        //     trigger: "blur",
        //     // validator: sameCityHighSpeedFeeEveryMile
        //     validator: requiredValidatedFn("单日添加总额不能为空")
        //   },
        //   {
        //     trigger: "blur",
        //     validator: validLessThan(999)
        //   }
        // ],
        // otherFeeTotalEveryOrder: [
        //   {
        //     required: true,
        //     trigger: "blur",
        //     // validator: sameCityHighSpeedFeeEveryMile
        //     validator: requiredValidatedFn("单笔订单添加金额不能为空")
        //   },
        //   {
        //     trigger: "blur",
        //     validator: validLessThan(999)
        //   }
        // ],
        roadBridgeFee: [
          {
            required: true,
            trigger: "blur",
            // validator: sameCityHighSpeedFeeEveryMile
            validator: requiredValidatedFn("路桥费不能为空")
          },
          {
            trigger: "blur",
            validator: validLessThan(999)
          }
        ],
        parkCarFeeEveryHour: [
          {
            required: true,
            trigger: "blur",
            // validator: sameCityHighSpeedFeeEveryMile
            validator: requiredValidatedFn("停车费不能为空")
          },{
            trigger: "blur",
            validator: validLessThan(999)
          }
        ],
        attachments: [
          {
            required: true,
            trigger: "blur",
            // validator: sameCityHighSpeedFeeEveryMile
            validator: validateRequireArrAttachmentFn
          }
        ]
      },
      actionUrl: baseUrl + "/route-admin-api/api/v1/file/uploadImage" // 公共文件上传服务
    };
  },
  watch: {
    popView: function(newVal) {
      this.$refs.formValidate.resetFields();
    },
  },
  mounted() {
    let that = this;
    that.calcModalWidth();
    window.onresize = function() {
      that.calcModalWidth();
    };
  },
  methods: {
    getImgObj(res) {
      let fileUrl = {
        id: res.data.fileUuid,
        url: res.data.fileUrl
      };
      this.floatParams.attachments.push(fileUrl);
      // this.attachments.push(fileUrl);
    },
    calcModalWidth() {
      let mapdrapEle = this.$refs.mapmodaledraw;
      if (mapdrapEle == void 0) {
        return false;
      }
      if (document.body.clientWidth <= 1280) {
        mapdrapEle.style.width = 590 + "px";
        mapdrapEle.style.height = 600 + "px";
      } else if (
        document.body.clientWidth > 1281 &&
        document.body.clientWidth <= 1440
      ) {
        mapdrapEle.style.width = 800 + "px";
        mapdrapEle.style.height = 600 + "px";
      } else if (document.body.clientWidth > 1440) {
        mapdrapEle.style.width = 1000 + "px";
        mapdrapEle.style.height = 600 + "px";
        if (document.body.clientHeight < 640) {
          mapdrapEle.style.height = 600 + "px";
        }
      }
    },
    commit(temp) {
      if (typeof temp === "object" && temp.params) {
        temp = temp.params;
      }
      if (temp) {
        this.$refs.formValidate.validate().then(res => {
          if (res) {
            const arr = [];
            const { cityDtos,attachments, ...params } = this.floatParams;
            cityDtos.map(cityCode => {
              const selected = this.cityList.find(i => i.value === cityCode);
              arr.push({
                cityCode: selected.value,
                cityName: selected.city || selected.label
              });
            });
            params.attachments = this.floatParams.attachments.map(pic=>{
              return pic.id
            });
            const pms = JSON.parse(JSON.stringify(params));
            if (this.updateType === 1) {
              pms.cityDtos = arr;
            } else {
              pms.uuid = this.uuid;
            }
            this.save(pms);
          }
        });
      } else {
        this.$emit("on-confirm", false);
      }
    },
    save(data) {
      if (this.updateType === 1) {
        surchargeSave(data)
          .then(res => {
            this.$emit("on-confirm", true);
            this.$Message.success(res.data.msg);
          })
          .catch(err => {});
      } else {
        surchargeUpdate(data)
          .then(res => {
            this.$emit("on-confirm", true);
            this.$Message.success(res.data.msg);
          })
          .catch(err => {});
      }
    },
    selectAll() {
      this.floatParams.cityDtos = this.cityList?.map(it => it.value)
    },
    clearAll() {
      this.floatParams.cityDtos = []
    },
    toNumber(val, key) {
      let v = `${val}`.replace(/[^\d]/g, "");
      this.floatParams[key] = v;
    },
    toDecimal(val, key, digit=2) {
      let v = `${val}`.replace(/[^\d\.]/g, "");
      let vArr = v.split(".");
      if (vArr.length > 2) {
        v = vArr.slice(0, 2).join(".");
      }
      if (vArr[1] && vArr[1].length > digit) {
        v = Number(v).toFixed(digit);
      }
      this.floatParams[key] = v;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.item-field {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  text-align: center;
  width: 200px;
  padding: 0 12px;
  text-align: right;
}

.center {
  text-align: center;
}
.mobile-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.mobile-wrap:last-child {
  margin-bottom: 0;
}

.link-mobile {
  display: block;
  width: 20px;
  height: 22px;
  text-align: center;
}

.real-number {
  width: 200px;
}

.area-number {
  width: 100px;
}

.fonttitle {
  font-size: 14px;
  // margin-bottom: 10px;
}

.fonttitle span:first-child {
  display: inline-block;
  width: 100px;
  text-align: left;
}

.mapchoice {
  color: royalblue;
  text-decoration: underline;
  cursor: pointer;
}

.iptwraper {
  display: inline-block;
}

.elecfencechoice {
  position: relative;
  width: 100%;
  height: 500px;

  .someOptBtn {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .deleteaclear {
      opacity: 0.8;
    }
  }
}

.btndislance {
  margin: 0 15px;
}

.latandlng {
  margin-top: 10px;
  max-width: 300px;
  position: relative;

  .upfonts {
    max-height: 60px;
    overflow-y: scroll;
  }

  .hidethisipt {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    z-index: -1;
  }
}

.shadowFloat {
  position: fixed;
  top: 10%;
  left: 25%;
  padding: 20px;
  width: 1000px;
  height: 600px;
  border-radius: 10px;
  background: #fff;

  .cancenlbtn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}

.navCoordList {
  margin-top: 24px;
  margin-left: -130px;

  .navCoordItem {
    position: relative;

    .ivu-btn {
      position: absolute;
      right: 130px;
      top: 7px;
    }
  }

  .navCoordItem:not(:last-child) .ivu-form-item {
    margin-bottom: 24px;
  }

  .navCoordItem .ivu-form-item + .ivu-form-item {
    margin-top: 24px;
  }

  /deep/ .ivu-form-item-error-tip {
    margin-left: 130px;
  }
}

.ivu-alert.ivu-alert-with-icon {
  margin: 10px 0 0 0;
  width: 300px;
}

// .policemodalstyle{
//     .ivu-form-item{
//         margin-bottom: 10px;
//     }
// }
.popView-body-wrap {
  &::-webkit-scrollbar {
    background-color: transparent;
  }
}
/deep/ .ivu-form-item .ivu-form-item .ivu-form-item-content {
  margin-left: 0 !important;
}
</style>
