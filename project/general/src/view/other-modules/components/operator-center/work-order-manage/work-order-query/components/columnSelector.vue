<!-- 
 * @description: 
 * @author: Tom Dai 
 * @date: 2020-05-12 15:56:37
 * @后台人员:  
!-->
<template>
    <div class="selectorBox">
         <Row>
             <Checkbox
             style="padding-left:15px"
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll"> <span style="padding-left:5px">共{{totalColumnKeysNew.length}}项 </span></Checkbox>
            <Divider dashed />
            <CheckboxGroup
                v-model="selectedKeys"
                @on-change="handleSelect"
            >
                
                <div class="flexBox" :class="[searchType==1 ? 'driverHeight' : ''] ">
                    <Checkbox
                    :label="item.key"
                    v-for="(item, index) in totalColumnNew"
                    :key="index"
                    >
                    <span>{{item.title}}</span>
                </Checkbox>
                </div>
            </CheckboxGroup>
        </Row>
        <Divider dashed />
        <Row>
            <Col
                span="4 "
                v-for="(item, index) in selectedItems"
                :key="index"
            >
                <div class="selectedItems" v-if="item"> {{item.title}} </div>
            </Col>
        </Row>
    
       
        <!-- <Row style="marginTop:20px" >
            <Button type="primary" @click="saveInCache">保存为默认</Button>
        </Row> -->
    </div>
</template>
<script>
import  { defaultData, driverColumn ,defaultColumn} from '../fields'
// import {
//     saveColumnsInCloud,
//     readColumnsInCloud
// } from '@/api/data'
export default {
    name: '',
    props:{
        searchType:{
            type:Number,
            default:1
        }

    },
    computed:{
        totalColumnNew(){
            let arr = []
            this.totalColumn.map((i)=>{
                if(!i.type){
                    arr.push(i)
                }
            })
            return arr
        },
        totalColumnKeysNew(){
            let arr = []
            this.totalColumn.map((i)=>{
                if(!i.type){
                    arr.push(i.key)
                }
            })
            return arr
        }
    },
    data() {
        return {
            columnList: [
                { label: '日期', keyName: 'date' },
                { label: '运营商', keyName: 'agentName' },
                { label: '合规司机数', keyName: 'driverCount' },
            ],
            selectedItems: [],
            selectedKeys: [],
            totalColumn:[],
            ...defaultData,
            keyMap:{
                1: "driver",
                2: "team",
                3: "agent"
            },
            checkAll: false,
            indeterminate: true,
        }
    },
    mounted(){
         this.setTotalCos()
            this.getLocalColumn()
       
    },
    methods: {
        //选中
        handleSelect(items) {
            this.selectedItems = []
            let totalColumn = JSON.parse(JSON.stringify(this.totalColumn))
            // const x = this.selectedKeys.map((item) => {
            //         const y = this.totalColumn.filter(key => key.key == item )
            //         this.totalColumn.map((key)=>{
            //             if(key.key == item){
            //                 this.selectedItems.push(key)
            //             }
            //         })
                    
            // })
            this.totalColumn.forEach((item) => {
                this.selectedKeys.forEach(key => {
                    if (item.key === key) {
                        this.selectedItems.push(item)
                    }
                })
            })
            if(this.selectedItems.length == this.totalColumnNew.length){
                this.indeterminate = false;
                this.checkAll = true;
            }else if(this.selectedItems.length > 0){
                this.indeterminate = true;
                this.checkAll = false;
            }else{
                this.indeterminate = false;
                this.checkAll = false;
            }
            
        },
        comfirmMethod(){
            this.$emit('takeFun',this.selectedItems)
        },
        setTotalCos(){
            switch (this.searchType) {
                case 1: 
                    this.totalColumn = driverColumn(this)
                break
                case 2: 
                    this.totalColumn = this.motorcadeColumn
                break
                case 3: 
                    this.totalColumn = this.operationColumn
                break
                default :
                 this.totalColumn = driverColumn

            }
        },
        // 储存到本地
        saveInCache(){
            // let keyName = this.keyMap[this.searchType]
            // let oriCols = JSON.parse(localStorage.getItem('savedColumns')) ? JSON.parse(localStorage.getItem('savedColumns')) : {}
            // oriCols[keyName] = this.selectedKeys
            let columns = this.selectedKeys.join(",")
            let params = {
                type: this.searchType,
                excelHeaderListStr:columns
             }
            //  saveColumnsInCloud(params).then(res=>{
            //      this.$Message.success("保存成功");
            //  })
            // localStorage.setItem('savedColumns',columns)

        },
        // 获取本地储存项
        getLocalColumn(){
            // const columnList = JSON.parse(localStorage.getItem('savedColumns'))
            // let arr = []
            //  this.totalColumn.map(item=>{
            //      if(!item.type) {
            //           arr.push(item.key)
            //      }
            //  })
            //  this.selectedKeys = arr
            let params = { type: this.searchType}
            // readColumnsInCloud(params).then(res=>{
            //     if (res.data.success && res.data.data.accountUuid) {
            //         let keys= res.data.data.excelHeaderListStr.split(',')
            //         this.selectedKeys =  JSON.parse(JSON.stringify(keys))
            //         this.handleSelect()
            //     }
            // })
            //  this.handleSelect()
            
            // let keyName = this.keyMap[this.searchType]
            //  if(columnList && columnList[keyName]){
            //     this.selectedKeys = columnList[keyName]
            //  }
            
                
        },
        handleCheckAll(){
            if (this.indeterminate) {
                    
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                    
                }
                this.indeterminate = false;
                if (this.checkAll) {
                    
                    this.selectedKeys = this.totalColumnKeysNew;
                    this.handleSelect()

                } else {
                    this.selectedKeys = [];
                }
            // 
               
        }
    }
}
</script>
<style scoped lang='less'>
.selectorBox {
    .selectedItems {
        min-width: 90px;
        line-height: 25px;
        text-align: center;
        background: #dddddd;
        color: #000;
        border-radius: 4px;
        margin: 5px;
    }
    .flexBox{
        height: 300px;
        width: 100%;
        // overflow: scroll;
        writing-mode: vertical-lr;
        label{
            writing-mode: horizontal-tb;
            float: left;
            width: 210px;
            padding-left: 15px;
            height: 25px;
            border-right: 1px solid #e8eaec;
        }
    }
    .driverHeight{
         height: 250px;
    }
}
</style>