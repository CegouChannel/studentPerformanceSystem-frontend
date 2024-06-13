<script setup>
import VSidebar from '@/components/VSidebar/VSidebar.vue'
import VHeader from '@/components/VHeader/VHeader.vue'
import VTable from '@/components/VTable/VTable.vue'
import VButton from '@/components/UI/VButton/VButton.vue'
import VSelect from '@/components/UI/VSelect/VSelect.vue'
import VInput from '@/components/UI/VInput/VInput.vue'
import VModalWindow from '@/components/UI/VModalWindow/VModalWindow.vue'
import lessonService from '@/API/lessonService.js'
import {useLessonsStore} from '@/store/lessonsStore.js'
import {usePlanTrainingStore} from '@/store/planTrainingStore.js'
import {ref} from 'vue'
import VInformationWindow from "@/components/VInformationWindow/VInformationWindow.vue";

const tableHead = [
  {
    id: 1,
    name: 'ID',
  },
  {
    id: 2,
    name: 'Название',
  },
  {
    id: 2,
    name: 'План обучения',
  },
]
const lessonsStore = useLessonsStore()
const planTrainingStore = usePlanTrainingStore()
await planTrainingStore.getPlansTraining()
await lessonsStore.getLessons()
const addLessonWindowOpened = ref(false)
const editLessonWindowOpened = ref(false)
const lessons = ref(lessonsStore.lessons)
const dataTableLessons = ref(lessons.value)

const formAddLesson = ref({
  name: '',
  planTraining: 1,
})

const formEditLesson = ref({
  id: '',
  name: '',
  planTraining: 1,
})
const windowInfoText = ref('')
const windowInfoVisible = ref(false)
const idLesson = ref('')
const dialogWindowVisible = ref(false)
const switchAddLessonWindow = () => {
  addLessonWindowOpened.value = !addLessonWindowOpened.value
}

const switchEditLessonWindow = (lesson) => {
  console.log(lesson)
  if (!editLessonWindowOpened.value) {
    formEditLesson.value = {
      id: lesson.id,
      name: lesson.name,
      planTraining: lesson.id_plan,
    }
  }
  editLessonWindowOpened.value = !editLessonWindowOpened.value
}

const addLesson = async () => {
  const reqAddLessons = await lessonService.addLesson(formAddLesson.value)
  if (reqAddLessons.insertId) {
    const newLesson = {
      id: reqAddLessons.insertId,
      id_plan: formAddLesson.value.planTraining,
      name: formAddLesson.value.name,
    }
    lessons.value.push(newLesson)
    formAddLesson.value = {
      name: '',
      planTraining: 1,
    }
    switchAddLessonWindow()
    openInfoWindow(`Урок ${newLesson.name} успешно добавлен!`)
  }
}

const editLesson = async () => {
  const reqEditLesson = await lessonService.editLesson(formEditLesson.value, formEditLesson.value.id)
  console.log(reqEditLesson)
  if (reqEditLesson.insertId === 0) {
    const index = lessons.value.findIndex(
        (obj) => obj.id === formEditLesson.value.id
    )
    console.log(index)
    lessons.value[index].id_plan = formEditLesson.value.planTraining
    lessons.value[index].name = formEditLesson.value.name
    lessons.value[index].value = formEditLesson.value.id
  }
  openInfoWindow('Изменения прошли успешно!')
  editLessonWindowOpened.value = !editLessonWindowOpened.value
}

const deleteLessonById = async (action, id) => {
  if (action === 'OpenWindow') {
    dialogWindowVisible.value = !dialogWindowVisible.value
    idLesson.value = id
  } else if (action === 'delete') {
    const reqDeleteLessonById = await lessonService.deleteLessonById(id)
    console.log(reqDeleteLessonById)
    if (!reqDeleteLessonById.insertId) {
      const index = lessons.value.findIndex((lesson) => lesson.id === id)
      if (index !== -1) {
        lessons.value.splice(index, 1)
      }
    }
    openInfoWindow(`Урок #${id} успешно удален!`)
    dialogWindowVisible.value = !dialogWindowVisible.value
  } else if (action === 'cancel') {
    dialogWindowVisible.value = !dialogWindowVisible.value
  }
}

const searchByLesson = (data) => {
  console.log(data)
  const input = data.inp
  if (input) {
    dataTableLessons.value = lessons.value.filter((lesson) => lesson.name.includes(input))
  } else {
    dataTableLessons.value = lessons.value
  }
}

const getNamePlanTraining = (id) => {
  return planTrainingStore.plansTraining.filter((plan) => plan.value === id)[0].title
}

const openInfoWindow = (text) => {
  windowInfoText.value = text
  windowInfoVisible.value = true
  setTimeout(() => {
    windowInfoVisible.value = false
  }, 2000)
}
</script>

<template>
  <div class="groups">
    <VSidebar class=""/>
    <div class="groups-body">
      <VHeader/>
      <h2 class="groups-title">Уроки</h2>
      <VTable
          @switchAddWindow="switchAddLessonWindow"
          @deleteById="deleteLessonById"
          @searchByInpAndSelect="searchByLesson"
          :tableHead="tableHead"
          title="Данные уроков"
      >
        <transition-group name="list" tag="p">
          <tr
              class="table-body-row"
              v-for="lesson in dataTableLessons"
              :key="lesson.id"
          >
            <td>{{ lesson.id }}</td>
            <td>{{ lesson.name }}</td>
            <td>{{ getNamePlanTraining(lesson.id_plan) }}</td>
            <td>
              <VButton
                  @click="deleteLessonById('OpenWindow', lesson.id)"
                  size="icon"
                  variant="text"
              >
                <v-icon color="red">mdi-delete</v-icon>
              </VButton>
              <VButton
                  @click="switchEditLessonWindow(lesson)"
                  size="icon"
                  variant="text"
                  icon="mid-pencil"
              >
                <v-icon color="secondary">mdi-pencil</v-icon>
              </VButton>
            </td>
          </tr>
        </transition-group>
      </VTable>
    </div>
    <VModalWindow :is-open="addLessonWindowOpened">
      <div class="groups_addGroup">
        <h3 class="addGroup-title">Добавление урока</h3>
        <VInput
            v-model="formAddLesson.name"
            placeholder="Название урока"
            size="fullWidth"
        ></VInput>
        <VSelect
            v-model="formAddLesson.planTraining"
            :options="planTrainingStore.plansTraining"
            size="fullWidth"
            disabled-option="План обучения"
        ></VSelect>
        <div class="addGroup-actions">
          <VButton @click="switchAddLessonWindow" size="small" color="secondary"
          >отменить
          </VButton>
          <VButton @click="addLesson" size="small" color="primary"
          >добавить
          </VButton>
        </div>
      </div>
    </VModalWindow>
    <VModalWindow :is-open="editLessonWindowOpened">
      <div class="groups_editGroup">
        <h3 class="editGroup">Редактирование урока #{{ formEditLesson.id }}</h3>
        <VInput
            v-model="formEditLesson.name"
            size="fullWidth"
            placeholder="Название группы"
        ></VInput>
        <VSelect
            v-model="formEditLesson.planTraining"
            size="fullWidth"
            :options="planTrainingStore.plansTraining"
            disabled-option="План обучения"
        />
        <div class="editGroup-actions">
          <VButton @click="switchEditLessonWindow" size="small" color="secondary"
          >отменить
          </VButton>
          <VButton @click="editLesson" size="small" color="primary"
          >готово
          </VButton>
        </div>
      </div>
    </VModalWindow>
    <VModalWindow :is-open="dialogWindowVisible">
      <div class="groups_dialogDelete">
        <h3 class="dialogDelete-title">Вы уверены, что хотите удалить урок #{{ idLesson }}?</h3>
        <div class="dialogDelete-actions">
          <VButton @click="deleteLessonById('cancel', idLesson)" class="dialogDelete-cancel" size="small" color="primary"
          >нет
          </VButton>
          <VButton @click="deleteLessonById('delete', idLesson)" class="dialogDelete-accept" size="small" color="secondary"
          >да
          </VButton>
        </div>
      </div>
    </VModalWindow>
    <VInformationWindow :visible="windowInfoVisible">
      {{ windowInfoText }}
    </VInformationWindow>
  </div>
</template>

<style scoped>
@import 'LessonsView.scss';
</style>
