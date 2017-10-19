<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 商品管理</el-breadcrumb-item>
				<el-breadcrumb-item> 规格列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="handle-box">
			<el-button type="warning" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
			<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
			<el-button type="primary" icon="search" @click="search">搜索</el-button>
			<router-link to="/addSpec">
				<el-button type="success" icon="edit" class="handle-edit mr10" style='float:right'>新增</el-button>
			</router-link>
		</div>
		<el-table :data='tableData' border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="id" label="序号" sortable width="100">
			</el-table-column>
			<el-table-column prop="name" label="规格名称">
			</el-table-column>
			<el-table-column prop="order" label="规格排序">
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template scope="scope">
					<router-link :to="{ path: 'addSpec', query: { id: scope.row.id}}" >
                        <el-button size="small" type="primary" >编辑</el-button>
                    </router-link>
					<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
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
			this.getData();
		},
		computed: {

		},
		methods: {
            //得到数据
			getData() {
				let self = this;
                axios.get(api.baseUrl + api.attribute.url+localStorage.getItem('type')+'?page='+self.cur_page,
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
            //搜索
			search() {
				this.is_search = true;
			},
			//编辑行
			// handleEdit(index, row) {
			// 	this.$message('编辑第' + (index + 1) + '行');
   //              //console.log(row)
			// },
			//删除行
			handleDelete(row) {
                let self = this;
                axios.post(api.baseUrl + api.attribute.url+'destroy/'+row.id,
                    qs.stringify({
                        
                    })
                ).then((res) => {
                    if(res.data.responseCode == 0) {
                        self.$message({
                          type: 'info',
                          message: `网络异常，删除失败`
                        });
                    } else {
                        self.$message({
                          type: 'info',
                          message: `删除成功`
                        });
                        self.getData()
                    }
                }).catch(function(error) {
                    //console.log(error);

                });
			},
			//删除全部
			delAll() {
				const self = this,
					length = self.multipleSelection.length;
				let str = '';
				self.del_list = self.del_list.concat(self.multipleSelection);
				for(let i = 0; i < length; i++) {
					str += self.multipleSelection[i].id + ',';
				}
                var row={
                    id:str
                }
               
				self.handleDelete(row)
				self.multipleSelection = [];
			},
			//翻页
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData();
			},
			//勾选
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