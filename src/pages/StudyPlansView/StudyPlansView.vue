<script setup>
import VSidebar from '@/components/VSidebar/VSidebar.vue'
import VHeader from '@/components/VHeader/VHeader.vue'
import VTable from '@/components/VTable/VTable.vue'
import VButton from '@/components/UI/VButton/VButton.vue'
import VModalWindow from '@/components/UI/VModalWindow/VModalWindow.vue'
import VInput from '@/components/UI/VInput/VInput.vue'
import planTrainingService from '@/API/planTrainingService.js'
import {usePlanTrainingStore} from '@/store/planTrainingStore.js'
import {useLessonsStore} from '@/store/lessonsStore.js'
import {ref} from 'vue'
import studentService from "@/API/studentService.js";
import VInformationWindow from "@/components/VInformationWindow/VInformationWindow.vue";

const plansStore = usePlanTrainingStore()
await plansStore.getPlansTraining()
const lessonsStore = useLessonsStore()

const tableHeadPlans = [
  {
    id: 1,
    name: 'ID',
  },
  {
    id: 2,
    name: 'Наименование',
  },
  {
    id: 3,
    name: 'Уроки',
  },
]

const editWindowPlanOpened = ref(false)
const addWindowPlanOpened = ref(false)
const formEditPlan = ref({
  id: '',
  name: '',
  lessons: '',
})
const dataPlan = ref({
  name: ''
})
const windowInfoText = ref('')
const windowInfoVisible = ref(false)
const dialogWindowVisible = ref(false)
const idPlan = ref()
const plans = ref(plansStore.plansTraining)
const dataTablePlans = ref(plans.value)

const switchEditWindow = (data) => {
  editWindowPlanOpened.value = !editWindowPlanOpened.value
  if (editWindowPlanOpened.value) {
    formEditPlan.value = {
      id: data.value,
      name: data.title,
      lessons: getLessonsByPlanId(data.value),
    }
  }
  openInfoWindow('Изменения прошли успешно!')
}

const switchAddWindow = () => {
  addWindowPlanOpened.value = !addWindowPlanOpened.value
}

const deleteById = async (action, id) => {
  if (action === 'open') {
    dialogWindowVisible.value = !dialogWindowVisible.value
    idPlan.value = id
  } else if (action === 'cancel') {
    dialogWindowVisible.value = !dialogWindowVisible.value
    idPlan.value = ''
  } else if (action === 'delete') {
    const reqDeletePlanById = planTrainingService.deletePlanTrainingById(id)
    if (!reqDeletePlanById.errno) {
      const index = dataTablePlans.value.findIndex(
          (plan) => plan.value === id
      )
      if (index !== -1) {
        dataTablePlans.value.splice(index, 1)
      }
      dialogWindowVisible.value = !dialogWindowVisible.value
      openInfoWindow(`План #${id} успешно удален!`)
    }
  }
}

const getLessonsByPlanId = (idPlan) => {
  let lesson
  const lessons = lessonsStore.lessons.filter(
      (lesson) => lesson.id_plan === idPlan
  )
  if (lessons.length === 0) {
    return 'Отсутствуют'
  }
  let response = ''
  for (lesson of lessons) {
    response += `${lesson.name}, `
  }
  return response
}

const addPlan = async () => {
  const reqAddPlan = await planTrainingService.addPlanTraining(dataPlan.value)
  if (!reqAddPlan.errno) {
    dataTablePlans.value.push(
        {
          value: reqAddPlan.insertId,
          title: dataPlan.value.name
        })
    switchAddWindow()
    openInfoWindow(`План ${dataPlan.value.name} успешно добавлен!`)
  }
}

const searchByPlans = (data) => {
  const input = data.inp
  if (input) {
    dataTablePlans.value = plans.value.filter((plan) => plan.title.includes(input))
  } else if (input === ''){
    dataTablePlans.value = plans.value
  }
}

const openInfoWindow = (text) => {
  windowInfoText.value = text
  windowInfoVisible.value = true
  setTimeout(() => {
    windowInfoVisible.value = false
  }, 1500)
}
await lessonsStore.getLessons()
</script>

<template>
  <div class="plans">
    <VSidebar/>
    <div class="plans-body">
      <VHeader/>
      <h3 class="plans-title">Учебные планы</h3>
      <VTable
          @switchAddWindow="switchAddWindow"
          @searchByInpAndSelect="searchByPlans"
          :table-head="tableHeadPlans"
          title="Данные учебных планов"
      >
        <transition-group name="list" tag="p">
          <tr
              class="table-body-row"
              v-for="plan in dataTablePlans"
              :key="plan.value"
          >
            <td>{{ plan.value }}</td>
            <td>{{ plan.title }}</td>
            <td>{{ getLessonsByPlanId(plan.value) }}</td>
            <td>
              <VButton
                  @click="deleteById('open' ,plan.value)"
                  size="icon"
                  variant="text"
              >
                <v-icon color="red">mdi-delete</v-icon>
              </VButton>
              <VButton
                  @click="switchEditWindow(plan)"
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
    <VModalWindow :is-open="editWindowPlanOpened">
      <div class="plans_editPlan">
        <h3 class="editPlan-title">
          Редактирование плана #{{ formEditPlan.id }}
        </h3>
        <VInput
            v-model="formEditPlan.name"
            placeholder="Наименование"
            size="fullWidth"
        />
        <div class="editPlan-actions">
          <VButton @click="switchEditWindow" size="small" color="secondary"
          >отменить
          </VButton>
          <VButton size="small" color="primary">готово</VButton>
        </div>
      </div>
    </VModalWindow>
    <VModalWindow :is-open="addWindowPlanOpened">
      <div class="plans_addPlan">
        <h3 class="addPlan-title">Добавление плана</h3>
        <div class="addPlan-body">
          <VInput v-model="dataPlan.name" placeholder="Наименование" size="fullWidth"/>
          <div class="addPlan-actions">
            <VButton @click="switchAddWindow" size="small" color="secondary"
            >отменить
            </VButton>
            <VButton @click="addPlan" size="small" color="primary">добавить</VButton>
          </div>
        </div>
      </div>
    </VModalWindow>
    <VModalWindow :is-open="dialogWindowVisible">
      <div class="groups_dialogDelete">
        <h3 class="dialogDelete-title">Вы уверены, что хотите удалить план #{{ idPlan }}?</h3>
        <div class="dialogDelete-actions">
          <VButton @click="deleteById('cancel', idPlan)" class="dialogDelete-cancel" size="small" color="primary"
          >нет
          </VButton>
          <VButton @click="deleteById('delete', idPlan)" class="dialogDelete-accept" size="small" color="secondary"
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
@import 'StudyPlansView.scss';
</style>
