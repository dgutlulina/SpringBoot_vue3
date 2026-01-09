<script setup>
import {dateFormat} from "@/js/tool.js"
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { postApi } from '@/js/api'
import { useStore } from '@/stores/my'
import { ElMessage } from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'

const props = defineProps(['article'])
const size = ref(40)
const router = useRouter()
const store = useStore()

// 点赞和收藏状态
const isLiked = ref(false)
const isFavorited = ref(false)

// 计算属性：用户是否已登录
const isAuthenticated = computed(() => store.user.user)

// 初始化点赞和收藏状态
onMounted(async () => {
  console.log(store.user.user)
  // 添加更严格的检查，确保store.user.user和store.user.user.id都已定义
  if (!isAuthenticated.value && store.user.user && store.user.user.id) {
    try {
      // 检查点赞状态
      const likeResponse = await postApi.isArticleLikedByUser(store.user.user.id, props.article.id)
      if (likeResponse.data.success) {
        isLiked.value = likeResponse.data.data
      }
      
      // 检查收藏状态
      const favoriteResponse = await postApi.isArticleFavoritedByUser(store.user.user.id, props.article.id)
      if (favoriteResponse.data.success) {
        isFavorited.value = favoriteResponse.data.data
      }
    } catch (error) {
      console.error('初始化点赞收藏状态失败:', error)
    }
  } else {
    console.log('用户未登录或用户ID未定义，无法初始化点赞收藏状态')
  }
})

// 点赞/取消点赞
const handleLike = async () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  try {
    if (isLiked.value) {
      // 取消点赞
      const response = await postApi.unlikeArticle(props.article.id)
      if (response.data.success) {
        isLiked.value = false
        ElMessage.success('取消点赞成功')
      } else {
        ElMessage.error(response.data.msg || '取消点赞失败')
      }
    } else {
      // 点赞
      const response = await postApi.likeArticle(props.article.id)
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
  }
}

// 收藏/取消收藏
const handleFavorite = async () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  try {
    if (isFavorited.value) {
      // 取消收藏
      const response = await postApi.unfavoriteArticle(props.article.id)
      if (response.data.success) {
        isFavorited.value = false
        ElMessage.success('取消收藏成功')
      } else {
        ElMessage.error(response.data.msg || '取消收藏失败')
      }
    } else {
      // 收藏
      const response = await postApi.favoriteArticle(props.article.id)
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
  }
}
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
      <el-row align="middle" style="margin-top: 16px;"><el-col>
        <el-space :size="20">
          <el-button
            type="text"
            @click="handleLike"
            class="interaction-btn"
          >
            <FontAwesomeIcon
              :icon="isLiked ? faHeartSolid : faHeartRegular"
              :class="isLiked ? 'liked' : ''"
              style="margin-right: 4px;"
            />
            <span>{{ isLiked ? '已点赞' : '点赞' }}</span>
          </el-button>
          <el-button
            type="text"
            @click="handleFavorite"
            class="interaction-btn"
          >
            <FontAwesomeIcon
              :icon="isFavorited ? faStarSolid : faStarRegular"
              :class="isFavorited ? 'favorited' : ''"
              style="margin-right: 4px;"
            />
            <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
          </el-button>
        </el-space>
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