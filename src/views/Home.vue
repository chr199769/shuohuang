<template>
  <div class="home">
    <aside class="sidebar">
      <nav>
        <router-link to="/console">控制台</router-link>
        <router-link to="/device-registration">设备登记</router-link>
        <router-link to="/warning-setting">预警设置</router-link>
        <router-link to="/warning-management">预警管理</router-link>
        <router-link 
          v-if="userRole === 'admin' || userRole === 'super_admin'" 
          to="/permission"
        >
          权限管理
        </router-link>
      </nav>
      <!-- 添加退出登录按钮 -->
      <div class="logout-section">
        <div class="user-info">
          <span>{{ username }}</span>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <span class="logout-icon">🚪</span>
          退出登录
        </button>
      </div>
    </aside>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const username = ref('');
const userRole = ref('');

// 获取用户信息
onMounted(() => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const user = JSON.parse(userInfo);
    username.value = user.username;
    userRole.value = user.role || 'user';
  } else {
    // 如果没有登录信息，跳转到登录页
    router.push('/login');
  }
});

// 退出登录
const handleLogout = () => {
  // 清除localStorage
  localStorage.removeItem('userInfo');
  ElMessage.success('已退出登录');
  // 跳转到登录页
  router.push('/login');
};
</script>

<style scoped>
.home {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background-color: #2c3e50;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.sidebar nav {
  flex: 1;
}

.sidebar nav a {
  display: block;
  padding: 12px 20px;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.sidebar nav a:hover {
  background-color: #34495e;
  border-left-color: #42b983;
}

.sidebar nav a.router-link-exact-active {
  background-color: #34495e;
  border-left-color: #42b983;
  font-weight: bold;
}

/* 退出登录区域样式 */
.logout-section {
  padding: 20px;
  border-top: 1px solid #34495e;
}

.user-info {
  color: #bdc3c7;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}

.logout-btn {
  width: 100%;
  padding: 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.logout-icon {
  font-size: 16px;
}

.main-content {
  flex: 1;
  padding: 30px;
  background-color: #f8f9fa;
  overflow-x: auto;
  box-sizing: border-box;
}
</style>