<template>
    <div>
        <div v-show="mainFlag">
            <SearchList
                ref="searchList"
                :inputList="inputList"
                @on-search="queryData"
                @on-reset="clearQueryData"
                @cascade-change="handleCityChange">
            </SearchList>
            <VTable
                    style="margin-top: 20px;"
                    :total="total"
                    :current="current"
                    :pageSize="pageSize"
                    :isLoading="isLoading"
                    :parColumns="tableColumns"
                    :parTableData="tableData"
                    @changePage="changePage"
                    @changePageSize="changePageSize">
            </VTable>
        </div>
        <report-detail :reportDetailInfo="reportDetailInfo" v-if="!mainFlag" @on-close="mainFlag=true"></report-detail>
    </div>

</template>

<script>
    import { inputList, pageData, tableTitle } from './fields.js'
    import { getProvinceCityList } from "_g/api/common.js";
    import { getAlltAgentByCity,queryReportTypeNameList,queryPageDriverReportList,queryDriverReportDetail } from "_o/api/operator-carrier";
    import reportDetail from './detail'
    import { tool } from "_o/api/baseMixin.js";
    import { mapActions, mapState } from 'vuex'
    export default {
        mixins: [tool],
        name: 'reportRecord',
        components: {
            reportDetail
        },
        data () {
            return {
                inputList: inputList(this),
                tableColumns: tableTitle(this),
                ...pageData,
                mainFlag: true,
                queryAjaxPramas: {},
                isLoading: false,
                reportDetailInfo:{}
            }
        },
        created(){
            this.getList();
            this.getAccessCityList();
            this.getReportTypeList();
            this.getAlltAgentByCity();
        },
        mounted () {
            
        },
        activated() {
            
        },
        computed: mapState({
            cityList: state => state.common.accessProvinceCityList
        }),
        methods: {
            ...mapActions([
                'getAccessCityList',
            ]),
            handleCityChange(value) {
              console.log(value)
              const [provinceCode, citycode] = value;
              this.getAlltAgentByCity(citycode);
            },
            // 根据城市code 获取运营商列表
            async getAlltAgentByCity(cityCode) {
                let [err, data] = await this.toResult(getAlltAgentByCity({ cityCode: cityCode }));
                if (err || !data){
                    this.inputList[1].dropList=[]
                    this.inputList[1].value=''
                    return
                };
                let list = data;
                this.inputList[1].dropList = list.map(item => {
                  return {
                    label: item.name,
                    value: item.uuid
                  };
                });
            },
            async getReportTypeList(){
                let [err, data] = await this.toResult(queryReportTypeNameList({ }));
                if (err || !data) return;
                let list = data;
                this.inputList[5].dropList = list.map(item => {
                  return {
                    label: item.reportDesc,
                    value: item.reportType
                  };
                });
            },
            async getReportDetail(reportUuid){
                let [err, data] = await this.toResult(queryDriverReportDetail({reportUuid:reportUuid}));
                if (err || !data) return;
                this.mainFlag=false
                this.reportDetailInfo=data
            },
            queryData (data) {
                this.currPage = 1
                this.queryAjaxPramas = data
                data.reportStartDate && (this.queryAjaxPramas.reportStartDate=this.$moment(data.reportStartDate).format('YYYY-MM-DD'))
                data.reportEndDate && (this.queryAjaxPramas.reportEndDate=this.$moment(data.reportEndDate).format('YYYY-MM-DD'))
                this.getList()
            },
            clearQueryData () {
                this.currPage = 1
                for (let key in this.queryAjaxPramas) {
                  delete this.queryAjaxPramas[key];
                }
                this.getList()
            },
            async getList () {
                let params = {
                    currPage: this.currPage,
                    pageSize: this.pageSize,
                    ...this.queryAjaxPramas
                }
                let [err, data] = await this.toResult(queryPageDriverReportList(params));
                if (err || !data) return;
                this.tableData = data.list || [];
                this.total = data.totalCount || 0;
            },
            changePageSize (val) {
                this.pageSize = val
                this.getList()
            },
            changePage (val) {
                this.currPage = val
                this.getList()
            },
        },
        watch: {
            cityList: {
                handler(newVal, oldVal) {
                    this.inputList[0].cascaderList = this.cityList
                },
                deep: true
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
