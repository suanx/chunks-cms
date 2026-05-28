import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'DataAnalysis' },
      },
      {
        path: 'video',
        name: 'Video',
        redirect: '/video/list',
        meta: { title: '视频管理', icon: 'VideoCamera' },
        children: [
          { path: 'list', name: 'VideoList', component: () => import('@/views/video/index.vue'), meta: { title: '视频列表' } },
          { path: 'create', name: 'VideoCreate', component: () => import('@/views/video/create.vue'), meta: { title: '新建视频' } },
          { path: 'edit/:id', name: 'VideoEdit', component: () => import('@/views/video/edit.vue'), meta: { title: '编辑视频', hidden: true } },
          { path: 'review', name: 'VideoReview', component: () => import('@/views/video/review.vue'), meta: { title: '视频审核' } },
        ],
      },
      {
        path: 'movie',
        name: 'Movie',
        redirect: '/movie/list',
        meta: { title: '影视剧管理', icon: 'Film' },
        children: [
          { path: 'list', name: 'MovieList', component: () => import('@/views/movie/index.vue'), meta: { title: '影视剧列表' } },
          { path: 'create', name: 'MovieCreate', component: () => import('@/views/movie/create.vue'), meta: { title: '新建影视剧' } },
          { path: 'edit/:id', name: 'MovieEdit', component: () => import('@/views/movie/edit.vue'), meta: { title: '编辑影视剧', hidden: true } },
        ],
      },
      {
        path: 'actor',
        name: 'Actor',
        redirect: '/actor/list',
        meta: { title: '影人管理', icon: 'UserFilled' },
        children: [
          { path: 'list', name: 'ActorList', component: () => import('@/views/actor/index.vue'), meta: { title: '影人列表' } },
          { path: 'create', name: 'ActorCreate', component: () => import('@/views/actor/create.vue'), meta: { title: '新建影人' } },
        ],
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: { title: '分类管理', icon: 'Folder' },
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/comment/index.vue'),
        meta: { title: '评论管理', icon: 'ChatDotRound' },
      },
      {
        path: 'banner',
        name: 'Banner',
        component: () => import('@/views/banner/index.vue'),
        meta: { title: '横幅管理', icon: 'PictureFilled' },
      },
      {
        path: 'user',
        name: 'User',
        redirect: '/user/list',
        meta: { title: '用户管理', icon: 'User' },
        children: [
          { path: 'list', name: 'UserList', component: () => import('@/views/user/index.vue'), meta: { title: '用户列表' } },
          { path: 'role', name: 'Role', component: () => import('@/views/user/role.vue'), meta: { title: '角色管理' } },
        ],
      },
      {
        path: 'audit',
        name: 'Audit',
        component: () => import('@/views/audit/index.vue'),
        meta: { title: '审计日志', icon: 'Document' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: { title: '系统设置', icon: 'Setting' },
      },
    ],
  },
];
