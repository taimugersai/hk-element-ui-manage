<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 会员管理</el-breadcrumb-item>
				<el-breadcrumb-item> 会员列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- <div class="handle-box">
			<el-button type="warning" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
			<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
			<el-button type="primary" icon="search" @click="search">搜索</el-button>
		</div> -->
		<el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="id" label="id" sortable width="100">
			</el-table-column>
			<el-table-column prop="name" label="昵称">
			</el-table-column>
			<el-table-column prop="vip_no" label="会员编号">
			</el-table-column>
			<!-- <el-table-column prop="avatar" label="头像">
				<template scope='scope'>
	                <img :src="baseUrl+scope.row.avatar" width='20%' alt="">
	              </template>
			</el-table-column> -->
			<el-table-column prop="phone" label="手机号">
			</el-table-column>
			<el-table-column prop="birthday" label="生日">
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size='size'>
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import api from '../../api/api.json'
    import axios from 'axios';
    import qs from 'qs';
	export default {
		data() {
			return {
				baseUrl:'',
				tableData: [],
				cur_page: 1,
				multipleSelection: [],
				select_cate: '',
				select_word: '',
				del_list: [],
				is_search: false,
				size:0,
                total:1
			}
		},
		created() {
			this.baseUrl=api.imgUrl
			this.getData();
		},
		methods: {
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData();
			},
			getData() {
				let self = this;
                axios.get(api.baseUrl + api.member.url,
                ).then((res) => {
                    if(res.data.responseCode == 0) {
                        self.$message({
                          type: 'info',
                          message: `网络异常，获取失败`
                        });
                    } else {
                        self.tableData=res.data.data.data
                        self.size=res.data.data.per_page
                        self.total=res.data.data.total
                    }
                }).catch(function(error) {
                    //console.log(error);
                });
			},
			search() {
				this.is_search = true;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			}
		}
	}
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}
	
	.handle-select {
		width: 120px;
	}
	
	.handle-input {
		width: 300px;
		display: inline-block;
	}
</style>