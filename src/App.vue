<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
</style>
<script>
	import axios from 'axios';
	let baseUrl='11111'
	// 添加响应拦截器
	// 
	export default {
		data: function() {
			return {
				
			}
		},
		mounted:function(){
			var self = this
			axios.interceptors.response.use(function (response) {
			    // 对响应数据做点什么
			    return response;
			  }, function (error) {
			    // 对响应错误做点什么
			    if (error.response) {
			      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
			      //console.log(error.response.data);
			      //console.log(error.response.status);
			      if(error.response.status==401){
			      	self.$message({
						type: 'info',
						message: `用户名密码错误`
				  	});
			      }
			      //console.log(error.response.headers);
			    } else {
			      // Something happened in setting up the request that triggered an Error
			      self.$message({
						type: 'info',
						message: `请先登陆`
				  });
				  self.$router.push('/login');
			    }
			  });
		},
		methods: {
			
		}
	}
</script>