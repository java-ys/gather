<template>
  <Modal
    :value="visible"
    :title="modalTitle"
    :loading="modalLoading"
    :width="450"
    @on-cancel="handleCancel"
  >
    <div
      slot="footer"
    >
      <Button
        type="default"
        @click="handleCancel"
      >
        取消
      </Button>
      <Button
        v-if="isEdit"
        type="primary"
        @click="handleSubmit"
      >
        确定
      </Button>
    </div>
    <Form
      ref="form"
      :model="form"
      :rules="rules"
    >
      <FormItem
        prop="cityCode"
        label="城市"
      >
        <Select
          v-if="isEdit"
          v-model="form.cityCode"
          style="width: 300px"
          filterable
          clearable
          :disabled="!!editDetail"
        >
          <Option
            v-for="item in cityList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </Select>
        <div
          v-else
        >
          {{editDetail && editDetail.cityName}}
        </div>
      </FormItem>
      <FormItem
        label="车型等级展示顺序"
      >
        <span>城市无XX车型的情况下，前端自动跳过不展示该车型</span>
        <div
          class="drag-content"
        >
          <div
            v-for="(item, index) in carList"
            :key="index"
            class="drag-list"
            :draggable="isEdit"
            @dragstart="handleDragStart(index)"
            @dragover="handleDragOver"
            @drop="handleDrop(index)"
          >
            <span>{{item|filterBusinessGrade}}</span>
            <Icon
              v-if="isEdit"
              type="ios-menu"
            />
          </div>
        </div>
      </FormItem>
    </Form>
    <Spin
      v-if="modalLoading"
      fix
    />
  </Modal>
</template>
<script>

export default {
  filters: {
    filterBusinessGrade(item) {
      if (item.expandBizLineDesc) {
        return `${item.expandBizLineDesc}·${item.businessCodeDesc}·${item.gradeDesc}`
      }
      return `${item.businessCodeDesc}·${item.gradeDesc}`
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modalLoading: {
      type: Boolean,
      default: false
    },
    cityList: {
      type: Array,
      default: () => []
    },
    carList: {
      type: Array,
      default: () => []
    },
    btnLoading: {
      type: Boolean,
      default: false
    },
    editDetail: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        cityCode: ""
      },
      rules: {
        cityCode: [
          {
            required: true,
            message: "请选择城市"
          }
        ]
      },
      dragStartIdx: 0,
    }
  },
  computed: {
    modalTitle() {
      if (this.isEdit) {
        return this.editDetail ? "编辑策略" : "新建策略"
      }
      return "查看策略"
    }
  },
  watch: {
    editDetail: {
      handler(val) {
        if (val) {
          this.form.cityCode = val.cityCode
        }
      },
      immediate: true
    },
    visible(val, oldVal) {
      if (!oldVal && val) {
        this.form.cityCode = ""
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    handleDragStart(index) {
      this.dragStartIdx = index
    },
    handleDragOver(e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
    },
    handleDrop(index) {
      const dragItem = this.carList.splice(this.dragStartIdx, 1)[0]
      this.carList.splice(index, 0, dragItem)
      this.carList.forEach((item, idx) => {
        item.sort = idx
      })
    },
    handleCancel() {
      this.$emit("close")
    },
    getCityNameByCode(cityCode) {
      return this.cityList.filter(item => cityCode === item.value)[0].label
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit("submit", {
            ...(this.editDetail || {}),
            cityCode: this.form.cityCode,
            businessGradeDto: this.carList
          })
        }
      })
    },
  }
}
</script>

<style scoped lang="less">
.drag-content {
  width: 100%;
  display: inline-block;
  padding-top: 15px;
}

.drag-list {
  display: flex;
  margin-bottom: 10px;
  width: 400px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid #dadada;

  span {
    flex: 1;
  }
}
</style>
