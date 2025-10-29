<script setup>
import { reactive, ref, inject } from 'vue'
import { ElMessageBox } from 'element-plus'
//发布文章
const axios = inject('axios')
function publishArticle() {
  console.log('准备发送的数据:', article)
  axios({
    method: 'post',
    url: '/api/article/publishArticle',
    data: article,
    timeout: 300000
  }).then((response) => {
    ElMessageBox.alert(response.data, '结果', {
      
    }).catch(err => {
    console.error('请求失败:', err)
    ElMessageBox.alert('网络错误或服务不可用', '错误')
  })
  })
}
//上传图片
const image_upload_handler = (blobInfo, progress) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open('POST', 'http://localhost:5173/api/article/upload');

  xhr.upload.onprogress = (e) => {
    progress(e.loaded / e.total * 100);
  };

  xhr.onload = () => {
    if (xhr.status === 403) {
      reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
      return;
    }
    if (xhr.status < 200 || xhr.status >= 300) {
      reject('HTTP Error: ' + xhr.status);
      return;
    }
    const json = JSON.parse(xhr.response);
    if (!json || !json.map || typeof json.map.url !== 'string') {
      reject('Invalid JSON: ' + xhr.responseText);
      return;
    }
    resolve(json.map.url);
  };

  const formData = new FormData();
  formData.append('file', blobInfo.blob(), blobInfo.filename());

  xhr.send(formData);
});
// 引入TinyMCE
import Editor from '@tinymce/tinymce-vue'
const apiKey = ref('883llcm8huxeu6ustdkrozbff79ma9wsm8ox7fjvk3gujx0e')
// 富文本编辑器TinyMCE的配置（json格式）
const init = reactive({
  language: "zh_CN", // 语言类型
  placeholder: "在这里输入文字",
plugins: ['image', 'code'],
  toolbar: 'undo redo | bold italic | image code', // 正确拼写 + 更完整工具栏
  images_file_types: 'jpg,jpeg,png,webp,svg',       // 支持常见图片格式
  images_upload_handler: image_upload_handler,      // ✅ 修正拼写
  convert_urls: false   
})


let article = reactive({ "title": "", "tags": "", "content": "" })
</script>

<template>
  <el-row>
    <el-col :span="24">
      <h4>发布文章</h4>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <el-input v-model="article.title" placeholder="请输入文章标题（必须）" clearable />
    </el-col>
    <!-- 将文本框内容和article的title属性进行双向绑定 -->

    <el-col :span="12">
      <el-input v-model="article.tags" :rows="1" type="textarea" placeholder="请输入文章标签,可以多行" />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
    </el-col>
  </el-row>
  <!-- <el-row>
    <el-col :span="24">
      <div align="right">
        <el-button>返回列表</el-button>
        <el-button type="primary" @click="publishArticle">保存文章</el-button>
      </div>
    </el-col>
  </el-row> -->
    <el-row>
    <el-col :span="24">
      <!-- 响应式变量的属性和富文本编辑器的内容（用户输入）双向绑定 -->
      <div id="editor">
        <editor v-model="article.content" :init="init" :api-key="apiKey"/>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div align="right">
        <el-button>返回列表</el-button>
        <el-button type="primary" @click="publishArticle">保存文章</el-button>
      </div>
    </el-col>
  </el-row>
</template>


<style scoped>
</style>
