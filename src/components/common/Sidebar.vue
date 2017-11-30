<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                 {
                        icon: 'el-icon-setting',
                        index: 'order',
                        title: '订单管理'
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'bigOrder',
                        title: '兑换管理'
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'goods',
                        title: '商品管理',
                        subs: [
                            {
                                index: 'classify',
                                title: '商品分类'
                            },
                            {
                                index: 'addClassify',
                                title: '添加分类'
                            },
                            {
                                index: 'goods',
                                title: '商品列表'
                            },
                            {
                                index: 'addGood',
                                title: '添加商品'
                            },
                            
                        ]
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'store',
                        title: '门店管理',
                        subs: [
                            {
                                index: 'store',
                                title: '门店列表'
                            },
                            {
                                index: 'addStore',
                                title: '添加门店'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'member',
                        title: '会员管理'
                    },
                   {
                        icon: 'el-icon-setting',
                        index: 'app',
                        title: 'app配置',
                        subs: [
                            {
                                index: 'banner',
                                title: '轮播列表'
                            },
                            {
                                index: 'addBanner',
                                title: '添加轮播图'
                            },
                            {
                                index: 'activity',
                                title: '活动列表'
                            },
                            {
                                index: 'addActivity',
                                title: '添加活动'
                            },
                            
                        ]
                    },
                     {
                        icon: 'el-icon-setting',
                        index: '6',
                        title: '配置管理',
                        subs: [
                            {
                                index: 'changePassword',
                                title: '修改密码'
                            },
                        ]
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
