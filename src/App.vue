<script setup>
import { provide } from "vue";
import { RouterView, useRouter } from "vue-router";
const router = useRouter();
router.push({ name: "home" });

const toHome = () => {
  router.push({ name: "home" });
};


const toAdminMain = () => {
  router.push({ name: "adminMain" });
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
</script>
<template>
  <RouterView />
</template>
<style scoped></style>
