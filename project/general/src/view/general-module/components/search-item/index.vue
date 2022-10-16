<!-- 
 * @description: 
 * @author: Tom Dai 
 * @date: 2019-11-06 14:09:37
 * @后台人员:  
!-->
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
<style scoped lang='less'>
.searchItem {
    width: 100%;
    .label_title {
        font-size: 12px;
        color: #000000;
        padding-bottom: 5px;
    }
}
</style>