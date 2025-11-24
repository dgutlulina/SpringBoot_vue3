<script setup>
import { reactive, inject, ref } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { undefine, nullZeroBlank } from "@/js/tool.js"

// 注入父组件提供的 thumbnail 更新回调（可选）
const updateThumbnail = inject('updateThumbnail', null) // 默认 null 避免未提供时报错

// 截图组件参数
const option = reactive({
  img: '',
  fixedBox: true,
  canMoveBox: false,
  fixedNumber: [373, 207],
  outputSize: 1,
  outputType: 'jpeg',
  autoCrop: true,
  autoCropWidth: 373,
  autoCropHeight: 207,
  infoTrue: true,
  original: true,
  centerBox: true,
  enlarge: 1
})

const data = reactive({ 
  file: null, 
  f: null,
  innerHTML: "",
  freshCropper: true,
  thumbnail: "", // 上传至服务器的图片 URL
  isEditor: false
})

const axios = inject('axios')

// 变换图片文件时调用
function uploadImg(event) {
  data.file = event.target.files[0]
  const item = {
    name: data.file.name,
    size: data.file.size,
    file: data.file
  }
  html5Reader(data.file, item)
  data.f = item
  data.isEditor = false
  document.getElementById('fade').style.display = 'block'
  document.getElementById('upload2').value = ''  
}

// 将图片文件转成 BASE64 格式
function html5Reader(file, item) {
  const reader = new FileReader()
  reader.onload = e => {
    option.img = e.target.result
  }
  reader.readAsDataURL(file)
}

// 取消上传
function cancelUpload() {
  document.getElementById('fade').style.display = 'none'
}

// 引用裁剪组件
const myCropper = ref(null)

// 点击确定，上传文件
function determineUpload($event) {
  console.log('开始上传图片') // 添加调试日志
  myCropper.value.getCropData((cropData) => {
    let theBlob = base64toFile(cropData, data.file.name)
    let formData = new FormData()
    formData.append("file", theBlob.file, theBlob.name)
    let config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }

    axios.post("/api/article/upload", formData, config)
      .then(res => {
        console.log('上传响应:', res) // 添加调试日志
        if (res.status === 200) {
          try {
            data.thumbnail = res.data.map.url
            console.log("上传成功，图片地址为：" + data.thumbnail)

            // ✅ 关键修复：上传成功后通知父组件更新 article.thumbnail
            // 确保无论如何都要尝试调用更新函数
            if (updateThumbnail) {
              console.log('调用 updateThumbnail 函数更新父组件') // 添加调试日志
              updateThumbnail(data.thumbnail)
            } else {
              console.warn('updateThumbnail 函数未定义')
            }
          } catch (e) {
            console.log("捕获到异常：", e)
          }
        } else {
          console.log("上传失败，状态码：" + res.status)
        }
      })
      .catch(err => {
        console.error("上传请求异常：", err)
      })
      .finally(() => {
        document.getElementById('fade').style.display = 'none'
      })
  })
}

// 将 base64 转换为文件
function base64toFile(dataurl, filename) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const theBlob = new Blob([u8arr], { type: mime })
  theBlob.lastModifiedDate = new Date()
  theBlob.name = filename
  return {
    file: theBlob,
    name: filename
  }
}

// 将图片顺时针旋转90度
function rotateRight() {
  myCropper.value.rotateRight()
}

// 注入父组件的 freshCropper 方法
const freshCropper = inject("freshCropper")

// 父组件调用：获取上传到服务器的图片 URL
const getThumbnail = () => {
  return data.thumbnail
}

// 清空数据
function clearData() {
  data.thumbnail = ""
  data.isEditor = false
  freshCropper()
}

// 父组件在编辑文章时调用
function setThumbnail(thumbnail) {
  console.log('Cropper组件设置缩略图:', thumbnail) // 添加调试日志
  data.thumbnail = thumbnail
  data.isEditor = true
}

// 暴露方法给父组件
defineExpose({
  getThumbnail,
  clearData,
  setThumbnail
})
</script>

<template>
  <div id="fade" class="black_overlay" v-if="data.freshCropper">
    <div id="light" class="white_content">
      <div class="test">
        <!-- ✅ 修复：outputSize 绑定正确属性 -->
        <VueCropper
          ref="myCropper"
          :img="option.img"
          :fixedBox="option.fixedBox"
          :canMoveBox="option.canMoveBox"
          :fixedNumber="option.fixedNumber"
          :outputSize="option.outputSize"   
          :outputType="option.outputType"
          :infoTrue="option.infoTrue"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :centerBox="option.centerBox"
          :original="option.original"
          :enlarge="option.enlarge"
        />
      </div>
      <div class="cropper-control">
        <el-row justify="end">
          <el-col :span="24">
            <span style="margin-right:10px">滚动鼠标滚轮可以缩放图片</span>
            <el-button type="primary" @click="cancelUpload()">取消</el-button>
            <el-button type="primary" @click="determineUpload($event)">确定</el-button>
            <el-button type="primary" @click="rotateRight()">向右边旋转90度</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>

  <div style="height:380px;margin-top: 20px;">
    <el-space :size="30">
      <label class="btn-photo" for="upload2">选择文章标题图片(可以不设置，使用默认值)</label>
      <input
        ref="upload"
        type="file"
        id="upload2"
        style="position:absolute; clip:rect(0 0 0 0);"
        accept="image/png, image/jpeg, image/gif, image/jpg"
        @change="uploadImg($event)"
      />
      <el-button type="primary" @click="freshCropper">清空图片</el-button>
    </el-space>
    <!-- 编辑状态显示已有的缩略图 -->
    <div v-if="data.isEditor && data.thumbnail" style="margin-top:10px">
      <p>当前文章标题图片:</p>
      <img :src="data.thumbnail.startsWith('http') ? data.thumbnail : (data.thumbnail.startsWith('/') ? '/api' + data.thumbnail : data.thumbnail)" style="max-width: 300px; max-height: 200px; border: 1px solid #ddd;"/>
    </div>
    <!-- 上传后显示预览图 -->
    <div v-else-if="!data.isEditor && data.thumbnail" style="margin-top:10px">
      <p>已选择的文章标题图片:</p>
      <img :src="data.thumbnail.startsWith('http') ? data.thumbnail : (data.thumbnail.startsWith('/') ? '/api' + data.thumbnail : data.thumbnail)" style="max-width: 300px; max-height: 200px; border: 1px solid #ddd;"/>
    </div>
  </div>
</template>

<style scoped>
.cropper-control {
  margin-top: 10px;
  text-align: right;
}
.card {
  margin: 1% 1%;
}
@media (min-width: 480px) {
  .textdiv {
    border: 1px solid #ccc;
    margin-bottom: 20px;
    margin-top: 10px;
    padding: 5px 10px;
    min-width: 10%;
    max-width: 70%;
  }
  .btn-photo {
    height: 25px;
    width: 350px;
    text-align: center;
    padding: 5px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
  }
  .white_content {
    left: 16%;
    width: 70%;
    height: 70%;
  }
}
@media (max-width: 480px) {
  .textdiv {
    border: 1px solid #ccc;
    margin-bottom: 20px;
    margin-right: 3%;
    padding: 1%;
    width: 74%;
  }
  .btn-photo {
    height: 23px;
    width: 15%;
    font-size: 12px;
    text-align: center;
    padding: 1%;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
  }
  .white_content {
    left: 5%;
    width: 90%;
    height: 80%;
  }
}
.textdiv img {
  max-width: 100%;
  display: block;
}
.black_overlay {
  display: none;
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 1000;
  filter: alpha(opacity=88);
}
.white_content {
  position: absolute;
  top: 16%;
  padding: 1%;
  border: 5px solid orange;
  background-color: white;
  z-index: 1002;
  overflow: auto;
}
.test {
  height: 92%;
}
</style>