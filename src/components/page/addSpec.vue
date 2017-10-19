<template>
  <div id="form">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i> 商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/spec' }"> 规格列表</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/addClassify' }"> 新增规格</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
          <el-col :span="12">
          <div>
              <el-form ref="form" label-width="80px" :rules="rules" :model="form">
                <el-form-item label="规格名称" required>
                  <el-input v-model="form.name" ></el-input>
                </el-form-item>      
                <el-form-item label="规格排序" required>
                  <el-input v-model="form.order"></el-input>
                </el-form-item>
                <el-form-item label="添加属性" required>
                  <el-tag
                    :key="tag"
                    type='primary'
                    v-for="tag in dynamicTags"
                    :closable="true"
                    :close-transition="false"
                    @close="handleClose(tag)"
                    style='margin-right:10px'
                  >
                  {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="mini"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">添加新属性</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">立即创建</el-button>
                  <el-button>取消</el-button>
                </el-form-item>
              </el-form>
          </div>
          </el-col>
        </el-row>
            
    </div>

  </div>
</template>

<script>
import api from '../../api/api.json';
import axios from 'axios';
import qs from 'qs';
export default {
  data () {
    return {
      id:'',
      
      props:[],
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      form:{
        name:'',
        order:0,
      }

    }
  },
  created() {
    var self=this;
    if(self.$route.query.id){
      self.id=self.$route.query.id;
      self.getData()
    }
  },
  methods: {
     //得到数据
    getData() {
      let self = this;
      axios.get(api.baseUrl + api.getSpecDetail.url+self.id,
      ).then((res) => {
          if(res.data.responseCode == 0) {
              self.$message({
                type: 'info',
                message: `网络异常，获取失败`
              });
          } else {
              res=res.data.data
              self.form.name=res.name;
              self.form.order=res.order;
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
      if(self.$route.query.id){
        url=api.baseUrl+api.attribute.url+'update/'+self.id
      }else{
        url=api.baseUrl+api.attribute.url+localStorage.getItem('type')
      }
      var data ={
          name: self.form.name,
          order: self.form.order,
          values:self.dynamicTags
      }
      //alert(JSON.stringify(data))
      axios.post(url,
        qs.stringify(data)
      ).then((res) => {
        //console.log(JSON.stringify(res));
        if(res.data.responseCode==1){

          self.$message({
            type: 'info',
            message: `添加成功`
          });
          self.$router.push('/spec')

          
        }
      }).catch(function(error) {
        //console.log(error);
      });
    },
    //删除属性
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    //显示输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //新增属性
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
      
  }
    
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
.el-breadcrumb{
    margin-bottom: 30px
}

</style>
