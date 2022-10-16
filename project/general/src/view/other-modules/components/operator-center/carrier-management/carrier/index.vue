<template>
    <div class="carrier">
        <div class="carrier-header">
          <SearchList :inputList="inputList" @on-search="search" @on-reset="reset" @cascade-change="cascadeChange"></SearchList>
          <div class="but-con">
            <Button type="primary" @click="popView" v-hasAuth="'carrier-add'">新建运营商</Button>
            <export-file
              btnText="批量导出"
              baseUrlKey="_baseUrl"
              exportUrl="/admin/sysAgent/export"
              exportFileName="运营商列表.xlsx"
              :isDisabled="isExportBtn"
              :queryData="searchParams"
              :disabled="!total || total===0"
            ></export-file>
          </div>
        </div>
        <div class="carrier-content">
            <VTable
                :total="total"
                :current="current"
                :pageSize="pageSize"
                :parColumns="parColumns"
                :parTableData="tableData"
                @changePage="changePage"
                @changePageSize="changePageSize"
                style="margin-top: 25px;">
            </VTable>
            <Modal :width="840" v-model="isPop" :title="title" :mask-closable="false" footer-hide>
                <Update
                    :uuid="uuid"
                    :cityList="cityList"
                    :type="updateType"
                    :popView="isPop"
                    :entity="entityInfo"
                    :modeType="mode"
                    @on-confirm="confirm"
                    @entity="showEntity"
                    >
                </Update>
            </Modal>
            <Modal :width="840" v-model="isSelect" title="选择开票主体" :mask-closable="false" footer-hide>
                <select-entity
                    :popView="isSelect"
                    @entityConfirm="entityConfirm"
                    @entityCancel="entityCancel">
                </select-entity>
            </Modal>
        </div>
    </div>
</template>

<script>
import { returnFields, inputList } from './index'
import { getCityOperatorTree } from '_g/api/common'
import { cppTranslate } from '@/libs/tools'
import { getCarrierList, updateEnableState } from '_o/api/operator-carrier'
import Update from './operation/update'
import selectEntity from './operation/selectEntity'
import { getWholeRegion } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";
import ExportFile from '_a/export-file/exportFile'
import { _getAreaInfoByCityCode } from "_g/api/general"

export default {
    name: 'carrier',
    components: {
        Update,
        selectEntity,
      ExportFile
    },
    data () {
        return {
          isExportBtn: false,
            ...returnFields(this),
            title: '新增运营商',
            mode: 0, // 开票主体类型 0:A模式 1:UP模式
            uuid: '',
            updateType: '',
            tableData: [],
            inputList: [],
            cityList: [],
            isPop: false,
            isSelect: false, // 是否显示选择票务信息弹窗
            isLoading: true,
            searchParams: {},
            entityInfo: {}, // 发票信息
        }
    },
    // activated重复
    // mounted() {
    //     this.getCityList()
    //     this.getTableList();
    // },
    activated() {
        this.getCityList()
        this.searchParams = {
            enableSwitch:1
        };
        this.getTableList();
    },
    methods: {
        showEntity(mode) { // 显示查询票务数据列表
          this.isPop = true
          this.isSelect = true
          this.mode = mode || 0
        },
        entityCancel() { // 取消查询主体
          this.isPop = true
          this.isSelect = false
        },
        entityConfirm(data) { // 选取了发票后
          this.isPop = true
          this.isSelect = false
          console.log(data)
          this.entityInfo = data
        },
        // 获取数据权限省市
        getCityList(){
            let params = {
                // areaType: 2,//已开启城市
                areaType: 1,//已配置城市
                authDimension: 2,//省市+机构维度
                businessLineList: [1,2,4]//快车、专车、出租车
            }
            getWholeRegion(params).then(res => {
                let list = cpTranslate(res.data.data||[])
                this.inputList = JSON.parse(JSON.stringify(inputList))
                this.inputList[0].cascaderList = list
                this.cityList = list
            })
        },
        getTableList: function(){ // 获取表格数据
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.pageSize = this.pageSize
            params.currPage = this.current
            this.$store.commit('changeLoadingFlag', true)
            getCarrierList(params).then(res => {
                this.tableData = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            }).catch(err=>{
                this.tableData = []
                this.total = 0
            })
        },
        // 点击新建运营商
        popView: function(){
            this.isPop = true
            this.title = '新增运营商'
            this.updateType = 'add'
        },
        // 新增、编辑的保存或取消按钮
        confirm: function(data){
            if(data) {
                this.getTableList()
                getCityOperatorTree().then(response => { // 获取省、市、运营商级联列表
                    let transformData = JSON.stringify(cppTranslate(response.data.data))
                    localStorage.setItem('pcOperatorList', transformData)
                })
            }
            this.isPop = false
        },
        search: function(data){
            this.current = 1
            this.searchParams = data
            this.getTableList()
        },
        reset(data){
            this.current = 1
            this.searchParams = data
            this.getTableList()
        },
        changePage: function(val){
            this.current = val
            this.getTableList()
        },
        changePageSize: function(val){
            this.pageSize = val
            this.getTableList()
        },
        updateEnableState (row) {
            const title = row.enableSwitch === 1 ? '停用':'启用'
            this.$Modal.confirm({
                title: `确定${title}该运营商吗`,
                onOk: async () => {
                updateEnableState({
                    enableStateReq:row.enableSwitch === 1 ? 0:1,
                    uuid:row.uuid
                }).then(res=>{
                    if(res.data.success){
                        this.$Message.success(`成功${title}该运营商！`)
                        this.reset({})
                    }else{
                        this.$Message.info(res.data.msg || '操作失败')
                    }
                })
                }
            });
        },
      cascadeChange(value, data, item) {
          if(value && value.length) {
            this.queryArea(value[1])
          } else {
            this.getSearchTermsByKey("areaCodeList").dropList = []
          }
      },
      async queryArea(cityCode) {
        let { list } = await _getAreaInfoByCityCode(cityCode);
        this.getSearchTermsByKey("areaCodeList").dropList = list
      },
      getSearchTermsByKey(key) {
          return this.inputList.find(item => item.bind_key === key) || {}
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .carrier-header{
        margin-top: 10px;
    }
    .but-con {
      display: flex;
      justify-content: space-between;
    }
</style>
