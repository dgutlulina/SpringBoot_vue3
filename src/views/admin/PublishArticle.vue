<script setup>
import { reactive, ref, inject, provide, nextTick } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useStore } from '@/stores/my'
import Editor from '@tinymce/tinymce-vue'
import { useRouter } from 'vue-router'
import Cropper from "@/components/Cropper.vue";
import { undefine, nullZeroBlank } from "@/js/tool.js"

const router = useRouter()
const store = useStore()
let type = "add"
const header = ref("发布文章")

const axios = inject('axios')

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

const apiKey = ref('883llcm8huxeu6ustdkrozbff79ma9wsm8ox7fjvk3gujx0e')
const init = reactive({
  language: "zh_CN", //语言类型
  placeholder: "在这里输入文字",
  plugins: ['image', 'code'],
  toolbar: 'image',
  images_file_types: 'jpg,jpeg,png,gif,bmp',
  images_upload_handler: image_upload_handler,
  convert_urls: false
})

let article = reactive({ "title": "", "tags": "", "content": "", thumbnail: "" })

const cropper1 = ref(null)
let isShowCropper = ref(true)

// 检查是否为编辑模式
if (store.articleId > 0) {
  type = "edit"
  header.value = "编辑文章"
  axios({
    method: 'post',
    url: '/api/article/selectById?id=' + store.articleId
  }).then((response) => {
    if (response.data.success) {
      let nowArticle = response.data.map.article
      article.id = nowArticle.id
      article.title = nowArticle.title
      article.tags = nowArticle.tags
      article.content = nowArticle.content
      article.thumbnail = nowArticle.thumbnail
      
      // 如果是编辑模式且有缩略图，则设置Cropper组件
      if(!undefine(article.thumbnail) 
          && !nullZeroBlank(article.thumbnail)
          && article.thumbnail.indexOf("/api")==0){
            cropper1.value.setThumbnail(article.thumbnail)
      }
    } else {
      ElMessageBox.alert(response.data.msg, '结果')
    }
    store.articleId = 0
  }).catch((error) => {
    ElMessageBox.alert("系统错误！", '结果')
    store.articleId = 0
  })
}

//刷新子组件Cropper，让子组件恢复初始状态
function freshCropper() {
  isShowCropper.value = false
  //nextTick将回调延迟到下次 DOM 更新循环之后执行。
  //在修改数据（isShowCropper.value = false）之后立即使用它，然后等待 DOM 更新。
  nextTick(() => {
    isShowCropper.value = true;
  })
}
provide("freshCropper", freshCropper)

function publishArticle() {
  // 获取Cropper组件的缩略图
  let thumbnail = cropper1.value.getThumbnail()
  if (undefine(thumbnail) || nullZeroBlank(thumbnail) 
            || thumbnail.indexOf("/api") != 0) {
    article.thumbnail = ""
  } else {
    article.thumbnail = thumbnail
  }
  
  let url = '/api/article/publishArticle';
  
  //发送axios的post请求，经过反向代理，最终访问http://localhost:8080/article/publishArticle
  axios({
    method: 'post',
    url: url + '?type=' + type,
    data: article,
    timeout: 3000000
  }).then((response) => {
    //response.data代表后端服务器返回的json格式的数据
    ElMessageBox.alert(response.data, '结果')
    if("添加成功！"==response.data){
      clearData()//清空数据
      window.scrollTo(0, 0)//滚动到顶端    
    }
  }).catch((error) => {
    ElMessageBox.alert("系统错误！", '结果')
  })
}

function clearData() {
  article.title = ""
  article.tags = ""
  article.content = ""
  article.thumbnail = ""
  cropper1.value.clearData()//清空子组件（剪裁图片）数据
}

function gotoArticleManage() {
  router.push({ name: 'manageArticle' })
}
</script>

<template>
  <el-row>
    <el-col :span="24">
      <h4>{{ header }}</h4>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <el-input v-model="article.title" placeholder="请输入文章标题（必须）" clearable />
    </el-col>
    <el-col :span="12">
      <el-input v-model="article.tags" :rows="1" type="textarea" placeholder="请输入文章标签,可以多行" />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div id="editor">
        <editor v-model="article.content" :init="init" :api-key="apiKey" />
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <Cropper ref="cropper1" v-if="isShowCropper" />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div align="right">
        <el-button @click="gotoArticleManage">返回列表</el-button>
        <el-button type="primary" @click="publishArticle">保存文章</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
</style>
