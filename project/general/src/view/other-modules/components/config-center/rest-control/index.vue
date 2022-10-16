<template>
    <div class="rest-control">
        <header>
            <searchList :inputList="inputList" @on-search="queryList" @on-reset="handelReset"></searchList>
        </header>
        <div class="content">
            <p>
                <span class="cityName">{{ cityName }}</span>
                <span class="remark" v-show="remark">备注:{{ remark }}</span>
                <Button type="primary" @click="showHandleRecord" v-hasAuth="'rest_control_record'">操作记录</Button>
            </p>
            <calendarWrap ref="calendarWrap" :cityType="cityType" :cityCode="city" :getRemark="getRemark"
                @getYear="getYear"></calendarWrap>
        </div>
        <handle-record ref="handleRecord" :cityType="cityType" :cityCode="city" :year="year"></handle-record>
    </div>
</template>

<script>
import calendarWrap from "./calendar-wrap.vue";
import handleRecord from "./handleRecord.vue";
export default {
    name: "rest_control",
    components: { calendarWrap, handleRecord },
    data() {
        return {
            inputList: [
                {
                    name: "cascader-input", // 文本输入框名
                    bind_key: ["provinceID", "cityID"], // 返回数据的key名
                    placeholder: "请选择省/市",
                    value: [0], // 绑定返回数据
                    cascaderList: [
                        { label: "全国所有城市", value: 0 },
                        ...JSON.parse(localStorage.getItem("provinceCityList"))
                    ],
                    title: "省 / 市："
                }
            ],

            city: "",
            cityType: "1", // 1 -> 全国  2 -> 指定城市
            cityName: "全国所有城市",
            year: new Date().getFullYear(),
            remark: ""
        };
    },
    methods: {
        queryList(data) {
            this.getCityName(data);
        },
        handelReset() {},
        // 获取城市名称
        getCityName(data) {
            if (data.provinceID == "0") {
                this.cityType = "1";
                this.cityName = "全国所有城市";
            } else {
                if (!!data.provinceID == false) {
                    this.$Message.warning("请选择省/市");
                    return;
                }
                this.city = data.cityID;
                this.cityType = "2";
                let cityList = JSON.parse(
                    localStorage.getItem('provinceCityList')
                );
                let p = this.getValue(data.provinceID, cityList);
                let c = this.getValue(this.city, cityList);
                this.cityName = p + " " + c;
            }
            // 子组件获取数据方法
            this.$refs.calendarWrap.getData();
        },
        getYear(year) {
            this.year = year;
        },
        getRemark(data) {
            this.remark = data;
        },
        showHandleRecord() {
            this.$refs.handleRecord.changeModalStatus(true);
            this.$refs.handleRecord.getTableData();
        },
        // 获取选中的所有日期
        getChoosenDays(data) {
            if (data && data.length == 1) {
                this.remark = "aaa";
            } else {
                this.remark = "";
            }
        },
        // 根据城市ID匹配对应中文名称
        getValue(value, arr) {
            let str = "";
            for (let list of arr) {
                if (list.value == value) {
                    str = list.label;
                    if (str != "") {
                        return str;
                    }
                } else if (list.children) {
                    str = this.getValue(value, list.children);
                    if (str != "") {
                        return str;
                    }
                }
            }
            return str;
        }
    }
};
</script>

<style lang="less">
.rest-control {
    .content {
        margin-top: 20px;
        border-top: 1px solid gray;

        p {
            padding: 10px;
            position: relative;

            .cityName {
                font-size: 25px;
            }

            .remark {
                margin-left: 30px;
            }

            button {
                position: absolute;
                right: 0;
            }
        }
    }
}
</style>
