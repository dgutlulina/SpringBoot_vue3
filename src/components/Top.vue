<script setup>
import { ref, inject } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useStore } from '@/stores/my';
import { ElMessageBox } from "element-plus";
const size = ref(30);
const toLogin = inject("toLogin");
const toAdminMain = inject("toAdminMain");

const store = useStore();
const username = ref("");
const isLogined = ref(false);
const isAdmin = ref(false);

// 安全地检查用户是否已登录
if(store && store.user && store.user !== null) {
  username.value="hi！ "+store.user.username
  isLogined.value=true
  // 检查是否是管理员
  if (store.user.authorities && store.user.authorities[0] === "ROLE_admin") {
    isAdmin.value = true;
  }
}
const toHome = inject("toHome")
const axios = inject('axios')

function toExit() {
  axios({
    method: 'post',
    url: '/api/logout'
  }).then((response) => {
    ElMessageBox.alert(response.data.msg, '结果')
    // 安全地清除用户状态
    if (store && store.user) {
      store.user = null
    }
    isLogined.value = false
    isAdmin.value = false;
    username.value = ""
    toHome()
  }).catch((error) => {
    ElMessageBox.alert("系统错误！", '结果')
  })
}
</script>
<template>
  <el-row class="top" aligin="middle" >
    <el-col :span="3"></el-col>
    <el-col :span="12" >
      <a>个人博客</a>
    </el-col>
    <el-col :span="6">
      <el-space :size="size">
        <a @click="toLogin" v-if="!isLogined">登录</a>
        <a @click="toAdminMain" v-if="isAdmin">后台管理</a>
        <a @click="toExit" v-if="isLogined">退出</a>
        <span v-html="username"></span>
        <!-- <a @click="toAdminMain">后台管理</a> -->
        <router-link title="查询" :to="{ path: '/search' }" style="text-decoration: none;">
          <el-icon>
            <Search class="searchIcon"/>
          </el-icon>
        </router-link>
      </el-space>
    </el-col>
    <el-col :span="3"></el-col>
  </el-row>
</template>

<style scoped>
* {
  background: #5f9ea0;
  color: #fff;
  font-size: 22px;
}

.top {
  height: 80px; 
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  text-decoration: none;
  cursor: pointer;
}

a:hover{ color: #10D07A; }

.searchIcon{ color: black; }

.searchIcon:hover{ color: #10D07A; }

</style>
