<script setup>
import Top from "@/components/Top.vue";
import { reactive, inject, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
const data = reactive({
  "articleCondition": { "title":"", "startDate": "",  "endDate":""},
  "pageParams": { "page": 1,  "rows": 5,  "total":0}
})
let myData = reactive({
  "articleVOs": [],
  "pageParams": {}
})

const axios = inject('axios')
function search(){
  axios({
    method: 'post',
    url: '/api/article/articleSearch',
    data: data
  }).then((response) => {
    if (response.data.success) {
      myData.articleVOs = response.data.map.articleVOs || []
      // 正确处理分页参数
      if (response.data.map.pageParams) {
        myData.pageParams = response.data.map.pageParams
      } else {
        // 如果后端没有返回分页参数，使用默认值
        myData.pageParams = { "page": 1, "rows": 5, "total": myData.articleVOs.length }
      }
    } else {
      ElMessageBox.alert(response.data.msg || '搜索失败', '结果')
    }
  }).catch((error) => {
    console.error('搜索错误:', error)
    ElMessageBox.alert("系统错误：" + error.message || '系统错误！', '结果')
  })
}

// 处理每页条数变化
function handleSizeChange(size) {
  data.pageParams.rows = size;
  data.pageParams.page = 1; // 重置到第一页
  search(); // 重新搜索
}

// 处理当前页变化
function handleCurrentChange(page) {
  data.pageParams.page = page;
  search(); // 重新搜索
}
onMounted(() => {
  search()
})
</script>
<template>
  <el-affix><Top/></el-affix>
  <el-row justify="center" style="margin-top:30px">
    <el-col :span="12">
      <el-input 
        v-model="data.articleCondition.title" 
        placeholder="文章标题" 
        title="文章标题" 
        clearable 
      />
    </el-col>
  </el-row>
  <el-row justify="center" style="margin-top:15px">
    <el-col :span="12">
      <el-space :size="40">
        <el-date-picker 
          value-format="YYYY-MM-DD" 
          v-model="data.articleCondition.startDate" 
          type="date" 
          placeholder="起始日期" 
          title="起始日期"
        />
        <el-date-picker 
          value-format="YYYY-MM-DD" 
          v-model="data.articleCondition.endDate" 
          type="date" 
          placeholder="结束日期" 
          title="结束日期"
        />
        <el-button type="primary" @click="search">开始查询</el-button>
      </el-space>
    </el-col>
  </el-row>
  <el-row>
  <el-col :offset="1" :span="24"><h4 style="margin-left: 10px;">查询结果 (共 {{ myData.pageParams.total || 0 }} 条)</h4></el-col>
</el-row>
<el-row>
  <el-col :span="1"></el-col>
  <el-col :span="22">
    <el-table v-if="myData.articleVOs && myData.articleVOs.length > 0" :data="myData.articleVOs" stripe border style="width: 100%">
      <el-table-column prop="categories" label="所属分类" width="150" />
      <el-table-column label="文章标题" width="800">
        <template #default="scope">
          <router-link :to="{path: '/article_comment/'+(scope.row.id || scope.row.articleId)}" style="text-decoration: none; color: #409eff;">
            {{scope.row.title}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="created" label="发布时间" width="170" />
    </el-table>
    <div v-else class="no-results" style="text-align: center; padding: 40px; color: #999;">
      暂无搜索结果
    </div>
    <!-- 分页组件 -->
    <el-row justify="center" style="margin-top: 20px;">
      <el-col :span="24" style="text-align: center;">
        <el-pagination
          v-model:current-page="data.pageParams.page"
          v-model:page-size="data.pageParams.rows"
          :page-sizes="[5, 10, 20, 50]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="myData.pageParams.total || 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </el-col>
  <el-col :span="1"></el-col>
</el-row>
</template>