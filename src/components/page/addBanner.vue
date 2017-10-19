<template>
	<div id="form">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 轮播图管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/banner' }"> 轮播图列表</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/addBanner' }"> 新增轮播图{{tableData}}
</el-breadcrumb-item>
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
				form: [{'label':'轮播图类型',"type":'radio',"value":'goods',opinion:[{value:"goods",text:"商品"},{value:"activity",text:'活动'}]}, //输入框。label为标题，type为类型，value为默认值
					{'label':'绑定详情',"type":'select',"value":'','placeholder':'',opinion:[]},
					{
						'label': '排序',
						"type": 'text',
						"value": '0',
						"ifRequired":true
					},
					// {
					// 	'label': '关联规格',
					// 	"type": 'checkbox',
					// 	"value": [],
					// 	"opinion": [],
					// 	"ifRequired":true
					// },
					{
						'label': '上传图片',
						"type": 'imgUpload',
						"imageUrl": '',
						"ifRequired":true,
						"remark":'*建议尺寸：343px*148px'
					},

					{
						'label': '',
						type: 'submit'
					}
				],
				imageUrl: '',
				id:'',
				lastChoose:0,
				flag:true
			}
		},
		computed:{
        	tableData:function(){
        		var self=this;
        		var url="" 
        		//url=  self.form[0].value 		
        		if(self.form[0].value=="goods"){
        			url=api.baseUrl + '/goods/all/'+localStorage.getItem('type')
        		}else{
        			url=api.baseUrl + '/activity/all/'+localStorage.getItem('type')
        		}
        		axios.get(url,
			    ).then((res) => {
			        if(res.data.responseCode == 0) {
			            self.$message({
			              type: 'info',
			              message: `网络异常，获取失败`
			            });
			        } else {
			            res=res.data.data
			             self.form[1].value=res[0].id;
			             self.form[1].opinion=res
			        }
			    }).catch(function(error) {
			        //console.log(error);
			    });
        		return ""
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
			    axios.get(api.baseUrl + api.banner.url+'show/'+self.id,
			    ).then((res) => {
			        if(res.data.responseCode == 0) {
			            self.$message({
			              type: 'info',
			              message: `网络异常，获取失败`
			            });
			        } else {
			            res=res.data.data
			            ////console.log(res)
			            self.form[0].value=res.type;
			            setTimeout(function(){self.form[1].value=res.model_id;},500)
			            
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
			
			onSubmit(){
				let self = this;
				var data={
					type:self.form[0].value,
					model_id:self.form[1].value,
					order:self.form[2].value,
					cover:self.form[3].imageUrl,
					//attributes:self.form[3].value
				}
				if(data.order===''){
					self.$message({
                      type: 'info',
                      message: `请填写排序`
                    });
                    return
				}
				if(data.cover==''){
					self.$message({
                      type: 'info',
                      message: `请上传轮播图`
                    });
                    return
				}
				//alert(JSON.stringify(self.form[3].imageUrl))
				var url='';
			    if(self.$route.query.id){
			      url=api.baseUrl+api.banner.url+'update/'+self.id
			    }else{
			      url=api.baseUrl + api.banner.url+localStorage.getItem('type')
			    }
			    if(self.flag){
			    	self.flag=false;
			    	setTimeout(function(){self.flag=true},1000)
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
	                        self.$router.push('/banner')
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