<template>
  <Modal v-model="showModal" :title="title" width="380px" :z-index="1">
    <Form
      inline="inline"
      :model="formData"
      :label-width="85"
      :rules="formValidate"
      ref="form"
    >
      <FormItem label="" prop="ruleName">
        <draggable @change="log" :list="countArr">
          <div v-for="(item, index) in countArr" :key="index" class="fl">
            <input v-model="countArr[index].name" type="text" :maxlength="6" />
            <div class="close" @click="handleClose2(item)">x</div>
          </div>
        </draggable>
        <Button
          icon="ios-add"
          type="dashed"
          size="large"
          @click="handleAdd"
          style="width:134px"
          >添加标签</Button
        >
      </FormItem>
      <br />
    </Form>
    <div slot="footer">
      <Button @click="showModal = false">取消</Button>
      <Button type="primary" v-lazy-click="saveData">保存</Button>
    </div>
  </Modal>
</template>

<script>
import draggable from "vuedraggable";
import { validatorTime } from "./fields";
import {
  feedbackTag,
  feedbackTagAdd,
  feedbackTagDelete
} from "_o/api/userStudy";
export default {
  name: "add",
  components: {
    draggable
  },
  data() {
    let self = this;
    return {
      showModal: false,
      title: "",
      countArr: [],
      formData: {},
      formValidate: {},
      type: ""
    };
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.type = val;
      if (val === 1) {
        this.title = "业务标签";
      } else {
        this.title = "问题标签";
      }
      // 查询标签数据
      feedbackTag({ type: this.type }).then(res => {
        let data = res.data.data || {};
        this.countArr = data;
      });
    },
    saveData() {
      let status = true;
      this.countArr.forEach(item => {
        if (!item.name) {
          status = false;
        }
      });
      if (status) {
        this.submit();
      } else {
        this.$Message.warning("标签信息填写不完整");
      }
    },
    log: function(evt) {
      if (evt.added) {
        this.count += 1;
        const item = evt.added.element;
        const idx = this.count.findIndex(e => e.name === item.name);
        let temp = JSON.parse(JSON.stringify(this.countArr));
        temp[idx].id = this.count;
        this.countArr = temp;
      }
    },
    handleAdd(val) {
      this.countArr.push({
        name: "",
        tagType: this.type
      });
    },
    handleClose2(val) {
      if (this.countArr.length <= 1) {
        this.$Message.warning("至少需要存在一个标签");
      } else {
        const index = this.countArr.indexOf(val.name);
        this.countArr.splice(index, 1);
      }
    },
    submit() {
      // 新增
      feedbackTagAdd({ type: this.type, tags: this.countArr }).then(res => {
        this.showModal = false;
      });
    }
  }
};
</script>
<style lang="less" scoped>
input {
  border: none;
  margin: 0;
  background: #f7f7f7;
  border: 1px solid #e8eaec;
  color: #515a6e;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 20px;
}
.fl {
  display: flex;
  position: relative;
  .close {
    position: absolute;
    right: 10px;
    top: -1px;
    font-size: 14px;
    color: #515a6e;
    cursor: pointer;
  }
}
</style>
