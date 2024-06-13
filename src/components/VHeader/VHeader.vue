<script setup>
import Cookies from "js-cookie";
import {ref} from 'vue'

const authUser = JSON.parse(Cookies.get('AuthUser'))
const fio = authUser.fio
const role = ref()
switch (authUser.role) {
  case 1:
    role.value = 'Администратор'
    break;
  case 2:
    role.value = 'Преподавтаель'
    break;
  default:
    role.value = 'Ученик'
    break;
}

const logOut = () => {
  Cookies.remove('AuthUser')
  window.location.href = '/'
}
</script>

<template>
  <div class="header">
    <div class="header-body">
      <div class="header-logo"></div>
      <div class="header-info">
        <h3 class="header-fio">{{ fio }}</h3>
        <h4 class="header-role">{{ role }}</h4>
      </div>
      <img
          @click="logOut()"
          class="header-logout"
          src="/header/logout.svg"
          alt="logout-icon"
      />
    </div>
  </div>
</template>

<style scoped>
@import 'VHeader.scss';
</style>
