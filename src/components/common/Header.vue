<template>
    <div class="header">
    <div class="logo"><span >{{username}}</span>后台管理系统</div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" :src="imgUrl">
                    {{username}}
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item  command='1'>品默</el-dropdown-item>
                    <el-dropdown-item  command='2'>麻麻香</el-dropdown-item>
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>

    import axios from 'axios';
    export default {
        data() {
            return {
                name: '',
                active:1,
                imgUrl:'../../../static/img/pinmo_logo.png'
            }
        },
        mounted:function(){
            if(!localStorage.getItem('type')){
                localStorage.setItem('type',1);
            }
            this.active=localStorage.getItem('type')
        },
        computed:{
            username(){
                var username=""
                if(this.active==1){
                    username="品默"
                    this.imgUrl="../../../static/img/pinmo_logo.png"
                }else if(this.active==2){
                    username="麻麻香"
                    this.imgUrl="../../../static/img/mama_logo.png"
                }
                //let username = localStorage.getItem('ms_username');
                return username;
            }
        },
        methods:{
            handleCommand(command) {
                var self=this;
                if(command == 'loginout'){
                    //退出登录
                    localStorage.removeItem('token')
                    axios.defaults.headers.common['Authorization'] = 'Bearer ';
                    this.$router.push('/login');
                }else{
                    //选择类型
                    self.active=command
                    localStorage.setItem('type',command);
                    //刷新页面
                    this.$router.go(0)
                }
            },
            // handleSelect(key, keyPath) {
            //     console.log(key, keyPath);
            // }
           
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:-15px;
        top:5px;
        width:60px;
        height:60px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
