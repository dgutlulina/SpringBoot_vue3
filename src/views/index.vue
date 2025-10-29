<script setup>
import Top from '@/components/Top.vue'
import { inject } from 'vue'
const toArticle = inject('toArticle')
</script>
<template>
<el-affix> 
  <Top/>
</el-affix>
<el-row>
  <el-col :span="2"></el-col>
  <el-col :span="14">
    <el-button @click="toArticle">跳转文章</el-button>
    开始aa <br>aa <br>aa <br>aa <br>aa <br>大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好<br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa <br>aa</br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
  </el-col>
  <el-col :span="6">前bb <br>bb <br>bb <br>我们我们我们我们我们我们我们我们我们我们 <br>bb <br>bb <br></br></el-col>
  <el-col :span="2"></el-col>
</el-row>
</template>
<style scoped>

</style>