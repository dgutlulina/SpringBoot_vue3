<script setup>
import {dateFormat} from "@/js/tool.js"
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps(['article'])
const size = ref(40)
const router = useRouter()
</script>
<template>
  <el-row>
    <el-col :sm="24" :md="11">
      <!-- 添加固定宽度和高度 -->
      <el-image 
        :src="props.article.thumbnail" 
        style="width: 480px; height: 250px;"
        :alt="props.article.title"
        fit="cover"
      />
    </el-col>
    <el-col :sm="0" :md="1"></el-col>
    <el-col :sm="24" :md="12">
      <el-row align="middle"><el-col>
        <el-space :size="size">
          <span id="categories" class="categorie-height" v-html="props.article.categories"></span>
          <span class="categorie-height" v-html="'发布于'+dateFormat(props.article.created,'yyyy-MM-dd')"></span>
        </el-space>
      </el-col></el-row>
      <el-row align="middle"><el-col>
        <span class="title" @click="router.push(`/article_comment/${props.article.id}`)" v-html="props.article.title"></span>
      </el-col></el-row>
      <el-row align="middle"><el-col>
        <span v-html="props.article.content.substring(0,90)"></span>
      </el-col></el-row>
    </el-col>
    <el-col :span="1"></el-col>
  </el-row>
</template>

<style scoped>
/* #表示元素选择器，hover表示鼠标在其上时 */
#categories:hover { color: #10D07A;}
.categorie-height{line-height: 40px;}
.title{
  color: #0f9ae0;
  font-size:20px;
  line-height: 40px;
  cursor: pointer;
}
.title:hover {
  color: #096B94;
  text-decoration: underline;
}
</style>