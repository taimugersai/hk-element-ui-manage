<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 活动管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/activity' }"> 活动列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <hk_table :tableData='tableData'  :router="router" :url="url" :size="size" :total="total"></hk_table>
    </div>

</template>

<script>
    import hk_table from './table'
    export default {
        data() {
            return {
                 tableData:[{title:"ID",data:"id",width:'150'},{title:"活动头图",data:"cover"},{title:"活动名称",data:"title"}],
                router:"addActivity",
                url:"/activities",
                size:0,
                total:0
            }
        },
        components: {
            hk_table
        },
    }
</script>
<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>