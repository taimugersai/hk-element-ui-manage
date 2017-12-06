<template>
    <!-- <el-upload
       action="http://192.168.1.130/api/admin/upload"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :headers='headers'>
      <i class="el-icon-plus"></i>
    </el-upload> -->
    <el-upload
      class="avatar-uploader"
      action="http://192.168.1.130/api/admin/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :headers='headers'
      >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
    import hk_table from './hk_table'
    export default {
        data() {
            return {
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    'Accept': 'application/json, text/plain, /'
                },
                dialogImageUrl: '',
                dialogVisible: false,
                imageUrl: ''
            }
        },
        components: {
            hk_table
        },
        methods: {
          upload(file){
            alert(JSON.stringify(file))
          },
          handleRemove(file, fileList) {
            console.log(file, fileList);
          },
          handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
          },
          handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
          },
          beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
          }
        }
    }
</script>
<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>