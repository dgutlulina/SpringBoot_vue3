<script setup>
import Top from '@/components/Top.vue'
import ArticleHeader from '@/components/ArticleHeader.vue'
import { inject, ref, reactive } from 'vue'
import axios from 'axios'
import imageMeUrl from '../assets/me.jpg'
import ReadRanking from '@/components/ReadRanking.vue'
import { ElMessageBox } from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWeibo, faGithub } from '@fortawesome/free-brands-svg-icons'
import { onBeforeRouteLeave } from 'vue-router'
import { useStore } from '@/main'

const store = useStore()
const size = ref(20)
const toArticle = inject('toArticle')


const data = reactive({
  articles: [],
  "pageParams": {
    "page": store.home.page,
    "rows": 5,
    "total": 0
  },
  articleVOs: []
})


function getAPage() {
  axios({
    method: 'post',
    url: '/api/article/getAPageOfArticle',
    data: data.pageParams
  }).then((response) => {
    if (response.data.success) {
      if (response.data.map.articles != null) {
        data.articles = response.data.map.articles
        data.pageParams = response.data.map.pageParams
        window.scrollTo(0, 0) //滚动到顶端
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

function handleCurrentChange(newPage) {
  data.pageParams.page = newPage
  getAPage()
}

function getIndexData() {
  axios({
    method: 'post',
    url: '/api/article/getIndexData1',
    data: data.pageParams
  }).then((response) => {
    if (response.data.success) {
      data.articles = response.data.map.articles
      data.pageParams = response.data.map.pageParams
      data.articleVOs = response.data.map.articleVOs
    } else {
      ElMessageBox.alert(response.data.msg, '结果')
    }
  }).catch((error) => {
    ElMessageBox.alert("系统错误！", '结果')
  })
}

getIndexData()

onBeforeRouteLeave((to, from) => {
  if (to.fullPath.indexOf("article_comment") >= 0) {
    store.home.page = data.pageParams.page
  } else {
    store.home.page = 1
  }
  return true
})

</script>
<template>
  <el-affix>
    <Top />
  </el-affix>
  <el-row style="margin-top:40px" align="top">
    <el-col :span="1"></el-col>
    <el-col :span="14">
      <el-row>
        <el-col>
          <template v-for="article in data.articles">
            <ArticleHeader :article="article" />
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-pagination v-model:current-page="data.pageParams.page" v-model:page-size="data.pageParams.rows"
            layout="prev, pager, next" :total="data.pageParams.total" @current-change="handleCurrentChange"
            :pager-count="7" />
        </el-col>
      </el-row>

    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="7">
      <fieldset align="center">
        <legend>
          <h3>CrazyStone</h3>
        </legend>
        <el-image :src="imageMeUrl" />
        <div style="margin-top:16px;">Java后台开发</div>
        <div style="margin-top:16px;">
          个人博客小站，主要发表关于Java、Spring、Docker等相关文章
        </div>
      </fieldset>
      <fieldset align="center">
        <legend>
          <h3>联系我</h3>
        </legend>
        <el-space :size="size">
          <FontAwesomeIcon :icon="faGithub" size="lg" border/>

         <FontAwesomeIcon :icon="faWeibo" size="lg" border />
        </el-space>
      </fieldset>
      <fieldset align="center">
        <legend>
          <h3>阅读排行榜</h3>
        </legend>
        <ReadRanking :articleVOs="data.articleVOs" />
      </fieldset>
    </el-col>
    <el-col :span="1"></el-col>
  </el-row>

</template>
<style scoped>
.icon:hover {
  color: #10D07A;
}

fieldset {
  border-color: #eee;
  border-width: 1px;
  border-style: solid;
}
</style>