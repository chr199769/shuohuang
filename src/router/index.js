import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Permission from '../views/Permission.vue';
import Login from '../views/Login.vue';
import BusinessData from '../views/BusinessData.vue';
import DeviceData from '../views/DeviceData.vue';
import { ElMessage } from 'element-plus';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/console',
    redirect: '/'
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      // 默认子路由指向业务数据
      { path: '', redirect: '/business' },
      { path: 'permission', name: 'Permission', component: Permission },
      { path: 'business', name: 'BusinessData', component: BusinessData },
      { path: 'device', name: 'DeviceData', component: DeviceData }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;