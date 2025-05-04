<template>
  <div class="register-page d-flex justify-content-center align-items-center min-vh-100">
    <div class="auth-box shadow-lg rounded-4 p-5 bg-white animate__animated animate__fadeIn">

      <!-- Logo Inside Card -->
      <div class="d-flex justify-content-center mb-3">
        <img
          src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/logo%20(2).png"
          alt="jobDev Logo"
          class="img-fluid"
          style="max-width: 250px;"
        />
      </div>

      <!-- Heading -->
      <h2 class="fw-bold text-center text-primary">Create an Account</h2>

      <!-- Alert -->
      <div
        v-if="alertMessage"
        class="alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        {{ alertMessage }}
        <button
          type="button"
          class="btn-close"
          @click="alertMessage = null"
          aria-label="Close"
        ></button>
      </div>

      <!-- Form -->
      <AuthForm :isLogin="false" :onSubmit="registerUser" />

      <!-- Footer Link -->
      <div class="text-center mt-3">
        <small class="text-muted">Already have an account?</small>
        <router-link to="/login" class="btn btn-link btn-sm">Log in</router-link>
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
    async registerUser(formData) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.email === formData.email)) {
        this.alertMessage = 'Email is already registered.';
        return;
      }
      users.push(formData);
      localStorage.setItem('users', JSON.stringify(users));
      this.alertMessage = 'Registration successful! Redirecting to login…';
      setTimeout(() => this.$router.push('/login'), 1500);
    }
  }
};
</script>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

/* Apply the same background as login page */
.register-page {
  background: linear-gradient(135deg, #f0f2f5, #e8ebf0);
  font-family: 'Segoe UI', sans-serif;
}

/* Form styling */
.auth-box {
  width: 100%;
  max-width: 420px;
}

/* Logo styling */
.img-fluid {
  max-width: 150px;
}

/* Input focus styling */
input.form-control:focus,
select.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  transition: all 0.3s ease;
}

/* Button lettering */
button {
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
