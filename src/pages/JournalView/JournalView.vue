<script setup>
import VSidebar from '@/components/VSidebar/VSidebar.vue'
import VHeader from '@/components/VHeader/VHeader.vue'
import VJournal from '@/components/VJournal/VJournal.vue'
import VSelect from '@/components/UI/VSelect/VSelect.vue'
import VModalWindow from '@/components/UI/VModalWindow/VModalWindow.vue'
import VButton from '@/components/UI/VButton/VButton.vue'
import {useStudentStore} from '@/store/studentStore.js'
import {useGroupStore} from '@/store/groupStore.js'
import {useLessonsStore} from '@/store/lessonsStore.js'
import {computed, ref} from 'vue'
import {useJournalStore} from '@/store/journalStore.js'
import JournalService from '@/API/journalService.js'

const studentStore = useStudentStore()
const groupStore = useGroupStore()
const lessonStore = useLessonsStore()
const journalStore = useJournalStore()

const activeGroup = ref(3)
const editJournalWindowOpened = ref(false)
const estimates = [
  {
    id: 1,
    value: 2,
    color: 'secondary',
  },
  {
    id: 2,
    value: 3,
    color: 'primary',
  },
  {
    id: 3,
    value: 4,
    color: 'primary',
  },
  {
    id: 4,
    value: 5,
    color: 'primary',
  },
]
const formEditJournal = ref({
  studentId: '',
  lessonId: '',
  status: '',
  estimate: '',
})

const switchEditJournal = (data) => {
  if (data) {
    formEditJournal.value.studentId = data.studentId
    formEditJournal.value.lessonId = data.lessonId
  }

  editJournalWindowOpened.value = !editJournalWindowOpened.value
}

const changeStatusJournal = (status) => {
  formEditJournal.value.status = status
  const index = journalStore.journal.findIndex(
      (journal) =>
          journal.id_student === formEditJournal.value.studentId &&
          journal.id_lesson === formEditJournal.value.lessonId
  )
  if (index === -1) {
    const reqAddJournal = JournalService.addJournal(formEditJournal.value)
    journalStore.journal.push({
      estimate: formEditJournal.value.estimate,
      id: reqAddJournal.insertId,
      id_lesson: formEditJournal.value.lessonId,
      id_student: formEditJournal.value.studentId,
      status: formEditJournal.value.status,
    })
  } else {
    formEditJournal.value.estimate = journalStore.journal[index].estimate
    const journalId = journalStore.journal[index].id
    const reqEditJournal = JournalService.editJournal(
        formEditJournal.value,
        journalId
    )
    if (!reqEditJournal.insertId) {
      journalStore.journal[index].status = status
    }
  }
}

const changeEstimateJournal = (estimate) => {
  formEditJournal.value.estimate = estimate
  const index = journalStore.journal.findIndex(
      (journal) =>
          journal.id_student === formEditJournal.value.studentId &&
          journal.id_lesson === formEditJournal.value.lessonId
  )
  if (index === -1) {
    const reqAddJournal = JournalService.addJournal(formEditJournal.value)
    journalStore.journal.push({
      estimate: formEditJournal.value.estimate,
      id: reqAddJournal.insertId,
      id_lesson: formEditJournal.value.lessonId,
      id_student: formEditJournal.value.studentId,
      status: formEditJournal.value.status,
    })
  } else {
    formEditJournal.value.status = journalStore.journal[index].status
    const journalId = journalStore.journal[index].id
    const reqEditJournal = JournalService.editJournal(
        formEditJournal.value,
        journalId
    )
    if (!reqEditJournal.insertId) {
      journalStore.journal[index].estimate = estimate
    }
  }
}

const getStudentsByGroup = computed(() => {
  const response = []
  studentStore.students.forEach((student) => {
    if (student.group === activeGroup.value) {
      response.push(student)
    }
  })
  return response
})

const getLessonsByGroup = computed(() => {
  let planId
  groupStore.groups.forEach((group) => {
    if (group.value === activeGroup.value) {
      planId = group.planTraining
    }
  })
  const response = []
  lessonStore.lessons.forEach((lesson) => {
    if (lesson.id_plan === planId) {
      response.push(lesson)
    }
  })
  return response
})

await journalStore.getJournal()
await groupStore.getGroups()
await studentStore.getStudents()
await lessonStore.getLessons()
</script>

<template>
  <div class="journal">
    <VSidebar/>
    <div class="journal-body">
      <VHeader/>
      <div class="journal-content">
        <h3 class="journal-title">Журнал</h3>
        <div class="table-actions">
          <VSelect
              v-model="activeGroup"
              :options="groupStore.groups"
              disabled-option="Выберите группу"
          />
        </div>
        <VJournal
            @openEditForm="switchEditJournal"
            :lessons="getLessonsByGroup"
            :students="getStudentsByGroup"
            :journal="journalStore.journal"
        />
      </div>
    </div>
    <VModalWindow :is-open="editJournalWindowOpened">
      <div class="editJournal">
        <h3 class="editJournal-title">Редактирование журнала</h3>
        <h3>
          Студент {{ formEditJournal.studentId }} Урок:
          {{ formEditJournal.lessonId }}
        </h3>
        <h4 class="editJournal-subtitle">Отсутствие</h4>
        <div class="editJournal-status">
          <VButton
              @click="changeStatusJournal('не был')"
              color="secondary"
              size="large"
          >Не был
          </VButton>
          <VButton
              @click="changeStatusJournal('болел')"
              color="primary"
              size="large"
          >Болел
          </VButton>
        </div>
        <h4 class="editJournal-subtitle">Оценка</h4>
        <div class="editJournal-estimate">
          <VButton
              v-for="estimate in estimates"
              :key="estimate.id"
              @click="changeEstimateJournal(estimate.value)"
              :color="estimate.color"
              size="icon"
          >{{ estimate.value }}
          </VButton>
        </div>
        <div class="editJournal-actions">
          <VButton @click="switchEditJournal" color="primary" size="small"
          >готово
          </VButton>
        </div>
      </div>
    </VModalWindow>
  </div>
</template>

<style scoped>
@import 'JournalView.scss';
</style>
