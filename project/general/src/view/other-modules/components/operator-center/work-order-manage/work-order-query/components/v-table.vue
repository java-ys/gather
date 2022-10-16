<template>
    <div class="my-table">
        <div class="operate-wrap clearfix"><slot name="header"></slot></div>
        <Table
            
            stripe
            :width="width"
            :height="tableHeight"
            no-data-text=""
            :columns="handleColumn()"
            :loading="!isLoading"
            ref="vtable"
            :data="parTableData"
            @on-sort-change="sortChange"
            @on-selection-change="onSelect"
            style="margin-top: 15px"
        ></Table>
        <!-- <div  v-if="isShowLoading && !isLoading" style="position: relative;height: 635px;">
            <Spin fix>
                <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
                <div style=" font-size: 14px;">Loading...</div>
            </Spin>
        </div> -->
        <span class="noDataText" v-if="!parTableData.length">暂无数据</span>
        <div style="margin-top: 25px; overflow: hidden" v-if="isShowPage&&isLoading">
            <div style="width: 100%;display: flex;justify-content:space-between;line-height: 32px;">
              <div style="color: #000;font-size: 14px;">全部：{{ total }}条</div>
              <div style="display: flex; ">
                  <Select v-model="currentPageSize" style="width:60px;margin-right: 8px" @on-change="changePageSize">
                    <Option v-for="(item,index) in pageSizeOpts" :key="index"  :value="item">{{ item }}</Option>
                </Select>
                <Page
                    :total="total"
                    :current="current"
                    :page-size="currentPageSize"
                    @on-change="changePage"
                ></Page>
                <Input v-model="currentPage" style="width: 50px;margin-left: 8px;margin-right: 8px" />
                <Button @click="currentChangePage()" style="width:54px;height:33px">GO</Button>
              </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
  // .my-Dropdown .ivu-dropdown-item{
  //   font-size: 14px !important;
  //   color: #666
  // }

  // .my-Dropdown .ivu-dropdown-item:hover{
  //   background: #fff2ea;
  //   font-size: 14px !important;
  //   color: #666
  // }
  
  // .my-table{
  //   .ivu-table-fixed-right{
  //     background: #fff;
  //   }
  //   .ivu-table-fixed-body{
  //     background: #fff;
  //   }
  //   .ivu-table-row-hover td{
  //     background: rgba(255,133,51,.1) !important;
  //   }
  //   margin-top: 15px;
  //   background: #fff;
  //   padding: 25px;
  //   ivu-table-border th{
  //     border: none!important;
  //   }
  //   .operate-wrap{
  //     line-height: 30px;
  //       div >span{
  //         font-size: 16px;
  //         font-weight: bold;
  //         color: #000;
  //     }
  //     }
  //     .clearfix:after {
  //       content:"";
  //       display:block;
  //       visibility:hidden;
  //       height:0;
  //       clear:both;
  //     }
  //   position: relative;
  //   .noDataText{
  //     position: absolute;
  //     left:48%;
  //     top: 48%;
  //     font-size: 14px;
  //     display: inline-block;
  //   }
  //   .ivu-table th, .ivu-table td{
  //       height: 56px;
  //     }
  //   .ivu-table-wrapper{
  //     border-left: 1px solid #e5e5e5;
  //     border-top: 1px solid #e5e5e5;
  //     .ivu-table:before{
  //       background-color: #e5e5e5 !important;
  //     }
  //     .ivu-table-fixed::before, .ivu-table-fixed-right::before{
  //       background-color: #e5e5e5 !important;
  //     }
  //     .ivu-table:after{
  //       background-color: #e5e5e5 !important;
  //     }
  //     .ivu-checkbox-inner{
  //       width: 16px !important;
  //       height: 16px !important;
  //     }
  //     .ivu-checkbox-checked .ivu-checkbox-inner:after{
  //       top: 2px !important;
  //       left: 5px !important;
  //     }
  //     .ivu-table th{
  //       height: 56px !important;
  //       background: #f3f3f7 !important;
  //     }
  //     .ivu-table-row{
  //       td{
  //         border: none !important;
  //       }
  //     }
  //     .ivu-table-tbody {
  //       .ivu-table-cell{
  //         border: none !important;
  //         color: #000;
  //         font-size: 14px;
  //       }
        
  //       .ivu-table-stripe .ivu-table-body tr:nth-child(2n) td, .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) td{
  //         background: #f3f3f7 !important;;
  //       }
        
  //     }
  //     .ivu-table-header,.ivu-table-fixed-header{
  //       .ivu-table-cell {
  //         color: #666;
  //         font-size: 14px;
  //       }
  //     }
  //   }
    
      
  //   //  分页 样式
  //   .ivu-page-item{
  //     // border: 1px solid #ccc;
  //     // color: #666;
  //     font-size: 14px;
  //   }
  //   .ivu-page-item a {
  //     color: #666;
  //   }
  //   .ivu-page-item-active a ,.ivu-page-item:hover a {
  //     color: #ff8533;
  //   }
    
  //   .ivu-page-item-active ,.ivu-page-item:hover{
  //     border-color: #ffcead;
  //   }
  //   .ivu-select-selection:hover, .ivu-select-selection-focused{
  //     border-color: #ffcead;
  //   }
  //   .ivu-select-visible .ivu-select-selection{
  //     box-shadow: 0 0 0 0 ;
  //     // border-color: #ffcead;
  //   }
    
  //   .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
  //     font-size: 14px !important;
  //   }
  //   .ivu-select-selection{
  //     border-color: #ccc;
  //   }
  //   .ivu-select-item{
  //     font-size: 14px !important;
  //     // color: #666
  //   }
  //   .ivu-select-item-focus, .ivu-select-item:hover{
  //     // background: #fff2ea;
  //   }
    

  //   .ivu-page-prev a, .ivu-page-next a{
  //     font-size: 16px;
  //   }
  //   .ivu-input{
  //     text-align: center;
  //   }
  //   .ivu-input:hover ,.ivu-input:focus{
  //     // border-color: #ffcead!important;
  //     box-shadow: 0 0 0 0 ;

  //   }
  //   .ivu-btn:hover ,.ivu-btn:focus{
  //     // border-color: #ffcead!important;
  //     box-shadow: 0 0 0 0 ;
  //     // color: #ff8533;

  //   }
  //   .ivu-page-prev:hover, .ivu-page-next:hover{
  //     // border-color: #ffcead!important;
  //   }
  // }
</style>
<script>
export default {
  name: 'VTable',
  props: {
    total: Number,
    current: Number,
    pageSize: Number,
    isLoading: Boolean,
    pageSizeOpts: {
      type:Array,
      default: ()=>{
        return [10, 20, 50, 100]
      }
    },
    isShowSizer: {
      type: Boolean,
      default: true
    },
    isShowLoading: {
      type: Boolean,
      default: true
    },
    isShowPage: {
      type: Boolean,
      default: true
    },
    width: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 635
    },
    parColumns: Array,
    parTableData: Array,
    loading:{
        type: Boolean,
        default: false
    },
    noColums: {
      type: Boolean,
      default: true
    },
    noHeight: {
      type: Boolean,
      default: true
    }
    
  },
  watch: {
    parTableData() {
      this.currentPage = this.current
    }
  },
  data() {
    return{
      currentPageSize: this.pageSize,
      currentPage: this.current,
      tableHeight: '',
    }
  },
  mounted() {
    if(!(this.noHeight)) {
      this.tableHeight = '-'
    }else{
      this.tableHeight = this.height
    }
  },
  methods: {
    changePage (val) {
      this.currentPage = val;
      this.$emit('changePage', val);
    },
    currentChangePage() {
      
      let totalPage = Math.ceil((this.total / this.pageSize)); // 总页码
      var r = /^\+?[1-9][0-9]*$/;　　//正整数
      if(Number(this.currentPage) % 1 === 0 && r.test(this.currentPage)) {
        if( Number(this.currentPage) <= totalPage ) {
          this.$emit('changePage', Number(this.currentPage));
        }else{
          this.currentPage = totalPage;
          if(this.currentPage >0) {
            this.$emit('changePage', totalPage);
          }else{
            this.$emit('changePage', 1);
            this.currentPage = 1;
          }
        }
			}else{
				this.$emit('changePage', 1);
        this.currentPage = 1;
      }
    },
    changePageSize(val) {
      this.$emit('changePageSize', val);
      this.$emit('changePage', 1);
      this.currentPage = 1;
    },
    sortChange (obj) {
        this.$emit('sortHandle', obj);
    },
    onSelect (obj) {
        this.$emit('selectHandle', obj);
    },
    rowclass(row,index) {
      return "demo-class"
    },
    handleColumn() {
      for (var i = this.parColumns.length - 1; i >= 0; i--) {
          !this.parColumns[i].align && (this.parColumns[i].align = 'left ');
          !this.parColumns[i].tooltip && (this.parColumns[i].tooltip = "true");
          !this.parColumns[i].ellipsis && (this.parColumns[i].ellipsis = "true");
      }
      return this.parColumns;
    }
  }
}
</script>
