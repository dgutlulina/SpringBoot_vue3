<script setup>
import { ref, inject } from "vue";
import { Search } from "@element-plus/icons-vue";
const size = ref(30);
const toAdminMain = inject("toAdminMain");
</script>
<template>
  <el-row class="top" aligin="middle">
    <el-col :span="3"></el-col>
    <el-col :span="12">
      <a>个人博客</a>
    </el-col>
    <el-col :span="6">
      <el-space :size="size">
        <a>登录</a>
        <a @click="toAdminMain">后台管理</a>
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
.top {
  background: #5f9ea0;
  color: white;
  font-size: 22px;
  height: 80px;
  line-height: 80px;
}

a {
  text-decoration: none;
  cursor: pointer;
}
a:hover {
  color: #10d07a;
}
.searchIcon {
  color: #000;
}
.searchIcon:hover {
  color: #10d07a;
}
</style>

