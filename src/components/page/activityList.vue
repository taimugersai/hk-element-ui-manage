<template>
    <div class="table">
        <!-- 面包屑 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 活动管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/activity' }"> 活动列表</el-breadcrumb-item>
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
                // 表格配置
                tableData:[{title:"ID",data:"id",width:'150'},{title:"活动头图",data:"cover"},{title:"活动名称",data:"title"}],
                //新增按钮跳转的路由
                router:"addActivity",
                //接口地址
                url:"/activities",
                // 每页显示数量
                size:0,
                //总数量
                total:0
            }
        },
        components: {
            hk_table
        },
    }
</script>