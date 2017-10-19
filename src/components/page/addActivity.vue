<template>
	<div id="form">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 活动管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/activity' }"> 活动列表</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/addClassify' }"> 新增活动</el-breadcrumb-item>
			</el-breadcrumb>
			<el-row>
				<el-col :span="12">
					<hk_form :form='form' v-on:onSubmit="onSubmit"></hk_form>
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
				activeIndex: '1',
				activeName2: '1',
				form: [ //输入框。label为标题，type为类型，value为默认值
					{
						'label': '活动标题',
						"type": 'text',
						"value": '',
						"ifRequired":true
					},
					{
						'label': '上传封面图片',
						"type": 'imgUpload',
						"imageUrl": '',
						"fileList":[],
						"remark":"*建议尺寸：100px*100px"
					},
					{'label':'活动内容',type:'editor',value:''},
					{
						'label': '活动排序',
						"type": 'text',
						"value": '',
						"ifRequired":true
					},
					{
						'label': '',
						type: 'submit'
					}
				],
				imageUrl: '',
				flag:true
			}
		},
		components: {
			hk_form
		},
		created() {
			var self=this;
			if(self.$route.query.id){
		      self.id=self.$route.query.id;
		      self.getData()
		    }
		},
		methods: {
			//得到数据
			getData(){
				let self = this;
			    axios.get(api.baseUrl + api.activity.url+'show/'+self.id,
			    ).then((res) => {
			        if(res.data.responseCode == 0) {
			            self.$message({
			              type: 'info',
			              message: `网络异常，获取失败`
			            });
			        } else {
			            res=res.data.data
			            
			            self.form[0].value=res.title;
			            self.form[1].imageUrl=res.cover;
			            
			            self.form[2].value=res.content;
			            self.form[3].value=res.order;
			            
			            for(var i=0;i<res.attributes.length;i++){
			              self.form[3].value.push(res.attributes[i].id);
			            }
			        }
			    }).catch(function(error) {
			        //console.log(error);
			    });
			},
			onSubmit() {
				var self=this;
				var data={
					title:self.form[0].value,
					cover:self.form[1].imageUrl,
					content:self.form[2].value,
					order:self.form[3].value
				}
				if(!data.title){
					self.$message({
                      type: 'info',
                      message: `请填写标题`
                    });
                    return
				}
				if(!data.cover){
					self.$message({
                      type: 'info',
                      message: `请上传封面`
                    });
                    return
				}
				if(!data.content){
					self.$message({
                      type: 'info',
                      message: `请填写内容`
                    });
                    return
				}
				if(data.order===''){
					self.$message({
                      type: 'info',
                      message: `请填写排序`
                    });
                    return
				}

				//alert(JSON.stringify(data))
				var url='';
			    if(self.$route.query.id){
			      url=api.baseUrl+api.activity.url+'update/'+self.id
			    }else{
			      url=api.baseUrl + api.activity.url+localStorage.getItem('type')
			    }
			    if(self.flag){
			    	self.flag=false
			    	setTimeout(function(){
			    		self.flag=true
			    	},1000)
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
	                          message: `提交成功`
	                        });
	                        self.$router.push('/activity')
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