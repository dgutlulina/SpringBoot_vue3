<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>个人中心</h1>
      <div style="text-align: right; margin-top: 10px;">
        <el-button @click="goHome" type="primary" plain>返回首页</el-button>
      </div>
    </div>
    
    <el-container class="profile-content">
      <el-aside width="200px" class="profile-nav">
        <el-menu
          :default-active="activeTab"
          class="el-menu-vertical"
          @select="handleTabSelect"
        >
          <el-menu-item index="profile">个人资料</el-menu-item>
          <el-menu-item index="posts">我的文章</el-menu-item>
          <el-menu-item index="liked">我喜欢的</el-menu-item>
          <el-menu-item index="favorites">我的收藏</el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-main class="profile-main">
        <!-- 个人资料标签页 -->
        <div v-if="activeTab === 'profile'" class="profile-tab">
          <h2>个人资料</h2>
          <div class="profile-info">
            <div class="avatar-section">
              <el-avatar :size="100" :src="userInfo.avatar || defaultAvatar" />
              <el-upload
                class="avatar-uploader"
                :action="uploadAvatarUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :headers="authHeaders"
              >
                <el-button type="primary" size="small" class="change-avatar-btn">更换头像</el-button>
              </el-upload>
            </div>
            
            <el-form 
              :model="userInfo" 
              :rules="profileRules" 
              ref="profileFormRef"
              label-width="100px" 
              class="profile-form"
            >
              <el-form-item label="昵称" prop="username">
                <el-input v-model="userInfo.username" />
              </el-form-item>
              
              <el-form-item label="个人简介" prop="bio">
                <el-input 
                  v-model="userInfo.bio" 
                  type="textarea" 
                  :rows="4"
                  placeholder="请输入个人简介"
                />
              </el-form-item>
              
              <el-form-item label="密码修改">
                <el-button type="primary" @click="showPasswordDialog = true">修改密码</el-button>
              </el-form-item>
              
              <el-form-item>
                <el-button 
                  type="primary" 
                  @click="saveProfile" 
                  :loading="savingProfile"
                  :disabled="!isAuthenticated"
                >
                  保存资料
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        
        <!-- 我的文章标签页 -->
        <div v-if="activeTab === 'posts'" class="posts-tab">
          <h2>我的文章</h2>
          <div class="posts-controls">
            <el-button type="primary" @click="createNewPost">发布新文章</el-button>
          </div>
          
          <el-table
            :data="userPosts"
            v-loading="loadingPosts"
            style="width: 100%"
          >
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="categories" label="分类" />
            <el-table-column prop="created" label="创建时间" :formatter="dateFormatTable" />
            <el-table-column prop="hits" label="浏览量" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" @click="editPost(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deletePost(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <el-pagination
            v-if="postsTotal > 0"
            @size-change="handlePostSizeChange"
            @current-change="handlePostCurrentChange"
            :current-page="postsPage"
            :page-sizes="[5, 10, 20]"
            :page-size="postsPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="postsTotal"
            class="pagination"
          />
        </div>
        
        <!-- 我喜欢的文章标签页 -->
        <div v-if="activeTab === 'liked'" class="liked-tab">
          <h2>我喜欢的文章</h2>
          
          <div v-if="likedPosts.length === 0 && !loadingLiked" class="no-data">
            <p>暂无点赞的文章</p>
          </div>
          <div v-else class="posts-list">
            <el-card 
              v-for="post in likedPosts" 
              :key="post.id" 
              class="post-card"
              v-loading="loadingLiked"
            >
              <template #header>
                <div class="card-header">
                  <span class="post-title">{{ post.title }}</span>
                  <el-button class="view-post-btn" type="text" @click="viewPost(post.id)">查看</el-button>
                </div>
              </template>
              <div v-if="post.thumbnail" class="post-thumbnail">
                <img :src="post.thumbnail" :alt="post.title" @click="viewPost(post.id)" style="cursor: pointer; width: 100%; height: auto;" />
              </div>
              <div class="post-meta">
                <span>发布于: {{ formatDate(post) }}</span>
              </div>
            </el-card>
          </div>
          
          <el-pagination
            v-if="likedTotal > 0"
            @size-change="handleLikedSizeChange"
            @current-change="handleLikedCurrentChange"
            :current-page="likedPage"
            :page-sizes="[5, 10, 20]"
            :page-size="likedPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="likedTotal"
            class="pagination"
          />
        </div>
        
        <!-- 我收藏的文章标签页 -->
        <div v-if="activeTab === 'favorites'" class="favorites-tab">
          <h2>我收藏的文章</h2>
          
          <div v-if="favoritePosts.length === 0 && !loadingFavorites" class="no-data">
            <p>暂无收藏的文章</p>
          </div>
          <div v-else class="posts-list">
            <el-card 
              v-for="post in favoritePosts" 
              :key="post.id" 
              class="post-card"
              v-loading="loadingFavorites"
            >
              <template #header>
                <div class="card-header">
                  <span class="post-title">{{ post.title }}</span>
                  <el-button class="view-post-btn" type="text" @click="viewPost(post.id)">查看</el-button>
                </div>
              </template>
              <div v-if="post.thumbnail" class="post-thumbnail">
                <img :src="post.thumbnail" :alt="post.title" @click="viewPost(post.id)" style="cursor: pointer; width: 100%; height: auto;" />
              </div>
              <div class="post-meta">
                <span>发布于: {{ formatDate(post) }}</span>
              </div>
            </el-card>
          </div>
          
          <el-pagination
            v-if="favoritesTotal > 0"
            @size-change="handleFavoritesSizeChange"
            @current-change="handleFavoritesCurrentChange"
            :current-page="favoritesPage"
            :page-sizes="[5, 10, 20]"
            :page-size="favoritesPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="favoritesTotal"
            class="pagination"
          />
        </div>
        
      </el-main>
    </el-container>
    
    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="updatePassword" :loading="updatingPassword">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/my'
import { userApi, postApi } from '@/js/api'
import { dateFormat } from '@/js/tool'

// 使用Pinia store
const store = useStore()

// 使用Vue Router
const router = useRouter()

// 响应式数据
const activeTab = ref('profile')
const defaultAvatar = ref('/src/assets/avatars.png')

// 用户信息
const userInfo = reactive({
  username: '',
  bio: '',
  avatar: ''
})

// 表单验证规则
const profileRules = reactive({
  username: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度应在2-20个字符之间', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }
  ]
})

// 密码修改相关
const showPasswordDialog = ref(false)
const updatingPassword = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordRules = reactive({
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码长度至少为6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
})

// 文章相关数据
const userPosts = ref([])
const loadingPosts = ref(false)
const postsPage = ref(1)
const postsPageSize = ref(10)
const postsTotal = ref(0)

// 点赞的文章
const likedPosts = ref([])
const loadingLiked = ref(false)
const likedPage = ref(1)
const likedPageSize = ref(10)
const likedTotal = ref(0)

// 收藏的文章
const favoritePosts = ref([])
const loadingFavorites = ref(false)
const favoritesPage = ref(1)
const favoritesPageSize = ref(10)
const favoritesTotal = ref(0)

// 保存状态
const savingProfile = ref(false)
const profileFormRef = ref(null)

// 计算属性：是否已认证
const isAuthenticated = computed(() => !!store.user && !!store.user.id)

// 计算属性：认证头
const authHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
})

// 计算属性：头像上传URL
const uploadAvatarUrl = computed(() => {
  return '/api/user/avatar'
})

// 标签页切换处理
const handleTabSelect = (index) => {
  activeTab.value = index
  
  // 切换到不同标签页时加载对应数据
  switch (index) {
    case 'posts':
      loadUserPosts()
      break
    case 'liked':
      if (isAuthenticated.value && store.user.id) {
        loadLikedPosts()
      } else {
        console.error('加载点赞文章失败：用户未登录或用户ID未定义')
        ElMessage.error('加载点赞文章失败：用户未登录或用户ID未定义')
      }
      break
    case 'favorites':
      if (isAuthenticated.value && store.user.id) {
        loadFavoritePosts()
      } else {
        console.error('加载收藏文章失败：用户未登录或用户ID未定义')
        ElMessage.error('加载收藏文章失败：用户未登录或用户ID未定义')
      }
      break
  }
}

// 头像上传相关
const handleAvatarSuccess = (response, file, fileList) => {
  if (response.success) {
    userInfo.avatar = response.map.data
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error(response.message || '头像上传失败')
  }
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像图片只能是 JPG/PNG/GIF 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 保存个人资料
const saveProfile = async () => {
  if (!isAuthenticated.value) {
    ElMessage.error('请先登录')
    return
  }
  
  try {
    savingProfile.value = true
    
    const response = await userApi.updateUserInfo({
      username: userInfo.username,
      bio: userInfo.bio
    })
    
    if (response.data.success) {
      ElMessage.success('资料保存成功')
    } else {
      ElMessage.error(response.data.message || '保存失败')
    }
  } catch (error) {
    console.error('保存资料失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    savingProfile.value = false
  }
}

// 修改密码
const passwordFormRef = ref(null)
const updatePassword = async () => {
  // 验证表单
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
  } catch (error) {
    return
  }
  
  try {
    updatingPassword.value = true
    
    const response = await userApi.updatePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword
    })
    
    if (response.data.success) {
      ElMessage.success('密码修改成功')
      showPasswordDialog.value = false
      // 重置表单
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } else {
      ElMessage.error(response.data.message || '密码修改失败')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error('密码修改失败，请稍后重试')
  } finally {
    updatingPassword.value = false
  }
}

// 加载用户文章
const loadUserPosts = async () => {
  if (!isAuthenticated.value) return
  
  try {
    loadingPosts.value = true
    
    const response = await userApi.getMyArticles({
      page: postsPage.value,
      rows: postsPageSize.value
    })
    
    if (response.data.success) {
      userPosts.value = response.data.map.articles || []
      postsTotal.value = response.data.map.pageParams.total || 0
    }
  } catch (error) {
    console.error('加载用户文章失败:', error)
    ElMessage.error('加载文章失败')
  } finally {
    loadingPosts.value = false
  }
}

// 加载点赞的文章
const loadLikedPosts = async () => {
  if (!isAuthenticated.value) return
  
  try {
    loadingLiked.value = true
    
    const response = await userApi.getLikedArticles({
      page: likedPage.value,
      rows: likedPageSize.value
    })
    
    if (response.data.success) {
      likedPosts.value = response.data.map.articleVOs || []
      likedTotal.value = response.data.map.pageParams.total || 0
    }
  } catch (error) {
    console.error('加载点赞文章失败:', error)
    ElMessage.error('加载点赞文章失败')
  } finally {
    loadingLiked.value = false
  }
}

// 加载收藏的文章
const loadFavoritePosts = async () => {
  if (!isAuthenticated.value) return
  
  try {
    loadingFavorites.value = true
    
    const response = await userApi.getFavoritedArticles({
      page: favoritesPage.value,
      rows: favoritesPageSize.value
    })
    
    if (response.data.success) {
      favoritePosts.value = response.data.map.articleVOs || []
      favoritesTotal.value = response.data.map.pageParams.total || 0
    }
  } catch (error) {
    console.error('加载收藏文章失败:', error)
    ElMessage.error('加载收藏文章失败')
  } finally {
    loadingFavorites.value = false
  }
}

// 删除文章
const deletePost = async (post) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文章 "${post.title}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await postApi.deletePost(post.id)
    
    if (response.data.success) {
      ElMessage.success('文章删除成功')
      // 重新加载文章列表
      loadUserPosts()
    } else {
      ElMessage.error(response.data.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 分页处理
const handlePostSizeChange = (size) => {
  postsPageSize.value = size
  loadUserPosts()
}

const handlePostCurrentChange = (page) => {
  postsPage.value = page
  loadUserPosts()
}

const handleLikedSizeChange = (size) => {
  likedPageSize.value = size
  loadLikedPosts()
}

const handleLikedCurrentChange = (page) => {
  likedPage.value = page
  loadLikedPosts()
}

const handleFavoritesSizeChange = (size) => {
  favoritesPageSize.value = size
  loadFavoritePosts()
}

const handleFavoritesCurrentChange = (page) => {
  favoritesPage.value = page
  loadFavoritePosts()
}

// 其他功能方法
const createNewPost = () => {
  // 跳转到发布文章页面
  router.push('/publish_article')
}

const editPost = (post) => {
  // 跳转到编辑文章页面
  router.push(`/publish_article?id=${post.id}`)
}

const viewPost = (postId) => {
  // 跳转到文章详情页
  router.push(`/article_comment/${postId}`)
}

    // 日期格式化函数，处理文章时间
    const formatDate = (post) => {
      if (!post) return ''
      
      // 尝试多种可能的时间字段名
      let dateValue = post.createdAt || post.created || post.created_at || post.createTime
      
      if (!dateValue) return ''
      
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return '' // 检查日期是否有效
      
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
// 日期格式化函数，用于表格显示
const dateFormatTable = (row, column, cellValue) => {
  if (!cellValue) return ''
  
  // 如果是Date对象，直接格式化
  if (cellValue instanceof Date) {
    return dateFormat(cellValue, 'yyyy-MM-dd')
  }
  
  // 如果是字符串，尝试格式化
  return dateFormat(cellValue, 'yyyy-MM-dd')
}

// 返回首页方法
const goHome = () => {
  router.push('/')
}

// 初始化数据
onMounted(async () => {
  // 无论用户是否已登录，都尝试获取用户信息
  try {
    const response = await userApi.getUserInfo()
    
    if (response.data.success && response.data.map && response.data.map.data) {
      const userData = response.data.map.data
      userInfo.username = userData.username || ''
      userInfo.bio = userData.bio || ''
      userInfo.avatar = userData.avatar || ''
      
      // 更新store中的用户信息，以便其他组件使用
      Object.assign(store.user, userData)
    } else {
      console.error('获取用户信息失败：响应数据格式不正确')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 不显示错误消息，因为未登录用户也会触发此错误
  }
})
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 40px);
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.profile-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-nav {
  background-color: #fafafa;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.profile-main {
  padding: 20px;
}

.profile-tab {
  max-width: 800px;
  margin: 0 auto;
}

.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.avatar-section .el-avatar {
  margin-right: 20px;
}

.change-avatar-btn {
  margin-top: 10px;
}

.profile-form {
  margin-top: 20px;
}

.posts-controls,
.friends-controls {
  margin-bottom: 20px;
  text-align: right;
}

.posts-list,
.friends-list {
  margin-top: 20px;
}

.post-card,
.friend-card {
  margin-bottom: 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-title {
  font-weight: bold;
  font-size: 16px;
}

.view-post-btn {
  margin-left: 10px;
}

.post-summary {
  margin: 10px 0;
  color: #666;
  line-height: 1.5;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 14px;
}

.friend-info {
  display: flex;
  align-items: center;
}

.friend-details {
  margin-left: 15px;
  flex: 1;
}

.friend-bio {
  color: #666;
  margin: 5px 0;
  font-size: 14px;
}

.friend-actions {
  margin-top: 10px;
}

.no-data {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }
  
  .profile-nav {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .el-menu {
    display: flex;
    flex-wrap: wrap;
  }
  
  .el-menu-item {
    flex: 1;
    justify-content: center;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-section .el-avatar {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>