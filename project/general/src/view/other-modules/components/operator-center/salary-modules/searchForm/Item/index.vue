<template>
    <div class="searchItem">
        <div class="label_title">{{label}}</div>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: '',
    props: {
        label: {
            type: String,
            default: ''
        }
    },
    data() {
        return {}
    }
}
</script>
<style scoped lang='scss'>
.searchItem {
    width: 100%;
    .label_title {
        font-size: 14px;
        color: #606266;
        box-sizing: border-box;
        padding-bottom: 5px;
        font-weight: bold;
    }
}
</style>