<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  }
})
</script>

<template>
<div :class="['info', {'active':visible}]">
  <h3 class="info-content">
    <slot></slot>
  </h3>
</div>
</template>

<style scoped>
@import 'VInformationWindow.scss';
</style>