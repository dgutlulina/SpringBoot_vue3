<script setup>
import { reactive, ref, inject, provide, nextTick, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useStore } from '@/stores/my'
import Editor from '@tinymce/tinymce-vue'
import { useRouter, useRoute } from 'vue-router'
import Cropper from "@/components/Cropper.vue";
import { undefine, nullZeroBlank } from "@/js/tool.js"

const updateThumbnail = (url) => {
  console.log('更新缩略图URL:', url) // 添加日志以便调试
  article.thumbnail = url
}
provide('updateThumbnail', updateThumbnail)

const router = useRouter()
const store = useStore()
let type = "add"
const header = ref("发布文章")

// 计算属性：用户是否已认证
const isAuthenticated = computed(() => !!store.user && !!store.user.id)

const axios = inject('axios')

// 分类和标签相关数据
const categories = ref([])
const tags = ref([])

// 获取所有分类
const getAllCategories = () => {
  axios({
    method: 'post',
    url: '/api/article/getAllCategories'
  }).then((response) => {
    if (response.data.success) {
      categories.value = response.data.map.categories || []
    } else {
      ElMessage.error(response.data.msg || '获取分类失败')
    }
  }).catch((error) => {
    ElMessage.error('获取分类失败')
    console.error(error)
  })
}

// 获取所有标签
const getAllTags = () => {
  axios({
    method: 'post',
    url: '/api/article/getAllTags'
  }).then((response) => {
    if (response.data.success) {
      tags.value = response.data.map.tags || []
    } else {
      ElMessage.error(response.data.msg || '获取标签失败')
    }
  }).catch((error) => {
    ElMessage.error('获取标签失败')
    console.error(error)
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

let article = reactive({ "title": "", "categories": "", "tags": "", "content": "", thumbnail: "" })

const cropper1 = ref(null)
let isShowCropper = ref(true)

// 检查是否为编辑模式 - 支持URL参数和store
const route = useRoute()
let articleIdToLoad = 0

// 首先检查URL参数中是否有文章ID
const urlArticleId = route.query.id
if (urlArticleId) {
  articleIdToLoad = parseInt(urlArticleId)
} else if (store.articleId > 0) {
  // 如果URL参数中没有，则检查store中的ID
  articleIdToLoad = store.articleId
}

if (articleIdToLoad > 0) {
  type = "edit"
  header.value = "编辑文章"
  axios({
    method: 'post',
    url: '/api/article/getArticleById?id=' + articleIdToLoad
  }).then((response) => {
    if (response.data.success) {
      let nowArticle = response.data.map.article
      article.id = nowArticle.id
      article.title = nowArticle.title
      article.categories = nowArticle.categories || ''
      article.tags = nowArticle.tags || ''
      article.content = nowArticle.content
      article.thumbnail = nowArticle.thumbnail
      
      console.log('加载文章数据，thumbnail值为:', article.thumbnail) // 添加调试日志
      
      // 如果是编辑模式且有缩略图，则设置Cropper组件
      if(!undefine(article.thumbnail) 
          && !nullZeroBlank(article.thumbnail)
          && article.thumbnail.indexOf("/api")==0){
            cropper1.value.setThumbnail(article.thumbnail)
      }
    } else {
      ElMessageBox.alert(response.data.msg, '结果')
    }
    // 清除store中的ID，避免重复使用
    if (store.articleId > 0) {
      store.articleId = 0
    }
  }).catch((error) => {
    ElMessageBox.alert("系统错误！", '结果')
    // 清除store中的ID，避免重复使用
    if (store.articleId > 0) {
      store.articleId = 0
    }
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
  // 检查用户是否已登录
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  console.log('发布文章前的thumbnail值:', article.thumbnail) // 添加调试日志
  
  // 处理缩略图，确保合法的URL被保存
  if (
    article.thumbnail &&
    !undefine(article.thumbnail) &&
    !nullZeroBlank(article.thumbnail) &&
    article.thumbnail.startsWith("/api")
  ) {
    // 合法，保留原值
    console.log('使用上传的缩略图') // 添加调试日志
  } else if (
    article.thumbnail &&
    !undefine(article.thumbnail) &&
    !nullZeroBlank(article.thumbnail)
  ) {
    // 不以/api开头但也非空，可能是完整URL，也保留
    console.log('使用完整URL缩略图') // 添加调试日志
  } else {
    // 非法或为空，设为空字符串，让后端使用默认图
    article.thumbnail = ""
    console.log('使用默认缩略图') // 添加调试日志
  }

  let url = '/api/article/publishArticle'
  
  // 在发送请求前再次记录thumbnail值
  console.log('发送到后端的thumbnail值:', article.thumbnail)
  
  axios({
    method: 'post',
    url: url + '?type=' + type,
    data: article,
    timeout: 3000000
  }).then((response) => {
    ElMessageBox.alert(response.data, '结果')
    if ("添加成功！" === response.data) {
      clearData()
      window.scrollTo(0, 0)
    }
  }).catch((error) => {
    ElMessageBox.alert("系统错误！", '结果')
  })
}

function clearData() {
  article.title = ""
  article.categories = ""
  article.tags = ""
  article.content = ""
  article.thumbnail = ""
  if (cropper1.value) {
    cropper1.value.clearData()//清空子组件（剪裁图片）数据
  }
}

function gotoArticleManage() {
  router.push({ name: 'manageArticle' })
}

// 组件挂载时获取分类和标签
onMounted(() => {
  getAllCategories()
  getAllTags()
})
</script>

<template>
  <el-row>
    <el-col :span="24">
      <h4>{{ header }}</h4>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-input v-model="article.title" placeholder="请输入文章标题（必须）" clearable />
    </el-col>
    <el-col :span="6">
      <el-select v-model="article.categories" placeholder="请选择分类" clearable filterable style="width: 100%">
        <el-option
          v-for="category in categories"
          :key="category"
          :label="category"
          :value="category"
        />
      </el-select>
    </el-col>
    <el-col :span="6">
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