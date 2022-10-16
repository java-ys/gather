<template>
    <div>
        <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
        <div class="right-flex">
            <m2-column-fixed
                :type="columnType"
                :totalColumn="totalColumn"
                :defaultFixed="defaultFixed"
                :localColumnList="localColumnList"
                @reload="reloadColumn"></m2-column-fixed>
            <Button type="primary" @click="batchRevoke" v-hasAuth="'msg-manage-batchCancel'" :disabled="selectList.length===0" class="right15">批量撤销</Button>
            <Button type="primary" @click="createAssignment" v-hasAuth="'shortmessage-manage-add'">新建任务</Button>
        </div>
        <VTable
            class="top15"
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="parColumns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            @selectHandle="selectHandle">
            <template slot-scope="params" slot="action">
                <Button
                    ghost
                    type="success"
                    size="small"
                    class="tableBtn"
                    v-hasAuth="'shortmessage-manage-detail'"
                    @click="popDetailView(params)">详情
                </Button>
                <Button
                    v-if="params.data.row.taskStatus===0 || params.data.row.taskStatus===1 || params.data.row.taskStatus===7"
                    ghost
                    type="error"
                    size="small"
                    v-hasAuth="'msg-manage-cancel'"
                    @click="revokeItem(params.data.row)">撤销
                </Button>
            </template>
        </VTable>
        <Modal title="新建任务" :mask-closable="false" v-model="addViewStatus" footer-hide width="650">
            <Add v-model="addViewStatus" :template="selectTemplate" @on-confirm="confirm" @select="showTemplateModal=true"></Add>
        </Modal>
        <Modal title="任务详情" :mask-closable="false" v-model="detailViewStatus" footer-hide width="650">
            <Detail v-model="detailViewStatus" :uuid="uuid"></Detail>
        </Modal>
        <Modal
            v-model="cancelModal"
            :width="520"
            @on-ok="closeCancelModal"
            @on-cancel="closeCancelModal"
            title="撤销结果">
            <div class="fontsize14 color00">失败条数/总撤销条数：{{cancelInfo.failCount}} / {{cancelInfo.totalCount}}</div>
            <div class="top15 line30">
                <div v-for="(item,i) in cancelInfo.failList" :key="i">{{item}}</div>
            </div>
            <div slot="footer">
                <Button type="primary" @click="closeCancelModal">确定</Button>
            </div>
        </Modal>
        <TemplateModal
            v-model="selectTemplate"
            :show="showTemplateModal"
            app-name="运营后台管理系统"
            app-code="T3_OPERATION_SYSTEM"
            @cancel="showTemplateModal = false"
        />
    </div>
</template>

<script>
import Add from "./popview/add"
import Detail from './popview/detail'
import t3ColumnFixed from "_a/m2-column-fixed/index.vue"
import columnFixedMix from "_a/m2-column-fixed/mixin";
import { parColumns, sendMap, inputList } from "./fields.js"
import { shortMsgList,shortMsgsBatchCancel,shortMsgsCancel } from "_o/api/announcement.js"
import { timeFormat } from '@/libs/util.js'
import { getNationalAreaInAuth } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";
import TemplateModal from '_o/components/reach-platform/components/TemplateModal'

export default {
    components: {
        Detail,
        Add,
        t3ColumnFixed,
        TemplateModal
    },
    data() {
        return {
            selectTemplate: null,
            uuid: '', // 详情用uuid
            queryAjaxPramas: {},
            total: 0,
            current: 1,
            pageSize: 10,
            tableData: [],
            addViewStatus: false,
            detailViewStatus: false,
            inputList,
            totalColumn: parColumns,
            parColumns:[],
            sendMap,
            selectList: [],
            cancelModal:false,
            cancelInfo:{},
            columnType:1,
            showTemplateModal: false,
        }
    },
    created() {
        this.getList()
        this.getCitiyList()
    },
    mixins: [columnFixedMix],
    watch: {
        addViewStatus() {
            this.selectTemplate = null;
        }
    },
    methods: {
        createAssignment () {
            this.addViewStatus = true
        },
        clearQueryData(data) {
            this.queryAjaxPramas = {}
            this.current = 1
            this.getList()
        },
        queryData(data) {
            data.startTime && (data.startTime = timeFormat(data.startTime, 'yyyy-MM-dd').split(' ')[0]);
            data.endTime && (data.endTime = timeFormat(data.endTime, 'yyyy-MM-dd').split(' ')[0]);
            this.current = 1
            this.queryAjaxPramas = data
            this.getList()
        },
        getList() {
            let params = {
                currPage: this.current,
                pageSize: this.pageSize
            };
            Object.assign(params, this.queryAjaxPramas)
            shortMsgList(params).then(res => {
                this.total = res.data.data.totalCount
                this.tableData = res.data.data.list
                // 0、待审核-1待发送，7处理中-可以撤销
                this.tableData.forEach(item=>{
                    item._checked = false
                    item._disabled = true
                    if(item.taskStatus===0||item.taskStatus===1||item.taskStatus===7) item._disabled = false
                })
                this.selectList = []
                this.$store.commit("changeLoadingFlag", false)
            })
        },
        getCitiyList(){
            // 按照乘客的城市权限查询
            getNationalAreaInAuth({}).then(res => {
                let list = res.data.data||[]
                list.forEach(function (item, index) {
                    item.label = item.province
                    item.value = item.provinceID
                    item.children = item.citys
                    item.children.forEach(function (_item, _index) {
                    _item.label = _item.city
                    _item.value = _item.cityID
                    })
                })
                this.inputList[1].cascaderList = list
            });
        },
        popDetailView (params) {
            this.uuid = params.data.row.uuid || ''
            this.detailViewStatus = true
        },
        // 撤销
        revokeItem (item) {
            let that = this
            let uuid = item.uuid

            this.$Modal.confirm({
				title:'确认撤销该条任务？',
				onOk:()=>{
					that.revokeAxios({uuid})
				}
			})
        },
        revokeAxios(params){
            shortMsgsCancel(params).then(res => {
                this.$Message.success('撤销成功！')
                this.selectList = []
                this.getList()
            })
        },
        changePageSize(val) {
            this.pageSize = val
            this.getList()
        },
        changePage(val) {
            this.current = val
            this.getList()
        },
        confirm () {
            this.getList()
        },
        selectHandle(list){
            this.selectList = list.map(item=>item.uuid)
        },
        batchRevoke(){
            let that = this
            this.$Modal.confirm({
                title:'确认撤销该条任务？',
                key: '1',
				onOk:()=>{
					shortMsgsBatchCancel({ uuidList: that.selectList }).then(res => {
                        let data = res.data.data||{}
                        if(data.failCount===0){
                            that.$Message.success('撤销成功！')
                            this.closeCancelModal()
                        }else {
                            data.failList = data.failMsg.split('====')
                            this.cancelInfo = data
                            this.cancelModal = true
                        }
                    })
				}
			})
        },
        closeCancelModal(){
            this.cancelModal = false
            this.selectList = []
            this.getList()
        }
    }
}
</script>

<style scoped>
    .manageDetail p {
        line-height: 30px;
        display: flex;
        padding-left: 50px;
        text-align: left;
    }
    .manageDetail .editName {
        width: 76px;
        padding: 0;
        display: inline-block;
    }
    .manageDetail .editDetail {
        width: 400px;
        display: inline-block;
    }
</style>
