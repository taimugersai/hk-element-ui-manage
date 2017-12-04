<template>
    <div class="table">
        <h1>控制台</h1>
        <!-- 筛选条 时间 状态 门店 -->
        <div class="handle-box">
           
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
            
            <div class="search_box">
                <el-button type="primary" icon="search" @click='getTotal_fee' style='margin-top:10px;margin-left:20px;'>筛选</el-button>
            </div>
            
            
            
            
        </div>
        <el-row>
          <div class="title">实时统计</div>
        </el-row>
        <el-row class='contents'>
           <el-col :span="8">
             <router-link :to="{ path: 'order', query: { status: 'all'}}" >
                <div class="grid-content bg-purple-dark" >
                  <p class="number">{{total_fee}}</p>
                  <p class="status">总金额</p>
                </div>
             </router-link>
            </el-col>
          <el-col :span="8">
          <router-link :to="{ path: 'order', query: { status: '1'}}" >
          <div class="grid-content bg-purple" >
          <p class="number">{{new_number}}</p>
            <p class="status">新订单</p>
            <span class="el-icon-bell" v-if='new_number>0'></span>
          </div>
          </router-link>
          </el-col>
          <el-col :span="8">
          <router-link :to="{ path: 'order', query: { status: '2'}}" ><div class="grid-content bg-purple-light" >
            <p class="number">{{un_number}}</p>
            <p class="status">待处理</p>
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
                store:[],
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
                ordered_at:'',
                status:'',
                store_id:'',

                total_fee:0,
                new_number:0,
                un_number:0
            }
        },
        mounted() {
            var self =this
            this.getTotal_fee();
            this.getStore();
            this.getNew();
            
            setInterval(function(){
              self.getNew()
            },300000)
        },
        methods: {
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
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
                        //console.log(res)
                        self.store=res.data.data
                        
                    }
                }).catch(function(error) {
                    //console.log(error);
                });
            },
            getTotal_fee() {
                let self = this;
                var time = String(self.ordered_at)
                if(time.split(',')[1]){
                  var date_range=time.split(',')[0]+'/'+time.split(',')[1]
                }else{
                   var date_range=""
                }
                axios.get(api.baseUrl +'/orders/count',
                    {
                        params: {
                            date_range:date_range,
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
                      this.$message({
                        message: '刷新成功',
                        type: 'success'
                      });
                        self.total_fee=res.data.data.total_fee
                    }
                }).catch(function(error) {
                    //console.log(error);
                });
            },
            getNew(){
               let self = this;
                axios.get(api.baseUrl +'/orders',
                    {
                        params: {
                            ordered_at:self.ordered_at,
                            out_trade_no:self.out_trade_no,
                            status: 1,
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

                        self.new_number=res.data.data.total
                        if(self.new_number>0){
                          self.playVoice()
                        }
                    }
                }).catch(function(error) {
                    //console.log(error);
                });
            },
            getUntreated(){
               let self = this;
                axios.get(api.baseUrl +'/orders',
                    {
                        params: {
                            ordered_at:self.ordered_at,
                            out_trade_no:self.out_trade_no,
                            status: 2,
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

                        self.un_number=res.data.data.total
                    }
                }).catch(function(error) {
                    //console.log(error);
                });
            },
            search() {
                let self = this;
                axios.get(api.baseUrl +'/order/'+localStorage.getItem('type')+'?page='+self.cur_page,
                     {
                        params: {
                            ordered_at:self.ordered_at,
                            out_trade_no:self.out_trade_no,
                            status: self.status,
                            store_id:self.store_id
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
                }).catch(function(error) {
                    //console.log(error);
                });
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            
           
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            playVoice:function(){
              var self=this;
              this.$message({
                  message: '你有'+self.new_number+'新订单待处理',
                  type: 'success'
              });
              var audio =document.getElementById('bgMusic')
              audio.play();
            },
            gotoOrder:function(status){
              alert(status)
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
    color:#8a6d3b;
  }
  .bg-purple {
    background: #e4b9b9;
     color:#a94442;
  }
  .bg-purple-light {
    background: #c1e2b3;
     color:#3c763d;
  }
  .grid-content {
    width: 150px;
    height: 150px;
    border-radius: 100%;
    min-height: 36px;
    margin:100px auto;
    filter:Alpha(Opacity=80);opacity:0.8;
    position: relative;
    cursor: pointer;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }



  /*标题*/
  .h1{
    font-size: 36px;
    padding-bottom: 9px;
    margin: 40px 0 20px;
    border-bottom: 1px solid #eee;
  }
  .title{
    margin-top: 20px;
    font-size: 30px;
    color: #337ab7
  }
  /*内容*/
  .contents{
    margin-top: 20px;
  }
  .contents .el-col{
    text-align: center;
  }
  .contents .number{
    font-size: 18px;
    line-height: 80px;
    color: #337ab7;
  }
  .grid-content:hover{
    filter:Alpha(Opacity=100);opacity:1;
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
    .search_box{
        display: inline-block;
        margin-top: 10px;
    }
    .el-icon-bell{
      color: white;
      background: red;
      padding: 10px;
      border-radius: 100%;
      position: absolute;
      top:0;
      right: 0;
    }
</style>