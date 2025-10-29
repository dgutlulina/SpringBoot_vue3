<script setup>
import Top from "@/components/Top.vue";
import { useRoute } from 'vue-router';
import { inject, reactive } from 'vue';
import { ElMessageBox } from 'element-plus';

const route = useRoute();
const axios = inject('axios');

let articleAndComment = reactive({
  "article": {"content": ""},
  "comments": []
});

axios({
  method: 'post',
  url: '/api/article/getArticleAndCommentByArticleId?articleId=' + route.params.articleId,
  timeout: 300000
}).then((response) => {
  if (response.data.success) {
    if (response.data.map.article !== null) {
      articleAndComment.article = response.data.map.article;
      articleAndComment.comments = response.data.map.comments;
    } else {
      ElMessageBox.alert("无文章！", '结果');
    }
  } else {
    ElMessageBox.alert(articleAndComment.msg, '结果');
  }
});
</script>
<template>
  <el-affix>
    <Top />
  </el-affix>
  <el-row>
    <el-col :span="3"></el-col>
    <el-col :span="18">
      <div v-html="articleAndComment.article.content"></div>
    </el-col>
    <el-col :span="3"></el-col>
  </el-row>
</template>

<style scoped>
</style>