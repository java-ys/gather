<template>
    <div class="handle-record">
        <Modal v-model="showModal" title="操作记录" width=1000>
            <div class="content">
                <v-table :total="tableConfig.total" :current="tableConfig.current"
                    :pageSize="tableConfig.pageSize" :isLoading="tableConfig.isLoading"
                    :parColumns="tableConfig.tableColumns" :parTableData="tableConfig.tableData"
                    @changePage="changePage" @changePageSize="changePageSize"></v-table>
            </div>
            <div slot="footer">
                <Button @click="cancleData">取消</Button>
                <Button type="primary" @click="confirmData">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import vTable from '_a/v-table/v-table.vue'
import { getHandleRecordList } from '_o/api/configData.js'
export default {
    name: 'handle-record',
    components: { vTable },
    props: {
        cityType: {
            required: true
        },
        cityCode: {
            required: true
        },
        year: {
            required: true
        }
    },
    data() {
        return {
            showModal: false,
            tableConfig: {
                total: 0,
                current: 1,
                pageSize: 10,
                isLoading: false,
                tableColumns: [
                    {key: 'isWork', title: '操作类型', render: (h, params) => {
                        let map = {
                            1: '设为工作日',
                            2: '设为休息日'
                        }
                        return h('span', {}, map[params.row.isWork])
                    }},
                    {key: 'cityName', title: '省/市'},
                    {key: 'date', title: '日历日期', render: (h, params) => {
                        let data = params.row;
                        return h('span', {}, `${data.year}-${data.month}-${data.day}`)
                    }},
                    {key: 'remark', title: '备注'},
                    {key: 'createTime', title: '操作时间', render: (h, params) => {
                        // 返回秒格式转换为毫秒
                        let date = new Date(params.row.createTime * 1000);
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        month = month > 9 ? month : '0' + month;
                        let day = date.getDate();
                        day = day > 9 ? day : "0" + day;
                        let hour = date.getHours();
                        hour = hour > 9 ? hour : '0' + hour;
                        let min = date.getMinutes();
                        min = min > 9 ? min : '0' + min;
                        let sec = date.getSeconds();
                        sec = sec > 9 ? sec : '0' + sec;
                        return h('span', {}, `${year}-${month}-${day} ${hour}:${min}:${sec}`)
                    }},
                    {key: 'creatorName', title: '操作人'},
                ],
                tableData: []
            }
        }
    },
    methods: {
        getTableData() {
            let conf = {
                currPage: this.tableConfig.current,
                pageSize: this.tableConfig.pageSize,
                year: this.year
            }
            getHandleRecordList(conf).then(res => {
                this.$store.commit('changeLoadingFlag', false);
                let data = res.data.data.list;
                this.tableConfig.tableData = data;
                this.tableConfig.total = res.data.data.totalCount;
            })
        },
        changePage(page) {
            this.tableConfig.current = page;
            this.getTableData();
        },
        changePageSize(size) {
            this.tableConfig.pageSize = size;
            this.getTableData();
        },
        changeModalStatus(bool) {
            this.showModal = bool
        },
        cancleData() {
            this.showModal = false
        },
        confirmData() {
            this.showModal = false
        }
    }
}
</script>

<style lang="less">
</style>
