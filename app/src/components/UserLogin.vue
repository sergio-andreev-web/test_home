<template>
  <div class="login-background">
    <div class="login-container">
      <h1>Авторизация</h1>
      <form class="login-form" @submit.prevent="login">
        <div class="input-group">
          <img src="@/assets/icons/phone_icon.svg" alt="Phone Icon" class="input-icon phone" />
          <label for="email">Логин или телефон</label>
          <input
              v-model="username"
              type="text"
              id="email"
              placeholder="Логин или телефон"
              required
          />
        </div>
        <div class="input-group">
          <img src="@/assets/icons/pass_icon.svg" alt="Password Icon" class="input-icon" />
          <input
              v-model="password"
              :type="passwordVisible ? 'text' : 'password'"
              id="password"
              placeholder="Пароль"
              required
          />
          <img
              src="@/assets/icons/hide_pass_icon.svg"
              alt="Hide Password Icon"
              class="toggle-password"
              @click="togglePasswordVisibility"
          />
        </div>
        <button type="submit" class="login-button">Войти</button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/services/axiosInstance';

export default {
  name: 'UserLogin',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      passwordVisible: false
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/auth/login/', {
          username: this.username,
          password: this.password,
          email: 'asdasd@asdasd.asd' // апи требует мыло
        });


        localStorage.setItem('token', response.data.key);
        this.$router.push('/');
      } catch (err) {
        if (err.response && err.response.data.data.non_field_errors) {
          this.error = err.response.data.data.non_field_errors.join(', ');
        } else {
          this.error = 'Ошибка авторизации. Проверьте данные и попробуйте снова.';
        }
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    }
  }
};
</script>

<style scoped lang="scss">
.login-background {
  background-image: url('@/assets/back.jpg');
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  margin-top: 2.5rem;
  width: 100%;
}

.login-container {
  background: #ffffff;
  max-width: 340px;
  width: 340px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  background: #44A248;
  padding: 1rem;
  border-radius: 5px;
  margin-top: -35px;
  color: #ffffff;
}

.input-group {
  position: relative;
  margin-bottom: 15px;
}

.input-icon {
  position: absolute;
  left: 10px;
  top: 19px;
  transform: translateY(-50%);

  &.phone {
    top: 44px;
  }
}

label {
  color: #50B053;
  font-size: 12px;
  margin-bottom: 10px;
  display: block;
  margin-left: 41px;
}

input {
  width: 100%;
  padding: 10px 40px;
  border-bottom: 1px solid #ccc;
  background: #ffffff;
  font-size: 14px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #50B053;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  max-width: 110px;
  width: 100%;
  margin: 0 auto;
  display: block;
}

.login-button:hover {
  background-color: #3c8e3f;
}

.error-message {
  color: tomato;
  font-size: 12px;
  margin-top: 10px;
}
</style>
