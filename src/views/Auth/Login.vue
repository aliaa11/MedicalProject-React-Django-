<template>
  <div class="login-page d-flex justify-content-center align-items-center min-vh-100">
    <div class="auth-box shadow-lg rounded-4 p-5 bg-white animate__animated animate__fadeIn">

      <!-- Logo -->
      <div class="text-center mb-4">
        <img
          src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/logo%20(2).png"
          alt="jobDev Logo"
          class="logo-img mb-2"
        />
        <h2 class="fw-bold text-primary">Welcome to jobPoint</h2>
      </div>

      <!-- Bootstrap Alert -->
      <div v-if="alertMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ alertMessage }}
        <button type="button" class="btn-close" @click="alertMessage = null" aria-label="Close"></button>
      </div>

      <!-- Auth Form -->
      <AuthForm :isLogin="true" :onSubmit="loginUser" />

      <!-- Create Account Link -->
      <div class="text-center mt-4">
        <span>Don't have an account?</span>
        <router-link to="/register" class="btn btn-outline-primary btn-sm ms-2">Create Account</router-link>
      </div>
    </div>
  </div>
</template>


<script>
import AuthForm from './AuthForm.vue';

export default {
  components: { AuthForm },
  data() {
    return {
      alertMessage: null
    };
  },
  methods: {
    loginUser({ email, password }) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        this.alertMessage = 'Invalid credentials. Please check your email and password.';
        return;
      }

      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('role', user.role);
      this.$router.push(`/${user.role}/dashboard`);
    }
  }
};
</script>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

.login-page {
  background: linear-gradient(135deg, #f0f2f5, #e8ebf0);
  font-family: 'Segoe UI', sans-serif;
}

.auth-box {
  width: 100%;
  max-width: 420px;
}

.logo-img {
  height: 120px;
}

input.form-control:focus,
select.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  transition: all 0.3s ease;
}

button {
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
