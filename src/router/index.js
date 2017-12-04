import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/index',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/console.vue'], resolve)
                },
                {
                    path: '/console',
                    component: resolve => require(['../components/page/console.vue'], resolve)
                },
                {
                    path: '/classify',
                    component: resolve => require(['../components/page/classify.vue'], resolve)
                },
                {
                    path: '/addClassify',
                    component: resolve => require(['../components/page/addClassify.vue'], resolve)
                },
                {
                    path: '/goods',
                    component: resolve => require(['../components/page/goodsList.vue'], resolve)
                },
                {
                    path: '/addGood',
                    component: resolve => require(['../components/page/addGoods.vue'], resolve)
                },
                {
                    path: '/spec',
                    component: resolve => require(['../components/page/specList.vue'], resolve)
                },
                {
                    path: '/addSpec',
                    component: resolve => require(['../components/page/addSpec.vue'], resolve)
                },
                {
                    path: '/order',
                    component: resolve => require(['../components/page/orderList.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/bigOrder',
                    component: resolve => require(['../components/page/bigOrder.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/bigOrderDetail',
                    component: resolve => require(['../components/page/bigOrderDetail.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/orderDetail',
                    component: resolve => require(['../components/page/orderDetail.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/store',
                    component: resolve => require(['../components/page/storeList.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/addStore',
                    component: resolve => require(['../components/page/addStore.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/addActivity',
                    component: resolve => require(['../components/page/addActivity.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/activity',
                    component: resolve => require(['../components/page/activityList.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/member',
                    component: resolve => require(['../components/page/memberList.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/banner',
                    component: resolve => require(['../components/page/banner.vue'], resolve)    
                },
                {
                    path: '/addBanner',
                    component: resolve => require(['../components/page/addBanner.vue'], resolve)    
                },
                {
                    path: '/changePassword',
                    component: resolve => require(['../components/page/changePassword.vue'], resolve)    
                },
                {
                    path: '/baseform',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve)
                },
                {
                    path: '/vueeditor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve)    // Vue-Quill-Editor组件
                },
                {
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve)     // Vue-Quill-Editor组件
                },
                {
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve)       // Vue-Core-Image-Upload组件
                },
                {
                    path: '/basecharts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve)   // vue-schart组件
                },
                {
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve)    // 拖拽列表组件
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
