<template>
    <div class="passenger-recommand-driver">
        <search-list :inputList="inputList" @on-search="searchData" @on-reset="resetData"></search-list>
        <div class="button-wrap">
            <Button type="primary" v-hasAuth="'agent-recruit-add'" @click="showAdd = true">新增推荐奖励配置</Button>
            <Button type="primary" v-hasAuth="'agent-recruit-award'" @click="turnToReward">奖励信息</Button>
        </div>
        <m2-table
            class="top15"
            :current="tableConfig.current"
            :total="tableConfig.total"
            :pageSize="tableConfig.pageSize"
            :parColumns="tableConfig.tableColumns"
            :parTableData="tableConfig.tableData"
            :isLoading="isLoading"
            @changePage="tablePageChange"
            @changePageSize="tablePageSizeChange">
        </m2-table>
        <!-- 操作记录弹框 -->
        <Modal v-model="showRecord" title="操作记录">
            <div class="showRecord-content">
                <v-table
                    stripe
                    :current="modalTable.current"
                    :pageSize="modalTable.pageSize"
                    :parColumns="modalTable.tableColumns"
                    :parTableData="modalTable.tableData"
                    :isShowPage="false">
                </v-table>
            </div>
            <div slot="footer">
                <Button type="primary" @click="showRecord = false">确定</Button>
            </div>
        </Modal>
        <!-- 新增推荐奖励配置弹框 -->
        <add-rule v-if="showAdd" :showAdd="showAdd" :cityList="cityList" @close="close" @confirmAdd="confirmAdd"></add-rule>
        <!-- 详情 -->
        <detail-modal
            :show="showDetail"
            :info="detailInfo"
            @close="showDetail=false">
        </detail-modal>
    </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { inputList, tableColumns, modalTableColumns } from './fields.js';
import addRule from './addRule/index.vue'
import detailModal  from './detail/index.vue'
import { cpTranslate } from '@/libs/tools';
import {
    axiosAgentRuleStop,
    axiosRewardList,
    axiosAgentRuleHistory,
    getCityList
} from '_o/api/operator-carrier';
import { constants } from 'crypto';
export default {
    name: 'agent-recommand-driver',
    components: { addRule,m2Table,detailModal },
    data() {
        return {
            isLoading: false,
            inputList: JSON.parse(JSON.stringify(inputList)),
            showRecord: false,
            tableConfig: {
                searchParams: {},
                current: 1,
                total: 0,
                pageSize: 10,
                tableColumns: tableColumns(this),
                tableData: []
            },
            modalTable: {
                current: 1,
                pageSize: 10,
                tableColumns: modalTableColumns(this),
                tableData: []
            },
            showAdd: false,
            dateOptions: {},
            cityList: [],
            showDetail: false,
            detailInfo: {}
        };
    },
    mounted() {
        this.translateCityList();
        this.getTableConfigData();
    },
    methods: {
        translateCityList() {
            getCityList({}).then(res => {
                let list = cpTranslate(res.data.data);
                this.inputList[1].cascaderList = [...list];
                this.cityList = [...list];
            });
        },
        searchData(params) {
            this.tableConfig.searchParams = params;
            this.tableConfig.current = 1;
            this.getTableConfigData();
        },
        resetData() {
            // 重置搜索条件与分页
            this.tableConfig.current = 1;
            this.tableConfig.searchParams = {};
            this.getTableConfigData();
        },
        // 获取列表数据
        getTableConfigData(params = this.tableConfig.searchParams) {
            let conf = {
                currPage: this.tableConfig.current,
                pageSize: this.tableConfig.pageSize
            };
            params = Object.assign(conf, params);
            this.isLoading = true
            axiosRewardList(params).then(res => {
                let list = res.data.data.list;
                this.tableConfig.tableData = list;
                this.tableConfig.total = res.data.data.totalCount;
                this.isLoading = false
            }).catch(err=>{
                this.isLoading = false
            })
            this.$store.commit('changeLoadingFlag', false);
        },
        tablePageChange(page) {
            this.tableConfig.current = page;
            this.getTableConfigData();
        },
        tablePageSizeChange(pageSize) {
            this.tableConfig.pageSize = pageSize;
            this.getTableConfigData();
        },
        // 确认新增
        confirmAdd() {
            this.getTableConfigData();
            this.close();
        },
        // 取消新增
        close() {
            this.showAdd = false;
        },
        // 终止数据
        finishData(data) {
            axiosAgentRuleStop({
                id: data.id
            }).then(res => {
                this.$Message.success('奖励配已被终止');
                this.getTableConfigData();
            });
        },
        // 获取操作记录列表数据
        getModalTableData(data) {
            axiosAgentRuleHistory({
                id: data.id
            }).then(res => {
                this.modalTable.tableData = res.data.data;
            });
        },
        // 格式化数字为两位小数
        formatNumber(value) {
            let reg = /^\d+\.\d{3,}$/;
            if (reg.test(value)) {
                let number = value.toFixed(2) - 0
                return number;
            }
            return value;
        },
        turnToReward(){
            this.$router.push({name:'agent-reward-list'})
        }
    }
};
</script>

<style lang="less">
.passenger-recommand-driver {
    .button-wrap {
        display: flex;
        justify-content: space-between;
    }
}
</style>