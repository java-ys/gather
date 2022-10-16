<!-- 
 * @description: 
 * @author: Tom Dai 
 * @date: 2020-06-04 16:41:16
 * @后台人员:  
!-->
<template>
    <div>
        <SearchList
            :inputList="inputList"
            @on-search='handleSearch'
            @on-reset="reset"
        ></SearchList>
          <Row :style="{marginTop:'20px'}">
            <VTable 
                :total="total"
                :current="current" 
                :pageSize="pageSize"
                :parColumns="statisticColumns" 
                :parTableData="statisticList"
                @changePage="changePage"
                @changePageSize="changePageSize"> 
            </VTable>
        </Row>
    </div>
</template>
<script>
import { pushInputList } from './statisticFields'
export default {
    name: '',
    mounted() {
        this.inputList = pushInputList
        this.inputList[2].cascaderList = JSON.parse(localStorage.getItem('pcOperatorList'))
        console.log(JSON.parse(localStorage.getItem('pcOperatorList')))
        // this.inputList[2].cascaderList = JSON.parse(localStorage.getItem('pcOperatorList'))
    },
    data() {
        return {
            inputList:[],
            total:0,
            current:1,
            pageSize:10,
            statisticColumns:[],
            statisticList:[]
        }
    },
    computed: { 
    },
    watch: {
        // 如果 `question` 发生改变，这个函数就会运行
        'inputList': {
            handler(newVal, oldVal) {
                console.log(newVal)
            },
            immediate: true,
            deep: true
        }
    },

    methods: {
        handleSearch() { },
        reset() { },
        changePage(){},
        changePageSize(){}
    }
}
</script>
<style scoped lang='less'>
</style>