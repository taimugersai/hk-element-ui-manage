<template>
	<div class="login-wrap">
		<div class="ms-title">品默&麻麻香管理系统</div>
		<div class="ms-login">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
				<el-form-item prop="username">
					<el-input v-model="ruleForm.username" placeholder="username"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
				</div>
				<!-- <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p> -->
			</el-form>
		</div>
	</div>
</template>

<script>
	import api from '../../api/api.json'
	import axios from 'axios';
	import qs from 'qs';
	export default {
		data: function() {
			return {
				ruleForm: {
					username: '',
					password: ''
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			submitForm(formName) {
				const self = this;
				//设置axios请求头
				axios.defaults.headers.common['Accept'] = 'application/json';
				axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
				//满足表单验证
				self.$refs[formName].validate((valid) => {
					if(valid) {
						axios.post(api.baseUrl + api.Login.url,
							qs.stringify({
								name: self.ruleForm.username,
								password: self.ruleForm.password
							})
						).then((res) => {
							if(res.data.access_token) {
								self.$message({
									type: 'info',
									message: `登陆成功`
								});
								//设置本地缓存token
								localStorage.setItem('token', res.data.access_token);
								//添加axios请求头
								axios.defaults.headers.common['Authorization'] = 'Bearer '+res.data.access_token;
								//返回状态判断(添加响应拦截器)
								
								//页面跳转
								self.$router.push('/index');
							}else{
								self.$message({
									type: 'info',
									message: res.responseMsg
								});
							}
						}).catch(function(error) {
							
						});
					} else {
						//console.log('error submit!!');
						return false;
					 }
				});
			}
		}
	}
</script>

<style scoped>
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
	}
	
	.ms-title {
		position: absolute;
		top: 50%;
		width: 100%;
		margin-top: -230px;
		text-align: center;
		font-size: 30px;
		color: #fff;
	}
	
	.ms-login {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 300px;
		height: 160px;
		margin: -150px 0 0 -190px;
		padding: 40px;
		border-radius: 5px;
		background: #fff;
	}
	
	.login-btn {
		text-align: center;
	}
	
	.login-btn button {
		width: 100%;
		height: 36px;
	}
</style>