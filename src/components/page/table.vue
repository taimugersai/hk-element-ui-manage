<template>
	<div class="table">
	 	<div class="handle-box">
            <el-button type="warning" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <!-- <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button> -->
            <router-link :to="router"> <el-button type="success" icon="edit" class="handle-edit mr10" style='float:right;margin-bottom:20px'>新增</el-button></router-link>
        </div>
		<el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column :prop="item.data" :label="item.title"  v-for="item in tableData" :width='item.width'>
				<template scope='scope' >
	                <img :src="scope.row.cover" width='100px' alt="" v-if='item.data=="cover"' style="margin:0 auto" >
	                <p v-if='item.data!="cover"&&item.data!="type"'>{{scope.row[item.data]}}</p>
                    <p v-if="item.data=='type'&&scope.row[item.data]=='activity'">活动</p>
                    <p v-if="item.data=='type'&&scope.row[item.data]=='goods'">商品</p>
	                <!-- <p>{{JSON.stringify(scope.row)}}</p>
	                <p>111</p> -->
	              </template>
			
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template scope="scope">
					<router-link :to="{ path: router, query: { id: scope.row.id}}" >
						<el-button size="small" >编辑</el-button>
					</router-link>
					<el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
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
				
				cur_page: 1,
                multipleSelection: [],
                del_list: [],
                select_word:'',
                is_search: false,
                size:0,
                total:1,
                data:[]
			}
		},
		props: {
			tableData: Array,
			router:String,
			url:String
		},
        created(){
            this.getData();
        },
		methods: {
            //获得数据
            getData(){
                let self = this;
                axios.get(api.baseUrl + self.url+'/'+localStorage.getItem('type')+'?page='+self.cur_page,
                ).then((res) => {
                    if(res.data.responseCode == 0) {
                        self.$message({
                          type: 'info',
                          message: `网络异常，获取失败`
                        });
                    } else {
                        self.data=res.data.data.data
                        self.size=res.data.data.per_page
                        self.total=res.data.data.total
                    }
                }).catch(function(error) {
                    //console.log(error);
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
                    //console.log(row)
                    let self = this;
                    axios.post(api.baseUrl + self.url+'/destroy/'+row.id,
                        qs.stringify({})
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
                    }).catch(function(error) {
                        //console.log(error);
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
                //console.log(length)
                if(length==0){
                    self.$message({
                      type: 'info',
                      message: `请选择待删除行数`
                    });
                }else{
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