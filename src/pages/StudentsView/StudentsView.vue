<script setup>
import VSidebar from '@/components/VSidebar/VSidebar.vue'
import VTable from '@/components/VTable/VTable.vue'
import VHeader from '@/components/VHeader/VHeader.vue'
import VInput from '@/components/UI/VInput/VInput.vue'
import VModalWindow from '@/components/UI/VModalWindow/VModalWindow.vue'
import VButton from '@/components/UI/VButton/VButton.vue'
import VSelect from '@/components/UI/VSelect/VSelect.vue'
import studentService from '@/API/studentService.js'
import {useStudentStore} from '@/store/studentStore.js'
import {ref} from 'vue'
import {useGroupStore} from '@/store/groupStore.js'
import VInformationWindow from "@/components/VInformationWindow/VInformationWindow.vue";

const studentStore = useStudentStore()
await studentStore.getStudents()

const groupStore = useGroupStore()

const addStudentWindowOpened = ref(false)
const editStudentWindowOpened = ref(false)
const dataStudent = ref({
  fio: '',
  address: '',
  group: '',
  phone: '',
})
const dataStudentForEdit = ref({
  id: '',
  fio: '',
  address: '',
  group: '',
  phone: '',
})
const tableHead = [
  {
    id: 1,
    name: 'ID',
  },
  {
    id: 2,
    name: 'ФИО',
  },
  {
    id: 3,
    name: 'адрес',
  },
  {
    id: 4,
    name: 'группа',
  },
  {
    id: 5,
    name: 'телефон',
  },
]
const students = ref(studentStore.students)
const dataTableStudent = ref(students.value)
const windowInfoText = ref('')
const windowInfoVisible = ref(false)
const dialogWindowVisible = ref(false)
const idStudent = ref()

const switchAddStudentWindow = () => {
  addStudentWindowOpened.value = !addStudentWindowOpened.value
}

const switchEditStudentWindow = (data) => {
  editStudentWindowOpened.value = !editStudentWindowOpened.value
  if (editStudentWindowOpened.value) {
    dataStudentForEdit.value = {
      id: data.id,
      fio: data.fio,
      address: data.address,
      group: data.group,
      phone: data.phone,
    }
  }
}

const addStudent = async () => {
  const reqAddStudent = await studentService.addStudent(dataStudent.value)
  if (!reqAddStudent.errno) {
    dataTableStudent.value.push(
        {
          id: reqAddStudent.insertId,
          fio: dataStudent.value.fio,
          address: dataStudent.value.address,
          group: dataStudent.value.group,
          phone: dataStudent.value.phone,
        })
    switchAddStudentWindow()
    openInfoWindow(`Студент #${dataStudent.value.fio} успешно добавлен!`)
  }
}

const editStudent = async () => {
  const reqEditStudent = studentService.editStudent(
      dataStudentForEdit.value,
      dataStudentForEdit.value.id
  )
  if (!reqEditStudent.errno) {
    const index = dataTableStudent.value.findIndex(
        (student) => student.id === dataStudentForEdit.value.id
    )
    dataTableStudent.value[index].fio = dataStudentForEdit.value.fio
    dataTableStudent.value[index].address = dataStudentForEdit.value.address
    dataTableStudent.value[index].group = dataStudentForEdit.value.group
    dataTableStudent.value[index].phone = dataStudentForEdit.value.phone
    openInfoWindow('Изменения прошли успешно!')
    switchEditStudentWindow()
  }
}

const deleteById = async (action, id) => {
  if (action === 'delete') {
    const reqDeleteStudent = await studentService.deleteStudentById(id)
    if (!reqDeleteStudent.errno) {
      const index = dataTableStudent.value.findIndex(
          (student) => student.id === id
      )
      if (index !== -1) {
        dataTableStudent.value.splice(index, 1)
      }
      dialogWindowVisible.value = !dialogWindowVisible.value
      openInfoWindow(`Студент #${id} успешно удален!`)
    }
  } else if (action === 'cancel') {
    dialogWindowVisible.value = !dialogWindowVisible.value
  }
}

const getNameGroup = (id) => {
  const groups = groupStore.groups
  return groups.filter((group) => group.value === id)[0].title
}

const tableSearch = (data) => {
  const input = data.inp
  const select = data.select

  if (input && select) {
    dataTableStudent.value = students.value.filter((obj) =>
        obj.fio.includes(data.inp) && obj.group === data.select)
  } else if (input) {
    dataTableStudent.value = students.value.filter((obj) =>
        obj.fio.includes(input))
  } else if (select) {
    dataTableStudent.value = students.value.filter((obj) =>
        obj.group === select)
  } else {
    dataTableStudent.value = students.value
  }
}

const openInfoWindow = (text) => {
  windowInfoText.value = text
  windowInfoVisible.value = true
  setTimeout(() => {
    windowInfoVisible.value = false
  }, 2000)
}

const openDialogWindow = (id) => {
  idStudent.value = id
  dialogWindowVisible.value = !dialogWindowVisible.value
}

await groupStore.getGroups()
</script>

<template>
  <div class="students">
    <VSidebar/>
    <div class="students-body">
      <VHeader/>
      <h2 class="students-title">Студенты</h2>
      <VTable
          @switchAddWindow="switchAddStudentWindow"
          @deleteById="deleteById"
          @search-by-inp-and-select="tableSearch"
          :options="groupStore.groups"
          :tableHead="tableHead"
          title="Данные студентов"
          placeholder-search="Поиск по ФИО"
      >
        <transition-group name="list" tag="p">
          <tr
              class="table-body-row"
              v-for="data in dataTableStudent"
              :key="data.id"
          >
            <td>{{ data.id }}</td>
            <td>{{ data.fio }}</td>
            <td>{{ data.address }}</td>
            <td>{{ getNameGroup(data.group) }}</td>
            <td>{{ data.phone }}</td>
            <td>
              <VButton @click="openDialogWindow(data.id)" size="icon" variant="text">
                <v-icon color="red">mdi-delete</v-icon>
              </VButton>
              <VButton
                  @click="switchEditStudentWindow(data)"
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
    <VModalWindow :is-open="addStudentWindowOpened">
      <div class="students_addStudent">
        <h3 class="addStudent-title">Добавление студента</h3>
        <div class="addStudent-form">
          <VInput
              v-model="dataStudent.fio"
              size="fullWidth"
              placeholder="ФИО"
          ></VInput>
          <VInput
              v-model="dataStudent.address"
              size="fullWidth"
              placeholder="Адрес"
          ></VInput>
          <VSelect
              v-model="dataStudent.group"
              size="fullWidth"
              :options="groupStore.groups"
              disabled-option="Группа"
          ></VSelect>
          <VInput
              v-model="dataStudent.phone"
              size="fullWidth"
              placeholder="Телефон"
          ></VInput>
          <div class="addStudent-actions">
            <v-button
                @click="switchAddStudentWindow()"
                size="small"
                color="secondary"
            >закрыть
            </v-button>
            <v-button
                @click="addStudent()"
                class="button-add"
                size="small"
                color="primary"
            >добавить
            </v-button>
          </div>
        </div>
      </div>
    </VModalWindow>
    <!--    Редактирование-->
    <VModalWindow :is-open="editStudentWindowOpened">
      <div class="students_addStudent">
        <h3 class="addStudent-title">
          Редактирование студента #{{ dataStudentForEdit.id }}
        </h3>
        <div class="addStudent-form">
          <VInput
              v-model="dataStudentForEdit.fio"
              size="fullWidth"
              placeholder="ФИО"
          ></VInput>
          <VInput
              v-model="dataStudentForEdit.address"
              size="fullWidth"
              placeholder="Адрес"
          ></VInput>
          <VSelect
              v-model="dataStudentForEdit.group"
              size="fullWidth"
              :options="groupStore.groups"
              disabled-option="Группа"
          ></VSelect>
          <VInput
              v-model="dataStudentForEdit.phone"
              size="fullWidth"
              placeholder="Телефон"
          ></VInput>
          <div class="addStudent-actions">
            <v-button
                @click="switchEditStudentWindow()"
                size="small"
                color="secondary"
            >закрыть
            </v-button>
            <v-button
                @click="editStudent()"
                class="button-add"
                size="small"
                color="primary"
            >готово
            </v-button>
          </div>
        </div>
      </div>
    </VModalWindow>
    <VInformationWindow :visible="windowInfoVisible">
      {{ windowInfoText }}
    </VInformationWindow>
    <VModalWindow :is-open="dialogWindowVisible">
      <div class="groups_dialogDelete">
        <h3 class="dialogDelete-title">Вы уверены, что хотите удалить студента #{{ idStudent }}?</h3>
        <div class="dialogDelete-actions">
          <VButton @click="deleteById('cancel', idStudent)" class="dialogDelete-cancel" size="small" color="primary"
          >нет
          </VButton>
          <VButton @click="deleteById('delete', idStudent)" class="dialogDelete-accept" size="small" color="secondary"
          >да
          </VButton>
        </div>
      </div>
    </VModalWindow>
  </div>
</template>

<style scoped>
@import 'StudentsView.scss';
</style>