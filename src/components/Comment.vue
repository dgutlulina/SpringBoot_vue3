<script setup>
const props = defineProps(['comment'])
</script>

<template>
  <el-row style="margin-bottom:10px">
    <el-col>
      <div class="comment-header">
        <img class="avatar" src="../assets/avatars.png"/>
        <span class="comment-author">{{ props.comment.author || '匿名用户' }}</span>
      </div>
    </el-col>
  </el-row>
  <el-row style="margin-bottom:10px">
    <el-col>
      <div class="comment-content">{{ props.comment.content }}</div>
    </el-col>
  </el-row>
  <el-row style="margin-bottom:10px" justify="end">
    <el-col :span="3">
      <div class="comment-time">{{ props.comment.createTime || props.comment.create_time || '未知时间' }}</div>
    </el-col>
  </el-row>
</template>
<style scoped>
.comment-header{
  height: 40px;
  display:flex;
  align-items:center;

}
.avatar {
  width: 40px;
  height: 40px;
  border: 1px solid #eaeaea;
  border-radius: 50%;

}
.comment-author {
  font-size: 11px;
  line-height: 40px;
  margin-left: 20px;
  height: 40px;
  color: #5f5f5f;
}
.comment-content{
  font-size: 18px;
}
.comment-time{
  color: #5f5f5f;
  font-size: 12px;
}
</style>