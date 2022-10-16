<template>
    <div>
        <Tabs v-model="activeTab">
            <TabPane name="1" label="报备记录" style="padding-top: 10px;">
                <report-record></report-record>
            </TabPane>
            <TabPane name="2" label="报备类型" style="padding-top: 10px;">
                <report-type></report-type>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import reportRecord from './report-record/index';
import reportType from './report-type/index';

export default {
    name: 'attendance-manage',
    components: {
        reportRecord,
        reportType
    },
    data(){
        return {
            activeTab: '1'
        }
    }
}
</script>

<style lang="less">
.content-container {
    margin: 10px 0 0 0;
    .operate-wrap {
        margin: 0 0 10px 0;
        text-align: right;
    }
}
</style>
