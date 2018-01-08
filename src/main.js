import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ue from './views/editor/editor';
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import Vuex from 'vuex';
import Vueditor from 'vueditor';

import 'vueditor/dist/style/vueditor.min.css';

Vue.use(ElementUI);
//Vue.use(axios);
Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
if(localStorage.getItem('token')){
	//console.log(localStorage.getItem('token'))
	axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');
	axios.defaults.headers.common['Accept'] = 'application/json';
}





require('froala-editor/js/froala_editor.pkgd.min')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('font-awesome/css/font-awesome.css')
require('froala-editor/css/froala_style.min.css')

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'
Vue.use(VueFroala)