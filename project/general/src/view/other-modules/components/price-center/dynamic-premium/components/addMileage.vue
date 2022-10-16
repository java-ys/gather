<template>
  <Modal
    v-model="showModal"
    :title="title"
    width="400px"
    class-name="vertical-center-modal"
  >
    <div>
      <div>请按顺序填写里程节点</div>
      <Form
        ref="formDynamic"
        :model="formDynamic"
        :label-width="130"
        style="width: 300px;margin-top:15px"
      >
        <FormItem
          v-for="(item, index) in formDynamic.items"
          :key="index"
          :label="'节点 ' + (index + 1) + '(公里)'"
          :prop="'items.' + index + '.value'"
          :rules="rulesChecked"
        >
          <Row>
            <Col span="18">
              <Input
                type="text"
                v-model="item.value"
                placeholder="请输入"
                :maxlength="12"
              ></Input>
            </Col>
            <Col span="4" offset="1">
              <Icon
                type="ios-remove-circle-outline"
                size="30"
                style=" cursor: pointer"
                color="red"
                @click="handleRemove(index)"
              />
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col span="12">
              <Button type="dashed" @click="handleAdd" icon="md-add"
                >添加里程节点</Button
              >
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button @click="showModal = false">取消</Button>
      <Button type="primary" @click="handleSubmit('formDynamic')">保存</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      title: "",
      index: 1,
      formDynamic: {
        items: [
          {
            value: ""
          }
        ]
      },
      rulesChecked: [
        {
          required: true,
          message: "必填",
          trigger: "change"
        },
        {
          pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
          message: "大于0的数字，最多2位小数",
          trigger: "change"
        }
      ],
      indexFlag: ""
    };
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.title = "添加里程节点";
      this.indexFlag = val;
      this.$refs["formDynamic"].resetFields();
      this.formDynamic = {
        items: [
          {
            value: ""
          }
        ]
      };
    },
    edit(val) {
      this.showModal = true;
      this.title = "编辑里程节点";
      this.indexFlag = JSON.parse(JSON.stringify(val));
      this.$refs["formDynamic"].resetFields();
      this.formDynamic = {
        items: [
          {
            value: ""
          }
        ]
      };
      let mileageRules = this.indexFlag.data.mileageRules;
      if (mileageRules.length === 2) {
        this.formDynamic.items[0].value = String(mileageRules[0].mileEnd);
      } else {
        mileageRules.pop();
        this.formDynamic.items = mileageRules.map(item => {
          return { value: String(item.mileEnd) };
        });
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let arr = this.formDynamic.items.map(item => {
            return Number(item.value);
          });
          let status = true;
          // 判断是否由小到大的数据
          for (let i = 0; i < arr.length; i++) {
            if (arr.length > 1) {
              if (arr[i] >= arr[i + 1]) {
                status = false;
              }
            }
          }
          if (!status || arr[0]==0.0 || arr[0]==0.00) {
            this.$Message.error("节点里程数校验不通过，保存失败");
          } else {
            let backData = [];
            if (arr.length === 1) {
              backData.push({ mileStart: 0, mileEnd: arr[0] });
              backData.push({ mileStart: arr[0] });
            } else if (arr.length === 2) {
              backData.push({ mileStart: 0, mileEnd: arr[0] });
              backData.push({ mileStart: arr[0], mileEnd: arr[1] });
              backData.push({ mileStart: arr[1] });
            } else {
              // 重新构造数据
              for (let i = 0; i < arr.length; i++) {
                if (i === 0) {
                  backData.push({ mileStart: 0, mileEnd: arr[0] });
                  backData.push({ mileStart: arr[0], mileEnd: arr[1] });
                } else {
                  if (i === arr.length - 1) {
                    backData.push({ mileStart: arr[i] });
                  } else {
                    backData.push({ mileStart: arr[i], mileEnd: arr[i + 1] });
                  }
                }
              }
            }
            this.$emit("getAddMileage", {
              data: backData,
              indexFlag: this.indexFlag
            });
            this.showModal = false;
          }
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleAdd() {
      if (this.formDynamic.items.length >= 20) {
        this.$Message.warning("最多可添加20个节点");
      } else {
        this.formDynamic.items.push({
          value: ""
        });
      }
    },
    handleRemove(index) {
      this.formDynamic.items.splice(index, 1);
    }
  }
};
</script>

<style>
</style>