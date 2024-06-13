<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <div v-show="isOpen" class="modalWindow">
    <v-expand-transition>
      <div v-show="isOpen" class="modalWindow-body">
        <slot></slot>
      </div>
    </v-expand-transition>
  </div>
</template>

<style scoped>
@import 'VModalWindow.scss';
</style>
