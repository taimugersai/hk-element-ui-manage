<template>
	<div id="form">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 系统管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/changePassword' }"> 修改密码</el-breadcrumb-item>
			</el-breadcrumb-item>
			</el-breadcrumb>
			<el-row>
				<el-col :span="12">
					<hk_form :form='form'  v-on:onSubmit="onSubmit">
					</hk_form>
				</el-col>
			</el-row>
		</div>

	</div>
</template>

<script>
	import hk_form from './form'
	import api from '../../api/api.json'
	import axios from 'axios';
	import qs from 'qs';
	export default {
		data() {
			return {
				form: [
					{
						'label': '请输入密码',
						"type": 'password',
						"value": '',
						"ifRequired":true
					},
					{
						'label': '再次输入密码',
						"type": 'password',
						"value": '',
						"ifRequired":true
					},
					{
						'label': '',
						type: 'submit'
					}
				]
			}
		},
		components: {
			hk_form
		},
		methods: {
			onSubmit(){
				let self = this;
				if(self.form[0].value.length<6){
					self.$alert('密码长度过短', '提交失败', {
						confirmButtonText: '确定'
					});
					return
				}
				if(self.form[0].value!=self.form[1].value){
					self.$alert('两次密码不一致', '提交失败', {
						confirmButtonText: '确定'
					});
					return
				}

				var data={
					password:self.form[0].value
				}
				
				axios.post(api.baseUrl+'/resetPassword',qs.stringify(data)
                ).then((res) => {
                    if(res.data.responseCode == 0) {
                        self.$message({
                          type: 'info',
                          message: `网络异常，获取失败`
                        });
                    } else {
                    	self.$message({
                          type: 'info',
                          message: `修改成功`
                        });
                        self.$router.push('/login')
                    }
                }).catch(function(error) {
                    //console.log(error);
                });
			}
		}
	}
</script>

<style>
	body {
		font-family: Helvetica, sans-serif;
	}
	
	.el-breadcrumb {
		margin-bottom: 30px
	}
	
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		width: 180px;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #20a0ff;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	
	.avatar {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>