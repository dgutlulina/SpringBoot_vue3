<script setup>
import { ref, onMounted, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const axios = inject('axios')

// 评论数据
const comments = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取所有评论
const getAllComments = () => {
  const pageParams = {
    page: currentPage.value,
    rows: pageSize.value
  }
  
  axios({
    method: 'post',
    url: '/api/comment/getAllComments',
    data: pageParams
  }).then((response) => {
    if (response.data.success) {
      comments.value = response.data.map.comments
      total.value = response.data.map.pageParams.total
    } else {
      ElMessage.error(response.data.msg)
    }
  }).catch((error) => {
    ElMessage.error('获取评论失败')
  })
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  getAllComments()
}

// 每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  getAllComments()
}

// 更新评论状态
const updateCommentStatus = (comment) => {
  const newStatus = comment.status === 'approved' ? 'rejected' : 'approved'
  
  axios({
    method: 'post',
    url: '/api/comment/updateStatus',
    params: {
      id: comment.id,
      status: newStatus
    }
  }).then((response) => {
    if (response.data.success) {
      comment.status = newStatus
      ElMessage.success('评论状态更新成功')
    } else {
      ElMessage.error(response.data.msg)
    }
  }).catch((error) => {
    ElMessage.error('更新评论状态失败')
  })
}

// 删除评论
const deleteComment = (commentId) => {
  ElMessageBox.confirm('确定要删除这条评论吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios({
      method: 'post',
      url: '/api/comment/delete',
      params: { id: commentId }
    }).then((response) => {
      if (response.data.success) {
        ElMessage.success('评论删除成功')
        getAllComments()
      } else {
        ElMessage.error(response.data.msg)
      }
    }).catch((error) => {
      ElMessage.error('删除评论失败')
    })
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// 组件挂载时获取数据
onMounted(() => {
  getAllComments()
})
</script>

<template>
  <div class="comment-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>评论管理</span>
        </div>
      </template>
      
      <div class="comment-table">
        <el-table :data="comments" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="articleId" label="文章ID" width="120" />
          <el-table-column prop="author" label="评论者" width="150" />
          <el-table-column prop="content" label="评论内容" show-overflow-tooltip />
          <el-table-column prop="created" label="评论时间" width="180" :formatter="formatDate" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'approved' ? 'success' : 'danger'">
                {{ scope.row.status === 'approved' ? '已通过' : '已拒绝' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP地址" width="150" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="updateCommentStatus(scope.row)"
              >
                {{ scope.row.status === 'approved' ? '拒绝' : '通过' }}
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="deleteComment(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页组件 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.comment-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-table {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>