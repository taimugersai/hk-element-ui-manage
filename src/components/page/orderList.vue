<template>
	<div class="table">
		<!-- 面包屑 -->
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 订单管理</el-breadcrumb-item>
				<el-breadcrumb-item> 订单列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- 搜索框 -->
		<div class="handle-box">
			<!-- 订单号 -->
			<div class="search_box">
				<span style='margin-left:10px;margin-right:10px'>订单:</span>
				<el-input v-model="out_trade_no" placeholder="输入订单号" class="handle-input mr10" style='width:200px'></el-input>
			</div>
			<!-- 时间选择 -->
			<div class="search_box">
                <span style='margin-left:10px;margin-right:10px'>选择时间:</span>
                 <el-date-picker
                  v-model="ordered_at"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format='yyyy-MM-dd'
                  :picker-options="pickerOptions2">
                </el-date-picker>
            </div>
			<!-- 订单状态 -->
			<div class="search_box">
				<span style='margin-left:10px;margin-right:10px'>订单状态:</span>
			    <el-select v-model="status" placeholder="请选择">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
			</div>
			<!-- 门店 -->
			<div class="search_box">
				<span style='margin-left:10px;margin-right:10px'>门店:</span>
				<el-select v-model="store_id" placeholder="请选择">
					<el-option
				      label="全部 "
				      value="">
				    </el-option>
				    <el-option
				      v-for="item in store"
				      :key="item.value"
				      :label="item.display_name "
				      :value="item.id">
				    </el-option>
				  </el-select>
			</div>
			<!-- 搜索按钮 -->
			<div class="search_box">
				<el-button type="primary" icon="search" @click="getData" style='margin-top:10px;margin-left:20px;'>搜索</el-button>
			</div>
		</div>
		<!-- 表格 -->
		<el-table :data="tableData" border style="width: 100%" ref="multipleTable" >
			<el-table-column prop="out_trade_no" label="订单号" sortable width="200">
			</el-table-column>
			<el-table-column prop="receive_info" label="收货信息" width="450">
			</el-table-column>
			<el-table-column prop="delivery" label="配送方式" width="100">
			</el-table-column>
			<el-table-column prop="payment" label="支付方式" width="105">
				<template scope='scope'>
					<p v-if='scope.row.payment=="alipay"'>支付宝</p>
					<p v-if='scope.row.payment=="weixin"'>微信</p>
					<p v-if='scope.row.payment=="会员余额"'>会员余额</p>
				</template>
			</el-table-column>
			<el-table-column prop="total_fee" label="总金额" width="90">
			</el-table-column>
			<el-table-column prop="actual_fee" label="实付金额" width="100">
			</el-table-column>
			<el-table-column prop="name" label="订单状态" width="125">
				<template scope='scope'>
				<!-- 	<p v-if='scope.row.status==0' style="color:#F7BA2A">待付款</p> -->
					<p v-if='scope.row.status==1' style="color:#20A0FF">已付款</p>
					<p v-if='scope.row.status==2' style="color:#20A0FF">已接单</p>
					<p v-if='scope.row.status==3' style="color:#20A0FF">配送中</p>
					<p v-if='scope.row.status==4' style="color:#13CE66">配送完成</p>
					<p v-if='scope.row.status==5' style="color:#13CE66">确认收货</p>
					<p v-if='scope.row.status==6' style="color:#F7BA2A">申请退款</p>
					<p v-if='scope.row.status==7' style="color:#FF4949">已退款</p>
				</template>
			</el-table-column>
			<el-table-column prop="ordered_at" label="下单时间" width="200">
			</el-table-column>
			<el-table-column label="操作" >
				<template scope="scope">
					<router-link   :to="{ path: 'orderDetail', query: { id: scope.row.id}}" >
						<el-button size="small" type="primary">操作</el-button>
					</router-link>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<div class="pagination">
			<el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="10">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import api from '../../api/api.json';
    import axios from 'axios';
    import qs from 'qs';
	export default {
		data() {
			return {
				tableData: [],
				cur_page: 1,//当前页
				pickerOptions2: {
		          shortcuts: [{
		            text: '最近一周',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近三个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		        },
		        //订单状态
				options: [{
		          value: 'all',
		          label: '全部'
		        }, {
		          value: '0',
		          label: '待付款'
		        }, {
		          value: '1',
		          label: '已付款'
		        },  {
		          value: '2',
		          label: '已接单'
		        },{
		          value: '3',
		          label: '配送中'
		        }, {
		          value: '4',
		          label: '配送完成'
		        }, {
		          value: '5',
		          label: '确认收货'
		        }, {
		          value: '6',
		          label: '申请退款'
		        }, {
		          value: '7',
		          label: '已退款'
		        }],
		        //门店列表
		        store:[],

		        //搜索订单号，时间，订单状态，门店id
		        out_trade_no:'',
		        ordered_at:'',
		        status:"all",
		        store_id:''
			}
		},
		mounted() {
			//如果路由中传来订单状态
			if(this.$router.history.current.query.status){
				this.status=this.$router.history.current.query.status
			}
			this.getData();
			this.getStore();
		},
		methods: {
			//翻页
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData();
			},
			//获得门店
			getStore(){
				let self = this;
                axios.get(api.baseUrl +'/stores',
                	{
					    params: {
							brand_id:localStorage.getItem('type')
					    }
					}
                ).then((res) => {
                    if(res.data.responseCode == 0) {
                        self.$message({
                          type: 'info',
                          message: `网络异常，获取失败`
                        });
                    } else {
                    	self.store=res.data.data
                    }
                });
			},
			//获得数据
			getData() {
				let self = this;
				//处理时间
				var time = String(self.ordered_at)
                if(time.split(',')[1]){
                  var date_range=time.split(',')[0]+'/'+time.split(',')[1]
                }else{
                   var date_range=""
                }
                axios.get(api.baseUrl +'/orders',
                	{
					    params: {
					    	page:self.cur_page,
					      	date_range:date_range,
							out_trade_no:self.out_trade_no,
							status: self.status,
						 	store_id:self.store_id,
							brand_id:localStorage.getItem('type')
					    }
					}
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
	.search_box{
		display: inline-block;
		margin-top: 10px;
	}
</style>