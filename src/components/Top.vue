<script setup>
import { ref, inject } from "vue";
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
      </el-space>
    </el-col>
    <el-col :span="3"></el-col>
  </el-row>
</template>
<style>
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
</style>
<style scoped></style>
