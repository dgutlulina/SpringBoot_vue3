<script setup>
import { provide } from "vue";
import { RouterView, useRouter } from "vue-router";

const router = useRouter();

// 移除自动跳转逻辑，依赖路由配置的默认行为

const toHome = () => {
  router.push({ name: "home" });
};

const toAdminMain = () => {
  router.push({ name: "adminMain" });
};

const toProfile = () => {
  router.push({ name: 'profile' });
};

function toArticle() {
  router.push({ name: 'articleAndComment', params: { articleId: 30 } })
}
function toLogin() {
  router.push({ name: 'login' })
}
provide("toAdminMain", toAdminMain);
provide("toArticle", toArticle);
provide("toLogin", toLogin);
provide("toHome", toHome);
provide("toProfile", toProfile);
</script>
<template>
  <RouterView />
</template>
<style scoped></style>