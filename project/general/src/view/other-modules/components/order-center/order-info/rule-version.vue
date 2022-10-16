<template>
    <div class="rule-version">
        <Modal v-model="showModal" :mask-closable=false>
            <div slot="header" class="modal-header">
                <span>{{ title }}</span>
                <span>版本号：{{ formItem.version }}</span>
            </div>
            <div class="modal-content">
                <Row>
                    <Col span="12">所选城市： {{formItem.cityName}}</Col>
                    <Col span="12">业务类型： {{formItem.typeModule | businessType}}</Col>
                </Row>
                <Row>
                    <Col span="24">策略名称： {{formItem.fareTypeNote}}</Col>
                </Row>
                <Row>
                    <Col span="24">生效时间： {{formItem.effectiveTime}}</Col>
                </Row>
                <Row>
                    <Col span="24">订单类型： {{formItem.typeTime | typeTime}}</Col>
                </Row>
                <Row>
                    <Col span="24">起步费（元）：{{formItem.startFare}}</Col>
                </Row>
                <Row>
                    <Col span="24">起步里程（公里）：{{formItem.startTrip}}</Col>
                </Row>
                <Row>
                    <Col span="24">起步时长（分钟）：{{formItem.startDuration}}</Col>
                </Row>
                <Row>
                    <Col span="24">时长费（元/分钟）：{{formItem.beyondTimeFare}}</Col>
                </Row>
                <Row>
                    <Col span="24">里程费（元/公里) ： {{formItem.beyondTripFare}}</Col>
                </Row>
                <Row>
                    <Col span="24">超时等待费（元/分钟）： {{formItem.beyondWaitFare}}</Col>
                </Row>
                <Row>
                    <Col span="24">免费等待时长（分钟）： {{formItem.freeWaitTime}}</Col>
                </Row>
                <Row>
                    <Col span="24">远程里程（公里）： {{formItem.haulBackTrip}}</Col>
                </Row>
                <Row>
                    <Col span="24">远程里程费（元/公里)：  {{formItem.haulBackTripFare}}</Col>
                </Row>
                <Row>
                    <Col span="24">夜间费（元/公里）： {{formItem.nightTripFare}}</Col>
                </Row>
            </div>
            <div slot="footer">
                <Button @click="changeStatus(false)">取消</Button>
                <Button type="primary">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    name: 'ruleVersion',
    props: {
        formItem: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showModal: false,
            title: '定价策略详情',
            version: 'DJ0002'
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

<style>

</style>
