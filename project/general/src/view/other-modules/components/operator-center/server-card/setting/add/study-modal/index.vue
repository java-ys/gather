<template>
 <div>
    <Modal
      v-model="isShow"
      :width="800"
      title="添加学习任务"
      class="new-ue"
      :mask-closable="false"
      @on-cancel="$emit('close')"
    >
      <div class="modal-content">
        <SearchList
          :inputList="inputList"
          @on-search="queryData"
          @on-reset="queryData"
        />
        <m2-table
          ref="studyModal"
          :height="530"
          :isLoading="isLoading"
          :total="pageObj.total"
          :current="pageObj.current"
          :pageSize="pageObj.pageSize"
          :parColumns="parColumns"
          :parTableData="tableData"
          @changePage="changePage"
          @changePageSize="changePageSize"
          @selectHandle="selectHandle">
        </m2-table>
      </div>
      <div slot="footer">
        <Button @click="cancelFun">取消</Button>
        <Button
          type="primary"
          @click="selectSubmit()"
        >确定
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { cacheData } from "./fields";
import m2Table from "_a/m2-table/v-table";
import s from "_o/api/study-exam";
// s.studyList
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    limitNumber: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      isShow: this.show,
      ...cacheData,
      isLoading: true
    };
  },
  components: {
    m2Table
  },
  mounted() {
    this.getList();
  },
  beforeDestroy() {
    this.cancelFun();
  },
  methods: {
    // 条件搜索后回调方法
    queryData(data) {
      // 点击查询
      this.pageObj.current = 1;
      this.searchData = data
      this.getList();
    },
    getList() {
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current,
        publishStatus: "2",
        ...this.searchData
      };
      this.isLoading = true
      s.studyList(params).then(res => {
        this.isLoading = false
        let data = res.data.data ||{};
        this.tableData = data.list || [];
        this.pageObj.total = data.totalCount || 0;

        //选中状态
        let selectedHash = {};
        this.selectedList.forEach(item => {
          selectedHash[item.id] = true;
        });
        let isFull = this.selectedList.length >= this.limitNumber;
        this.tableData.forEach(item => {
          item._checked = false;
          item._disabled = false;
          if (selectedHash[item.id]) {
            item._checked = true;
          } else {
            if (isFull) {
              item._disabled = true;
            }
          }
        });
      }).catch(err=>{
        this.isLoading = false
      })
    },
    changePage: function(val) {
      this.pageObj.current = val;
      this.getList();
    },
    changePageSize: function(val) {
      this.current = 1
      this.pageObj.pageSize = val;
      this.getList();
    },
    selectHandle(list) {
      // list返回为本页面选中条数，所以selectedList中要过滤掉本页数据，方便push
      this.tableData.forEach(item => {
        this.selectedList.forEach((sub, index) => {
          item.id === sub.id && this.selectedList.splice(index, 1);
        });
      });
      let len = this.selectedList.length;
      let addLen = list.length;

      let listHash = {};
      if (len + addLen < this.limitNumber) {
        list.forEach(item => {
          this.selectedList.push(item);
          listHash[item.id] = true;
        });
        // return false
        this.tableData.forEach(item => {
          item._checked = false;
          item._disabled = false;
          if (listHash[item.id]) item._checked = true;
        });
      } else {
        for (let val of list) {
          if (this.selectedList.length < this.limitNumber) {
            this.selectedList.push(val);
            listHash[val.id] = true;
          } else {
            let num = this.limitNumber;
            this.$Message.warning("最多选择" + num + "条");
            break;
          }
        }
        this.tableData.forEach(item => {
          item._checked = false;
          item._disabled = false;
          if (listHash[item.id]) item._checked = true;
          else item._disabled = true;
        });
      }
      this.tableData.splice(0, 1, this.tableData[0]);
    },
    cancelFun() {
      this.$emit("close");
      this.selectedList.splice(0, this.selectedList.length);
      this.$refs.studyModal.handelSelectAll(false);
      this.tableData.splice(0, this.tableData.length);
      this.pageObj.current = 1;
      this.pageObj.total = 0;
      this.pageObj.pageSize = 10;
      this.searchData = {}
    },
    selectSubmit() {
      let params = [...this.selectedList];
      params = params.map(v=>{
        return {
          learningTaskName: v.learningTaskName,
          id: v.id,
          taskType: 1
        }
      })
      this.$emit("selectDown", params);
      this.$emit("close");
    }
  },
  watch: {
    show(newVal) {
      this.isShow = this.show;
      if (newVal) {
        this.selectedList = [...this.list];
        let selectedHash = {};
        this.selectedList.forEach(item => {
          selectedHash[item.id] = true;
        });
        this.getList();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.modal-foot {
  min-height: 45px;
  padding-top: 15px;
  border-top: 1px solid #e8eaec;
}
</style>
