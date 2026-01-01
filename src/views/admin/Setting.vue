<script setup>
import { ref, inject } from 'vue'
import { ElMessage } from 'element-plus'

const axios = inject('axios')

// 系统设置表单数据
const settings = ref({
  siteName: '个人博客',
  siteDescription: '我的个人技术博客',
  siteKeywords: '博客,技术,文章',
  uploadPath: '/api/images/',
  defaultThumbnail: '/api/images/6.png'
})

// 表单验证规则
const rules = {
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  siteDescription: [
    { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
  ],
  siteKeywords: [
    { max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }
  ]
}

// 保存系统设置
const saveSettings = () => {
  // 这里可以添加表单验证
  ElMessage.success('系统设置保存成功')
  // 实际项目中，这里应该调用后端API保存设置
}

// 重置设置
const resetSettings = () => {
  settings.value = {
    siteName: '个人博客',
    siteDescription: '我的个人技术博客',
    siteKeywords: '博客,技术,文章',
    uploadPath: '/api/images/',
    defaultThumbnail: '/api/images/6.png'
  }
  ElMessage.info('设置已重置')
}
</script>

<template>
  <div class="setting-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <el-form :model="settings" :rules="rules" ref="ruleFormRef" label-width="120px" size="default">
        <!-- 网站基本信息 -->
        <el-divider content-position="left">网站基本信息</el-divider>
        
        <el-form-item label="网站名称" prop="siteName">
          <el-input v-model="settings.siteName" placeholder="请输入网站名称" />
        </el-form-item>
        
        <el-form-item label="网站描述" prop="siteDescription">
          <el-input v-model="settings.siteDescription" type="textarea" placeholder="请输入网站描述" :rows="3" />
        </el-form-item>
        
        <el-form-item label="网站关键词" prop="siteKeywords">
          <el-input v-model="settings.siteKeywords" placeholder="请输入网站关键词，用逗号分隔" />
        </el-form-item>
        
        <!-- 文件上传设置 -->
        <el-divider content-position="left">文件上传设置</el-divider>
        
        <el-form-item label="上传路径">
          <el-input v-model="settings.uploadPath" placeholder="请输入文件上传路径" readonly />
        </el-form-item>
        
        <el-form-item label="默认缩略图">
          <el-input v-model="settings.defaultThumbnail" placeholder="请输入默认缩略图路径" readonly />
        </el-form-item>
        
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
          <el-button @click="resetSettings">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.setting-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>