<template>
  <form @submit.prevent="submitForm" class="auth-form needs-validation" novalidate>

    <!-- Full Name Input (For Registration) -->
    <div v-if="!isLogin" class="mb-3">
      <label for="name" class="form-label">Full Name</label>
      <input v-model="form.name" type="text" class="form-control" id="name" required />
      <div class="invalid-feedback">Name is required.</div>
    </div>

    <!-- Email Input -->
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input v-model="form.email" type="email" class="form-control" id="email" required />
      <div class="invalid-feedback">Please provide a valid email address.</div>
    </div>

    <!-- Phone Input (For Registration) -->
    <div v-if="!isLogin" class="mb-3">
      <label for="phone" class="form-label">Phone</label>
      <input
        v-model="form.phone"
        type="tel"
        class="form-control"
        id="phone"
        pattern="^[0-9]{9,15}$"
        required
      />
      <div class="invalid-feedback">Phone number must be between 9 to 15 digits.</div>
    </div>

    <!-- Password Input -->
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        v-model="form.password"
        type="password"
        class="form-control"
        id="password"
        minlength="6"
        required
      />
      <div class="invalid-feedback">Password must be at least 6 characters long.</div>
    </div>

    <!-- Confirm Password Input (For Registration) -->
    <div v-if="!isLogin" class="mb-3">
      <label for="confirm" class="form-label">Confirm Password</label>
      <input
        v-model="form.password_confirmation"
        type="password"
        class="form-control"
        id="confirm"
        required
      />
      <div class="invalid-feedback">Please confirm your password.</div>
    </div>

    <!-- Role Selection (For Registration) -->
    <div v-if="!isLogin" class="mb-3">
      <label for="role" class="form-label">Register as:</label>
      <select v-model="form.role" class="form-select" id="role" required>
        <option disabled value="">Select Role</option>
        <option value="employer">Employer</option>
        <option value="candidate">Candidate</option>
      </select>
      <div class="invalid-feedback">Please select a role.</div>
    </div>

    <!-- Image Upload Input (For Registration) -->
    <div v-if="!isLogin" class="mb-3">
      <label for="image" class="form-label">Profile Image</label>
      <input
        type="file"
        class="form-control"
        id="image"
        accept="image/*"
        @change="handleImageUpload"
        :class="{ 'is-invalid': imageRequired && !form.image }"
        required
      />
      <div class="invalid-feedback">Profile image is required.</div>
      <div v-if="previewImage" class="mt-2 text-center">
        <img :src="previewImage" class="img-thumbnail" style="max-width: 120px;" />
      </div>
    </div>

    <!-- Submit Button -->
    <button type="submit" class="btn btn-primary w-100">
      {{ isLogin ? 'Login' : 'Register' }}
    </button>
  </form>
</template>

<script>
export default {
  props: {
    isLogin: Boolean,
    onSubmit: Function,
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: '',
        image: null, // base64 string
      },
      previewImage: null,
      imageRequired: false,
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.image = e.target.result;
          this.previewImage = e.target.result;
          this.imageRequired = false; // reset if image is provided
        };
        reader.readAsDataURL(file);
      }
    },
    submitForm() {
      const formEl = this.$el;

      // Set flag to trigger image validation
      if (!this.isLogin && !this.form.image) {
        this.imageRequired = true;
      }

      if (formEl.checkValidity() === false || this.imageRequired) {
        formEl.classList.add('was-validated');
        return;
      }

      if (!this.isLogin && this.form.password !== this.form.password_confirmation) {
        alert('Passwords do not match!');
        return;
      }

      const payload = { ...this.form };
      if (this.isLogin) {
        delete payload.name;
        delete payload.phone;
        delete payload.password_confirmation;
        delete payload.role;
        delete payload.image;
      }

      this.onSubmit(payload);
    },
  },
};
</script>

<style scoped>
.auth-form {
  max-width: 450px;
  margin: auto;
}

.auth-form .form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.auth-form .invalid-feedback {
  font-size: 0.875rem;
}

button {
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 10px 15px;
}
</style>