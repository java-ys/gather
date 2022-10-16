<template>
  <div>
    <div class="carrier-header">
      <SearchList ref="search" :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
    </div>
    <div class="carrier-content">
      <VTable
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @rowClickHandle="changeRow"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></VTable>
    </div>
    <div class="popView-footer-wrap">
        <Button
          size="large"
          type="text"
          style="margin-right: 8px;"
          @click="commit(0)"
        >
          取消
        </Button>
        <Button
          @click="commit(1)"
          size="large"
          type="primary"
        >
          确定
        </Button>
      </div>
  </div>
</template>
<script>
import {searchEntity} from "_o/api/operator-carrier";
import { listColumns } from "./fields";
  export default {
    data () {
      let { columns } = listColumns;
      return {
        current: 1,
        total: 0,
        pageSize: 10,
        columns: columns(this),
        tableData: [],
        inputList: [
          {
            name: "text-input", // 文本输入框名
            bind_key: "invoiceSubjectName", // 返回数据的key名
            placeholder: "请输入开票主体名称",
            value: "", // 用于数据绑定
            title: "开票主体名称：",
            titleWidth: 100
          },
          {
            name: "text-input", // 文本输入框名
            bind_key: "taxNum", // 返回数据的key名
            placeholder: "请输入税号",
            value: "", // 用于数据绑定
            title: "税号："
          }
        ],
        searchParams: {
          "invoiceSubjectName":null,
          "taxNum":null
        }
      }
    },
    props: {
      popView: Boolean, // 是否打开弹窗
    },
    components: {},
    mounted() {
      this.getSelectList()
    },
    watch: {
      "popView": function () {
        if (this.popView) {
          this.current = 1
          this.searchParams = {
            "invoiceSubjectName":null,
            "taxNum":null
          }
          this.getSelectList()
        }
        this.$refs.search.reset()
      }
    },
    methods: {
      commit: function (temp) {
        if(temp === 0) {
          this.$emit('entityCancel')
        } else {
          this.tableData.forEach((data,index)=>{
            if(data.chooseStatus === true) {
              this.$emit('entityConfirm', data)
            }
          })
        }
      },
      search: function(data){
          this.current = 1
          this.searchParams = data
          this.getSelectList()
      },
      reset(data){
          this.current = 1
          this.searchParams = data
          this.getSelectList()
      },
      changeRow(a,b) { // 单机某行
        this.tableData.forEach((data,index)=>{
          if(index !== b) {
            data.chooseStatus = false
          } else {
            data.chooseStatus = true
          }
        })
      },
      getSelectList() {
        searchEntity({...this.searchParams,currPage:this.current,pageSize:this.pageSize}).then(res => {
          let data = res.data.data || {};
          if (data.list && data.list.length>0) {
            data.list.forEach((element,index) => {
            element.chooseStatus = false
            data.list[0].chooseStatus = true
          });
          }
          this.tableData = data.list;
          this.total = data.totalCount;
        });
      },
      changePage(page) {
        this.current = page;
        this.getSelectList();
      },
      changePageSize(pageSize) {
        this.pageSize = pageSize;
        this.getSelectList();
      },
    }
  }
</script>
<style lang='less' scoped>
</style>
