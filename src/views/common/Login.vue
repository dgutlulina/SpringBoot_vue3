<script setup>
import { reactive, ref, inject } from 'vue'
import { ElMessageBox } from 'element-plus'
import qs from 'qs'
import { useStore } from '@/stores/my'
const store = useStore()
const axios = inject('axios')
const toAdminMain = inject("toAdminMain")
const toHome = inject("toHome")

const formSize = ref('default')
const ruleFormRef = ref(null)
const user = reactive({
  "username": "",
  "password": ""
})
//设置表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名！', trigger: 'blur' },
    { min: 2, max: 10, message: '长度3-10', trigger: 'blur' }
  ],
  password: [
  { required: true, message: '请输入密码！', trigger: 'blur' },
  { min: 4, max: 10, message: '长度3-10', trigger: 'blur' },
  { pattern: /[A-Za-z0-9_-\u4e00-\u9fa5]+/, message: '请输入正确的密码',
    trigger: ['blur', 'change'] }
]
})
//表单验证
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {//如果通过验证，则可以提交表单数据
      const formData = new FormData();
      formData.append('username', user.username);
      formData.append('password', user.password);
      
      axios({
        method: 'post',
        url: '/api/login',//要和服务器端Security设置的登录网址一致
        data: formData
      }).then((response) => {
        if(response.data.success){
          console.log('登录成功！欢迎 ' + response.data.map.user.username);
          store.user = response.data.map.user
          // 如果用户名是admin，则进入后台管理页面
          if(response.data.map.user.username === "admin"){
            toAdminMain()
          } else if(response.data.map.user.authorities[0]==="ROLE_common"){
            toHome()//普通用户跳转到主页
          } else if (response.data.map.user.authorities[0] === "ROLE_admin") {
            toAdminMain()//管理员用户跳转至管理页面
          }
        }else{
          ElMessageBox.alert(response.data.msg, '结果')
        }
      }).catch((error) => { //请求失败返回的数据
        ElMessageBox.alert("系统错误！", '结果')
      })
    } else {
      ElMessageBox.alert("验证失败！", '结果')
    }
  })
}
</script>
<template>
<div class="log">
  <el-row justify="center">
    <el-col :span="10">
      <h2 class="log-title">~~欢迎登录博客~~</h2>
    </el-col>
  </el-row>
  <el-row justify="center">
    <el-col :span="8">
          <el-form ref="ruleFormRef" :model="user" status-icon
             :rules="rules" :size="formSize" label-width=auto >
      <el-form-item label="用户名：" prop="username" >
        <el-input v-model="user.username" />
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="user.password" type="password" />
      </el-form-item>
        <el-form-item >
          <el-button  style="margin-left: 80px;width: 100%;" type="primary" @click="submitForm(ruleFormRef)">登陆</el-button>
        </el-form-item>
    </el-form>
  </el-col>
</el-row>
<el-row justify="center">
  <el-col :span="8">
    <p style="margin-left: 200px; color: #2E2D3C">
      2022 © Powered By <a style="color: #0e90d2">CrazyStone</a></p>
  </el-col>
</el-row>
</div>
</template>
<style scoped>

.log-title {
  font-size: 3rem;
  color: black;
  margin-top: 180px;
  margin-left: 200px;
}

.log{
  width: 100%;
  height: 100vh; /* 设置高度为视口高度 */
  background: url('/src/assets/back.jpg') #000 no-repeat center center; /* 使用正确路径并居中显示 */
  background-size: cover; /* 覆盖整个区域 */
}
</style>
