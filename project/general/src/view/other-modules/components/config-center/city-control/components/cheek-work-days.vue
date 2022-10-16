<template>
  <Modal
    v-model="showWeekModal"
    :title="modalTitle"
    :width="isWeek ? 400 : 800"
    class-name="cheek-week-modal"
  >
    <div>
      <div>
        <Checkbox
          v-model="checkedAllWeekStatus"
          class="mb-15"
          @on-change="checkedAllWeek"
        >全选</Checkbox>
      </div>
      <!-- 星期 -->
      <CheckboxGroup v-if="isWeek" v-model="modalWeek" @on-change="onChangeWeek">
        <div v-for="item in dataList" :key="item.value">
          <Checkbox :label="item.value" class="mb-15" :disabled="getWeekItemStatus(item.value)">{{item.label}}</Checkbox>
        </div>
      </CheckboxGroup>
    </div>
    <div slot="footer">
      <Button @click="showWeekModal = false">取消</Button>
      <Button v-lazy-click="saveWeek" type="primary">保存</Button>
    </div>
  </Modal>
</template>

<script>
const weekData = [
  {
    value: 1,
    label: "工作日",
    name: 1
  },
  {
    value: 2,
    label: "节假日",
    name: 2
  },
]
let weekMap = {}
weekData.forEach(w => {
  weekMap[w.value] = w.name
})

export default {
  props: {
    type: {
      default: "1"
    }
  },
  data() {
    return {
      showWeekModal: false,
      checkedAllWeekStatus: false,
      dataSource: [],
      modalWeek: [],
      isEdit: false,
      editData: [],
      editIndex: 0
    };
  },
  computed: {
    isWeek() {
      return this.type === "1"
    },
    modalTitle() {
      return "添加重复规则"
    },
    dataList() {
      return weekData
    },
    dataMap() {
      return weekMap
    }
  },
  methods: {
    addWeek(val) {
      this.showWeekModal = true;
      this.isEdit = false;
      this.modalWeek = [];
      this.checkedAllWeekStatus = false;
      this.dataSource = JSON.parse(JSON.stringify(val));
    },
    // 编辑星期
    getEditWeek(val) {
      this.isEdit = true;
      this.showWeekModal = true;
      this.modalWeek = JSON.parse(JSON.stringify(val.currentData));
      this.editData = JSON.parse(JSON.stringify(val.currentData));
      this.dataSource = JSON.parse(JSON.stringify(val.dataSource));
      this.editIndex = val.index;
      this.checkedAllWeekStatus = false;
    },
    onChangeWeek(val) {},
    checkedAllWeek(val) {
      // 判断全选
      if (val) {
        this.modalWeek = this.dataList.map(d => d.value);
        let arr = [];
        if (this.dataSource) {
          // 编辑
          if (this.isEdit) {
            // 不能选已经选过的
            this.dataSource.forEach((item, index) => {
              if (index === this.editIndex) {
                // todo
              } else {
                item.circulateTimes.forEach(yItem => {
                  arr.push(yItem);
                });
              }
            });
            this.modalWeek = this.modalWeek.filter(item => !arr.some(e => e === item));
          }
          // 新增
          else {
            this.dataSource.forEach(item => {
              item.circulateTimes.forEach(yItem => {
                arr.push(yItem);
              });
            });
            this.modalWeek = this.modalWeek.filter(item => !arr.some(e => e === item));
          }
        }
      } else {
        this.modalWeek = [];
      }
    },
    getWeekItemStatus(val) {
      let status = false;
      // 如果是编辑进来 解除限制
      if (this.isEdit) {
        if (this.dataSource && this.dataSource.length > 0) {
          this.dataSource.forEach(item => {
            item.circulateTimes.forEach(yItem => {
              if (yItem === val) {
                status = true;
              }
            });
          });
          this.editData.forEach(item => {
            if (item === val) {
              status = false;
            }
          });
        }
      } else {
        if (this.dataSource && this.dataSource.length > 0) {
          this.dataSource.forEach(item => {
            item.circulateTimes.forEach(yItem => {
              if (yItem === val) {
                status = true;
              }
            });
          });
        }
      }
      return status;
    },
    saveWeek() {
      if (this.modalWeek.length === 0) {
        this.$Message.warning(`请${this.modalTitle}`);
      } else {
        this.showWeekModal = false;
        let data = [];
        this.modalWeek.forEach(item => {
          data.push(item);
        });
        data.sort();
        if (this.isEdit) {
          this.dataSource[this.editIndex].circulateTimes = data;
        } else {
          this.dataSource.push({
            circulateTimes: data,
            isChecked: false,
          });
        }
        console.log(this.dataSource)

        this.$emit("getWeekData", this.dataSource);
      }
    }
  }
};
</script>

<style scoped lang="less">
.mb-15 {
  margin-bottom: 15px;
}
.cheek-week-modal{
  z-index:1299
}
.inline-check{
  display: inline-block;
  width:108px;
  padding:10px 15px 15px 10px;
  margin-right:-1px;
  margin-bottom:-1px;
  border:1px solid #ddd;
  /deep/ .ivu-checkbox-wrapper{
    font-size: 16px;
    font-weight: bold;
  }
  &.disabled{
    background:#f3f3f3;
  }
  &.checked{
    background:#d7eff9;
  }
}
</style>