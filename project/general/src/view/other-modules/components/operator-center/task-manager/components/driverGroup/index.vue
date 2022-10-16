<template>
  <div v-if="showDriverModal">
    <Modal
      class="driverModal"
      v-model="showDriverModal"
      width="30%"
      footer-hide
      title="司机人群包"
      @on-cancel="cancelFun"
    >
      <div class="modal-content">
        <VTable
          ref="driverGroup"
          :total="pageObj.total"
          :current="pageObj.current"
          :pageSize="pageObj.pageSize"
          :parColumns="parColumns"
          :parTableData="tableData"
          @changePage="changePage"
          @changePageSize="changePageSize"
          @selectHandle="selectHandle"
        />
        <div class="modal-foot">
          <div class="pull-right">
            <Button
              class="right15"
              @click="cancelFun"
            >
              取消
            </Button>
            <Button
              type="primary"
              @click="selectSubmit"
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { cacheData } from "./fields";
import { queryICrowdList } from "_o/api/task-manager";

export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    limitNumber: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      ...cacheData,
      showDriverModal: true
    };
  },
  mounted() {
    this.selectedList = [...this.list];
    let selectedHash = {};
    this.selectedList.forEach(item => {
      selectedHash[item.crowdCode] = true;
    });
    this.getList();
  },
  methods: {
    getList(obj) {
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current,
      };
      if (obj) {
        Object.keys(obj).forEach(key => {
          params[key] = obj[key];
        });
      }
      this.$store.commit("changeLoadingFlag", true);
      queryICrowdList(params).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          this.tableData = data ? data.list : [];
          this.pageObj.total = data ? data.totalCount : 0;

          let selectedHash = {};
          this.selectedList.forEach(item => {
            selectedHash[item.crowdCode] = true;
          });
          let isFull = this.selectedList.length >= this.limitNumber;
          this.tableData.forEach(item => {
            item._checked = false;
            item._disabled = false;
            item.crowdCode = item.crowdCode
            if (selectedHash[item.crowdCode]) {
              item._checked = true;
            } else {
              if (isFull) {
                item._disabled = true;
              }
            }
          });

          this.$store.commit("changeLoadingFlag", false);
        } else {
          this.$Message.error(res.data.msg || "请求异常");
        }
      });
    },
    changePage(val) {
      this.pageObj.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageObj.pageSize = val;
      this.getList();
    },
    selectHandle(list) {
      // list返回为本页面选中条数，所以selectedList中要过滤掉本页数据，方便push
      this.tableData.forEach(item => {
        this.selectedList.forEach((sub, index) => {
          item.crowdCode === sub.crowdCode && this.selectedList.splice(index, 1);
        });
      });
      let len = this.selectedList.length;
      let addLen = list.length;

      let listHash = {};
      if (len + addLen < this.limitNumber) {
        list.forEach(item => {
          this.selectedList.push(item);
          listHash[item.crowdCode] = true;
        });
        // return false
        this.tableData.forEach(item => {
          item._checked = false;
          item._disabled = false;
          if (listHash[item.crowdCode]) item._checked = true;
        });
      } else {
        for (let val of list) {
          if (this.selectedList.length < this.limitNumber) {
            this.selectedList.push(val);
            listHash[val.crowdCode] = true;
          } else {
            let num = this.limitNumber;
            this.$Message.warning("最多选择" + num + "个模板");
            break;
          }
        }
        this.tableData.forEach(item => {
          item._checked = false;
          item._disabled = false;
          if (listHash[item.crowdCode]) item._checked = true;
          else item._disabled = true;
        });
      }
      this.tableData.splice(0, 1, this.tableData[0]);
    },
    cancelFun() {
      this.selectedList.splice(0, this.selectedList.length);
      this.$refs.driverGroup.handelSelectAll(false);
      this.tableData.splice(0, this.tableData.length);
      this.pageObj.current = 1;
      this.pageObj.total = 100;
      this.pageObj.pageSize = 10;
      this.showDriverModal = false
      this.$emit("close");
    },
    selectSubmit() {
      let params = [...this.selectedList];
      this.$emit("selectDown", params);
      this.$emit("close");
    }
  }
};
</script>
<style lang="less" scoped>
.driverModal {
  position: relative;
  z-index: 99999;
}
.modal-foot {
  min-height: 45px;
  padding-top: 15px;
  border-top: 1px solid #e8eaec;
}
</style>
