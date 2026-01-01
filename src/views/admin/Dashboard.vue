<script setup>
import { ref, onMounted, inject } from 'vue'
import { ElMessage } from 'element-plus'

const axios = inject('axios')

// 统计数据
const statistics = ref({
  articleCount: 0,
  commentCount: 0,
  totalHits: 0
})

// 获取仪表盘统计数据
const getDashboardStatistics = () => {
  axios({
    method: 'post',
    url: '/api/statistic/getDashboardStatistics'
  }).then((response) => {
    if (response.data.success) {
      statistics.value = response.data.map
    } else {
      ElMessage.error(response.data.msg)
    }
  }).catch((error) => {
    ElMessage.error('获取统计数据失败')
  })
}

// 组件挂载时获取数据
onMounted(() => {
  getDashboardStatistics()
})
</script>

<template>
  <div class="dashboard-container">
    <div class="statistics-cards">
      <el-card shadow="hover" class="statistic-card">
        <template #header>
          <div class="card-header">
            <span>文章总数</span>
          </div>
        </template>
        <div class="statistic-content">
          <el-icon class="statistic-icon"><document /></el-icon>
          <span class="statistic-number">{{ statistics.articleCount }}</span>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="statistic-card">
        <template #header>
          <div class="card-header">
            <span>评论总数</span>
          </div>
        </template>
        <div class="statistic-content">
          <el-icon class="statistic-icon"><comment /></el-icon>
          <span class="statistic-number">{{ statistics.commentCount }}</span>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="statistic-card">
        <template #header>
          <div class="card-header">
            <span>访问总量</span>
          </div>
        </template>
        <div class="statistic-content">
          <el-icon class="statistic-icon"><view /></el-icon>
          <span class="statistic-number">{{ statistics.totalHits }}</span>
        </div>
      </el-card>
    </div>
    
    <div class="recent-activity">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>最近活动</span>
          </div>
        </template>
        <div class="activity-content">
          <el-empty description="暂无活动记录" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.statistics-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.statistic-card {
  flex: 1;
  min-width: 250px;
  max-width: 350px;
}

.statistic-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.statistic-icon {
  font-size: 48px;
  color: #409eff;
  margin-right: 20px;
}

.statistic-number {
  font-size: 48px;
  font-weight: bold;
  color: #303133;
}

.recent-activity {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-content {
  padding: 20px 0;
}
</style>