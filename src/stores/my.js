import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useStore = defineStore('my', () => {
  const articleId = ref(0)
  const page = reactive({ "pageParams": null })

  // 确保user对象结构正确
  const user = reactive({ "user": null })

  return { articleId, page, user }
})