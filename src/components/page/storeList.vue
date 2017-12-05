<template>
    <div class="table">
        <!-- 面包屑 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 门店管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/store' }"> 门店列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 表格 -->
        <!-- tableData为返回数据，router为新增按钮跳转路由，url为接口地址，size为每页显示，total为总条数 -->
        <hk_table :tableData='tableData'  :router="router" :url="url" :size="size" :total="total"></hk_table>
    </div>
</template>

<script>
    import hk_table from './hk_table'
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