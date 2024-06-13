<script setup>
import VSidebar from '@/components/VSidebar/VSidebar.vue'
import VHeader from '@/components/VHeader/VHeader.vue'
import VTable from '@/components/VTable/VTable.vue'
import VButton from '@/components/UI/VButton/VButton.vue'
import VSelect from '@/components/UI/VSelect/VSelect.vue'
import VInput from '@/components/UI/VInput/VInput.vue'
import VModalWindow from '@/components/UI/VModalWindow/VModalWindow.vue'
import groupService from '@/API/groupService.js'
import {useGroupStore} from '@/store/groupStore.js'
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
    id: 3,
    name: 'План обучения',
  },
]
const groupsStore = useGroupStore()
const planTrainingStore = usePlanTrainingStore()
await planTrainingStore.getPlansTraining()
await groupsStore.getGroups()
const addGroupWindowOpened = ref(false)
const editGroupWindowOpened = ref(false)
const groups = ref(groupsStore.groups)
const dataTableGroup = ref(groups.value)

const formAddGroup = ref({
  name: '',
  planTraining: 1,
})

const formEditGroup = ref({
  id: '',
  name: '',
  planTraining: 1,
})
const windowInfoText = ref('')
const windowInfoVisible = ref(false)
const idGroup = ref('')
const dialogWindowVisible = ref(false)
const switchAddGroupWindow = () => {
  addGroupWindowOpened.value = !addGroupWindowOpened.value
}

const switchEditGroupWindow = (group) => {
  if (!editGroupWindowOpened.value) {
    formEditGroup.value = {
      id: group.value,
      name: group.title,
      planTraining: group.planTraining,
    }
  }
  editGroupWindowOpened.value = !editGroupWindowOpened.value
}

const addGroup = async () => {
  const reqAddGroup = await groupService.addGroup(formAddGroup.value)
  if (reqAddGroup.insertId) {
    const newGroup = {
      planTraining: formAddGroup.value.planTraining,
      title: formAddGroup.value.name,
      value: reqAddGroup.insertId,
    }
    groups.value.push(newGroup)
    formAddGroup.value = {
      name: '',
      planTraining: 1,
    }
    switchAddGroupWindow()
    openInfoWindow(`Группа ${newGroup.title} успешно добавлена!`)
  }
}

const editGroup = async () => {
  const reqEditGroup = await groupService.editGroup(
      formEditGroup.value,
      formEditGroup.value.id
  )
  if (reqEditGroup.insertId === 0) {
    const index = groups.value.findIndex(
        (obj) => obj.value === formEditGroup.value.id
    )
    groups.value[index].planTraining = formEditGroup.value.planTraining
    groups.value[index].title = formEditGroup.value.name
    groups.value[index].value = formEditGroup.value.id
  }
  openInfoWindow('Изменения прошли успешно!')
  editGroupWindowOpened.value = !editGroupWindowOpened.value
}

const deleteGroupById = async (action, id) => {
  if (action === 'OpenWindow') {
    dialogWindowVisible.value = !dialogWindowVisible.value
    idGroup.value = id
  } else if (action === 'delete') {
    const reqDeleteGroupById = await groupService.deleteGroupById(id)
    if (!reqDeleteGroupById.insertId) {
      const index = groups.value.findIndex((group) => group.value === id)
      if (index !== -1) {
        groups.value.splice(index, 1)
      }
    }
    openInfoWindow(`Группа #${id} успешно удалена!`)
    dialogWindowVisible.value = !dialogWindowVisible.value
  } else if (action === 'cancel') {
    dialogWindowVisible.value = !dialogWindowVisible.value
  }
}

const searchByGroup = (data) => {
  const input = data.inp
  if (input) {
    dataTableGroup.value = groups.value.filter((group) => group.title.includes(input))
  } else if (input === ''){
    dataTableGroup.value = groups.value
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
      <h2 class="groups-title">Группы</h2>
      <VTable
          @switchAddWindow="switchAddGroupWindow"
          @deleteById="deleteGroupById"
          @searchByInpAndSelect="searchByGroup"
          :tableHead="tableHead"
          title="Данные групп"
      >
        <transition-group name="list" tag="p">
          <tr
              class="table-body-row"
              v-for="group in dataTableGroup"
              :key="group.value"
          >
            <td>{{ group.value }}</td>
            <td>{{ group.title }}</td>
            <td>{{ getNamePlanTraining(group.planTraining) }}</td>
            <td>
              <VButton
                  @click="deleteGroupById('OpenWindow', group.value)"
                  size="icon"
                  variant="text"
              >
                <v-icon color="red">mdi-delete</v-icon>
              </VButton>
              <VButton
                  @click="switchEditGroupWindow(group)"
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
    <VModalWindow :is-open="addGroupWindowOpened">
      <div class="groups_addGroup">
        <h3 class="addGroup-title">Добавление группы</h3>
        <VInput
            v-model="formAddGroup.name"
            placeholder="Название группы"
            size="fullWidth"
        ></VInput>
        <VSelect
            v-model="formAddGroup.planTraining"
            :options="planTrainingStore.plansTraining"
            size="fullWidth"
            disabled-option="План обучения"
        ></VSelect>
        <div class="addGroup-actions">
          <VButton @click="switchAddGroupWindow" size="small" color="secondary"
          >отменить
          </VButton>
          <VButton @click="addGroup" size="small" color="primary"
          >добавить
          </VButton>
        </div>
      </div>
    </VModalWindow>
    <VModalWindow :is-open="editGroupWindowOpened">
      <div class="groups_editGroup">
        <h3 class="editGroup">Редактирование группы #{{ formEditGroup.id }}</h3>
        <VInput
            v-model="formEditGroup.name"
            size="fullWidth"
            placeholder="Название группы"
        ></VInput>
        <VSelect
            v-model="formEditGroup.planTraining"
            size="fullWidth"
            :options="planTrainingStore.plansTraining"
            disabled-option="План обучения"
        />
        <div class="editGroup-actions">
          <VButton @click="switchEditGroupWindow" size="small" color="secondary"
          >отменить
          </VButton>
          <VButton @click="editGroup" size="small" color="primary"
          >готово
          </VButton>
        </div>
      </div>
    </VModalWindow>
    <VModalWindow :is-open="dialogWindowVisible">
      <div class="groups_dialogDelete">
        <h3 class="dialogDelete-title">Вы уверены, что хотите удалить группу #{{ idGroup }}?</h3>
        <div class="dialogDelete-actions">
          <VButton @click="deleteGroupById('cancel', idGroup)" class="dialogDelete-cancel" size="small" color="primary"
          >нет
          </VButton>
          <VButton @click="deleteGroupById('delete', idGroup)" class="dialogDelete-accept" size="small" color="secondary"
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
@import 'GroupsView.scss';
</style>
