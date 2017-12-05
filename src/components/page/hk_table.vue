<template>
	<div class="table">
        <!-- 删除与新增按钮，头部公共操作区 -->
	 	<div class="handle-box">
            <el-button type="warning" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <!-- <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button> -->
            <router-link :to="router"> <el-button type="success" icon="edit" class="handle-edit mr10" style='float:right;margin-bottom:20px'>新增</el-button></router-link>
        </div>
        <!-- 表格部分 -->
		<el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <!-- 选择框 -->
			<el-table-column type="selection" width="55"></el-table-column>
            <!-- 单元格 -->
			<el-table-column :prop="item.data" :label="item.title"  v-for="item in tableData" :width='item.width'>
				<template scope='scope' >
                    <!-- 如果传来的表格行信息带有cover，则显示图片 -->
	                <img :src="scope.row.cover" width='100px' alt="" v-if='item.data=="cover"' style="margin:0 auto" >
	                <!-- 如果传来的表格行信息不带有cover，并且带有type参数，则直接显示数据 -->
                    <p v-if='item.data!="cover"&&item.data!="type"'>{{scope.row[item.data]}}</p>
                    <!-- 如果传来的表格行信息带有type参数，则根据type参数显示内容 -->
                    <p v-if="item.data=='type'&&scope.row[item.data]=='activity'">活动</p>
                    <p v-if="item.data=='type'&&scope.row[item.data]=='goods'">商品</p>
	              </template>
			</el-table-column>
            <!-- 按钮 -->
			<el-table-column label="操作" width="180">
				<template scope="scope">
                    <!-- 跳转到详情 -->
					<router-link :to="{ path: router, query: { id: scope.row.id}}" >
						<el-button size="small" >编辑</el-button>
					</router-link>
                    <!-- 删除 -->
					<el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
        <!-- 分页 -->
		<div class="pagination">
			<el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :size="size">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import api from '../../api/api.json';
    import axios from 'axios';
    import qs from 'qs';
	export default {
		name: 'table',
		data() {
			return {
				cur_page: 1,//当前页
                multipleSelection: [],//已选择
                del_list: [],//删除列表
                size:0,//每页显示
                total:1,//总条数
                data:[]//数据
			}
		},
		props: {
			tableData: Array,//表格参数
			router:String,//跳转页面数据
			url:String//接口数据
		},
        created(){
            this.getData();
        },
		methods: {
            //获得数据
            getData(){
                let self = this;
                axios.get(api.baseUrl + self.url,
                {
                    params: {
                        brand_id: localStorage.getItem('type'),
                        page:self.cur_page
                    }
                }
                ).then((res) => {
                    if(res.data.responseCode == 0) {
                        self.$message({
                          type: 'info',
                          message: `网络异常，获取失败`
                        });
                    } else {
                        //有分页的返回结果
                        if(res.data.data.total){
                            self.data=res.data.data.data//显示的每行数据的数组
                            self.size=res.data.data.per_page//每页显示多少行
                            self.total=res.data.data.total//总条数，用来计算总页数
                        }else{
                            //没分页的返回结果
                            self.data=res.data.data
                        }
                        
                    }
                });
            },
			//翻页
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
			 //删除
            handleDelete(row) {
                var self=this;
                // this.$message.error('删除第'+(index+1)+'行');
                this.$confirm('确认删除？')
                .then(_ => {
                    let self = this;
                    axios.delete(api.baseUrl + self.url+'/'+row.id,
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
                            self.multipleSelection = [];
                            self.getData()
                        }
                    });
                  })
                .catch(_ => {});
            },
            //多行删除
            delAll(){
                const self = this,
                      length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                if(length==0){
                    self.$message({
                      type: 'info',
                      message: `请选择待删除行数`
                    });
                }else{
                    //将选择行数的id拼成逗号隔开的字符串传入删除方法
                    for (let i = 0; i < length; i++) {
                        str += self.multipleSelection[i].id + ',';
                    }
                    var row={
                        id:str
                    }
                    self.handleDelete(row)
                }
                
            },
            //勾选
            handleSelectionChange(val) {
                this.multipleSelection = val;
                //console.log(this.multipleSelection.length)
            }
		}
	}
</script>
<style>
	body {
		font-family: Helvetica, sans-serif;
	}
	
	
</style>