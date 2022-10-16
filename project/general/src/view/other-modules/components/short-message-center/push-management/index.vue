<template>
<div class="container1">
    <SearchList :inputList="inputList" @on-search='handleSearch' @on-reset="reset"></SearchList>
    <div class="right-flex">
        <column-fixed-btn
            :type="columnType"
            :localColumnList="localColumnList"
            :totalColumn="totalColumn"
            :defaultFixed="defaultFixed"
            @reload="reloadColumn">
        </column-fixed-btn>
        <Button type="primary" @click="batchRevoke" v-hasAuth="'push-center-batchCancel'" :disabled="selectList.length===0" class="right15">批量撤销</Button>
        <Button type="primary" @click="goToAddPush" v-hasAuth="'push-center-add'">新增</Button>
    </div>

    <VTable
        class="top15"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :parColumns="parColumns"
        :parTableData="pushList"
        @changePage="changePage"
        @changePageSize="changePageSize"
        @selectHandle="selectHandle">
    </VTable>
    <Modal v-model="detailModal" title="PUSH消息详情" :width="650">
        <DetailTag :theInfo='detailInfo' :show="detailModal" ></DetailTag>
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
</div>
</template>

<script>
import {getPushlist,cancelPush ,batchCancelPush, remoteSearch,getPushDetail} from '_o/api/announcement.js'
import { fields, page,pushStatusMap,parColumns } from './fields.js'
import { getNationalAreaInAuth } from "_g/api/common.js";
import  DetailTag from './components/detail.vue'
import { cpTranslate } from "@/libs/tools";
  import columnFixedBtn from "_a/m2-column-fixed/index.vue";
  import columnFixedMix from "_a/m2-column-fixed/mixin";
import oss from "@/mixins/oss";

export default {
    components: {
        DetailTag,
        columnFixedBtn
    },
    data() {
        return {
            ...fields,
            queryForm: {},
            inputLoading: false,
            options1: [],
            detailModal:false,
            detailInfo:{},
            roleList: [{
                    value: '1',
                    label: '司机'
                },
                {
                    value: '2',
                    label: '乘客'
                }
            ],
            pushList: [],

            total: null,
            current: 1,
            isLoading: false,
            pageSize: 10,
            queryParams:{},
            selectList: [],
            cancelModal: false,
            cancelInfo: {},
            columnType: 2,
            parColumns: [],
            totalColumn: parColumns(this)
        };
    },
    mounted() {
        this.getList()
        this.getCitiyList()
    },
    mixins: [columnFixedMix, oss],
    methods: {
        //获取分页pushList
        getList() {
            this.isLoading = true
            let data = {pageSize: Number(this.pageSize),currPage: Number(this.current)}
            if(this.queryParams){
                data = Object.assign(this.queryParams,data)
            }
            if(data.cityCode){
                data.cityCodeList = [data.cityCodes]
                delete data.provinceCode
            }
            getPushlist(data).then(res=>{
                if(res.data.success){
                    this.total = res.data.data.totalCount
                    this.pushList = res.data.data.list
                    // 2待推送,4处理中-可以撤销
                    this.pushList.forEach(item=>{
                        item._checked = false
                        item._disabled = true
                        if(item.pushStatus===2||item.pushStatus===4) item._disabled = false
                    })
                    this.selectList = []
                    this.$store.commit('changeLoadingFlag', false)
                }
            })
        },
        getCitiyList(){
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
        reset(){
            this.queryParams = {}
            this.getList()
        },
        // 搜索
        handleSearch(val) {
            this.queryParams = val
            this.getList()
        },
        //远程模糊搜索
        /*remoteMethod(query) {
             remoteSearch({ title: query }).then(res => {
                this.inputList[0].remoteList = []
                for(let i = 0; i < res.data.data.length; i++){
                    this.inputList[0].remoteList.push({
                        label: res.data.data[i],
                        value: res.data.data[i]
                    })
                }
            })
        },*/
        changePageSize(val) {
            this.pageSize = val;
            this.getList()
        },
        changePage(val) {
            this.current = val
            this.getList()
        },
        handleSelectRole(item) {

        },
        //获取详情
        getDetail(id){
            let data = { uuid : id}
            getPushDetail(data).then(async (res) =>{
                if(res.data.success){
                  this.detailInfo = res.data.data
                    // failUrl uploadFileUrl 返回的是文件uuid
                  let r = ["failUrl", "uploadFileUrl"]
                    for(let i =0; i<r.length; i++) {
                    let v = this.detailInfo[r[i]]
                    if(v) {
                        let [, url] = await this.getOssFile({uuid: v})
                        this.detailInfo[r[i]] = url
                    }
                    }

                }
            })
        },
        //放弃推送
        handleAbord(item) {
            let data = {uuid : item.uuid}
            this.$Modal.confirm({
                title: '确认撤销该条推送？',
                onOk: () => {
                    cancelPush(data).then(res=>{
                        this.$Message.success('撤销成功！');
                        this.selectList = []
                        this.getList()
                    })
                }
            });
        },
        // 批量撤销
        batchRevoke(){
            let that = this
            this.$Modal.confirm({
				title:'确认撤销该条推送？',
				onOk:()=>{
					batchCancelPush({ uuidList: that.selectList }).then(res => {
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
        },
        selectHandle(list){
            this.selectList = list.map(item=>item.uuid)
        },
        goToAddPush(){
            this.$router.push({name: 'add-push'})
        },
        goToDetail(id){
            this.$router.push({name: 'push-detail',params:{id: id}})
        },
        goToReminder(){
            this.$router.push({name: 'passenger-reminder'})
        },
    }
}
</script>
