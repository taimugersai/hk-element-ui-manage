<template>
	<div class="table">
		<!-- 面包屑 -->
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 会员管理</el-breadcrumb-item>
				<el-breadcrumb-item> 会员列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- 表格 -->
		<el-table :data="tableData" border style="width: 100%" ref="multipleTable">
			
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
		<!-- 分页 -->
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
                });
			}
		}
	}
</script>