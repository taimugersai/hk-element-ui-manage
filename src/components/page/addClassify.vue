<template>
	<div id="form">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 商品分类</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/classify' }"> 商品分类列表</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/addClassify' }"> 新增商品分类</el-breadcrumb-item>
			</el-breadcrumb>
			<el-row>
				<el-col :span="12">
					<hk_form :form='form' v-on:onSubmit="onSubmit">
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
				form: [{
						'label': '分类名称',
						"type": 'text',
						"value": '',
						"ifRequired":true
					}, //输入框。label为标题，type为类型，value为默认值
					{
						'label': '分类描述',
						"type": 'textarea',
						"value": '',
						"ifRequired":true
					},
					{
						'label': '排序',
						"type": 'text',
						"value": '0',
						"ifRequired":true
					},
					{
						'label': '上传图片',
						"type": 'imgUpload',
						"imageUrl": '',
						"ifRequired":true,
						"remark":'*建议尺寸：100px*100px'
					},
					{
						'label': '',
						type: 'submit'
					}
				],
				imageUrl: '',
				id:'',
				flag:true,
			}
		},
		components: {
			hk_form
		},
		created() {
			var self=this;
			//this.getAllSpec();
			if(self.$route.query.id){
		      self.id=self.$route.query.id;
		      self.getData()
		    }
		},
		methods: {
			//得到数据
			getData(){
				let self = this;
			    axios.get(api.baseUrl + api.category.url+'show/'+self.id,
			    ).then((res) => {
			        if(res.data.responseCode == 0) {
			            self.$message({
			              type: 'info',
			              message: `网络异常，获取失败`
			            });
			        } else {
			            res=res.data.data
			            self.form[0].value=res.name;
			            self.form[1].value=res.desc;
			            self.form[2].value=res.order;
			            self.form[3].imageUrl=res.cover;
			            // for(var i=0;i<res.attributes.length;i++){
			            //   self.form[3].value.push(res.attributes[i].id);
			            // }
			        }
			    }).catch(function(error) {
			        //console.log(error);
			    });
			},
			//获得所有规格
			getAllSpec() {
				let self = this;
                axios.get(api.baseUrl + api.attribute.url+'all/'+localStorage.getItem('type'),
                ).then((res) => {
                    if(res.data.responseCode == 0) {
                        self.$message({
                          type: 'info',
                          message: `网络异常，获取失败`
                        });
                    } else {
                    	//console.log(res.data.data)
                    	//self.form[3].opinion=res.data.data
                        
                    }
                }).catch(function(error) {
                    //console.log(error);
                });
			},
			onSubmit(){
				let self = this;
				var data={
					name:self.form[0].value,
					desc:self.form[1].value,
					order:self.form[2].value,
					cover:self.form[3].imageUrl,
					//attributes:self.form[3].value
				}

				if(!data.name){
					self.$message({
                      type: 'info',
                      message: `请填写分类名称`
                    });
                    return
				}
				if(!data.desc){
					self.$message({
                      type: 'info',
                      message: `请填写分类描述`
                    });
                    return
				}
				if(self.form[2].value===''){
					self.$message({
                      type: 'info',
                      message: `请填写分类排序`
                    });
                    return
				}
				if(!data.cover){
					self.$message({
                      type: 'info',
                      message: `请上传封面图`
                    });
                    return
				}
				if(self.flag){
					self.flag=false;
					setTimeout(function(){
						self.flag=true
					},1000)
					var url='';

				    if(self.$route.query.id){
				      url=api.baseUrl+api.category.url+'update/'+self.id
				    }else{
				      url=api.baseUrl + api.category.url+localStorage.getItem('type')
				    }
					axios.post(url,qs.stringify(data)
	                ).then((res) => {
	                    if(res.data.responseCode == 0) {
	                        self.$message({
	                          type: 'info',
	                          message: `网络异常，获取失败`
	                        });
	                    } else {
	                    	self.$message({
	                          type: 'info',
	                          message: `添加成功`
	                        });
	                        self.$router.push('/classify')
	                    }
	                }).catch(function(error) {
	                    //console.log(error);
	                });
				}else{
					self.$message({
                      type: 'info',
                      message: `请勿重复提交`
                    });
				}
				
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