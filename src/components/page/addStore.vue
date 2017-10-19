<template>
	<div id="form">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 门店管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/store' }"> 门店列表</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/addStore' }"> 新增门店</el-breadcrumb-item>
			</el-breadcrumb>
			<el-row>
				<el-col :span="12">
					<hk_form :form='form' v-on:onSubmit="onSubmit"></hk_form>
					<!-- 百度地图 -->
					<!-- <template>
						<baidu-map class="map" ak="CTnpQIcAa9nHPYYFoCweNxOe" @click='setLocation' :scroll-wheel-zoom="true" :zoom="15" :center="center"> -->
							<!-- 地图定位控件 -->
							<!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation> -->
							<!-- 地图缩放控件 -->
							<!-- <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation> -->
						<!-- </baidu-map>
					</template> -->
					<div id="r-result"><input type="text" id="suggestId" size="20" value="百度" /></div>
					<div id="allmap" class='map'></div>
					
					<div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
				</el-col>
			</el-row>

		</div>

	</div>
</template>

<script>
	import { BaiduMap } from 'vue-baidu-map'
	import hk_form from './form'
	import api from '../../api/api.json';
	import axios from 'axios';
	import qs from 'qs';
	export default {
		data() {
			return {
				map:{},
				id:'',
				form: [{
						'label': '门店名称',
						"type": 'text',
						"value":  '',
						"ifRequired":true
					}, //输入框。label为标题，type为类型，value为默认值
					{
						'label': '账号（英文字符/数字/_）',
						"type": 'text',
						"value": '',
						"ifRequired":true

					},
					{
						'label': '门店密码',
						"type": 'password',
						"value": '',
						"ifRequired":true
					},
					{
						'label': '确认密码',
						"type": 'password',
						"value": '',
						"ifRequired":true
					},
					{
						'label': '联系电话',
						"type": 'text',
						"value": '',
						"ifRequired":true
					},
					{
						'label': '地址',
						"type": 'text',
						"value": '',
						"ifRequired":true
					},
					{
						'label': '门店经度',
						"type": 'text',
						"value": '',
						"ifRequired":true
					},
					{
						'label': '门店纬度',
						"type": 'text',
						"value": '',
						"ifRequired":true
					},
					{
						'label': '',
						type: 'submit'
					}
				],
				center: {
					lng: 0,
					lat: 0
				},
				flag:true

			}
		},
		mounted: function() {
			var self = this
			//将地图中心定位到当前位置
			// if(navigator.geolocation) {
			// 	navigator.geolocation.getCurrentPosition(self.showPosition);
			// } else {
			// 	alert("Geolocation is not supported by this browser.")
			// }

			self.map = new BMap.Map("allmap");
			// var point = new BMap.Point(116.331398,39.897445);
			self.map.centerAndZoom('江苏无锡',15);
			self.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
			$('#district').change(function(){
				//district = $('#city').val() + $('#district').val();
				self.map.centerAndZoom('江苏无锡',15);
			})
			var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
				{"input" : "suggestId"
				,"location" : self.map
			});
			ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
			var _value = e.item.value;
				var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
				
				self.setPlace(myValue);
			});

			self.map.setDefaultCursor('crosshair');
			self.map.addEventListener("click", self.clickMap);
		    if(self.$route.query.id){
		      self.id=self.$route.query.id;
		      self.getData()
		    }
		},
		components: {
			BaiduMap,
			hk_form,
		},
		methods: {
			setPlace(myValue){
				var self=this;
				self.map.clearOverlays();    //清除地图上所有覆盖物
				function myFun(){
					var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
					self.form[6].value = pp.lng
					self.form[7].value = pp.lat
					self.map.centerAndZoom(pp, 18);
					self.map.addOverlay(new BMap.Marker(pp));    //添加标注
				}
				var local = new BMap.LocalSearch(self.map, { //智能搜索
				  onSearchComplete: myFun
				});
				local.search(myValue);
			},
			//将地图中心定位到当前位置
			showPosition(position) {
				this.center.lng = position.coords.longitude
				this.center.lat = position.coords.latitude
			},
			//点击后得到点击位置坐标
			setLocation(e) {
				const {
					lng,
					lat
				} = e.target.getCenter()
				this.form[6].value = lng
				this.form[7].value = lat
			},
			 //得到数据
		    getData() {
		      let self = this;
		      axios.get(api.baseUrl + '/store/show/'+self.id,
		      ).then((res) => {
		          if(res.data.responseCode == 0) {
		              self.$message({
		                type: 'info',
		                message: `网络异常，获取失败`
		              });
		          } else {
		              res=res.data.data
		              self.form[0].value=res.display_name
				      self.form[1].value=res.name
				      self.form[2].value=res.password
				      self.form[4].value=res.tel
				      self.form[5].value=res.address
				      self.form[6].value=res.lng
				      self.form[7].value=res.lat
		             
		              for(var i=0;i<res.values.length;i++){
		                self.dynamicTags.push(res.values[i].value);
		              }
		          }
		      }).catch(function(error) {
		          //console.log(error);
		      });
		    },
			//提交
		    onSubmit() {
		      let self = this;
		      var url='';
		      var data={
		      	display_name:self.form[0].value,
		      	name:self.form[1].value,
		      	password:self.form[2].value,
		      	tel:self.form[4].value,
		      	address:self.form[5].value,
		      	lng	:self.form[6].value,
		      	lat	:self.form[7].value,
		      }
		      	if(!data.display_name){
					self.$message({
	                  type: 'info',
	                  message: `请填写商店名`
	                });
	                return
				}
				 if(!data.name){
					self.$message({
	                  type: 'info',
	                  message: `请填写账号`
	                });
	                return
				}
				 if(self.form[2].value==''){
					self.$message({
	                  type: 'info',
	                  message: `请填写密码`
	                });
	                return
				}

				if(self.form[3].value==''){
					self.$message({
	                  type: 'info',
	                  message: `请再次填写密码`
	                });
	                return
				}
				if(self.form[2].value!=self.form[3].value){
					self.$message({
	                  type: 'info',
	                  message: `两次密码不一致`
	                });
	                return
				}
				if(data.password.length<6){
					self.$message({
	                  type: 'info',
	                  message: `密码长度不能小于6位`
	                });
	                return
				}
				
				 if(!data.tel){
					self.$message({
	                  type: 'info',
	                  message: `请填写联系方式`
	                });
	                return
				}
				var regphone =/^0?1[3|4|5|8][0-9]\d{8}$/
			      if(regphone.test(data.tel)==false){
			        self.$message({
	                  type: 'info',
	                  message: `手机格式不正确`
	                });
			        return 
			      }
				 if(!data.address){
					self.$message({
	                  type: 'info',
	                  message: `请填写地址`
	                });
	                return
				}
				if(!data.lng||!data.lng){
					self.$message({
	                  type: 'info',
	                  message: `请选择经纬度`
	                });
	                return
				}
				






		      if(self.$route.query.id){
		        url=api.baseUrl+'/store/update/'+self.id
		      }else{
		        url=api.baseUrl+'/store/'+localStorage.getItem('type')
		      }
		      if(self.flag){
		      	self.flag=false
		      	setTimeout(function(){self.flag=true},1000)
		      	axios.post(url,
			        qs.stringify(data)
			      ).then((res) => {
			        //console.log(JSON.stringify(res));
			        if(res.data.responseCode==1){

			          self.$message({
			            type: 'info',
			            message: `添加成功`
			          });
			          self.$router.push('/store')

			          
			        }
			      }).catch(function(error) {
			        //console.log(error);
			      });
		      }else{
	      		self.$message({
		            type: 'info',
		            message: `请勿重复提交`
		          });
		      }
		      
		    },
		    clickMap(e){
		    	var self =this;
				var geoc = new BMap.Geocoder();  
				self.map.clearOverlays();
				var point = new BMap.Point(e.point.lng, e.point.lat);
				var mk = new BMap.Marker(point);
				self.map.addOverlay(mk);
				self.map.panTo(point);
				geoc.getLocation(point, function(rs){
					var addComp = rs.addressComponents;
					//console.log(addComp.street + ", " + addComp.streetNumber);
					//$('#search').val(addComp.street + addComp.streetNumber);
				});
				//$('#geolocation').val(e.point.lng+','+e.point.lat);
				//console.log(e.point)
				self.form[6].value=e.point.lng
				self.form[7].value=e.point.lat
			}
		}
	}
	function G(id) {
		return document.getElementById(id);
	}
</script>

<style>
	.map {
		width: 800px;
		height: 600px;
	}
	#r-result input{
		width: 260px;
		height: 30px;
		border-radius: 4px;
		position: relative;
		top: 50px;
		left: 20px;
		z-index: 99999;
		padding-left: 30px;
		outline: none;
	}
</style>