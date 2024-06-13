<script setup>
const props = defineProps({
  lessons: {
    type: Array,
    required: true,
  },
  students: {
    type: Array,
    required: true,
  },
  journal: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['openEditForm'])
const openEditForm = (studentId, lessonId) => {
  const data = {
    studentId: studentId,
    lessonId: lessonId,
  }
  emit('openEditForm', data)
}

const getEstimate = (studentId, lessonId) => {
  const index = props.journal.findIndex(
      (journal) =>
          journal.id_student === studentId && journal.id_lesson === lessonId
  )
  if (index !== -1 && props.journal[index].estimate !== 0) {
    return props.journal[index].estimate
  }
}

const getStatus = (studentId, lessonId) => {
  const index = props.journal.findIndex(
      (journal) =>
          journal.id_student === studentId && journal.id_lesson === lessonId
  )
  if (index !== -1) {
    return props.journal[index].status
  }
  return false
}

const getShortFio = (fio) => {
  const parts = fio.split(' ')
  return `${parts[0]} ${parts[1].charAt(0)}. ${parts[2].charAt(0)}.`
}
</script>

<template>
  <div class="table">
    <table class="table-content students">
      <thead class="table-head">
      <tr class="table-head-row">
        <th class="table-head-student">Студент</th>
      </tr>
      </thead>
      <tbody class="table-body">
      <tr
          class="table-body-row"
          v-for="student in students"
          :key="student.id"
      >
        <td :title="student.fio" class="table-body-fio">{{ getShortFio(student.fio) }}</td>
      </tr>
      </tbody>
    </table>
    <table class="table-content lessons">
      <thead class="table-head">
      <tr class="table-head-row">
        <th
            v-for="lesson in lessons"
            :key="lesson.id"
            class="table-head-lesson"
        >
          {{ lesson.name }}
        </th>
      </tr>
      </thead>
      <tbody class="table-body">
      <tr
          class="table-body-row"
          v-for="student in students"
          :key="student.id"
      >
        <td
            v-for="lesson in lessons"
            :key="lesson.id"
            :class="[
              `table-body-status`,
              { sick: getStatus(student.id, lesson.id) === 'болел' },
              { wasNot: getStatus(student.id, lesson.id) === 'не был' },
            ]"
            @click="openEditForm(student.id, lesson.id)"
        >
          {{ getEstimate(student.id, lesson.id) }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@import 'VJournal.scss';
</style>
