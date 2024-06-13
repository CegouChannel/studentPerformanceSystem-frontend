<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'medium',
  },
  color: {
    type: String,
  },
  icon: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['click'])

const click = () => {
  emit('click')
}
</script>

<template>
  <v-btn @click="click" icon="$vuetify" :class="['btn', `btn_${size}`, `btn_${color}`]">
    <slot></slot>
  </v-btn>
</template>

<style scoped>
@import 'VButton.scss';
</style>
