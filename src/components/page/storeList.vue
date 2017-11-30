<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 门店管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/store' }"> 门店列表</el-breadcrumb-item>
                
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
                 tableData:[{title:"ID",data:"id",width:'150'},{title:"门店名称",data:"display_name"},{title:"账号信息",data:"name"},{title:"联系电话",data:"tel"},{title:'地址',data:'address'}],
                router:"addStore",
                url:"/stores",
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