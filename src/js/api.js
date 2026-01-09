import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/api', // API的基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage或store中获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 用户未授权，可能需要重新登录
      localStorage.removeItem('token');
      // 可以在这里跳转到登录页
    }
    return Promise.reject(error);
  }
);

// 用户相关API
export const userApi = {
  // 获取用户信息
  getUserInfo: () => apiClient.get('/profile/info'),
  
  // 更新用户信息
  updateUserInfo: (data) => apiClient.post('/profile', data),
  
  // 更新用户名
  updateUsername: (username) => apiClient.post('/profile/username', { username }),
  
  // 更新个人简介
  updateBio: (bio) => apiClient.post('/profile/bio', { bio }),
  
  // 上传头像
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 更新密码
  updatePassword: (data) => apiClient.post('/profile/password', data),
  
  // 删除账户
  deleteUser: () => apiClient.delete('/profile'),
  
  // 获取我的帖子
  getMyArticles: (params) => apiClient.post('/profile/articles', params),
  
  // 获取我喜欢的帖子
  getLikedArticles: (params) => apiClient.post('/profile/liked-articles', params),
  
  // 获取我的收藏
  getFavoritedArticles: (params) => apiClient.post('/profile/favorited-articles', params),
};

// 帖子相关API
export const postApi = {
  // 获取用户发布的帖子
  getUserPosts: (userId, params) => apiClient.post(`/article/getUserArticles`, params, { params: { userId } }),
  
  // 获取用户点赞的帖子
  getLikedPosts: (userId, params) => apiClient.post(`/article/getUserLikedArticles`, params, { params: { userId } }),
  
  // 获取用户收藏的帖子
  getFavoritePosts: (userId, params) => apiClient.post(`/article/getUserFavoritedArticles`, params, { params: { userId } }),
  
  // 删除帖子
  deletePost: (postId) => apiClient.post(`/article/deleteById`, { id: postId }),
  
  // 点赞相关
  likeArticle: (articleId) => apiClient.post(`/article/likeArticle`, { articleId }),
  unlikeArticle: (articleId) => apiClient.post(`/article/unlikeArticle`, { articleId }),
  isArticleLikedByUser: (userId, articleId) => apiClient.get(`/article/isArticleLikedByUser`, { params: { userId, articleId } }),
  
  // 收藏相关
  favoriteArticle: (articleId) => apiClient.post(`/article/favoriteArticle`, { articleId }),
  unfavoriteArticle: (articleId) => apiClient.post(`/article/unfavoriteArticle`, { articleId }),
  isArticleFavoritedByUser: (userId, articleId) => apiClient.get(`/article/isArticleFavoritedByUser`, { params: { userId, articleId } }),
};

// 好友相关API
export const friendApi = {
  // 获取好友列表
  getFriends: (params) => apiClient.get('/friends', { params }),
  
  // 添加好友
  addFriend: (data) => apiClient.post('/friends/add', data),
  
  // 删除好友
  removeFriend: (friendId) => apiClient.delete(`/friends/${friendId}`),
};

export default apiClient;