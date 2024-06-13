<script setup>
import { ref } from 'vue'

const sidebarList = [
  {
    id: 1,
    name: 'Студенты',
    url: '/students',
  },
  {
    id: 2,
    name: 'Группы',
    url: '/groups',
  },
  {
    id: 3,
    name: 'Учебные планы',
    url: '/plans',
  },
  {
    id: 4,
    name: 'Журнал',
    url: '/journal',
  },
  {
    id: 5,
    name: 'Уроки',
    url: '/lessons',
  }
]

const activeUrl = ref(document.location.pathname)
const activeItem = sidebarList.filter((obj) => obj.url === activeUrl.value)[0].id
</script>

<template>
  <div class="sidebar">
    <ul class="sidebar-list">
      <li
        v-for="item in sidebarList"
        :key="item.id"
        class="sidebar-item"
      >
        <div v-if="item.id === activeItem" class="item-mark"></div>
        <router-link :to="item.url" :class="['sidebar-link', { 'active': item.id === activeItem }]"
          >{{ item.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@import 'VSidebar.scss';
</style>
