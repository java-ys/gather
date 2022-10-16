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

export default {
  name: "list",
  components: { priceLadder },

  props: {
    formDynamic: {
      type: Object,
      default: null
    },
    index: Number,
    flag: {
      type: String,
      default: "normal"
    }
  },
  data() {
    let self = this;
    const validators = {
      // 正数且最多两位小数
      numValidator: (rule, value, callback) => {
        if (value === "") {
          // if (self.flag == "normal") {
          //   callback();
          // } else {
          callback(new Error("必填"));
          // }
        } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
          callback(new Error("正数且最多两位小数"));
        } else {
          callback();
        }
      }
    };
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
          label: "公里以上"
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
                    width: "100px",
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
        params.column.status === 0
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
                          // if (self.flag == "normal") {
                          //   callback();
                          // } else {
                          callback(new Error("必填"));
                          // }
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
                    width: "100px"
                  },
                  props: {
                    size: "small",
                    value: params.column.max
                  },
                  on: {
                    "on-change": e => {
                      params.column.max = e.target.value;
                      context.strategy.eventEmitterInstance.trigger(
                        "update",
                        params.index,
                        context.index,
                        context.flag,
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
                "单价（元/公里）："
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
                    prop: `column.${params.index}.value`,
                    rules: [
                      { validator: validators.numValidator, trigger: "blur" }
                    ]
                  }
                },
                [
                  h("Input", {
                    style: {
                      width: "100px",
                      marginRight: "30px"
                    },
                    props: {
                      size: "small",
                      value: params.column.value
                    },
                    on: {
                      "on-change": e =>
                        (params.column.value = e.target.value)
                    }
                  })
                ]
              )
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
  inject: ["strategy"],

  mounted() {
    this.refValue = this.$refs.myRef;
  },
  methods: {
    async addType() {
      await this.refValue.validate(async valid => {
        if (valid) {
          await this.strategy.addTypeItem(this.index, this.flag);
        } else {
          this.$Message.error("表单校验失败");
        }
      });
    },

    async delType(i) {
      await this.strategy.delTypeItem(i, this.index, this.flag);
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
