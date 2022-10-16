<template>
    <div>
        <Tabs v-model="activeTab">
            <TabPane name="1" label="用户反馈信息" style="padding-top: 10px;">
                <feedbackDetail v-if="activeTab === '1'"></feedbackDetail>
            </TabPane>
            <TabPane name="2" label="反馈类型设置" style="padding-top: 10px;">
                <feedbackTool v-if="activeTab === '2'"></feedbackTool>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import feedbackTool from './feedback-tool/index';
    import feedbackDetail from './feedback-detail/index';

    export default {
        name: 'feedback',
        components: {
            feedbackTool,
            feedbackDetail,
        },
        data() {
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