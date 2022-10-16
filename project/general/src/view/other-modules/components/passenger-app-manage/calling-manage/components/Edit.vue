<template>
  <Form
    v-if="form"
    ref="form"
    :model="form"
    :rules="rules"
  >
    <FormItem
      v-if="visible && !isDefaultConfig"
      label="城市"
      prop="cityCode"
      :label-width="80"
      required
    >
      <Cascader
        v-model="form.cityCode"
        :disabled="readonly || isEdit"
        :data="cityList"
      />
    </FormItem>
    <Divider orientation="left">单车型等级呼叫：</Divider>
    <FormItem
      prop="aloneModelVo"
      :label-width="80"
    >
      <SingleCarType
        v-model="form.aloneModelVo"
        :is-realtime="isRealtime"
        :readonly="readonly"
        :secondCountList="secondCountList"
      >
        <template v-slot:top>
          <TextCombination
            v-model="form.aloneModelVo.webModel"
            :readonly="readonly"
          />
        </template>
        <template v-slot:bottom>
          <TextCombination
            v-model="form.aloneModelVo.changeOverTimeDto.webModel"
            :readonly="readonly"
          />
        </template>
      </SingleCarType>
    </FormItem>
    <Divider orientation="left">多车型等级同时呼叫：</Divider>
    <FormItem
      prop="multipleModelVo"
      :label-width="80"
    >
      <MultipleCarType
        v-model="form.multipleModelVo"
        :is-realtime="isRealtime"
        :readonly="readonly"
        :secondCountList="secondCountList"
      />
    </FormItem>
    <Divider orientation="left">叫车小tip：(配置超过一条时，将进行轮播。最多配置3条。)</Divider>
    <FormItem
      prop="carouselModelVo"
      :label-width="80"
      label=" "
      required
    >
      <Carousel
        v-model="form.carouselModelVo"
        :readonly="readonly"
      />
    </FormItem>
    <Divider orientation="left">追加呼叫：</Divider>
    <FormItem
      prop="additionalModelVo"
      :label-width="80"
    >
      <MultipleCarType
        v-model="form.additionalModelVo"
        :is-realtime="isRealtime"
        :readonly="readonly"
        :secondCountList="secondCountList"
      />
    </FormItem>

    <FormItem
      v-if="!readonly"
      :label-width="80"
    >
      <Button
        :loading="submitLoading"
        type="primary"
        @click="handleSubmit"
      >
        保存
      </Button>
      <Button
        type="default"
        @click="close"
      >
        取消
      </Button>
    </FormItem>
  </Form>
</template>

<script>
import Carousel from "./Carousel"
import SingleCarType from "./SingleCarType"
import MultipleCarType from "./MultipleCarType"
import TextCombination from "./TextCombination"
export default {
  components: {
    Carousel,
    SingleCarType,
    MultipleCarType,
    TextCombination
  },
  props: {
    cityList: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    isDefaultConfig: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    submitLoading: {
      type: Boolean,
      default: false
    },
    webType: {
      type: Number,
      default: 0
    }
  },
  data() {
    const secondCountList = []
    for (let i = 5; i <= 120; i >= 60 ? i += 10 : i += 5) {
      secondCountList.push(i)
    }

    return {
      rules: {
        cityCode: [
          {
            required: true,
            message: "请选择城市"
          },
          {
            validator: (rule, value, callback) => {
              if (!value || !value[1]) {
                callback(new Error("请选择城市"))
              } else {
                callback()
              }
            }
          }
        ],
        aloneModelVo: [
          {
            required: true,
            message: "填写单车型等级呼叫信息"
          },
          {
            validator: (rule, value, callback) => {
              if (!value.webModel.startTip) {
                callback(new Error("单车型等级呼叫: 请输入呼叫提示文本"))
              } else if (value.changeOverTimeDto.changeFlag) {
                if (!value.changeOverTimeDto.webModel.startTip) {
                  callback(new Error("单车型等级呼叫: 请输入随时间变更提示文案"))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        multipleModelVo: [
          {
            validator: (rule, value, callback) => {
              if (!value.webModel.startTip) {
                callback(new Error("多车型等级同时呼叫: 请输入呼叫提示文本"))
              } else if (value.changeOverTimeDto.changeFlag) {
                if (!value.changeOverTimeDto.webModel.startTip) {
                  callback(new Error("多车型等级同时呼叫: 请输入随时间变更提示文案"))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        carouselModelVo: [
          {
            validator: (rule, value, callback) => {
              if (!value[0].startTip) {
                callback(new Error("请输入叫车小Tip"))
              } else {
                callback()
              }
            }
          }
        ],
        additionalModelVo: [
          {
            validator: (rule, value, callback) => {
              if (!value.webModel.startTip) {
                callback(new Error("追加呼叫: 请输入呼叫提示文本"))
              } else if (value.changeOverTimeDto.changeFlag) {
                if (!value.changeOverTimeDto.webModel.startTip) {
                  callback(new Error("追加呼叫: 请输入随时间变更提示文案"))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
      },
      secondCountList,
      form: null,
    }
  },
  computed: {
    isRealtime() {
      return this.webType === 0
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.form = {
            ...val,
            carouselModelVo: !val.carouselModelVo || val.carouselModelVo.length === 0 ? [
              {
                startTip: ""
              }
            ] : val.carouselModelVo,
            multipleModelVo: val.multipleModelVo || {
              webModel: {
                startTip: "正在全力为您呼叫"
              },
              changeOverTimeDto: {
                changeFlag: false,
                secondCount: 15,
                webModel: {
                  startTip: "附近车辆较少,持续呼叫"
                }
              }
            },
            aloneModelVo: val.aloneModelVo || {
              webModel: {
                startTip: "正在全力为您呼叫",
                carLevelFlag: false,
                endTip: "",
              },
              changeOverTimeDto: {
                changeFlag: false,
                secondCount: 15,
                webModel: {
                  startTip: "附近车辆少，持续呼叫",
                  carLevelFlag: false,
                  endTip: "",
                },
              }
            },
            additionalModelVo: val.additionalModelVo || {
              webModel: {
                startTip: "增加更多车型 车辆更快应答",
                carLevelFlag: false,
                endTip: "",
              },
              changeOverTimeDto: {
                changeFlag: false,
                secondCount: 15,
                webModel: {
                  startTip: "附近车辆较少，建议您增加更多车型",
                  carLevelFlag: false,
                  endTip: "",
                },
              }
            },
            cityCode: [`${val.cityCode.substring(0, 3)}000`, val.cityCode]
          }
        } else {
          this.form = {
            cityCode: [],
            aloneModelVo: {
              webModel: {
                startTip: "正在全力为您呼叫",
                carLevelFlag: false,
                endTip: "",
              },
              changeOverTimeDto: {
                changeFlag: false,
                secondCount: 15,
                webModel: {
                  startTip: "附近车辆少，持续呼叫",
                  carLevelFlag: false,
                  endTip: "",
                },
              }
            },
            multipleModelVo: {
              webModel: {
                startTip: "正在全力为您呼叫"
              },
              changeOverTimeDto: {
                changeFlag: false,
                secondCount: 15,
                webModel: {
                  startTip: "附近车辆较少,持续呼叫"
                }
              }
            },
            carouselModelVo: [
              {
                startTip: ""
              }
            ],
            additionalModelVo: {
              webModel: {
                startTip: "增加更多车型 车辆更快应答",
                carLevelFlag: false,
                endTip: "",
              },
              changeOverTimeDto: {
                changeFlag: false,
                secondCount: 15,
                webModel: {
                  startTip: "附近车辆较少，建议您增加更多车型",
                  carLevelFlag: false,
                  endTip: "",
                },
              }
            },
          }
        }
      },
      immediate: true
    },
  },
  methods: {
    handleSubmit() {
      if (this.submitLoading) return
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.form,
            webType: this.webType,
            cityCode: this.form.cityCode[1]
          }
          this.$emit("submit", params)
        }
      })
    },
    close() {
      this.$emit("close")
    }
  },
}
</script>

<style scoped lang="less">

</style>
