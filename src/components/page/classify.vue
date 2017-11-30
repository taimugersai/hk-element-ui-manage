<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 商品分类</el-breadcrumb-item>
                <el-breadcrumb-item> 商品分类列表</el-breadcrumb-item>
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
                 tableData:[{title:"ID",data:"id",width:'150'},{title:"分类名",data:"name"},{title:"分类描述",data:"desc"},{title:"封面图",data:"cover"},{title:'分类排序',data:'order'}],
                router:"addClassify",
                url:"/categories",
                size:0,
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