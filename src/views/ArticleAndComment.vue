<script setup>
import Top from "@/components/Top.vue";
import Comment from "@/components/Comment.vue";
import { useRoute } from 'vue-router';
import { inject, reactive, ref } from 'vue';
import { ElMessageBox, ElInput, ElButton, ElCard, ElRow, ElCol } from 'element-plus';

const route = useRoute();
const axios = inject('axios');

let articleAndComment = reactive({
  "article": {"content": ""},
  "comments": []
});

// 添加评论相关数据
const commentContent = ref('')

// 获取文章和评论
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
    ElMessageBox.alert(response.data.msg, '结果');
  }
});

// 提交评论的方法
const submitComment = () => {
  if (!commentContent.value.trim()) {
    ElMessageBox.alert('评论内容不能为空！', '提示');
    return;
  }

  const commentData = {
    articleId: route.params.articleId,
    content: commentContent.value,
    author: '匿名用户' // 默认匿名用户
  };

  axios({
    method: 'post',
    url: '/api/comment/add',
    data: commentData
  }).then((response) => {
    if (response.data.success) {
      ElMessageBox.alert('评论提交成功！', '提示', {
        confirmButtonText: '确定',
        callback: () => {
          commentContent.value = '';
          // 重新加载评论列表，确保数据同步
          reloadComments();
        }
      });
    } else {
      ElMessageBox.alert(response.data.msg || '评论提交失败！', '提示');
    }
  }).catch(error => {
    console.error('提交评论失败:', error);
    ElMessageBox.alert('提交评论时发生错误！', '错误');
  });
};

// 重新加载评论
const reloadComments = () => {
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
      ElMessageBox.alert(response.data.msg, '结果');
    }
  });
};
</script>

<template>
  <el-affix>
    <Top />
  </el-affix>

  <el-row>
    <el-col :span="14" :offset="5">
      <div class="article-content" v-html="articleAndComment.article.content"></div>
    </el-col>
  </el-row>

  <el-row style="background-color: #f7f7f7;">
    <el-col :span="14" :offset="5">
      <div class="comments-container">
        <!-- 发表评论区域 -->
        <div class="comment-form-area">
          <el-card class="comment-card">
            <el-row>
              <el-col>
                <el-input 
                  v-model="commentContent" 
                  :autosize="{ minRows: 4 }"
                  type="textarea" 
                  placeholder="请输入评论内容..." />
              </el-col>
            </el-row>
            <el-row justify="end" style="margin-top: 15px;">
              <el-col :xs="8" :sm="6" :md="4">
                <el-button @click="submitComment" type="primary" round>提交评论</el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
        
        <!-- 评论列表 -->
        <div class="comments-list">
          <div 
            v-for="comment in articleAndComment.comments" 
            :key="comment.id" 
            class="comment-item">
            <Comment :comment="comment"></Comment>
          </div>
          <div v-if="!articleAndComment.comments || articleAndComment.comments.length === 0" class="no-comments">
            暂无评论
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.article-content {
  padding: 20px 0;
}

.comments-container {
  padding: 20px 0;
}

.comment-form-area {
  margin-bottom: 30px;
}

.comment-card {
  padding: 20px;
}

.comments-list {
  margin-top: 20px;
}

.comment-item {
  padding: 20px;
  background: #fff;
  margin-bottom: 10px;
  margin-top: 10px;
}

.no-comments {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px;
}
</style>