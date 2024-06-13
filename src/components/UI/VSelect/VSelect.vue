<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'medium',
  },
  disabledOption: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['change'])
</script>

<template>
  <v-select
      @input="emit('input')"
      :class="['select', `select_${size}`]"
      :items="options"
      item-title="title"
      item-value="value"
      :label="disabledOption"
      :disabled-option="disabledOption"
      :options="options"
  ></v-select>
</template>

<style scoped>
@import 'VSelect.scss';
</style>
