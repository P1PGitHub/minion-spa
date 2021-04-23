<template>
  <PageBody>
    <template v-slot:page-header v-if="project">
      <div class="md:flex items-center justify-between w-full">
        <h1
          v-if="project"
          class="tracking-wide text-2xl font-bold text-blue-700 dark:text-blue-300 mt-2"
        >
          {{ project.summary }}
        </h1>
        <div class="flex items-center justify-between space-x-2 mt-2 md:mt-0">
          <ButtonLink theme="hollow" spacing="sm" :link="{ name: 'projects' }">
            <inline-svg
              :src="require('@/assets/svg/arrows/arrow-left.svg')"
              class="h-6 w-6"
            />
          </ButtonLink>
          <ActionButton theme="hollow" spacing="sm" @click="refreshProject">
            <inline-svg
              :src="require('@/assets/svg/arrows/sync-ltr.svg')"
              class="h-6 w-6"
            />
          </ActionButton>
        </div>
      </div>
    </template>
    <template v-slot:page-content v-if="project">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-4">
          <SolidSection>
            <SectionHeader text="Task Progress" />
            <TaskProgressBar
              :totalTasks="project.total_tasks"
              :completedTasks="project.completed_tasks"
              :status="project.status"
            />
            <div
              class="md:flex items-center justify-between space-y-2 md:space-x-2 md:space-y-0"
            >
              <StatusDisplay
                :status="project.status"
                @click="openEditDescriptionModal"
              />
              <div
                class="bg-gray-200 dark:bg-gray-600 text-sm md:text-base rounded"
              >
                <button
                  @click="openEditDueDateModal"
                  class="flex items-center space-x-2 px-4 py-2"
                >
                  <inline-svg
                    :src="require('@/assets/svg/alerts/calendar-today.svg')"
                    class="h-4 w-4 md:h-6 md:w-6"
                  />
                  <span class="whitespace-nowrap">
                    {{ project.due_date | moment('MMM D, YYYY') }}
                  </span>
                </button>
              </div>
            </div>
          </SolidSection>
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Clients" />
              <ActionButton
                theme="hollow"
                spacing="sm"
                @click="openNewClientModal"
                >Add +</ActionButton
              >
            </div>
            <ClientListItem
              v-for="(client, index) in project.clients"
              :key="client.id"
              :client="client"
              :projectID="client.project"
              :hideBorder="index === project.clients.length - 1"
              @deleteClient="deleteClient"
            />
          </SolidSection>
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Team Members" />
              <ActionButton
                theme="hollow"
                spacing="sm"
                @click="openNewMemberModal"
                >Add +</ActionButton
              >
            </div>
            <div>
              <MemberListItem
                v-for="(member, index) in project.members"
                :key="member.id"
                :showBorder="index + 1 !== project.members.length"
                :member="member"
                @deleteMember="deleteMember"
              />
            </div>
          </SolidSection>
        </div>

        <div>
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Tasks" />
              <div class="flex items-center space-x-2">
                <ActionButton
                  theme="hollow"
                  spacing="sm"
                  @click="toggleTaskItems"
                  v-if="project.tasks.length"
                >
                  <inline-svg
                    :src="require('@/assets/svg/content/details-more.svg')"
                    class="h-6 w-6"
                  />
                </ActionButton>
                <ActionButton
                  theme="primary"
                  spacing="sm"
                  @click="openNewTaskModal"
                >
                  Add +
                </ActionButton>
              </div>
            </div>
            <TaskListItem
              v-for="(task, index) in project.tasks"
              :key="task.id"
              :task="task"
              :members="task.members"
              :hideProject="true"
              ref="tasks"
              @complete="project.completed_tasks++"
              @uncomplete="project.completed_tasks--"
              @delete="deleteTask(index)"
              @deleteMember="deleteTaskMember"
            />
            <HeaderAside v-if="!project.tasks.length">
              <p>No tasks have been added to this project yet.</p>
            </HeaderAside>
          </SolidSection>
        </div>

        <div class="space-y-4">
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Description" />
              <ActionButton
                theme="hollow"
                spacing="sm"
                @click="openEditDescriptionModal"
              >
                <inline-svg
                  :src="require('@/assets/svg/design/edit.svg')"
                  class="h-6 w-6"
                />
                <span>Edit</span>
              </ActionButton>
            </div>

            <p class="whitespace-pre-wrap">{{ project.description }}</p>
          </SolidSection>
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Files & Resources" />
              <ActionButton
                theme="hollow"
                spacing="sm"
                @click="openFileUploadModal"
              >
                <inline-svg
                  :src="require('@/assets/svg/file/upload.svg')"
                  class="h-6 w-6"
                />
              </ActionButton>
            </div>
            <FileListItem
              :file="file"
              v-for="(file, index) in files"
              :key="file.name"
              @deleteFile="deleteFile(index)"
            />
            <div class="flex justify-between px-2 mt-4" v-if="files.length">
              <ActionButton theme="hollow" @click="decrementFilesPage"
                ><inline-svg
                  :src="require('@/assets/svg/arrows/arrow-left.svg')"
                  class="h-6 w-6"
              /></ActionButton>
              <div class="flex items-center justify-center px-2">
                {{ filesPageNumber }} / {{ filesMaxPage }}
              </div>
              <ActionButton theme="hollow" @click="incrementFilesPage">
                <inline-svg
                  :src="require('@/assets/svg/arrows/arrow-right.svg')"
                  class="h-6 w-6"
                />
              </ActionButton>
            </div>
            <HeaderAside v-else>No files found for this project.</HeaderAside>
          </SolidSection>
        </div>

        <div>
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Updates" />
              <div class="flex items-center space-x-2">
                <ActionButton
                  theme="hollow"
                  spacing="sm"
                  @click="refreshUpdates"
                >
                  <inline-svg
                    :src="require('@/assets/svg/arrows/sync-ltr.svg')"
                    class="h-6 w-6"
                    :class="{ 'animate-spin': loadingUpdates }"
                  />
                </ActionButton>
                <ActionButton
                  theme="hollow"
                  spacing="sm"
                  @click="toggleUpdateItems"
                >
                  <inline-svg
                    :src="require('@/assets/svg/content/details-more.svg')"
                    class="h-6 w-6"
                  />
                </ActionButton>
                <ActionButton
                  theme="hollow"
                  spacing="sm"
                  @click="openNewUpdateModal"
                >
                  Add +
                </ActionButton>
              </div>
            </div>
            <div>
              <UpdateListItem
                v-for="(update, index) in filteredUpdates"
                :key="update.id"
                :update="update"
                :hideMessage="hideUpdateMessage"
                :hideProject="true"
                :hideBorder="index + 1 == filteredUpdates.length"
              />
              <div class="flex justify-between px-2 mt-4">
                <ActionButton theme="hollow" @click="decrementUpdatePage"
                  ><inline-svg
                    :src="require('@/assets/svg/arrows/arrow-left.svg')"
                    class="h-6 w-6"
                /></ActionButton>
                <div class="flex items-center justify-center px-2">
                  {{ updatePageNumber }} / {{ updateMaxPage }}
                </div>
                <ActionButton theme="hollow" @click="incrementUpdatePage">
                  <inline-svg
                    :src="require('@/assets/svg/arrows/arrow-right.svg')"
                    class="h-6 w-6"
                  />
                </ActionButton>
              </div>
            </div>
          </SolidSection>
        </div>
      </div>
    </template>
    <template v-slot:modals v-if="project">
      <NewTaskModal
        ref="newTaskModal"
        :subtitle="project.summary"
        :projectID="project.id"
        v-model="newTask"
        @addTask="addTask"
      />
      <NewUpdateModal
        ref="newUpdateModal"
        :subtitle="project.summary"
        :projectID="project.id"
        v-model="newUpdate"
        @addUpdate="addUpdate"
      />
      <EditDescriptionModal
        ref="editDescriptionModal"
        :subtitle="project.summary"
        :projectID="project.id"
        :initialDescription="project.description"
        :initialStatus="project.status"
        :initialSummary="project.summary"
        @save="saveProjectDetails"
      />
      <NewClientModal
        ref="newClientModal"
        :subtitle="project.summary"
        :projectID="project.id"
        @addClient="addClient"
        v-model="newClient"
      />
      <NewMemberModal
        ref="newMemberModal"
        :subtitle="project.summary"
        :currentMembers="project.members"
        :projectID="project.id"
        @addMember="addMember"
        v-model="newMember"
      />
      <EditDueDateModal
        ref="editDueDateModal"
        :subtitle="project.summary"
        :currentDueDate="project.due_date"
        @save="saveDueDate"
      />
      <FileUploadModal
        :projectID="project.id"
        ref="fileUploadModal"
        @updateFiles="getFiles"
      />
    </template>
  </PageBody>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import ButtonLink from '@/components/ui/buttonLink'
import ClientListItem from '@/components/ui/listItems/clientListItem'
import EditDescriptionModal from '@/components/ui/modals/editDescriptionModal'
import EditDueDateModal from '@/components/ui/modals/editDueDateModal'
import FileUploadModal from '@/components/ui/modals/projectFileUploadModal'
import HeaderAside from '@/components/ui/headerAside'
import Loading from '@/components/common/loading'
import MemberListItem from '@/components/ui/listItems/memberListItem'
import Modal from '@/components/ui/modal'
import NewClientModal from '@/components/ui/modals/newClientModal'
import NewMemberModal from '@/components/ui/modals/newMemberModal'
import NewTaskModal from '@/components/ui/modals/newTaskModal'
import NewUpdateModal from '@/components/ui/modals/newUpdateModal'
import PageBody from '@/components/ui/pageBody'
import SectionHeader from '@/components/ui/sectionHeader'
import SolidSection from '@/components/ui/solidSection'
import StatusDisplay from '@/components/ui/statusDisplay'
import TaskListItem from '@/components/ui/listItems/taskListItem'
import TaskProgressBar from '@/components/ui/taskProgressBar'
import UpdateListItem from '@/components/ui/listItems/updateListItem'

import FileListItem from '@/components/ui/listItems/fileListItem'

import moment from 'moment'

export default {
  name: 'ProjectView',
  middleware: ['auth'],
  head: {
    title: 'Project View - Minion',
  },
  components: {
    ActionButton,
    ButtonLink,
    ClientListItem,
    EditDescriptionModal,
    EditDueDateModal,
    FileListItem,
    FileUploadModal,
    HeaderAside,
    Loading,
    MemberListItem,
    Modal,
    NewClientModal,
    NewMemberModal,
    NewTaskModal,
    NewUpdateModal,
    PageBody,
    SectionHeader,
    SolidSection,
    StatusDisplay,
    TaskListItem,
    TaskProgressBar,
    UpdateListItem,
  },
  data() {
    return {
      loading: false,
      loadingUpdates: false,
      project: null,
      files: [],
      newClient: {
        client_id: null,
        client_name: '',
        primary: false,
        contact_name: '',
        contact_phone: '',
        contact_email: '',
      },
      newMember: {
        account: null,
        message: '',
      },
      newTask: {
        title: '',
        message: '',
        completed: false,
        members: [],
      },
      newUpdate: {
        title: '',
        message: '',
        status: 'INFO',
      },
      hideUpdateMessage: true,
      filesPageNumber: 1,
      updatePageNumber: 1,
    }
  },
  computed: {
    updateMaxPage() {
      if (this.project.updates.length) {
        return Math.ceil(this.project.updates.length / 10)
      } else {
        return 1
      }
    },
    filesMaxPage() {
      if (this.files.length) {
        return Math.ceil(this.files.length / 5)
      } else {
        return 1
      }
    },
    filteredUpdates() {
      return this.project.updates.slice(
        10 * (this.updatePageNumber - 1),
        10 * this.updatePageNumber
      )
    },
    filteredFiles() {
      return this.files.slice(
        5 * (this.filesPageNumber - 1),
        5 * this.filesPageNumber
      )
    },
  },
  methods: {
    addClient(client) {
      if (client.primary) {
        this.project.clients.forEach((client) => (client.primary = false))
        this.project.clients.unshift(client)
      } else {
        this.project.clients.push(client)
      }
    },
    addMember(member) {
      this.project.members.push(member)
    },
    addTask(task) {
      this.project.tasks.push(task)
      this.project.total_tasks++
      if (task.completed) {
        this.project.completed_tasks++
      }
    },
    addUpdate(update) {
      this.project.updates.unshift(update)
    },
    decrementUpdatePage() {
      if (this.updatePageNumber > 1) {
        this.updatePageNumber--
      }
    },
    decrementFilesPage() {
      if (this.filesPageNumber > 1) {
        this.filesPageNumber--
      }
    },
    deleteClient(id) {
      this.project.clients = this.project.clients.filter(
        (client) => client.id !== id
      )
    },
    async deleteFile(index) {
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: `Are you sure you want to delete file '${this.files[index].name}' and remove it from this project?`,
      })
      this.$root.$once('modalClose', async (choice) => {
        if (!choice) {
          return
        }
        let ref = `${this.$store.state.team.team.slug}/projects/${this.project.id}/files/${this.files[index].name}`
        let fileRef = this.$fireStorage.ref().child(ref)
        try {
          await fileRef.delete()
          this.$store.dispatch('api/post', {
            url: `/projects/${this.project.id}/updates/`,
            data: {
              title: `${
                this.$store.state.account.account.first_name
              } ${this.$store.state.account.account.last_name.substring(
                0,
                1
              )} has deleted file '${
                this.files[index].name
              }' and removed it from the project.`,
              project: this.project.id,
              status: 'REMARK',
            },
          })
          this.$root.$emit('showToast', {
            text: 'The file has been deleted and removed from this project.',
            type: 'success',
          })
          this.files.splice(index, 1)
        } catch {
          this.$root.$emit('showToast', {
            text: 'Something went wrong with deleting that file.',
            type: 'error',
          })
        }
      })
    },
    deleteMember(id) {
      this.project.members = this.project.members.filter(
        (member) => member.id !== id
      )
    },
    deleteTask(index) {
      let deletedTasks = this.project.tasks.splice(index, 1)
      if (deletedTasks[0].completed) {
        this.project.completed_tasks--
      }
      this.project.total_tasks--
    },
    deleteTaskMember(args) {
      let taskIndex = this.project.tasks.findIndex(
        (task) => task.id === args.taskID
      )
      this.project.tasks[taskIndex].members.splice(args.memberIndex, 1)
    },
    async getFiles() {
      this.files = []
      let storageRef = `${this.$store.state.team.team.slug}/projects/${this.project.id}/files/`
      let fileRefs = await this.$fireStorage.ref().child(storageRef).listAll()
      for (const ref of fileRefs.items) {
        this.files.push({
          name: ref.name,
          meta: await ref.getMetadata(),
          download: await ref.getDownloadURL(),
        })
      }
    },
    incrementUpdatePage() {
      if (this.updatePageNumber < this.updateMaxPage) {
        this.updatePageNumber++
      }
    },
    incrementFilesPage() {
      if (this.filesPageNumber < this.filesMaxPage) {
        this.filesPageNumber++
      }
    },
    openEditDescriptionModal() {
      this.$refs.editDescriptionModal.open()
    },
    openEditDueDateModal() {
      this.$refs.editDueDateModal.open()
    },
    openFileUploadModal() {
      this.$refs.fileUploadModal.open()
    },
    openNewClientModal() {
      this.$refs.newClientModal.open()
    },
    openNewMemberModal() {
      this.$refs.newMemberModal.open()
    },
    openNewTaskModal() {
      this.$refs.newTaskModal.open()
    },
    openNewUpdateModal() {
      this.$refs.newUpdateModal.open()
    },
    async refreshProject() {
      this.$root.$emit('showLoading')
      this.project = await this.$store.dispatch(
        'api/get',
        `/projects/${this.$route.params.id}/`
      )
      this.project.due_date = moment(this.project.due_date).utc().toDate()
      this.$root.$emit('hideLoading')
    },
    async refreshUpdates() {
      this.loadingUpdates = true
      this.project.updates = await this.$store.dispatch(
        'api/get',
        `/projects/${this.project.id}/updates/`
      )
      this.loadingUpdates = false
    },
    async saveDueDate(dueDate) {
      this.project.due_date = dueDate
      await this.$store.dispatch('api/put', {
        url: `/projects/${this.project.id}/`,
        data: {
          summary: this.project.summary,
          description: this.project.description,
          due_date: this.project.due_date,
          status: this.project.status,
          active: this.project.active,
          team: this.project.team,
        },
      })
      this.$refs.editDueDateModal.reset()
      this.$refs.editDueDateModal.close()
    },
    async saveProjectDetails(details) {
      this.project.description = details.description
      this.project.summary = details.summary
      this.project.status = details.status
      await this.$store.dispatch('api/put', {
        url: `/projects/${this.project.id}/`,
        data: {
          summary: this.project.summary,
          description: this.project.description,
          due_date: this.project.due_date,
          status: this.project.status,
          active: this.project.active,
          team: this.project.team,
        },
      })
      this.$refs.editDescriptionModal.reset()
      this.$refs.editDescriptionModal.close()
    },
    toggleTaskItems() {
      let openStatus = false
      this.$refs.tasks.forEach((task) => {
        openStatus = openStatus || task.isOpen
      })
      this.$refs.tasks.forEach((task) => {
        task.setOpen(!openStatus)
      })
    },
    toggleUpdateItems() {
      this.hideUpdateMessage = !this.hideUpdateMessage
    },
  },

  async created() {
    this.$root.$emit('showLoading')
    this.project = await this.$store.dispatch(
      'api/get',
      `/projects/${this.$route.params.id}/`
    )
    this.project.due_date = moment(this.project.due_date).utc().toDate()
    this.$root.$emit('hideLoading')

    this.getFiles()
  },
}
</script>
