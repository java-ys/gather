<template>
    <div class="searchWrap">
        <div class="search-input">
            <Input v-model="keyword" placeholder="请输入地址" style="width: 200px" @on-change="autoCompleteSearchStreet" @on-enter="enterHandle">
                <span class="searchBtn" slot="append" @click.stop="autoCompleteSearchStreet">搜索</span>
            </Input>
        </div>
        <div class="search-tips">
            <ul v-show="showList">
                <li v-for="(tip, index) in tips"
                :key="index"
                @click="changeTip(tip)"
                @mouseover="selectedTip=index"
                :class="{'autocomplete-selected': index === selectedTip}">
                {{tip.name}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            keyword:"",
            tips:[],
            selectedTip:0,
            showList:true
        }
    },
    props:{
        searchOption:{
            type:Object,
            default(){
                return {}
            }
        },
        onSearchResult:{
            type:Function,
            default(){
                return ()=>{}
            }
        }
    },
    mounted(){
        this._onSearchResult = this.onSearchResult;
    },
    methods:{
        hideList(){
            this.showList= false;
        },
        // 选中地址
        changeTip(tip) {
            this.keyword = tip.name;
            this.placeSearchStreet();
            this.hideList();
        },
        placeSearchStreet(str){
            const {keyword,searchOption} = this;
            var placeSearch = new AMap.PlaceSearch(searchOption);
            placeSearch.search(str||keyword, (status, result)=> {
                // 查询成功时，result即对应匹配的POI信息
                let {poiList: {pois}} = result;
                let LngLats = pois.map(poi => {
                    poi.lat = poi.location.lat;
                    poi.lng = poi.location.lng;
                    return poi;
                });
                this._onSearchResult(LngLats);
            })
        },
        enterHandle(){
            this.autoCompleteSearchStreet();
            this.hideList();
            this.tips = [];
        },
        // 搜索地址详情
        autoCompleteSearchStreet(){
            const {searchOption,keyword} = this;
            const _autoComplete = new AMap.Autocomplete(searchOption);
            _autoComplete.search(keyword, (status, result) => {
                if (status === 'complete') {
                    this.tips = result.tips;
                    this.showList = true;
                    // this.placeSearchStreet(this.tips[0].name)
                }
            });
        },
    }
}
</script>
<style lang="less" scoped>
.searchBtn{
    cursor: pointer;
}
.search-tips{
  position: absolute;
  top: 100%;
  border: 1px solid #dbdbdb;
  background: #FFF;
  overflow: auto;
  z-index: 10;
  max-height: 400px;
  ul {
    padding: 0;
    margin: 0;
    li {
        height: 40px;
        line-height: 40px;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
        padding: 0 10px;
        cursor: pointer;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        &.autocomplete-selected {
            background: #eee;
        }
    }
  }
}
</style>