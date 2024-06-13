<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'normal',
  },
  type: {
    type: String,
    default: 'text',
  },
})
</script>

<template>
  <v-text-field
    :class="['ipt', `ipt_${size}`]"
    :label="placeholder"
    :type="type"
  ></v-text-field>
</template>

<style scoped>
@import 'VInput.scss';
</style>
