<template>
  <div class="price-ladder">
    <priceLadder
      v-for="(item, key) in formDynamic.column"
      :key="key"
      :render="render"
      :index="key"
      :column="item"
    >
      <template v-slot="{ index }">
        <Button
          v-if="!!index"
          size="small"
          type="error"
          @click="delType(index)"
        >
          删除
        </Button>
        <Button
          v-else
          size="small"
          :disabled="
            !!formDynamic.column[formDynamic.column.length - 1].status ||
              formDynamic.column.length === maxPriceladder
          "
          @click="addType"
        >
          添加
        </Button>
      </template>
    </priceLadder>
  </div>
</template>
<script>
import priceLadder from "../render";
import { eventEmitter } from "../utils";
const validators = {
  // 正数且最多两位小数
  numValidator: (rule, value, callback) => {
    if (value === "") {
      callback(new Error("必填"));
    } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
      callback(new Error("正数且最多两位小数"));
    } else {
      callback();
    }
  },
  radioValidator: (rule, value, callback) => {
    if (value === "") {
      callback(new Error("必填"));
    } else if (!/^(?:0|[1-9][0-9]?|100)$/.test(value)) {
      callback("0-100之间的整数");
    } else {
      callback();
    }
  }
};

export default {
  name: "list",
  components: { priceLadder },

  props: {
    formDynamic: {
      type: Object,
      default: function() {
        return {
          column: [
            {
              max: "",
              min: 0,
              status: 0,
              type: 0,
              fixModel: "",
              ExtraRatio: ""
            }
          ]
        };
      }
    },
    eventEmitterInstance: {
      validator: function(value) {
        return value instanceof eventEmitter;
      }
    }
  },
  data() {
    return {
      maxPriceladder: 5, // 最多可建立最多5个阶梯单价
      refValue: null, // 组件挂在后保存form的ref实例
      slectStatus: [
        {
          value: 0,
          label: "至"
        },
        {
          value: 1,
          label: "元以上"
        }
      ],
      slectType: [
        {
          value: 0,
          label: "固定金额"
        },
        {
          value: 1,
          label: "固定比例"
        },
        {
          value: 2,
          label: "固定金额 + 固定比例"
        }
      ],
      render: (h, params, scopedSlots) => {
        let childVnode = [];
        const context = this;
        childVnode = childVnode.concat([
          h(
            "span",
            {
              style: {
                display: "inline-block",
                textAlign: "left"
              }
            },
            `抽成基数阶梯${params.index + 1}：`
          ),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                minWidth: "15px",
                textAlign: "left"
              }
            },
            params.column.min
          ),
          h(
            "FormItem",
            {
              style: {
                display: "inline-block",
                verticalAlign: "baseline"
              },
              props: {
                // label: params.column.univalence,
                // required: true,
                // prop: `column.${params.index}.status`,
                // rules: [{ required: true, type: 'string', message: '必填', trigger: 'blur' }]
              }
            },
            [
              h(
                "Select",
                {
                  props: {
                    size: "small",
                    value: params.column.status
                  },
                  style: {
                    width: "75px",
                    margin: "0 10px"
                  },
                  on: {
                    "on-change": e => {
                      params.column.status = e;
                    }
                  }
                },
                this.slectStatus.map(item => {
                  return h(
                    "Option",
                    {
                      style: {},
                      props: {
                        value: item.value,
                        disabled: params.index + 1 >= this.maxPriceladder
                      }
                    },
                    item.label
                  );
                })
              )
            ]
          )
        ]);

        if (
          params.index + 1 < this.maxPriceladder &&
          Number(params.column.status) === 0
        ) {
          childVnode.push(
            h(
              "FormItem",
              {
                style: {
                  display: params.column.status ? "none" : "inline-block",
                  verticalAlign: "baseline"
                },
                props: {
                  // label: params.column.univalence,
                  prop: `column.${params.index}.max`,
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        if (value === "") {
                          if (self.flag == "normal") {
                            callback();
                          } else {
                            callback(new Error("必填"));
                          }
                        } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
                          callback(new Error("正数且最多两位小数"));
                        } else if (Number(value) <= Number(params.column.min)) {
                          callback(new Error("区间最大值应大于最小值"));
                        } else {
                          callback();
                        }
                      },
                      trigger: "blur"
                    }
                  ]
                },
                refs: "FormItem"
              },
              [
                h("Input", {
                  style: {
                    width: "50px"
                  },
                  props: {
                    size: "small",
                    value: params.column.max
                  },
                  on: {
                    "on-change": e => {
                      params.column.max = e.target.value;
                      context.eventEmitterInstance.trigger(
                        "update",
                        params.index,
                        e.target.value
                      );
                    }
                  }
                })
              ]
            )
          );
        }

        childVnode.push(
          h(
            "div",
            {
              style: {
                display: "inline-block"
              },
              props: {}
            },
            [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    marginLeft: "20px"
                  },
                  class: "span-label"
                },
                "抽成方式："
              ),
              h(
                "FormItem",
                {
                  style: {
                    display: "inline-block",
                    verticalAlign: "baseline"
                  },
                  props: {
                    // label: params.column.univalence,
                    // required: true,
                    // prop: `column.${params.index}.type`,
                    // rules: [{ required: true, message: '必填', trigger: 'blur' }]
                  }
                },
                [
                  h(
                    "Select",
                    {
                      props: {
                        size: "small",
                        value: params.column.type
                      },
                      style: {
                        width: "100px",
                        margin: "0 10px"
                      },
                      on: {
                        "on-change": e => {
                          params.column.type = e;
                        }
                      }
                    },
                    this.slectType.map(item => {
                      return h(
                        "Option",
                        {
                          style: {},
                          props: {
                            value: item.value,
                            disabled: params.index + 1 >= this.maxPriceladder
                          }
                        },
                        item.label
                      );
                    })
                  )
                ]
              )
            ]
          )
        );
        let child = [];
        if (Number(params.column.type) !== 1) {
          child.push(
            h(
              "FormItem",
              {
                style: {
                  verticalAlign: "baseline",
                  marginRight: "10px",
                  display: "inline-block"
                },
                props: {
                  // label: params.column.univalence,
                  prop: `column.${params.index}.fixModel`,
                  rules: [
                    { validator: validators.numValidator, trigger: "blur" }
                  ]
                },
                refs: "FormItem"
              },
              [
                h("Input", {
                  style: {
                    width: "50px"
                  },
                  props: {
                    size: "small",
                    value: params.column.fixModel
                  },
                  on: {
                    "on-change": e => (params.column.fixModel = e.target.value)
                  }
                }),
                <span>元</span>
              ]
            )
          );
        }
        if (Number(params.column.type) !== 0) {
          child.push(
            h(
              "FormItem",
              {
                style: {
                  verticalAlign: "baseline",
                  marginRight: "10px",
                  display: "inline-block"
                },
                props: {
                  // label: params.column.univalence,
                  prop: `column.${params.index}.ExtraRatio`,
                  rules: [
                    { validator: validators.radioValidator, trigger: "blur" }
                  ]
                },
                refs: "FormItem"
              },
              [
                h("Input", {
                  style: {
                    width: "50px"
                  },
                  props: {
                    size: "small",
                    value: params.column.ExtraRatio
                  },
                  on: {
                    "on-change": e =>
                      (params.column.ExtraRatio = e.target.value)
                  }
                }),
                <span>%</span>
              ]
            )
          );
        }
        childVnode.push(
          h(
            "div",
            {
              style: {
                display: "inline-block"
              }
            },
            [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    marginLeft: "20px"
                  },
                  class: "span-label"
                },
                "抽成标准："
              ),
              ...child
            ]
          )
        );

        childVnode.push(scopedSlots.default({ index: params.index }));

        return h(
          "Form",
          {
            style: {
              // display: 'inline-block'
            },
            props: {
              model: this.formDynamic
            },
            ref: "myRef"
          },
          childVnode
        );
      }
    };
  },
  mounted() {
    this.refValue = this.$refs.myRef;
  },
  methods: {
    async addType() {
      let context = this;
      await this.refValue.validate(async valid => {
        if (valid) {
          await context.$emit("addTypeItem");
        } else {
        }
      });
    },

    async delType(i) {
      await this.$emit("delTypeItem", i);
    }
  }
};
</script>
<style lang="less" scoped>
.span-label:before {
  content: "*";
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
  color: #ed4014;
}
</style>
