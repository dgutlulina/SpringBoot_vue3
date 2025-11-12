<script setup>
import { reactive, watch } from 'vue'
const props = defineProps(['articleVOs'])
let rankings = reactive([])

watch(() => props.articleVOs, (newValue, oldValue) => {
  rankings.length = 0
  for (let index = 0; index < newValue.length; index++) {
    rankings.push((index + 1) + "、" + newValue[index].title + "(" + newValue[index].hits + ")")
  }
})
</script>

<template>
  <el-row v-for="ranking in rankings" :key="ranking">
    <el-col :span="24">
      {{ ranking }}
      <el-divider class="divider" />
    </el-col>
  </el-row>
</template>

<style scoped>
.divider {
  margin-top: 8px;
  margin-bottom: 8px;
}
a:hover {
  color: #10D07A;
}
.title {
  color: black;
  font-size: 15px;
}
</style>