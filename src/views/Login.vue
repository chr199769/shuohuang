<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>{{ isLogin ? '用户登录' : '用户注册' }}</h2>
        <!-- 移除原有的tab-switch按钮组 -->
      </div>

      <!-- 登录表单 -->
      <el-form 
        v-if="isLogin"
        :model="loginForm" 
        :rules="loginRules" 
        ref="loginFormRef" 
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="账户" prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入账户名"
            prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 添加注册链接 -->
        <div class="register-link">
          <span>没有账号？</span>
          <span class="register-text" @click="switchToRegister">注册</span>
        </div>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading"
            class="submit-btn"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 注册表单 -->
      <el-form 
        v-else
        :model="registerForm" 
        :rules="registerRules" 
        ref="registerFormRef" 
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="账户" prop="username">
          <el-input 
            v-model="registerForm.username" 
            placeholder="请输入账户名"
            prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model="registerForm.phone" 
            placeholder="请输入手机号"
            prefix-icon="Phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 添加返回登录链接 -->
        <div class="back-login-link">
          <span class="back-login-text" @click="switchToLogin">返回登录</span>
        </div>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleRegister" 
            :loading="loading"
            class="submit-btn"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const isLogin = ref(true);
const loading = ref(false);
const loginFormRef = ref(null);
const registerFormRef = ref(null);

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
});

// 注册表单数据
const registerForm = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

// 密码验证规则
const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'));
  } else if (value.length < 10) {
    callback(new Error('密码长度不能少于10位'));
  } else {
    // 检查是否包含字母、数字、特殊字符
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    
    if (!hasLetter || !hasNumber || !hasSpecial) {
      callback(new Error('密码必须包含字母、数字和特殊字符'));
    } else {
      callback();
    }
  }
};

// 确认密码验证
const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

// 手机号验证
const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'));
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
};

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入账户名', trigger: 'blur' },
    { min: 3, max: 20, message: '账户名长度在3到20个字符', trigger: 'blur' }
  ],
  password: [
      { required: true, validator: validatePassword, trigger: 'blur' }
  ]
};

// 注册表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入账户名', trigger: 'blur' },
    { min: 3, max: 20, message: '账户名长度在3到20个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, validator: validatePhone, trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
};

// 切换到登录
const switchToLogin = () => {
  isLogin.value = true;
  // 清空表单
  if (registerFormRef.value) {
    registerFormRef.value.resetFields();
  }
};

// 切换到注册
const switchToRegister = () => {
  isLogin.value = false;
  // 清空表单
  if (loginFormRef.value) {
    loginFormRef.value.resetFields();
  }
};

// 处理登录
const handleLogin = () => {
  loginFormRef.value?.validate(async (valid) => {
    if (!valid) return;
    
    loading.value = true;
    try {
      // 模拟登录API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
      
      if (user) {
        // 保存用户信息到localStorage
        localStorage.setItem('userInfo', JSON.stringify({
          username: user.username,
          role: user.role,
          loginTime: new Date().toISOString()
        }));
        
        ElMessage.success('登录成功');
        // 跳转到控制台页面
        router.push('/');
      } else {
        throw new Error('用户名或密码错误');
      }
    } catch (error) {
      ElMessage.error(error.message || '登录失败，请检查账户信息');
    } finally {
      loading.value = false;
    }
  });
};

// 处理注册
const handleRegister = () => {
  registerFormRef.value?.validate(async (valid) => {
    if (!valid) return;
    
    loading.value = true;
    try {
      // 模拟注册API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.username === registerForm.username)) {
        throw new Error('用户名已存在');
      }
      
      // 添加新用户，默认权限为普通用户
      users.push({
        username: registerForm.username,
        password: registerForm.password,
        phone: registerForm.phone,
        role: 'user'
      });
      
      localStorage.setItem('users', JSON.stringify(users));
      
      ElMessage.success('注册成功，请登录');
      // 切换到登录页面
      switchToLogin();
    } catch (error) {
      ElMessage.error(error.message || '注册失败，请重试');
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  min-height: 500px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
}

.tab-switch {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.login-form {
  margin-top: 20px;
}

.login-form .el-form-item {
  margin-bottom: 25px;
}

.login-form .el-input {
  height: 45px;
}

.login-form .el-input__inner {
  height: 45px;
  line-height: 45px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

.login-form .el-input__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.submit-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.el-form-item__label {
  color: #2c3e50;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
}

/* 新增注册链接样式 */
/* 修改注册链接样式 - 右对齐 */
.register-link {
  text-align: right;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.register-text {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
}

.register-text:hover {
  color: #66b1ff;
  text-decoration: underline;
}

/* 返回登录链接样式 */
.back-login-link {
  text-align: right;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.back-login-text {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
}

.back-login-text:hover {
  color: #66b1ff;
  text-decoration: underline;
}

/* 注册链接样式 - 右对齐 */
.register-link {
  text-align: right;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.register-text {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
}

.register-text:hover {
  color: #66b1ff;
  text-decoration: underline;
}
</style>