import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/index.vue"),
    },
    {
      path: "/admin_Main",
      name: "adminMain",
      component: () => import("../views/admin/AdminMain.vue"),
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("../views/admin/Dashboard.vue"),
        },
        {
          path: "publish_article",
          name: "publishArticle",
          component: () => import("../views/admin/PublishArticle.vue"),
        },
        {
          path: "edit_article",
          name: "editArticle",
          component: () => import("../views/admin/EditArticle.vue"),
        },
        {
          path: "comment",
          name: "comment",
          component: () => import("../views/admin/Comment.vue"),
        },
        {
          path: "category",
          name: "category",
          component: () => import("../views/admin/Category.vue"),
        },
        {
          path: "setting",
          name: "setting",
          component: () => import("../views/admin/Setting.vue"),
        },
      ],
    },

    {
      path: "/article_comment/:articleId",
      name: "articleAndComment",
      component: () => import("../views/ArticleAndComment.vue"),
    },
  ],
});

export default router;
