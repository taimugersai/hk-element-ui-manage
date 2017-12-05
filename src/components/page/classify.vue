<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 商品分类</el-breadcrumb-item>
                <el-breadcrumb-item> 商品分类列表</el-breadcrumb-item>
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
                tableData:[{title:"ID",data:"id",width:'150'},{title:"分类名",data:"name"},{title:"分类描述",data:"desc"},{title:"封面图",data:"cover"},{title:'分类排序',data:'order'}],
                //新增按钮跳转的路由
                router:"addClassify",
                //接口地址
                url:"/categories",
                // 每页显示数量
                size:0,
                //总数量
                total:0
            }
        },
        components: {
            hk_table
        },
        mounted:function(){
        }
    }
</script>