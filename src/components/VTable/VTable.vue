<script setup>
import VInput from '@/components/UI/VInput/VInput.vue'
import VButton from '@/components/UI/VButton/VButton.vue'
import VSelect from '@/components/UI/VSelect/VSelect.vue'
import {ref, watch} from 'vue'
import {useGroupStore} from '@/store/groupStore.js'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
  },
  tableHead: {
    type: Array,
    required: true,
  },
  err: {
    type: String,
  },
  placeholderSearch: {
    type: String,
    default: 'Поиск'
  }
})

const emit = defineEmits([
  'switchAddWindow',
  'deleteById',
  'switchEditWindow',
  'onPageChange',
  'searchByInpAndSelect',
])
const groupStore = useGroupStore()

const valuesSearch = ref({
  inp: '',
  select: ''
})


const switchAddWindow = () => {
  emit('switchAddWindow')
}

const searchTable = () => {
  emit('searchByInpAndSelect', valuesSearch.value)
}

await groupStore.getGroups()
</script>

<template>
  <div class="table">
    <div class="table-head">
      <div class="table-head-title">
        <h1 class="title">{{ title }}</h1>
        <VButton @click="switchAddWindow" size="icon" variant="text">
          <v-icon color="primary">mdi-plus</v-icon>
        </VButton>
      </div>
      <div class="table-head-actions">
        <div class="table-head-input">
          <VInput @input="searchTable" v-model="valuesSearch.inp" :placeholder="placeholderSearch" size="large"/>
        </div>
        <div class="table-head-select">
          <VSelect
              v-if="options"
              v-model="valuesSearch.select"
              disabled-option="Выберите группу"
              @update:modelValue="searchTable"
              :options="options"
              size="large"
          />
        </div>
      </div>
    </div>
    <TransitionGroup name="list" tag="ul">
      <h1 v-if="err" class="table-err">{{ err }}</h1>
    </TransitionGroup>
    <div class="table-body">
      <table class="table-body-head">
        <tbody>
        <tr
            :style="`grid-template-columns: 0.2fr repeat(${tableHead.length}, 1fr);`"
        >
          <td v-for="head in tableHead" :key="head.id">
            {{ head.name }}
          </td>
          <td>действия</td>
        </tr>
        </tbody>
      </table>
      <table class="table-body-data">
        <tbody>
        <slot></slot>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import 'VTable.scss';
</style>
