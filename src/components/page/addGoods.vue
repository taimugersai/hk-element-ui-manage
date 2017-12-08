<template>
	<div id="form">
		<div class="crumbs">
			
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 商品管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/goods' }"> 商品列表</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/addClassify' }"> 新增商品</el-breadcrumb-item>
			</el-breadcrumb>
			<el-row>
				<el-col :span="12">
					<!-- <hk_form :form='form' v-on:onSubmit="onSubmit" v-on:selectChange='selectChange'></hk_form> -->
					<el-form  label-width="80px" :rules="rules" :model="formData" ref="formData">
					  <el-form-item label="商品名称"  prop="name">
					    <el-input v-model="formData.name"></el-input>
					  </el-form-item>
					  <el-form-item label="商品分类" required>
					    <el-select v-model="formData.classify">
					      <el-option :label="item.name" :value="item.id" v-for="item in classifyList"></el-option>
					    </el-select>
					  </el-form-item>
					  <el-form-item label="pos系统商品编号" prop="pos_no">
					    <el-input v-model="formData.pos_no"></el-input>
					    <span  style="color:rgb(255, 73, 73)">*请严格按照pos端商品编号填写，填写错误将造成商品无法支付等意外错误</span>
					  </el-form-item>
					  <el-form-item label="库存" required>
					    <el-input type='number' v-model="formData.stock"></el-input>
					  </el-form-item>
					  <el-form-item label="排序" required>
					    <el-input type='number' v-model="formData.order"></el-input>
					  </el-form-item>
					  <el-form-item label="轮播图" required>
					    <el-upload
						  :action="actionUrl"
						  list-type="picture-card"
						  :on-preview="handlePictureCardPreview"
						  :on-remove="handleRemove"
						  :on-success='handleSuccess'
						  :file-list="fileList"
						  >
						  <i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog v-model="dialogVisible" size="tiny">
						  <img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
						 <span  style="color:rgb(255, 73, 73)">*建议比例：1*1</span>
					  </el-form-item>
					  <el-form-item label="商品默认价格" prop='price'>
					    <el-input v-model.number="formData.price" ></el-input>
					  </el-form-item>
					  <el-form-item label="商品描述" prop='desc'>
					    <el-input type="textarea" v-model="formData.desc"></el-input>
					  </el-form-item>
					  <el-form-item label="静态属性" required >
					  	  <el-button type="primary" icon="plus" @click='addStaticAttributes'></el-button>
						  <div v-for='(item,index) in static_attributes'  style="margin-top:20px" >
						  	<el-input v-model="item.staticAttributesName" style='width:80px'></el-input>
								<el-tag
				                    :key="tag"
				                    type='primary'
				                    v-for="tag in item.dynamicTags"
				                    :closable="true"
				                    :close-transition="false"
				                    @close="handleClose(tag,index)"
				                    style='margin-right:10px'
				                  >
				                  {{tag}}
				                  </el-tag>
				                  <el-input
				                    class="input-new-tag"
				                    v-if="item.inputVisible"
				                    v-model="item.inputValue"
				                    v-ref="saveTagInput"
				                    size="mini"
				                    @keyup.enter.native="handleInputConfirm(index)"
				                    @blur="handleInputConfirm(index)"
				                  >
				                  </el-input>
				                  <el-button v-else class="button-new-tag" size="small" @click="showInput(index)">添加新属性</el-button>
				                <el-button type="primary" icon="delete" @click="deleteAttribute(index)"></el-button>
						  </div>
					  </el-form-item>
					  <el-form-item label="多选属性" required >
					  	  <el-button type="primary" icon="plus" @click='addCheckAttributes'></el-button>
						  <div v-for='(item,index) in check_attributes'  style="margin-top:20px" >
						  	<el-input v-model="item.checkAttributesName" style='width:80px'></el-input>
								<el-tag
				                    :key="tag"
				                    type='primary'
				                    v-for="tag in item.dynamicTags"
				                    :closable="true"
				                    :close-transition="false"
				                    @close="handleCheckClose(tag,index)"
				                    style='margin-right:10px'
				                  >
				                  {{tag}}
				                  </el-tag>
				                  <el-input
				                    class="input-new-tag"
				                    v-if="item.inputVisible"
				                    v-model="item.inputValue"
				                    v-ref="saveTagInput"
				                    size="mini"
				                    @keyup.enter.native="handleCheckInputConfirm(index)"
				                    @blur="handleCheckInputConfirm(index)"
				                  >
				                  </el-input>
				                  <el-button v-else class="button-new-tag" size="small" @click="showCheckInput(index)">添加新属性</el-button>
				                <el-button type="primary" icon="delete" @click="deleteCheckAttribute(index)"></el-button>
						  </div>
					  </el-form-item>
					  <el-form-item label="是否置顶" required>
					    <el-radio-group v-model="formData.ifTop">
					      <el-radio :label="1">是</el-radio>
					      <el-radio :label="0">否</el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item label="是否推荐" required>
					    <el-radio-group v-model="formData.isRecommend">
					      <el-radio :label="1">是</el-radio>
					      <el-radio :label="0">否</el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item label="商品详情" required>
						<hk_quill ref="myTextEditor" v-model="formData.content" :uploadUrl='actionUrl' :fileName='"file"'></hk_quill>
					  </el-form-item>

					  <el-form-item>
					    <el-button type="primary" @click="onSubmit('formData')">立即创建</el-button>
					    <el-button>取消</el-button>
					  </el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import { quillEditor } from 'vue-quill-editor';
	import hk_form from './hk_form'
	import hk_quill from './quill'
	import api from '../../api/api.json'
	import axios from 'axios';
	import qs from 'qs';
	export default {
		data() {
			return {
				formData:{
					name:"",
					price:0,
					pos_no:"",
					stock:0,
					desc:'',
					ifTop:1,
		        	isRecommend:1,
		        	content:'',
		        	classify:'',
				},
				id:'',

				actionUrl:'',
		       
		        classifyList:[],
		        classifyPlacehold:'',

		        dialogImageUrl: '',
        		dialogVisible: false,
        		

        		
        	
		        dynamicTags: [],
		        inputVisible: false,
		        inputValue: '',
		        static_attributes:[],
		        check_attributes:[],
		        specsList:[],
				specs:[],


				fileList: [],

				rules: {
		          name: [
		            { required: true, message: '请输入商品名称', trigger: 'blur' },
		            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
		          ],
		          pos_no: [
		            { required: true, message: '请输入pos机号', trigger: 'blur' },
		            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
		          ],
		          price: [
		            { required: true, message: '请输入价格'},
		            { type: 'number',message: '年龄必须为数字值'},
		          ],
		          desc: [
		            { required: true, message: '请输入商品描述', trigger: 'blur' },
		            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
		          ]
		        }
		      

			}
		},
		components: {
			quillEditor,
			hk_form,
			hk_quill
		},
		created(){
			var self=this;
            this.getAllClass();

            if(self.$route.query.id){
		      self.id=self.$route.query.id;
		      setTimeout(function(){
		      	  self.getData()
		      },500)
		    
		    }
		    self.actionUrl=api.baseUrl+"/upload"
        },
   		methods: {
   			//获得所有分类
			getAllClass() {
				let self = this;
                 axios.get(api.baseUrl +'/categories',
					{
					    params: {
					      	brand_id: localStorage.getItem('type')
					    }
					  }
                ).then((res) => {
                    if(res.data.responseCode == 0) {
                        self.$message({
                          type: 'info',
                          message: res.data.responseMsg
                        });
                    } else {
                    	self.formData.classify=res.data.data[0].id
                    	self.classifyList=res.data.data
                    }
                }).catch(function(error) {
                    self.$message({
                      type: 'info',
                      message: `暂无商品分类，请先添加商品分类`
                    });
                });
			},
			//得到并付给商品原先的值
			getData(){
				let self = this;
			    axios.get(api.baseUrl + '/goods/'+self.id,
			    ).then((res) => {
			        if(res.data.responseCode == 0) {
			            self.$message({
			              type: 'info',
			              message: `网络异常，获取失败`
			            });
			        } else {
			            res=res.data.data
			            self.formData.name=res.name
			            self.formData.pos_no=res.pos_no
			            self.formData.stock=res.stock
			            self.formData.price=res.price
			            self.formData.content=res.content
			            self.formData.ifTop=res.is_top
			            self.formData.isRecommend=res.is_recommend
			            self.formData.desc=res.desc 
			            self.formData.order = res.order
			            self.formData.classify=res.category_id
			            //设置轮播图
			            var imgList=res.banners.split(',')
			            for(var i=0;i<imgList.length;i++){
			            	var data={
			            		name:'test.jpg',
			            		url:imgList[i]
			            	}
			            	self.fileList.push(data)
			            }
			            //设置静态属性
			            for (var p1 in res.static_attributes) {
				           if (res.static_attributes.hasOwnProperty(p1))
				           		var array=res.static_attributes[p1].split(',')
				           		var item={
				           			staticAttributesName:p1,
				           			dynamicTags:array
				           		}
				               self.static_attributes.push(item);
				        }
				        //设置多属性
			            for (var p2 in res.notes) {
				           if (res.notes.hasOwnProperty(p2))
				           		var array=res.notes[p2].split(',')
				           		var item={
				           			checkAttributesName:p2,
				           			dynamicTags:array
				           		}
				               self.check_attributes.push(item);
				        }
				        self.formData.classify=res.category_id
			        }
			    }).catch(function(error) {
			        //console.log(error);
			    });
			},
			//点击添加静态属性按钮
	        addStaticAttributes(){
	        	var self=this;
	        	var data ={
	        		staticAttributesName:'',
	        		dynamicTags:[],
	        		inputVisible: false,
		        	inputValue: '',
	        	};
	        	self.static_attributes.push(data)
	        },
	        //点击添加多选属性按钮
	        addCheckAttributes(){
	        	var self=this;
	        	var data ={
	        		checkAttributesName:'',
	        		dynamicTags:[],
	        		inputVisible: false,
		        	inputValue: '',
	        	};
	        	self.check_attributes.push(data)
	        },
	        //点击添加属性标签显示输入框
		    showInput(index) {
		    	var self=this
		      this.static_attributes[index].inputVisible = true;
		      this.static_attributes.splice(index,1,this.static_attributes[index])
		      this.$nextTick(_ => {
		      	 //self.$refs.saveTagInput[index].$refs.input.focus();
		      });
		    },
		    //点击添加属性标签显示输入框
		    showCheckInput(index) {
		    	var self=this
		      this.check_attributes[index].inputVisible = true;
		      this.check_attributes.splice(index,1,this.check_attributes[index])
		      this.$nextTick(_ => {
		      	 //self.$refs.saveTagInput[index].$refs.input.focus();
		      });
		    },
			//删除数组中某元素
			removeByValue(arr, val) {
			  for(var i=0; i<arr.length; i++) {
			    if(arr[i] == val) {
			    	arr.splice(i, 1);
			      break;
			    }
			  }
			},
		    handleSuccess(file, fileList){

		    	var self = this;
		    	if(!fileList.response.data.path.match(/^(?:http|ftp|https):\/\//)){
	                fileList.response.data.path = api.imgUrl+fileList.response.data.path;
	                fileList.url=fileList.response.data.path
	            }else{
	            	fileList.url=fileList.response.data.path
	            }
            	self.fileList.push(fileList)
            	//console.log(self.fileList)
		    },
			//删除图片
			handleRemove(file, fileList,index) {
			  var self=this
  		      self.fileList=fileList
	        },
	        //点击放大图片
	        handlePictureCardPreview(file) {
	          this.dialogImageUrl = file.url;
	          this.dialogVisible = true; 
	        },
	        //删除静态属性
	        deleteAttribute(index){
	        	var self = this;
	        	self.static_attributes.splice(index,1)
	        	console.log(self.static_attributes)
	        },
	        //删除静态属性
	        deleteCheckAttribute(index){
	        	var self = this;
	        	self.check_attributes.splice(index,1)
	        	console.log(self.static_attributes)
	        },
			//提交
			onSubmit(formData){
				let self = this;
				self.$refs[formData].validate((valid) => {
					if(valid) {
						if(self.formData.content==""){
							self.$alert('请填写商品详情', '提交失败', {
								confirmButtonText: '确定'
							});
							return				
						}
						//轮播图
						var banners=[]
						for(var i=0;i<self.fileList.length;i++){
							banners.push(self.fileList[i].url)
						}
						banners=banners.join(',')
						if(banners==""){
							self.$alert('请上传轮播图', '提交失败', {
								confirmButtonText: '确定'
							});
							return				
						}
						//静态属性
						var static_attributes={}
						for(var i=0;i<self.static_attributes.length;i++){
							var static_value=[]
							for(var j=0;j<self.static_attributes[i].dynamicTags.length;j++){
								static_value.push(self.static_attributes[i].dynamicTags[j])
							}
							
							static_attributes[self.static_attributes[i].staticAttributesName]=static_value.join(',')
						}
						var value=static_attributes={}?static_attributes:''

						//多选属性
						var check_attributes={}
						for(var i=0;i<self.check_attributes.length;i++){
							var check_value=[]
							for(var j=0;j<self.check_attributes[i].dynamicTags.length;j++){
								check_value.push(self.check_attributes[i].dynamicTags[j])
							}

							check_attributes[self.check_attributes[i].checkAttributesName]=check_value.join(',')
						}
						
						var checkValue=check_attributes={}?check_attributes:'';
						
						var data={
							category_id:self.formData.classify,
							name:self.formData.name,
							pos_no:self.formData.pos_no,
							price:self.formData.price,
							desc:self.formData.desc,
							stock:self.formData.stock,
							order:self.formData.order,
							is_top:self.formData.ifTop,
							is_recommend:self.formData.isRecommend,
							banners:banners,
							content:self.formData.content,
							static_attributes:value,
							notes:checkValue,
							brand_id:localStorage.getItem('type')
						}
						console.log(data)

						var url='';
					    if(self.$route.query.id){
					      url=api.baseUrl+'/goods/'+self.id;
					      axios.put(url,qs.stringify(data)
			                ).then((res) => {
			                     self.callBack(res)
			                }).catch(function(error) {
			                    //console.log(error);
			                });
					    }else{
					      url=api.baseUrl + '/goods/'
					      axios.post(url,qs.stringify(data)
			                ).then((res) => {
			                    self.callBack(res)
			                }).catch(function(error) {
			                    //console.log(error);
			                });
					    }
					   
					    
						
					}
				})
				
			},
			// 请求回掉函数
			callBack(res){
				var self = this;
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
                    self.$router.push('/goods')
                }
			},
			//标签删除属性
		    handleClose(tag,index) {
		      this.static_attributes[index].dynamicTags.splice(this.static_attributes[index].dynamicTags.indexOf(tag), 1);
		    },
		    //多选标签删除属性
		    handleCheckClose(tag,index) {
		      this.check_attributes[index].dynamicTags.splice(this.check_attributes[index].dynamicTags.indexOf(tag), 1);
		    },
		   
		    //标签新增属性
		    handleInputConfirm(index) {
		      let inputValue = this.static_attributes[index].inputValue;
		      if (inputValue) {
		        this.static_attributes[index].dynamicTags.push(inputValue);
		      }
		      this.static_attributes[index].inputVisible = false;
		      this.static_attributes[index].inputValue = '';
		    },
		    //多选标签新增属性
		    handleCheckInputConfirm(index) {
		      let inputValue = this.check_attributes[index].inputValue;
		      if (inputValue) {
		        this.check_attributes[index].dynamicTags.push(inputValue);
		      }
		      this.check_attributes[index].inputVisible = false;
		      this.check_attributes[index].inputValue = '';
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
		width: 240px;
	}
	.el-upload--picture-card{
		width: 240px;
		height: 180px;
		line-height: 180px;
	}
	.el-upload-list__item{
		width: 240px!important;
		height: 180px!important;
	}
	.el-upload-list__item-thumbnail{
		width: 240px!important;
		height: 180px!important;
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