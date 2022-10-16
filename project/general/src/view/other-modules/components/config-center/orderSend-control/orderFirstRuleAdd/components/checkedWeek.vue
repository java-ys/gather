<template>
  <Modal
    v-model="showWeekModal"
    title="添加星期值"
    width="400px"
    :z-index="1"
    class-name="vertical-center-modal"
  >
    <div>
      <Checkbox
        v-model="checkedAllWeekStatus"
        class="mb-15"
        @on-change="checkedAllWeek"
      >
        全选
      </Checkbox>
      <br />
      <CheckboxGroup v-model="modalWeek" @on-change="onChangeWeek">
        <Checkbox label="1" class="mb-15" :disabled="getWeekItemStatus(1)">
          星期一
        </Checkbox>
        <br />
        <Checkbox label="2" class="mb-15" :disabled="getWeekItemStatus(2)">
          星期二
        </Checkbox>
        <br />
        <Checkbox label="3" class="mb-15" :disabled="getWeekItemStatus(3)">
          星期三
        </Checkbox>
        <br />
        <Checkbox label="4" class="mb-15" :disabled="getWeekItemStatus(4)">
          星期四
        </Checkbox>
        <br />
        <Checkbox label="5" class="mb-15" :disabled="getWeekItemStatus(5)">
          星期五
        </Checkbox>
        <br />
        <Checkbox label="6" class="mb-15" :disabled="getWeekItemStatus(6)">
          星期六
        </Checkbox>
        <br />
        <Checkbox label="7" :disabled="getWeekItemStatus(7)">星期日</Checkbox>
      </CheckboxGroup>
    </div>
    <div slot="footer">
      <Button @click="showWeekModal = false">取消</Button>
      <Button v-lazy-click="saveWeek" type="primary">保存</Button>
    </div>
  </Modal>
</template>

<script>
import { getWeekName } from "../fields";

export default {
  data() {
    return {
      showWeekModal: false,
      checkedAllWeekStatus: false,
      dataSource: [],
      modalWeek: [],
      isEdit: false,
      editData: [],
      editIndex: 0,
      index: 0,
    };
  },
  methods: {
    addWeek(val) {
      this.index = val.index;
      this.showWeekModal = true;
      this.isEdit = false;
      this.modalWeek = [];
      this.checkedAllWeekStatus = false;
      this.dataSource = JSON.parse(JSON.stringify(val.weekFormData));
    },
    // 编辑星期
    getEditWeek(val) {
      const { currentData, dataSource } = val
      this.isEdit = true;
      this.showWeekModal = true;
      this.modalWeek = JSON.parse(JSON.stringify(currentData));
      this.editData = JSON.parse(JSON.stringify(currentData));
      this.dataSource = JSON.parse(JSON.stringify(dataSource));
      this.index = val.index;
      this.editIndex = val.editIndex;
      this.checkedAllWeekStatus = false;
    },
    onChangeWeek(val) {},
    checkedAllWeek(val) {
      // 判断全选
      if (val) {
        this.modalWeek = ["1", "2", "3", "4", "5", "6", "7"];
        let arr = [];
        if (this.dataSource) {
          // 编辑
          if (this.isEdit) {
            // 不能选已经选过的
            this.dataSource.forEach((item, index) => {
              if (index === this.editIndex) {
              } else {
                item.weekList.forEach(yItem => {
                  arr.push(yItem);
                });
              }
            });
            this.modalWeek = this.modalWeek.filter(item => !arr.some(e => e == item));
          }
          // 新增
          else {
            this.dataSource.forEach(item => {
              item.weekList.forEach(yItem => {
                arr.push(yItem);
              });
            });
            this.modalWeek = this.modalWeek.filter(item => !arr.some(e => e == item));
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
            item.weekList.forEach(yItem => {
              if (yItem === val || Number(yItem) === val) {
                status = true;
              }
            });
          });
          this.editData.forEach(item => {
            if (item === val || Number(item) === val) {
              status = false;
            }
          });
        }
      } else {
        if (this.dataSource && this.dataSource.length > 0) {
          this.dataSource.forEach(item => {
            item.weekList.forEach(yItem => {
              if (yItem === val || Number(yItem) === val) {
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
        this.$Message.warning("请选择星期值");
      } else {
        this.showWeekModal = false;
        let data = [];
        let dataName = "";
        this.modalWeek.forEach(item => {
          data.push(item);
        });
        data.sort();
        data.forEach(item => {
          if (dataName) {
            dataName = dataName + "、" + getWeekName(item);
          } else {
            dataName = getWeekName(item);
          }
        });
        if (this.isEdit) {
          this.dataSource[this.editIndex].weekList = data;
          this.dataSource[this.editIndex].weekName = dataName;
        } else {
          this.dataSource.push({
            weekList: data,
            weekName: dataName,
            isChecked: false,
            timeDtoList: []
          });
        }
        this.$emit("getWeekData", {
          dataSource: this.dataSource,
          index: this.index
        });
      }
    }
  }
};
</script>

<style scoped>
.mb-15 {
  margin-bottom: 15px;
}
</style>