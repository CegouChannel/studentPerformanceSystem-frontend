<script setup>
import VInput from '@/components/UI/VInput/VInput.vue'
import VButton from '@/components/UI/VButton/VButton.vue'
import UserService from '@/API/userService.js'
import Cookies from "js-cookie";
import { ref } from 'vue'

const formLog = ref({
  email: '',
  password: '',
})

const error = ref('')

const logIn = async () => {
  error.value = ''
  if (formLog.value.email === '' || formLog.value.password === '') {
    error.value = 'Заполните все поля!'
    return false
  }
  const respLogin = await UserService.login(formLog.value)
  if (respLogin.id) {
    const authUser = JSON.stringify(respLogin)
    Cookies.set('AuthUser', authUser, {expires: 14})
    window.location.href = '/students'
  } else {
    error.value = respLogin.message
  }
}
</script>

<template>
  <div class="page">
    <div class="page-auth">
      <VInput
        v-model="formLog.email"
        class="auth-inp"
        placeholder="Email"
        size="fullWidth"
      />
      <VInput
        v-model="formLog.password"
        class="auth-inp"
        placeholder="Пароль"
        size="fullWidth"
        type="password"
      />
      <VButton
        @click="logIn()"
        class="auth-btn"
        color="secondary"
        size="fullWidth"
        >войти
      </VButton>
      <TransitionGroup name="list" tag="ul">
        <h1 v-if="error !== ''" class="auth-err">
          {{ error }}
        </h1>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
@import 'HomeView.scss';
</style>
