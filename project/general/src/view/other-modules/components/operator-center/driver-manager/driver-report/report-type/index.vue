<template>
    <div>
        <div>
            <SearchList
                ref="searchList"
                :inputList="inputList"
                @on-search="queryData"
                @on-reset="clearQueryData">
            </SearchList>

            <Button type="primary" v-hasAuth="'report-type-add'" @click="handleItem('新建报备类型', 'A')">新建</Button>
            <VTable
                    style="margin-top: 20px;"
                    :total="total"
                    :current="currPage"
                    :pageSize="pageSize"
                    :isLoading="isLoading"
                    :parColumns="tableColumns"
                    :parTableData="tableData"
                    @changePage="changePage"
                    @changePageSize="changePageSize">
            </VTable>
        </div>
        <Modal
            v-model="modelFlag"
            :title="modelTitle"
            :mask-closable="false">
             <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="报备类型" prop="reportDesc">
                    <Input v-model="formValidate.reportDesc" :maxlength="20" style="width: 300px"></Input>
                    <span class="counter">( {{formValidate.reportDesc ? formValidate.reportDesc.length : 0}}/20 )</span>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" @click="ok">确定</Button>
            </div>
        </Modal>
    </div>

</template>

<script>
    import { inputList, pageData, tableTitle } from './fields.js'
    import { reportTypeList, addReportType, editReportType, reportTypeDetail, setEnableStatus, moveReportType } from "_o/api/operator-carrier";
    
    export default {
        name: 'reportRecord',
        components: {
            
        },
        data () {
            return {
                inputList: inputList(this),
                tableColumns: tableTitle(this),
                ...pageData,
                queryAjaxPramas: {},
                isLoading: false,
                modelTitle: '新建报备类型',
                uuid: '',
                editflag: '',
                modelFlag: false,
                formValidate: {
                    reportDesc: ''
                },
                ruleValidate: {
                    reportDesc: [
                        { required: true, message: '请输入报备类型', trigger: 'blur' }
                    ],
                }
            }
        },
        mounted () {
            this.getList()
        },
        watch: {
            modelFlag () {
                this.$refs['formValidate'].resetFields();
            }
        },
        methods: {
            queryData (data) {
                this.currPage = 1
                this.queryAjaxPramas = data
                this.getList()
            },
            clearQueryData () {
                this.currPage = 1
                this.queryAjaxPramas = {}
                this.getList()
            },
            getList () {
                this.isLoading = true
                let params = {
                    currPage: this.currPage,
                    pageSize: this.pageSize,
                    ...this.queryAjaxPramas
                }
                reportTypeList(params).then(res => {
                    this.isLoading = false
                    this.tableData = res.data.data.list || [];
                    this.total = res.data.data.totalCount || 0;
                })
            },
            changePageSize (val) {
                this.pageSize = val
                this.getList()
            },
            changePage (val) {
                this.currPage = val
                this.getList()
            },
            handleItem (title, flag) {
                this.modelTitle = title
                this.modelFlag = true
                this.editflag = flag
            },
            detailReport (uuid) {
                this.uuid = uuid
                reportTypeDetail({recordUuid: uuid}).then(res => {
                    console.log(res.data.data.reportDesc)
                    this.formValidate.reportDesc = res.data.data.reportDesc.length > 20 ? 
                                                    res.data.data.reportDesc.substring(0, 20) :
                                                    res.data.data.reportDesc
                    this.uuid = res.data.data.recordUuid
                })
            },
            ok () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        if(this.editflag === 'A'){
                            addReportType({...this.formValidate}).then(res => {
                                this.modelFlag = false
                                this.getList()
                            })
                            return
                        }
                        let params = {
                            recordUuid: this.uuid,
                            ...this.formValidate
                        }
                        editReportType(params).then(res => {
                            this.modelFlag = false
                            this.getList()                                
                        })
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            cancel () {
                this.modelFlag = false
            },
            setEnableStatus (uuid, flag) {
                setEnableStatus({recordUuid: uuid}).then(res => {
                    if(res.data.success){
                        this.getList()
                        flag ===1 ? this.$Message.warning('已停用') : this.$Message.success('启用成功')
                    }else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            moveReportType (uuid, flag) {
                moveReportType({recordUuid: uuid, moveFlag: flag}).then(res => {
                    this.getList()
                })
            }
        }
    }
</script>
<style lang="less">
    .day-end-number {
        .ivu-form-item-content {
            margin: 0 !important;
        }
    }
</style>
