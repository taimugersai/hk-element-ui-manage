<template>
    <div class="table">
        <!-- 面包屑 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 轮播图管理</el-breadcrumb-item>
                <el-breadcrumb-item> 轮播图列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- tableData为返回数据，router为新增按钮跳转路由，url为接口地址，size为每页显示，total为总条数 -->
        <hk_table :tableData='tableData'  :router="router" :url="url" :size="size" :total="total"></hk_table>
    </div>
</template>

<script>
    import api from '../../api/api.json'
    import axios from 'axios';
    import qs from 'qs';
    import hk_table from './hk_table'
    export default {
        data() {
            return {
                size:0,
                total:1,
                tableData:[{title:"ID",data:"id",width:'150'},{title:"轮播图",data:"cover"},{title:"类型",data:'type',width:'150'},{title:"轮播图排序",data:"order",width:'150'}],
                router:"addBanner",
                url:"/banners",
            }
        },
        components: {
            hk_table
        },
    }
</script>