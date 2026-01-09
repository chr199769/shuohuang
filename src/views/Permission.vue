<template>
  <div class="permission-container">
    <h2>权限管理</h2>
    <el-table :data="userList" style="width: 100%" stripe border>
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="role" label="当前权限">
        <template #default="scope">
          <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'success'">
            {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <el-button 
            size="small" 
            :type="scope.row.role === 'admin' ? 'warning' : 'primary'"
            @click="toggleRole(scope.row)"
          >
            {{ scope.row.role === 'admin' ? '降级为普通用户' : '设为管理员' }}
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="deleteUser(scope.row)"
          >
            删除用户
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const userList = ref([]);

const loadUsers = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  // 过滤掉超管 admin
  userList.value = users.filter(u => u.username !== 'admin');
};

onMounted(() => {
  loadUsers();
});

const toggleRole = (user) => {
  const newRole = user.role === 'admin' ? 'user' : 'admin';
  const actionText = newRole === 'admin' ? '设为管理员' : '降级为普通用户';
  
  ElMessageBox.confirm(
    `确定要将用户 ${user.username} ${actionText}吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    updateUserRole(user.username, newRole);
  }).catch(() => {});
};

const updateUserRole = (username, newRole) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const index = users.findIndex(u => u.username === username);
  if (index !== -1) {
    users[index].role = newRole;
    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
    ElMessage.success('权限修改成功');
  }
};

const deleteUser = (user) => {
  ElMessageBox.confirm(
    `确定要删除用户 ${user.username} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }
  ).then(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUsers = users.filter(u => u.username !== user.username);
    localStorage.setItem('users', JSON.stringify(newUsers));
    loadUsers();
    ElMessage.success('用户已删除');
  }).catch(() => {});
};
</script>

<style scoped>
.permission-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 100px);
}

h2 {
  margin-bottom: 20px;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
}

.tips {
  margin-bottom: 20px;
}
</style>
