<script setup>
import Top from "@/components/Top.vue";
import Comment from "@/components/Comment.vue";
import { useRoute } from 'vue-router';
import { inject, reactive, ref, onMounted, computed, watchEffect } from 'vue';
import { ElMessageBox, ElInput, ElButton, ElCard, ElRow, ElCol, ElMessage } from 'element-plus';
import { useStore } from '@/stores/my';
import { postApi } from '@/js/api';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHeart, faStar } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

const route = useRoute();
const axios = inject('axios');
const store = useStore();

let articleAndComment = reactive({
  "article": {"content": ""},
  "comments": []
});

// 添加评论相关数据
const commentContent = ref('')

// 点赞和收藏相关数据
const isLiked = ref(false)
const isFavorited = ref(false)
const loadingLike = ref(false)
const loadingFavorite = ref(false)

// 计算属性：是否已认证
const isAuthenticated = computed(() => !!store.user && !!store.user.id)

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
      
      // 更新点赞和收藏状态 - 从API响应中获取状态
      if (response.data.map.isLiked !== undefined) {
        isLiked.value = response.data.map.isLiked;
      }
      if (response.data.map.isFavorited !== undefined) {
        isFavorited.value = response.data.map.isFavorited;
      }
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
    url: '/api/comment/insert',
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
        
        // 更新点赞和收藏状态 - 从API响应中获取状态
        if (response.data.map.isLiked !== undefined) {
          isLiked.value = response.data.map.isLiked;
        }
        if (response.data.map.isFavorited !== undefined) {
          isFavorited.value = response.data.map.isFavorited;
        }
      } else {
        ElMessageBox.alert("无文章！", '结果');
      }
    } else {
      ElMessageBox.alert(response.data.msg, '结果');
    }
  });
};
const canComment = ref(false)//是否显示评论
// 修改条件判断，允许所有登录用户（包括管理员）显示评论区
if(store.user && store.user.id){
  canComment.value=true
  // 由于isAuthenticated现在是computed，不再直接赋值
}

// 处理点赞
const handleLike = async () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  try {
    loadingLike.value = true
    const articleId = route.params.articleId
    
    if (isLiked.value) {
      const response = await postApi.unlikeArticle(articleId)
      if (response.data.success) {
        isLiked.value = false
        ElMessage.success('取消点赞成功')
      } else {
        ElMessage.error(response.data.msg || '取消点赞失败')
      }
    } else {
      const response = await postApi.likeArticle(articleId)
      if (response.data.success) {
        isLiked.value = true
        ElMessage.success('点赞成功')
      } else {
        ElMessage.error(response.data.msg || '点赞失败')
      }
    }
  } catch (error) {
    console.error('处理点赞失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  } finally {
    loadingLike.value = false
  }
}

// 处理收藏
const handleFavorite = async () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  try {
    loadingFavorite.value = true
    const articleId = route.params.articleId
    
    if (isFavorited.value) {
      const response = await postApi.unfavoriteArticle(articleId)
      if (response.data.success) {
        isFavorited.value = false
        ElMessage.success('取消收藏成功')
      } else {
        ElMessage.error(response.data.msg || '取消收藏失败')
      }
    } else {
      const response = await postApi.favoriteArticle(articleId)
      if (response.data.success) {
        isFavorited.value = true
        ElMessage.success('收藏成功')
      } else {
        ElMessage.error(response.data.msg || '收藏失败')
      }
    }
  } catch (error) {
    console.error('处理收藏失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  } finally {
    loadingFavorite.value = false
  }
}

// 使用 watchEffect 监听用户认证状态和文章ID的变化
watchEffect(async () => {
  // 确保用户已登录且文章ID存在
  if (isAuthenticated.value && store.user.id && route.params.articleId) {
    try {
      const articleId = route.params.articleId;
      // 检查点赞状态
      const likeResponse = await postApi.isArticleLikedByUser(store.user.id, articleId)
      if (likeResponse.data.success) {
        // 根据 msg 字段判断点赞状态
        isLiked.value = likeResponse.data.msg === '已点赞'
      } else {
        console.error('获取点赞状态失败:', likeResponse.data.msg)
      }
      
      // 检查收藏状态
      const favoriteResponse = await postApi.isArticleFavoritedByUser(store.user.id, articleId)
      if (favoriteResponse.data.success) {
        // 根据 msg 字段判断收藏状态
        isFavorited.value = favoriteResponse.data.msg === '已收藏'
      } else {
        console.error('获取收藏状态失败:', favoriteResponse.data.msg)
      }
    } catch (error) {
      console.error('初始化点赞和收藏状态失败:', error)
    }
  } else {
    // 用户未登录或文章ID不存在时，重置状态
    isLiked.value = false
    isFavorited.value = false
    console.log('用户未登录或文章ID未定义，重置点赞收藏状态')
  }
})
</script>

<template>
  <el-affix>
    <Top />
  </el-affix>

  <el-row>
    <el-col :span="14" :offset="5">
      <div class="article-content" v-html="articleAndComment.article.content"></div>
      
      <div class="article-actions" style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <el-button 
          type="primary" 
          :icon="isLiked ? faHeartSolid : faHeart"
          @click="handleLike"
          :loading="loadingLike"
          :plain="!isLiked"
          :class="{ 'liked': isLiked }"
          style="margin-right: 20px;"
        >
          {{ isLiked ? '已点赞' : '点赞' }}
        </el-button>
        <el-button 
          type="success" 
          :icon="isFavorited ? faStarSolid : faStar"
          @click="handleFavorite"
          :loading="loadingFavorite"
          :plain="!isFavorited"
          :class="{ 'favorited': isFavorited }"
        >
          {{ isFavorited ? '已收藏' : '收藏' }}
        </el-button>
      </div>
    </el-col>
  </el-row>

  <el-row style="background-color: #f7f7f7;">
    <el-col :span="14" :offset="5">
      <div class="comments-container">
        <!-- 发表评论区域 -->
        <div class="comment-form-area" v-if="canComment">
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