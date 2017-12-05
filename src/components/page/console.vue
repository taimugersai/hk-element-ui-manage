<template>
	<div class="table">
		<h1>控制台</h1>
		<!-- 筛选条 时间 状态 门店 -->
		<div class="handle-box">

			<div class="search_box">
				<span style='margin-left:10px;margin-right:10px'>选择时间:</span>
				<el-date-picker v-model="ordered_at" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format='yyyy-MM-dd' :picker-options="pickerOptions2">
				</el-date-picker>
			</div>

			<div class="search_box">
				<span style='margin-left:10px;margin-right:10px'>订单状态:</span>
				<el-select v-model="status" placeholder="请选择">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>

			<div class="search_box">
				<span style='margin-left:10px;margin-right:10px'>门店:</span>
				<el-select v-model="store_id" placeholder="请选择">
					<el-option label="全部 " value="">
					</el-option>
					<el-option v-for="item in store" :key="item.value" :label="item.display_name " :value="item.id">
					</el-option>
				</el-select>
			</div>

			<div class="search_box">
				<el-button type="primary" icon="search" @click='getTotal_fee' style='margin-top:10px;margin-left:20px;'>筛选</el-button>
			</div>

		</div>
		<el-row>
			<div class="title">实时统计</div>
		</el-row>
		<el-row class='contents'>
			<el-col :span="24">
				<router-link :to="{ path: 'order', query: { status: 'all'}}">
					<div class="grid-content bg-purple-dark">
						<p class="number">{{total_fee}}元</p>
						<p class="status">总金额</p>
					</div>
				</router-link>
			</el-col>
		</el-row>
		<el-row class='contents'>
			<el-col :span="6">
				<router-link :to="{ path: 'order', query: { status: '1'}}">
					<div class="grid-content bg-purple-dark">
						<p class="number">{{new_number}}</p>
						<p class="status">新订单</p>
						<span class="el-icon-bell" v-if='new_number>0'></span>
					</div>
				</router-link>
			</el-col>
			<el-col :span="6">
				<router-link :to="{ path: 'order', query: { status: '2'}}">
					<div class="grid-content bg-purple">
						<p class="number">{{un_number}}</p>
						<p class="status">待处理</p>
						
					</div>
				</router-link>
			</el-col>
			<el-col :span="6">
				<router-link :to="{ path: 'bigOrder', query: { status: '1'}}">
					<div class="grid-content bg-purple-light">
						<p class="number">{{big_new_number}}</p>
						<p class="status">兑换新订单</p>
						<span class="el-icon-bell" v-if='big_new_number>0'></span>
					</div>
				</router-link>
			</el-col>
      <el-col :span="6">
        <router-link :to="{ path: 'bigOrder', query: { status: '2'}}">
          <div class="grid-content bg-purple">
            <p class="number">{{big_un_number}}</p>
            <p class="status">兑换待处理</p>
          </div>
        </router-link>
      </el-col>
		</el-row>
		<audio id="bgMusic" src='../../../static/newVoice.mp3'>

		</audio>
	</div>

</template>

<script>
	import api from '../../api/api.json';
	import axios from 'axios';
	import qs from 'qs';
	export default {
		data() {
			return {
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
				}, {
					value: '2',
					label: '已接单'
				}, {
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
				store: [],
				//时间配置
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
				//时间选择器绑定的时间
				ordered_at: '',
				//订单状态
				status: '',
				//门店id
				store_id: '',
				//总金额，新订单数量，未处理订单数量，大客户订单数量，大客户未处理订单数量
				total_fee: 0,
				new_number: 0,
				un_number: 0,
				big_new_number:0,
				big_un_number:0
			}
		},
		mounted() {
			var self = this
			this.getTotal_fee();
			this.getStore();
			this.getNew();
			this.getUntreated();
			this.getBigOrderNew();
			this.getBigOrderUntreated();
			setInterval(function() {
				self.getNew();
				this.getBigOrderNew();
			}, 300000)
		},
		computed:{
			//处理时间选择器返回的格式成"yy-mm-dd/yy-mm-dd"
			date_range:function(){
				var self = this;
				var time = String(self.ordered_at);
				var date_range='';
				if(time.split(',')[1]) {
					date_range = time.split(',')[0] + '/' + time.split(',')[1];
				} else {
					date_range = "";
				}
				return date_range;
			}
		},
		methods: {
			//获得所有门店
			getStore:function() {
				let self = this;
				axios.get(api.baseUrl + '/stores', {
					params: {
						brand_id: localStorage.getItem('type')
					}
				}).then((res) => {
					if(res.data.responseCode == 0) {
						self.$message({
							type: 'info',
							message: `网络异常，获取失败`
						});
					} else {
						self.store = res.data.data
					}
				})
			},
			//获得总金额
			getTotal_fee:function() {
				let self = this;
				axios.get(api.baseUrl + '/orders/count', {
					params: {
						date_range: self.date_range,
						status: self.status,
						store_id: self.store_id,
						brand_id: localStorage.getItem('type')
					}
				}).then((res) => {
					if(res.data.responseCode == 0) {
						self.$message({
							type: 'info',
							message: `网络异常，获取失败`
						});
					} else {
						this.$message({
							message: '刷新成功',
							type: 'success'
						});
						self.total_fee = res.data.data.total_fee.toFixed(2)
					}
				});
			},
			//获得新订单数量
			getNew:function() {
				let self = this;
				axios.get(api.baseUrl + '/orders', {
					params: {
						date_range: self.date_range,
						status: 1,
						store_id: self.store_id,
						brand_id: localStorage.getItem('type')
					}
				}).then((res) => {
					if(res.data.responseCode == 0) {
						self.$message({
							type: 'info',
							message: `网络异常，获取失败`
						});
					} else {
						self.new_number = res.data.data.total
						if(self.new_number > 0) {
							self.playVoice()
						}
					}
				});
			},
			//获得未处理订单数量
			getUntreated:function() {
				let self = this;
				axios.get(api.baseUrl + '/orders', {
					params: {
						date_range: self.date_range,
						status: 2,
						store_id: self.store_id,
						brand_id: localStorage.getItem('type')
					}
				}).then((res) => {
					if(res.data.responseCode == 0) {
						self.$message({
							type: 'info',
							message: `网络异常，获取失败`
						});
					} else {
						self.un_number = res.data.data.total
					}
				});
			},
			//获得大客户新订单数量
			getBigOrderNew:function(){
				let self = this;
				axios.get(api.baseUrl + '/bigOrders', {
					params: {
						date_range: self.date_range,
						status: 1,
						store_id: self.store_id,
						brand_id: localStorage.getItem('type')
					}
				}).then((res) => {
					if(res.data.responseCode == 0) {
						self.$message({
							type: 'info',
							message: `网络异常，获取失败`
						});
					} else {
						self.big_new_number = res.data.data.total
						if(self.new_number > 0) {
							self.playVoice()
						}
					}
				});
			},
			//获得大客户未处理订单数量
			getBigOrderUntreated:function(){
				let self = this;
				axios.get(api.baseUrl + '/bigOrders', {
					params: {
						date_range: self.date_range,
						status: 2,
						store_id: self.store_id,
						brand_id: localStorage.getItem('type')
					}
				}).then((res) => {
					if(res.data.responseCode == 0) {
						self.$message({
							type: 'info',
							message: `网络异常，获取失败`
						});
					} else {
						self.big_un_number = res.data.data.total
					}
				});
			},
			//播放新订单提醒
			playVoice: function() {
				var self = this;
				this.$message({
					message: '你有' + self.new_number + '新订单待处理',
					type: 'success'
				});
				var audio = document.getElementById('bgMusic')
				audio.play();
			}
		}

	}
</script>
<style scoped>
	.el-row {
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.el-col {
		border-radius: 4px;
	}
	
	.bg-purple-dark {
		background: #f7ecb5;
		color: #8a6d3b;
	}
	
	.bg-purple {
		background: #e4b9b9;
		color: #a94442;
	}
	
	.bg-purple-light {
		background: #c1e2b3;
		color: #3c763d;
	}
	
	
	
	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
	/*标题*/
	.h1 {
		font-size: 36px;
		padding-bottom: 9px;
		margin: 40px 0 20px;
		border-bottom: 1px solid #eee;
	}
	
	.title {
		margin-top: 20px;
		font-size: 30px;
		color: #337ab7
	}
	/*内容*/
	.contents {
		margin-top: 20px;
	}
	
	.contents .el-col {
		text-align: center;
	}
	
	.contents .number {
		font-size: 18px;
		line-height: 80px;
		color: #337ab7;
	}
	.grid-content {
	    width: 150px;
	    height: 150px;
	    border-radius: 100%;
	    min-height: 36px;
	    margin: 50px auto;
	    filter: Alpha(Opacity=80);
	    opacity: 0.8;
	    position: relative;
	    cursor: pointer;
	}
	.grid-content:hover {
		filter: Alpha(Opacity=100);
		opacity: 1;
	}
	/*搜索框*/
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
	
	.search_box {
		display: inline-block;
		margin-top: 10px;
	}
	
	.el-icon-bell {
		color: white;
		background: red;
		padding: 10px;
		border-radius: 100%;
		position: absolute;
		top: 0;
		right: 0;
	}
</style>