<template>
  <Modal
    title="New Task"
    :subheading="subtitle"
    :icon="require('@/assets/svg/other/check.svg')"
    ref="modal"
    @close="tabIndex = -1"
    @open="tabIndex = 0"
  >
    <form class="space-y-4" @submit.prevent>
      <fieldset class="space-y-2">
        <label for="task-title" class="block">Title</label>
        <input
          type="text"
          name="task-title"
          id="task-title"
          placeholder="Setup Ingenicos"
          v-model="value.title"
          :tabindex="tabIndex"
          ref="taskTitle"
        />
      </fieldset>
      <fieldset class="space-y-2">
        <label for="task-message" class="block">Message</label>
        <textarea
          name="task-message"
          id="task-message"
          rows="5"
          placeholder="Setup for 7 terminals, don't forget to test."
          class="w-full"
          v-model="value.message"
          :tabindex="tabIndex"
        ></textarea>
      </fieldset>
      <fieldset class="space-y-2">
        <label for="task-members" class="block">Members</label>
        <select
          name="task-members"
          id="task-members"
          multiple
          class="multiselect"
          v-model="value.members"
          :tabindex="tabIndex"
        >
          <option
            :value="member.id"
            v-for="member in $store.state.team.members"
            :key="member.id"
          >
            {{ member.last_name }}, {{ member.first_name }}
          </option>
        </select>
      </fieldset>
      <fieldset
        class="flex items-center space-x-2 p-2 border bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-600 rounded"
      >
        <input
          type="checkbox"
          name="task-completed"
          id="task-completed"
          class="rounded-full dark:bg-gray-400"
          v-model="value.completed"
          :tabindex="tabIndex"
        />
        <label for="task-completed">Completed?</label>
      </fieldset>
      <div class="flex items-center space-x-2">
        <ActionButton theme="hollow" @click="reset" :tabindex="tabIndex">
          <inline-svg
            :src="require('@/assets/svg/arrows/sync.svg')"
            class="h-6 w-6 text-gray-800 dark:text-white"
          />
        </ActionButton>
        <ActionButton
          theme="primary"
          class="w-full"
          @click="postTask"
          :tabindex="tabIndex"
          >Add Task</ActionButton
        >
      </div>
    </form>
    <div
      class="absolute inset-0 z-50 flex items-center justify-center bg-opacity-25 bg-gray-400"
      v-if="isLoading"
    >
      <Loading size="xl" />
    </div>
  </Modal>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import Loading from '@/components/common/loading'
import Modal from '@/components/ui/modal'
export default {
  name: 'NewTaskModal',
  components: {
    ActionButton,
    Loading,
    Modal,
  },
  props: {
    projectID: {
      type: Number,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      tabIndex: -1,
    }
  },
  watch: {
    tabIndex() {
      if (this.tabIndex === 0) {
        setTimeout(() => {
          this.$refs.taskTitle.focus()
        }, 25)
      }
    },
    value() {
      this.$emit('input', this.value)
    },
  },
  methods: {
    close() {
      this.$refs.modal.close()
    },
    open() {
      this.$refs.modal.open()
    },
    async postTask() {
      if (this.isLoading || !this.validate()) {
        return
      }
      this.isLoading = true
      const newTask = await this.$store.dispatch('api/post', {
        url: `/projects/${this.projectID}/tasks/`,
        data: {
          title: this.value.title,
          message: this.value.message,
          completed: this.value.completed,
          project: this.projectID,
        },
      })
      const newMembers = []
      for (const member of this.value.members) {
        newMembers.push(
          await this.$store.dispatch('api/post', {
            url: `/projects/tasks/${newTask.id}/members/`,
            data: {
              task: newTask.id,
              account: member,
            },
          })
        )
      }

      this.isLoading = false
      this.$emit('addTask', { ...newTask, members: newMembers })
      this.close()
      this.reset()
    },
    reset() {
      this.value.title = ''
      this.value.message = ''
      this.value.completed = false
      this.value.members = []
    },
    validate() {
      return this.title !== ''
    },
  },
}
</script>
+
