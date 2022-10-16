<template>
  <div class="modal-content">
    <SearchList
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    />
    <VTable
      ref="userGroup"
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
        <Button class="right15" @click="cancelFun">
          取消
        </Button>
        <Button type="primary" @click="selectSubmit">
          确定
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
import { cacheData } from "./fields";
import { axiosNewUserGroupScenceList } from "_o/api/market";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
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
      ...cacheData
    };
  },
  watch: {
    isShow(newVal) {
      if (newVal) {
        this.selectedList = [...this.list];
        let selectedHash = {};
        this.selectedList.forEach(item => {
          selectedHash[item.uuid] = true;
        });
        // let isFull = this.selectedList.length>=this.limitNumber
        this.getList();
      }
    }
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
      for (let key in this.searchData) {
        delete this.searchData[key];
      }
      for (let key in data) {
        this.searchData[key] = data[key];
      }
      this.getList(data);
    },
    clearQueryData() {
      // 点击清空
      this.pageObj.current = 1;
      for (let key in this.searchData) {
        delete this.searchData[key];
      }
      this.getList();
    },
    getList(obj) {
      let params = {
        pageSize: this.pageObj.pageSize,
        pageNum: this.pageObj.current,
      };
      if (obj) {
        Object.keys(obj).forEach(key => {
          params[key] = obj[key];
        });
      }
      this.$store.commit("changeLoadingFlag", true);
      axiosNewUserGroupScenceList(params).then(res => {
        if (res.data.data.success) {
          let data = res.data.data.data;
          this.tableData = data ? data.list : [];
          this.pageObj.total = data ? data.totalCount : 0;

          let selectedHash = {};
          this.selectedList.forEach(item => {
            selectedHash[item.uuid] = true;
          });
          let isFull = this.selectedList.length >= this.limitNumber;
          this.tableData.forEach(item => {
            item._checked = false;
            item._disabled = false;
            item.uuid = item.uuid
            if (selectedHash[item.uuid]) {
              item._checked = true;
            } else {
              if (isFull) {
                item._disabled = true;
              }
            }
          });

          this.$store.commit("changeLoadingFlag", false);
        } else {
          this.$Message.error(res.data.msg || "服务器请求异常");
        }
      });
    },
    changePage: function(val) {
      this.pageObj.current = val;
      this.getList(this.searchData);
    },
    changePageSize: function(val) {
      this.pageObj.pageSize = val;
      this.getList(this.searchData);
    },
    selectHandle(list) {
      // list返回为本页面选中条数，所以selectedList中要过滤掉本页数据，方便push
      this.tableData.forEach(item => {
        this.selectedList.forEach((sub, index) => {
          item.uuid === sub.uuid && this.selectedList.splice(index, 1);
        });
      });
      let len = this.selectedList.length;
      let addLen = list.length;

      let listHash = {};
      if (len + addLen < this.limitNumber) {
        list.forEach(item => {
          this.selectedList.push(item);
          listHash[item.uuid] = true;
        });
        // return false
        this.tableData.forEach(item => {
          item._checked = false;
          item._disabled = false;
          if (listHash[item.uuid]) item._checked = true;
        });
      } else {
        for (let val of list) {
          if (this.selectedList.length < this.limitNumber) {
            this.selectedList.push(val);
            listHash[val.uuid] = true;
          } else {
            let num = this.limitNumber;
            this.$Message.warning("最多选择" + num + "个模板");
            break;
          }
        }
        this.tableData.forEach(item => {
          item._checked = false;
          item._disabled = false;
          if (listHash[item.uuid]) item._checked = true;
          else item._disabled = true;
        });
      }
      this.tableData.splice(0, 1, this.tableData[0]);
    },
    cancelFun() {
      this.$emit("close");
      this.selectedList.splice(0, this.selectedList.length);
      this.$refs.userGroup.handelSelectAll(false);
      this.tableData.splice(0, this.tableData.length);
      this.pageObj.current = 1;
      this.pageObj.total = 100;
      this.pageObj.pageSize = 10;
      Object.keys(this.searchData).forEach(key => {
        this.searchData[key] = "";
      });
    },
    selectSubmit() {
      let params = [...this.selectedList];
      params.forEach(item=>{
          this.$set(item,'userSubgroupUuid',item.uuid)
      })
      this.$emit("selectDown", params);
      this.$emit("close");
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
