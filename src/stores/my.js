import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useStore = defineStore('my', () => {
  const articleId = ref(0)
  const page = reactive({ "pageParams": null })

  // 确保user对象结构正确，直接存储用户信息而不是嵌套在user属性中
  const user = reactive({})

  return { articleId, page, user }
})