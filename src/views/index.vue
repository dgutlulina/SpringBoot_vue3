<script setup>
import Top from '@/components/Top.vue'
import ArticleHeader from '@/components/ArticleHeader.vue'
import { inject ,ref,reactive} from 'vue'
import axios from 'axios'
const toArticle = inject('toArticle')

const data = reactive({ articles: [] })
function getIndexData(){
  axios({ method:'post', url:'/api/article/getIndexData'})
    .then((response) => {
      if (response.data.success) {
        data.articles=response.data.map.articles
      }else{
        ElMessageBox.alert(response.data.msg, '结果')
      }
    }).catch((error) => {
      ElMessageBox.alert("系统错误！", '结果')
    })
}

getIndexData()

</script>
<template>
<el-affix> 
  <Top/>
</el-affix>
<el-row style="margin-top:40px" align="top">
  <el-col :span="1"></el-col>
  <el-col :span="14">
    <template v-for="article in data.articles">
      <ArticleHeader :article="article"/>
    </template>
  </el-col>
  <el-col :span="1"></el-col>
  <el-col :span="7">
  </el-col>
  <el-col :span="1"></el-col>
</el-row>
<!-- <el-row>
  <el-col :span="2"></el-col>
  <el-col :span="14">
    <el-button @click="toArticle">跳转文章</el-button>
    开始aa <br>aa <br>aa <br>aa <br>aa <br>大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好<br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa</br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
  </el-col>
  <el-col :span="6">前bb <br>bb <br>bb <br>我们我们我们我们我们我们我们我们我们我们 <br>bb <br>bb <br></br></el-col>
  <el-col :span="2"></el-col>
</el-row> -->
</template>
<style scoped>

</style>