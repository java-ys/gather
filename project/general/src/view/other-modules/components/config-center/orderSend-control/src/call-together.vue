<template>
  <div class="call-together">
    <Form
      ref="addTemplate"
      label-position="left"
      :model="addParams"
      :rules="rules"
    >
      <span class="title">
        同时呼叫派单策略
      </span>
      <FormItem
        label=""
        prop="time"
      >
        <span>同时呼叫及第三方渠道车辆的情况下，优先向T3派单，</span>
        <div class="item">
          <Input
            v-model="addParams.time"
            placeholder="请输入时间"
            style="width: 50px"
          ></Input
          ><span>秒内未成功派单，再向第三方渠道派单。</span>
        </div>
      </FormItem>
    </Form>
    <Button
      v-hasAuth="'call-together-add'"
      type="primary"
      class="button"
      @click="success"
    >
      完成
    </Button>
  </div>
</template>

<script>
import { priorityTimeDetail, priorityTimeEdit, priorityTimeSave } from "_o/api/callTogether/index.js";
const get = (p, o, d) => (!Array.isArray(p)
  ? p.replace(/\[/g, ".").replace(/\]/g, "").split(".")
  : p
).reduce((xs, x) => (xs && xs[x] ? xs[x] : d), o);
export default {
  name: "call-together",
  data() {
    return {
      addParams: {
        time: ""
      },
      rules: {
        time: [
          {
            required: true,
            message: "仅限输入大于0的整数",
            pattern: /(^[1-9]{1}[0-9]*$)/
          }
        ]
      },
      uuid: ""
    };
  },
  mounted() {
    this.queryTime();
  },
  methods: {
    success() {
      this.$refs["addTemplate"].validate(valid => {
        if (valid) {
          if (this.uuid === "") {
            this.save();
          } else {
            this.edit();
          }
        }
      });
    },
    queryTime() {
      priorityTimeDetail({})
        .then(res => {
          if (res.data.success) {
            this.addParams.time = get("data.sameTimeCallsecond", res.data, "");
            this.uuid = get("data.uuid", res.data, "");
          } else {
            this.uuid = "";
            this.addParams.time = "";
          }
        })
        .catch(reason => {
          this.addParams.time = "";
        });
    },
    edit() {
      if (!this.uuid) return;
      priorityTimeEdit({
        uuid: this.uuid,
        sameTimeCallsecond: this.addParams.time
      })
        .then(res => {
          this.$Message.success("编辑成功");
          this.queryTime();
        })
        .catch(reason => {});
    },
    save() {
      priorityTimeSave({
        sameTimeCallsecond: this.addParams.time
      })
        .then(res => {
          this.$Message.success("编辑成功");
          this.queryTime();
        })
        .catch(reason => {});
    }
  }
};
</script>

<style scoped lang="less">
.call-together {
  width: 460px;
  height: 200px;
  border: 1px solid #dddd;
  padding: 10px;
  border-radius: 5px;
  .title {
    font-size: 22px;
  }
  .item {
    display: inline-block;
  }
  .button {
    float: right;
    margin-right: 10px;
  }
  div,
  span {
    font-size: 18px;
  }
}
</style>
