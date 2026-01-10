<script setup>
import { ref, onMounted, inject } from 'vue'
import { ElMessage, ElInput, ElButton } from 'element-plus'
import { CirclePlus } from '@element-plus/icons-vue'

const axios = inject('axios')

// 分类和标签数据
const categories = ref([])
const tags = ref([])

// 新增分类/标签表单
const newCategory = ref('')
const newTag = ref('')

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

// 新增分类
const addCategory = () => {
  if (!newCategory.value.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }

  axios({
    method: 'post',
    url: '/api/article/addOrUpdateCategory',
    params: { category: newCategory.value.trim() }
  }).then((response) => {
    if (response.data.success) {
      ElMessage.success('分类添加成功')
      newCategory.value = ''
      getAllCategories()
    } else {
      ElMessage.error(response.data.msg || '添加分类失败')
    }
  }).catch((error) => {
    ElMessage.error('添加分类失败')
    console.error(error)
  })
}

// 新增标签
const addTag = () => {
  if (!newTag.value.trim()) {
    ElMessage.warning('请输入标签名称')
    return
  }

  axios({
    method: 'post',
    url: '/api/article/addOrUpdateTag',
    params: { tag: newTag.value.trim() }
  }).then((response) => {
    if (response.data.success) {
      ElMessage.success('标签添加成功')
      newTag.value = ''
      getAllTags()
    } else {
      ElMessage.error(response.data.msg || '添加标签失败')
    }
  }).catch((error) => {
    ElMessage.error('添加标签失败')
    console.error(error)
  })
}

// 删除分类
const deleteCategory = (category) => {
  if (!category) return
  
  axios({
    method: 'post',
    url: '/api/article/deleteCategory',
    params: { category }
  }).then((response) => {
    if (response.data.success) {
      ElMessage.success('分类删除成功')
      getAllCategories()
    } else {
      ElMessage.error(response.data.msg || '删除分类失败')
    }
  }).catch((error) => {
    ElMessage.error('删除分类失败')
    console.error(error)
  })
}

// 删除标签
const deleteTag = (tag) => {
  if (!tag) return
  
  axios({
    method: 'post',
    url: '/api/article/deleteTag',
    params: { tag }
  }).then((response) => {
    if (response.data.success) {
      ElMessage.success('标签删除成功')
      getAllTags()
    } else {
      ElMessage.error(response.data.msg || '删除标签失败')
    }
  }).catch((error) => {
    ElMessage.error('删除标签失败')
    console.error(error)
  })
}

// 组件挂载时获取数据
onMounted(() => {
  getAllCategories()
  getAllTags()
})
</script>

<template>
  <div class="category-tag-container">
    <el-card shadow="hover" class="category-card">
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
        </div>
      </template>
      <div class="input-section">
        <el-input
          v-model="newCategory"
          placeholder="输入新分类名称"
          style="width: 200px; margin-right: 10px;"
          @keyup.enter="addCategory"
        />
        <el-button type="primary" @click="addCategory">添加分类</el-button>
      </div>
      <div class="category-list">
        <el-tag
          v-for="category in categories"
          :key="category"
          closable
          :disable-transitions="false"
          @close="deleteCategory(category)"
          size="large"
          style="margin: 5px"
        >
          {{ category }}
        </el-tag>
        <el-empty v-if="categories.length === 0" description="暂无分类" />
      </div>
    </el-card>

    <el-card shadow="hover" class="tag-card">
      <template #header>
        <div class="card-header">
          <span>标签管理</span>
        </div>
      </template>
      <div class="input-section">
        <el-input
          v-model="newTag"
          placeholder="输入新标签名称"
          style="width: 200px; margin-right: 10px;"
          @keyup.enter="addTag"
        />
        <el-button type="primary" @click="addTag">添加标签</el-button>
      </div>
      <div class="tag-list">
        <el-tag
          v-for="tag in tags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="deleteTag(tag)"
          size="large"
          style="margin: 5px"
        >
          {{ tag }}
        </el-tag>
        <el-empty v-if="tags.length === 0" description="暂无标签" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.category-tag-container {
  padding: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.category-card,
.tag-card {
  flex: 1;
  min-width: 300px;
  max-width: 600px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-list,
.tag-list {
  padding: 10px 0;
}
</style>