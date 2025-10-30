<script setup>
import { Odometer, Edit, Memo, Comment, Filter, Setting } from '@element-plus/icons-vue';
import { reactive } from 'vue'
import { Fold, Expand, View, DArrowRight } from '@element-plus/icons-vue'
import { RouterView } from 'vue-router';

const asideState = reactive({
  collapse: false, // false=展开，true=收缩
  width: '200px'   // 展开时宽度200px，收缩时70px
})

// 定义侧边栏切换函数：点击图标时切换状态
function toggleCollapse() {
  asideState.collapse = !asideState.collapse;
  // 根据收缩状态修改侧边栏宽度
  asideState.width = asideState.collapse ? '70px' : '200px';
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside :width="asideState.width">
      <!-- logo -->
        <el-row>
          <el-col class="left-top">
            <img src="../../assets/bloglogo.jpg" width="50px" height="50px" />
            <span class="blg-text">MyBlog</span>
          </el-col>
        </el-row>
        <!-- 侧边栏选项  -->
        <el-row>
          <el-col>
            <!-- 菜单  -->
            <el-menu 
            router 
            style="
                background-color: #2f353f;
                padding-bottom: 50px;
                width: 100%;
            " :collapse="asideState.collapse" 
            collapse-transition="false"
            :default-active="$route.path">
              <!-- 仪表盘  -->
              <el-menu-item class="text" index="/admin_Main">
                <el-icon>
                  <odometer />
                </el-icon>
                <span>
                  仪表盘
                </span>
              </el-menu-item>
              <!-- 发布文章  -->
              <el-menu-item class="text" index="/admin_Main/publish_article">
                <el-icon>
                  <Edit />
                </el-icon>
                <span>
                  发布文章
                </span>
              </el-menu-item>
              <!-- 文章管理  -->
              <el-menu-item class="text" index="/admin_Main/manage_article">
                <el-icon>
                  <Memo />
                </el-icon>
                <span>
                  文章管理
                </span>
              </el-menu-item>
              <!-- 评论管理  -->
              <el-menu-item class="text" index="/admin_Main/comment">
                <el-icon>
                  <Comment />
                </el-icon>
                <span>
                  评论管理
                </span>
              </el-menu-item>
              <!-- 分类管理  -->
              <el-menu-item class="text" index="/admin_Main/category">
                <el-icon>
                  <Filter />
                </el-icon>
                <span>
                  分类/标签
                </span>
              </el-menu-item>
              <!-- 系统设置  -->
              <el-menu-item class="text" index="/admin_Main/setting">
                <el-icon>
                  <Setting />
                </el-icon>
                <span>
                  系统设置
                </span>
              </el-menu-item>

            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main style="padding: 0;">
        <el-row align="middle" justify="space-between" style="height: 70px; border-bottom: 1px solid #eee;">
          <el-col :span="2">
            <span @click="toggleCollapse" style="margin-left: 20px; cursor: pointer; color: #666;">
              <el-icon :size="24">
               
                <Fold v-if="!asideState.collapse" />
                <Expand v-if="asideState.collapse" />
              </el-icon>
            </span>
          </el-col>

          <el-col :span="2">
            <el-dropdown trigger="click" style="margin-right: 20px;">
              <span class="el-dropdown-link">
                <img src="@/assets/me.jpg" style="width: 36px; height: 36px; border-radius: 50%;" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="View" style="color: #333;">
                    查看网站
                  </el-dropdown-item>
                  <el-dropdown-item :icon="DArrowRight" style="color: #333;">
                    用户注销
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <RouterView />
          </el-col>
        </el-row>
      </el-main>

    </el-container>
  </div>
</template>

<style scoped>
.blg-text {
  margin-left: 10px;
  font-size: 28px;
  color: #2f353f;
}

.left-top {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  background-color: #eee;
}

.text {
  color: #a7b1c2;
  display: block;
  background: #2f353f;
}

.text:hover {
  background: #272c35 !important;
}

.text:active {
  background: #272c35 !important;
  color: #fff !important;
}
</style>