<!-- 
 * @description: 
 * @author: Tom Dai 
 * @date: 2020-06-08 17:14:24
 * @后台人员:  
!-->
<template>
    <div>
        <Row>
            <span> 标题：</span> <Input
                v-model="title"
                placeholder=""
                style="width: 200px"
            />
        </Row>
        <Row style="marginTop:20px">
            <Table
                border
                :columns="columns"
                :data="tableData"
            ></Table>
        </Row>
    </div>
</template>
<script>
export default {
    name: '',
    data() {
        return {
            title: '',
            columns: [
                {
                    title: '类别',
					key: 'name',
					minWidth: 120
				},
				{
                    title: '标题',
					key: 'title',
					minWidth: 120
				},
				{
                    title: '未查看人数',
					key: 'no',
					minWidth: 120
				},
				{
                    title: '请选择',
					key: 'no',
					minWidth: 120
                },
            ],
            tableData: []
        }
    }
}
</script>
<style scoped lang='less'>
</style>