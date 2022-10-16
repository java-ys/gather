<template>
<div class="container1">
    <SearchList :inputList="inputList" @on-search='handleSearch' @on-reset="reset"></SearchList>
    <Button type="primary" @click.stop="handleAdd" v-hasAuth="'passenger-reminder-add'">新增</Button>
    <VTable 
        :total="total" 
        :current="current"
        :pageSize="pageSize" 
        :parColumns="pushColumn" 
        :parTableData="ployList" 
        @changePage="changePage" 
        @changePageSize="changePageSize"
        style="margin-top: 25px;">
    </VTable>
    <Modal v-model="detailModal" :footer-hide="true" title="详情" @on-cancel="cancelPloy(3)">
        <DetailTag ref="editTag" :theInfo='detailInfo'></DetailTag>
    </Modal>
    <Modal v-model="addModal" :title="titleName" width='800' @on-cancel="cancelPloy">
        <AddTag ref="addTag" :theInfo='editInfo' :tag="tag" @clearForm="cancelPloy"></AddTag>
        <div slot="footer">
            <Button type="text" size="large" @click="cancelPloy">取消</Button>
            <Button type="primary" size="large" @click="savePloy(tag)">确定</Button>
        </div>
    </Modal>
</div>
</template>

<script>
import {queryPloyList, queryPloySave,queryPloyUpdate, queryPloyDetail} from '_o/api/announcement.js'
import { fields, page, pushStatusMap } from './fields.js'
import { getOnLineCity } from "_g/api/common.js";
import  DetailTag from './components/detail.vue'
import { cpLabelValue } from "@/libs/tools";
import  AddTag from './components/add.vue'
export default {
    components: {
        DetailTag,
        AddTag
    },
    data() {
        return {
            titleName: '新增提醒',
            tag:0,
            destroy: true,
            ...fields,
            queryForm: {},
            inputLoading: false,
            options1: [],
            detailModal:false,
            detailInfo:{},
            editInfo:null,
            roleList: [{
                    value: '1',
                    label: '司机'
                },
                {
                    value: '2',
                    label: '乘客'
                }
            ],
            ployList: [], //存放list数据
            pushColumn: [
                {
                    key: 'strategyName',
                    title: '策略名称',
                    minWidth: 160,
                    tooltip: true,
                },
                
                {
                    key: 'businessLines',
                    title: '产品线',
                    minWidth: 160,
                    tooltip: true,
                    render:(j,params)=>{
                        let bLines, newLines = [];
                        params.row.businessLines.map((item, idx) => {
                            newLines.push( item === "4" ? "快享" : "专享" )
                        });
                        bLines = newLines.join("、")
                        return j('div',[
                            j('span',{},bLines)
                        ])
                    }
                },
                {
                    title: '城市',
                    key: 'cityCodes',
                    minWidth: 150,
                    tooltip: true,
                    render:(j,params)=>{
                        return j('div',[
                            j('span',{},params.row.cityNames.join("、"))
                        ])
                    }
                },
                {
                    key: 'updateTime',
                    title: '生效时段',
                    minWidth: 285,
                    tooltip: true,
                    render:(j,params)=>{
                        return j('div',[
                            j('span',{}, params.row.startTime + ' 至 ' + params.row.endTime),
                        ])
                    }
                },
                {
                    key: 'effectStatus',
                    title: '生效状态',
                    minWidth: 160,
                    tooltip: true,
                    render:(j,params)=>{
                        return j('div',[
                            j('span',{
                                style:{
                                    display: (params.row.effectStatus == 0) ? 'inline-block' : 'none'
                                }
                            },'未开始'),
                            j('span',{
                                style:{
                                    display: (params.row.effectStatus == 1) ? 'inline-block' : 'none'
                                }
                            },'已生效'),
                            j('span',{
                                style:{
                                    display: (params.row.effectStatus == 2) ? 'inline-block' : 'none'
                                }
                            },'已失效'),
                        ])
                    }
                },
                {
                    key: 'createTime',
                    title: '创建时间',
                    minWidth: 160,
                    tooltip: true
                },
                {
                    key: 'updater',
                    title: '操作人',
                    minWidth: 160,
                    tooltip: true
                },
                {
                    key: 'version',
                    title: '版本号',
                    minWidth: 160,
                    tooltip: true
                },
                {
                    key: 'actions',
                    title: '操作',
                    width: 140,
                    fixed: 'right',
                    render: (h, params) => {
                            if(params.row.effectStatus === 0){
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            ghost: true,
                                            size:'small'
                                        },
                                        directives: [{
                                            name: 'hasAuth',
                                            value: 'passenger-reminder-detail'
                                        }],
                                        style: {
                                            display: 'inline-block'
                                        },
                                        on: {
                                            click: () => {
                                                let id = params.row.uuid
                                                this.getDetail(id)
                                                this.detailModal = true
                                                this.editTagInit()
                                            }
                                        }
                                    }, '详情'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            ghost: true,
                                            size:'small'
                                        },
                                        directives: [{
                                            name: 'hasAuth',
                                            value: 'passenger-reminder-edit'
                                        }],
                                        style: {
                                            marginLeft: '15px',
                                            display: 'inline-block'
                                        },
                                        on: {
                                            click: () => {
                                                let id = params.row.uuid
                                                this.getEditDetail(id)
                                                this.titleName = "编辑提醒"
                                                this.addModal = true
                                                this.tag = 1
                                                this.addTagInit()
                                                this.addTagReset()
                                            }
                                        }
                                },  '编辑'),
                            ])
                        }else{
                            return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            ghost: true,
                                            size:'small'
                                        },
                                        directives: [{
                                            name: 'hasAuth',
                                            value: 'passenger-reminder-detail'
                                        }],
                                        style: {
                                            display: 'inline-block'
                                        },
                                        on: {
                                            click: () => {
                                                let id = params.row.uuid
                                                this.getDetail(id)
                                                this.detailModal = true
                                                this.editTagInit()
                                            }
                                        }
                                    }, '详情')
                                    ]
                            )
                        }
                        
                    }
                },
            ],
            total: null,
            current: 1,
            isLoading: false,
            pageSize: 10,
            queryParams:{},
            selectList: [],
            cancelInfo: {},
            addModal: false

        };
    },
    mounted() {
        this.getCitiyList()
        this.getList()
    },
    methods: {
        addTagReset(){
            this.$refs.addTag.$refs.reminderForm.resetFields()
            this.$refs.addTag.$refs.comingNodeForm.resetFields()
            this.$refs.addTag.$refs.goOnNodeForm.resetFields()
            this.$refs.addTag.$refs.destinationNodeForm.resetFields()
            this.$refs.addTag.$refs.payNodeForm.resetFields()
        },
        editTagInit(){
            this.$refs.editTag.orderNodeToggle = false
            this.$refs.editTag.comingNodeToggle = false
            this.$refs.editTag.goOnNodeToggle = false
            this.$refs.editTag.destinationNodeToggle = false
            this.$refs.editTag.payNodeToggle = false
        },
        addTagInit(){
            this.$refs.addTag.reminderNodeForm.remindNodeList = []  //提醒节点
            this.$refs.addTag.orderNodeToggle = false
            this.$refs.addTag.comingNodeToggle = false
            this.$refs.addTag.goOnNodeToggle = false
            this.$refs.addTag.destinationNodeToggle = false
            this.$refs.addTag.payNodeToggle = false
        },
        addTagValClear(){
            
        },
        handleAdd(){
            if(this.editInfo){
                for(var key in this.editInfo){
                    delete this.editInfo[key];
                }
            }

            this.addModal = true
            this.titleName = '新增提醒'
            this.tag = 0
            this.addTagInit()
            this.addTagReset()
            this.$refs.addTag.clear()
            this.$refs.addTag.orderNodeToggle = true
        },
        cancelPloy(param){
            if(param === 3){//detail
                this.$refs.editTag.clear()
                this.detailModal = false
            }else{//add edit
                this.$refs.addTag.clear()
                this.addModal = false
            }
        },
        savePloy(tag){ //0-新增 1-编辑   
            let $model = this.$refs['addTag'].$refs
            let warningTimes = 0;
            $model.reminderForm.validate((valid) => { //表头
                if(valid === false) {
                    this.$Message.warning('请填写必填项')
                    warningTimes++
                    return
                }else {
                    $model.reminderForm['startTime'] = $model.reminderForm.effectedTime[0]
                    $model.reminderForm['endTime'] = $model.reminderForm.effectedTime[1]
                    delete $model.reminderForm['effectedTime']
                }
            })
            if($model.reminderNodeForm.model.remindNodeList.length == 0) { //复选框校验 
                $model.reminderNodeForm.model.remindNodeListNone = true
                warningTimes++
            }else{
                $model.reminderForm.model["strategyNodes"] = []
                $model.reminderNodeForm.model.remindNodeList.map(item => { //复选框 -把选中的行程节点的数据放入 节点集合中
                    if(item === "1"){
                        $model.orderNodeForm.validate((valid) => {
                            if(valid === false) {
                             this.$Message.warning('请填写必填项')
                             warningTimes++
                             return
                            }
                        })
                        !$model.orderNodeForm.model.routeNode && ($model.orderNodeForm.model.routeNode = 1) //提醒节点 默认选中第一项时,不触发change事件,所以这里需要主动存值 
                        $model.reminderForm.model["strategyNodes"].push($model.orderNodeForm.model)
                    }else if(item === "2"){
                        
                        $model.comingNodeForm.validate((valid) => {
                            if(valid === false) {
                             this.$Message.warning('请填写必填项')
                    warningTimes++
                             return
                            }
                        })
                        $model.comingNodeForm.model.distance = ($model.comingNodeForm.model.distance && Number($model.comingNodeForm.model.distance))
                        $model.reminderForm.model["strategyNodes"].push($model.comingNodeForm.model)
                    }else if(item === "3"){
                        $model.goOnNodeForm.validate((valid) => {
                            if(valid === false) {
                             this.$Message.warning('请填写必填项')
                    warningTimes++
                             return
                            }
                        })
                        // $model.goOnNodeForm.model.distance = Number($model.goOnNodeForm.model.distance)
                        $model.reminderForm.model["strategyNodes"].push($model.goOnNodeForm.model)
                    }else if(item === "4"){
                        $model.destinationNodeForm.validate((valid) => {
                            if(valid === false) {
                             this.$Message.warning('请填写必填项')
                    warningTimes++
                             return
                            }
                        })
                        $model.destinationNodeForm.model.distance = Number($model.destinationNodeForm.model.distance)
                        $model.reminderForm.model["strategyNodes"].push($model.destinationNodeForm.model)
                    }else if(item === "5"){
                        $model.payNodeForm.validate((valid) => {
                            if(valid === false) {
                             this.$Message.warning('请填写必填项')
                    warningTimes++
                             return
                            }
                        })
                        // $model.payNodeForm.model.distance = Number($model.payNodeForm.model.distance)
                        $model.reminderForm.model["strategyNodes"].push($model.payNodeForm.model)
                    }
                })
                if(warningTimes > 0) return
                
                if(tag){
                    queryPloyUpdate($model.reminderForm.model).then(res=>{
                        if(res.data.success){
                            this.$Message.success('编辑成功！');
                            this.getList()
                            this.cancelPloy()
                        }else {
                            this.$Message.error(res.data.msg);
                        }
                    })
                }else{
                    queryPloySave($model.reminderForm.model).then(res=>{
                        if(res.data.success){
                            this.$Message.success('新增成功！');
                            this.getList()
                            this.cancelPloy()
                        }else {
                            this.$Message.error(res.data.msg);
                        }
                    })
                }

            }           

        },
        //获取分页ployList
        getList() {
            this.isLoading = true
            let data = {pageSize: Number(this.pageSize),currPage: Number(this.current)}
            
            if(this.queryParams){
                data = Object.assign(this.queryParams,data)
            }
            queryPloyList(data).then(res=>{
                if(res.data.success){
                    this.total = res.data.data.totalCount
                    this.ployList = res.data.data.list
                }
            })
        },
        getCitiyList(){
            getOnLineCity({}).then(res => { //
                let list = res.data.data||[]
                let params = {
                list: list,
                labelKey: 'city',
                valueKey: 'cityId',
                isDeep: true,
                data: {
                    loading: false,
                    type:1 //级联位置
                }
                }
                list = cpLabelValue(params)
                this.inputList[2].dropList = list
            });
        },
        reset(){
            this.queryParams = {}
            this.current = 1
            this.pageSize = 10
            this.getList()
        },
        // 搜索
        handleSearch(val) {
            val.startTime && (val.startTime = this.$moment(val.startTime).format('YYYY-MM-DD HH:mm:ss'))
            val.endTime && (val.endTime = this.$moment(val.endTime).format('YYYY-MM-DD HH:mm:ss'))
            val.effectStatus && (val.effectStatus = Number(val.effectStatus))
            val.routeNode && (val.routeNode = Number(val.routeNode))
            this.queryParams = val
            this.current = 1
            this.pageSize = 10
            this.getList()
        },
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
            queryPloyDetail(data).then(res =>{
                if(res.data.success){
                  this.detailInfo = res.data.data
                }
            })
        },
        getEditDetail(id){
            let data = { uuid : id}
            queryPloyDetail(data).then(res =>{
                if(res.data.success){
                       
                  this.editInfo = res.data.data
                  this.editInfo["strategyUuid"] = id  //存入策略id
                  this.editInfo["cityCodes"] = res.data.data.cityCodes
                }
            })
        },
        selectHandle(list){
            this.selectList = list.map(item=>item.uuid)
        },
    },
}
</script>
<style lang="less" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  /deep/ .ivu-modal-body {
    height: 650px;
    overflow-y: auto;
  }
  span.redColr {
    color: red;
  }
  .uploadBlock {
    position: relative;
  }
  .uploadTxt {
    position: absolute;
    left: 85px;
    top: -11px;
    color: #999888;
    -webkit-transform: scale(0.95);
    transform: scale(0.96);
  }
</style>
