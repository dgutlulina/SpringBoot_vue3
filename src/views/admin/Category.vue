<script setup>
import { ref, onMounted, inject } from 'vue'
import { ElMessage } from 'element-plus'

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
      categories.value = response.data.map.categories
    } else {
      ElMessage.error(response.data.msg)
    }
  }).catch((error) => {
    ElMessage.error('获取分类失败')
  })
}

// 获取所有标签
const getAllTags = () => {
  axios({
    method: 'post',
    url: '/api/article/getAllTags'
  }).then((response) => {
    if (response.data.success) {
      tags.value = response.data.map.tags
    } else {
      ElMessage.error(response.data.msg)
    }
  }).catch((error) => {
    ElMessage.error('获取标签失败')
  })
}

// 删除分类
const deleteCategory = (category) => {
  axios({
    method: 'post',
    url: '/api/article/deleteCategory',
    params: { category }
  }).then((response) => {
    if (response.data.success) {
      ElMessage.success('分类删除成功')
      getAllCategories()
    } else {
      ElMessage.error(response.data.msg)
    }
  }).catch((error) => {
    ElMessage.error('删除分类失败')
  })
}

// 删除标签
const deleteTag = (tag) => {
  axios({
    method: 'post',
    url: '/api/article/deleteTag',
    params: { tag }
  }).then((response) => {
    if (response.data.success) {
      ElMessage.success('标签删除成功')
      getAllTags()
    } else {
      ElMessage.error(response.data.msg)
    }
  }).catch((error) => {
    ElMessage.error('删除标签失败')
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