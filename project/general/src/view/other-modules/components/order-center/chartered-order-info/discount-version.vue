<template>
    <div class="discount-version">
        <Modal v-model="showModal" :mask-closable=false>
            <div slot="header" class="modal-header">
                <span>{{ title }}</span>
                <span>版本号：{{ params.versionNumber }}</span>
            </div>
            <div class="modal-content">
                <Row>
                    <Col span="12">所选城市：{{params.cityName}}</Col>
                    <Col span="12">业务类型：{{params.typeModule | businessType}}</Col>
                </Row>
                <Row>
                    <Col span="24">折扣矩阵名称：{{params.ruleName}}</Col>
                </Row>
                <Row>
                    <Col span="24">生效时间：{{params.createTime}}</Col>
                </Row>
                <Row>
                    <Col span="24">订单类型：{{params.typeTime | typeTime}}</Col>
                </Row>
                <div style="border-top: 1px solid #e3e3e3;border-bottom: 1px solid #e3e3e3;margin-top: 10px;" v-if="params.list && params.list.length > 0">
                    <Row>
                        <Col span="12" v-for="(list, index) in params.list" :key="index">
                            <Row>
                                折扣时段{{index + 1}}: {{list.startTime}} - {{list.endTime}}
                            </Row>
                            <Row>
                                折扣系数{{index + 1}}: {{list.rate}}
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
            <div slot="footer">
                <Button @click="changeStatus(false)">取消</Button>
                <Button type="primary" @click="changeStatus(false)">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    name: 'discount-version',
    props: {
        params: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showModal: false,
            title: '折扣矩阵详情',
            version: '',
        }
    },
    filters: {
        businessType(value) {
            if(!value) {
                return '暂无'
            }
            let map = {
                1: '出租',
                2: '专享',
                4: '快享'
            }
            return map[value];
        },
        typeTime(value) {
            if(!value) {
                return '暂无'
            }
            let map = {
                1: '实时订单',
                2: '预约订单'
            }
            return map[value];
        }
    },
    methods: {
        changeStatus(bool) {
            this.showModal = bool;
        }
    }
}
</script>

<style lang="less">
.modal-header {
    font-size: 16px;
    font-weight: bolder;

    :first-child {
        margin-right: 30px;
    }
}
.modal-content {

    .ivu-row {
        padding: 10px 0px;
    }
}
</style>
