<script setup>
import { provide } from "vue";
import { RouterView, useRouter } from "vue-router";
const router = useRouter();
router.push({ name: "home" });

const toAdminMain = () => {
  router.push({ name: "adminMain" });
};
function toArticle() {
  router.push({ name: 'articleAndComment', params: { articleId: 30 } })
}
provide("toAdminMain", toAdminMain);
provide("toArticle", toArticle);
</script>
<template>
  <RouterView />
</template>
<style scoped></style>
