<template>
	<div class="form">
		<el-form  label-width="120px" >
			<div v-for="item in form">
				<!-- 单行输入框 -->
				<el-form-item :label="item.label" v-if='item.type=="text"' :required='item.ifRequired'>
					<el-input v-model="item.value"></el-input>
				</el-form-item>
				<!-- 单行密码输入框 -->
				<el-form-item :label="item.label" v-if='item.type=="password"' :required='item.ifRequired'>
					<el-input  type="password" v-model="item.value" ></el-input>
				</el-form-item>
				<!-- textarea -->
				<el-form-item :label="item.label" v-if='item.type=="textarea"' :required='item.ifRequired'>
					<el-input type="textarea" :rows="2" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入内容" v-model="item.value">
					</el-input>
				</el-form-item>
				<!-- 单选框 -->
				<el-form-item :label="item.label" v-if='item.type=="radio"' :required='item.ifRequired' >
					<el-radio-group v-model="item.value">
						<el-radio :label="radio.value" v-for="radio in item.opinion">{{radio.text}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<!-- 多选框 -->
				<el-form-item :label="item.label" v-if='item.type=="checkbox"' :required='item.ifRequired'>
					<el-checkbox-group v-model="item.value">
						<el-checkbox :label="checkbox.id" name="type" v-for="checkbox in item.opinion">{{checkbox.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<!-- 下拉列表 -->
				<el-form-item :label="item.label" v-if='item.type=="select"' :required='item.ifRequired' :change='selectChange()'>
					<el-select v-model="item.value" :placeholder="item.placeholder">
						<el-option :label="select.name||select.title" :value="select.id" v-for="select in item.opinion">{{select.name||select.title}}</el-option>
					</el-select>
				</el-form-item>
				<!-- 开关 -->
				<el-form-item :label="item.label" v-if='item.type=="switch"' :required='item.ifRequired'>
					<el-switch on-text="" off-text="" v-model="item.value"></el-switch>
				</el-form-item>
				<!-- 图片上传 -->
				<el-form-item :label="item.label" v-if='item.type=="imgUpload"' :required='item.ifRequired'>
					<el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" name='file' :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="item.fileList" >
						<img v-if="item.imageUrl" :src="item.imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<span v-if="item.remark" style="color:rgb(255, 73, 73)">{{item.remark}}</span>
				</el-form-item>
				<!-- 多图片上传 -->
				<el-form-item :label="item.label" v-if='item.type=="imgListUpload"' :required='item.ifRequired'>
					<el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" >
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog v-model="item.dialogVisible" size="tiny" >
						<img width="100%" :src="item.dialogImageUrl" alt="">
					</el-dialog>

				</el-form-item>
				<el-form-item :label="item.label" v-if='item.type=="editor"' :required='item.ifRequired'>
					<hk_quill ref="myTextEditor" v-model="item.value" :config="item.editorOption" :uploadUrl='uploadUrl' :fileName='"file"'></hk_quill>
				</el-form-item>
				<el-form-item v-if='item.type=="submit"'>
					<el-button type="primary" @click="onSubmit">立即提交</el-button>
					<el-button>取消</el-button>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>

<script>
	import api from '../../api/api.json'
	import { quillEditor } from 'vue-quill-editor';
	import hk_quill from './quill'
	export default {
		components: {
			quillEditor,
			hk_quill
		},
		name: 'form',
		data() {
			return {
				uploadUrl:api.baseUrl+"/upload"
				// {'label':'商品名称',"type":'text',"value":''},//输入框。label为标题，type为类型，value为默认值
				// {'label':'所属分类',"type":'select',"value":'','placeholder':'',opinion:[{value:"小西点1"},{value:"小西点2"},{value:"小西点3"},{value:"小西点4"},{value:"小西点5"}]},//下来列表。label为标题，type为类型，value为默认值需要为数组,opinion为复选框的选项
				// {'label':'基础价格',"type":'text',"value":''},
				// {'label':'商品描述',"type":'textarea',"value":''},//多行文本框。label为标题，type为类型，value为默认值
				// {'label':'口味',"type":'checkbox',"value":['水果动物鲜奶油'],opinion:[{value:"水果动物鲜奶油"},{value:" 覆盆子果茸水果动物鲜奶油"},{value:"芒果百香果果茸动物鲜奶油"},{value:"江苏凤梨百香果果茸动物鲜奶油"}]},//复选框。label为标题，type为类型，value为默认值需要为数组,opinion为复选框的选项
				// {'label':'尺寸',"type":'checkbox',"value":['12'],opinion:[{value:"12"},{value:" 14"},{value:"16"},{value:"20"}]},//复选框。label为标题，type为类型，value为默认值需要为数组,opinion为复选框的选项
				// {'label':'是否热门',"type":'radio',"value":'是',opinion:[{value:"是"},{value:"否"}]},//单选框。label为标题，type为类型，value为默认值,opinion为单选框的选项
				// {'label':'是否置顶',"type":'radio',"value":'是',opinion:[{value:"是"},{value:"否"}]},//单选框。label为标题，type为类型，value为默认值,opinion为单选框的选项
				// {'label':'商品图片',type:'imgListUpload'},
				// {'label':'商品详情',type:'editor'},
				// {'label':'',type:'submit'}
			}
		},
		props: {
			form: Array
		},
		methods: {
			//上传图片
			handleAvatarSuccess(res, file) {
				var self = this;
				//console.log(res)
				if(res.data.path){
					if(!res.data.path.match(/^(?:http|ftp|https):\/\//)){
			            res.data.path = api.imgUrl + res.data.path;
			        }
				}


				for(var i=0;i<self.form.length;i++){
					if(self.form[i].type=='imgUpload'){
						self.form[i].imageUrl= res.data.path
					}
				}
			},
			handleRemove(file, fileList) {
				//console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				//console.log(file.url);
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleSuccess(file, fileList){
		    	////console.log(file, fileList);
		    	// this.imgList.push(file.data)
		    	// this.$emit('handleSuccess')
		    },
			//提交
			onSubmit() {
				this.$emit('onSubmit')
			},
			//改变下拉框
			selectChange(){
				//alert(111)
				this.$emit('selectChange')
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