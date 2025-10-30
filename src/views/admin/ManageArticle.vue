<script setup>
import { reactive, inject, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

let myData = reactive({
  "articleVOs": [],
  "pageParams": { "page": 1, "rows": 4, "total": 100 }
})

function getAPage() {
  axios({
    method: 'post',
    url: '/api/article/getAPageOfArticleVO',
    data: myData.pageParams
  }).then((response) => {
    if (response.data.success) {
      if (response.data.map.articleVOs != null) {
        myData.articleVOs = response.data.map.articleVOs
      } else {
        ElMessageBox.alert("无文章！", '结果')
      }
    } else {
      ElMessageBox.alert(response.data.msg, '结果')
    }
  }).catch((error) => {
    ElMessageBox.alert("系统错误！", '结果')
  })
}

getAPage()

function handleSizeChange(newRows) {
  myData.pageParams.rows = newRows
  myData.pageParams.page = 1
  getAPage()
}

function handleCurrentChange(newPage) {
  myData.pageParams.page = newPage
  getAPage()
}

const router = useRouter()
function editArticle1(articleId) {
  router.push({ name: 'editArticle', query: { id: articleId } })
}

let selectedArticleId
const dialogVisible = ref(false)
function showDialog(articleId) {
  selectedArticleId = articleId
  dialogVisible.value = true
}

function deleteArticle() {
  axios({
    method: 'post',
    url: '/api/article/deleteById?id=' + selectedArticleId
  }).then((response) => {
    if (response.data.success) {
      getAPage()
    } else {
      ElMessageBox.alert(response.data.msg, '结果')
    }
  }).catch((error) => {
    ElMessageBox.alert("系统错误！", '结果')
  })
}
</script>

<template>
  <el-row>
    <el-col :span="24">
      <h4 style="margin-left: 10px;">文章管理</h4>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-table :data="myData.articleVOs" stripe border style="width: 100%">
        <el-table-column label="文章标题" width="360">
          <template #default="scope">
            <router-link :to="{ path: '/article_comment/' + scope.row.id }" style="text-decoration: none;">
              {{ scope.row.title }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="发布时间" width="170" />
        <el-table-column prop="hits" label="浏览量" width="70" />
        <el-table-column prop="categories" label="所属分类" width="100" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="editArticle1(scope.row.id)" :icon="Edit" size="small">编辑</el-button>
            <el-button type="danger" @click="showDialog(scope.row.id)" :icon="Delete" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <!-- 分页 -->
  <el-row justify="center" align="middle" style="height:60px">
    <el-col :span="16">
      <el-pagination v-model:currentPage="myData.pageParams.page" v-model:page-size="myData.pageParams.rows"
        :page-sizes="[2, 4, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="myData.pageParams.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" :pager-count="7" />
    </el-col>
  </el-row>
  <!-- 删除弹窗 -->
  <el-dialog v-model="dialogVisible" title="注意" width="30%" center>
    <span>确定要删除吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteArticle">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>