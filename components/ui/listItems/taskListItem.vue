<template>
  <div
    class="border rounded border-gray-200 dark:border-gray-700 p-2 space-y-2"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          class="h-8 w-8 rounded-full border border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
          :disabled="disableInput"
          v-model="task.completed"
        />
        <h3 class="font-semibold">{{ task.title }}</h3>
      </div>

      <div class="flex items-center space-x-2">
        <button
          class="rounded border border-gray-400 dark:border-gray-600 h-8 w-8 p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          @click="toggle"
        >
          <inline-svg
            :src="require('@/assets/svg/buttons/more.svg')"
            class="text-gray-700 dark:text-white h-6 w-6"
          />
        </button>
      </div>
    </div>
    <div class="space-y-2" v-show="isOpen">
      <div
        class="text-black dark:text-white bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded p-2 space-y-2"
        v-if="task.message"
      >
        <p class="whitespace-pre-wrap">{{ task.message }}</p>
      </div>
      <div
        class="bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded p-2 space-y-2"
        v-if="members.length"
      >
        <div
          class="flex items-center justify-between"
          v-for="(member, index) in members"
          :key="member.id"
        >
          <div class="flex items-center space-x-2">
            <inline-svg :src="require('@/assets/svg/other/user.svg')" />
            <p class="font-semibold">
              {{ member.account.first_name }}
              {{ member.account.last_name.substring(0, 1) }}
            </p>
          </div>
          <button
            class="p-1 flex items-center justify-center text-gray-400 dark:text-gray-600 hover:text-red-700 dark:hover:text-red-400"
            @click="deleteMember(index)"
          >
            <inline-svg
              class="h-4 w-4"
              :src="require('@/assets/svg/content/trash.svg')"
            />
          </button>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <div
          class="w-full rounded bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-200 text-sm"
          v-if="!hideProject && project"
        >
          <nuxt-link
            class="flex items-center justify-between py-1 px-2"
            :to="{ name: 'projects-id', params: { id: project.id } }"
          >
            <p class="overflow-x-hidden whitespace-no-wrap">
              {{ project.summary }}
            </p>

            <inline-svg
              :src="require('@/assets/svg/content/clipboard.svg')"
              class="h-6 w-6 text-gray-500"
            />
          </nuxt-link>
        </div>
      </div>
      <div class="flex items-center justify-end" v-if="hideProject">
        <div
          class="flex items-center space-x-2 border border-gray-400 rounded p-1"
        >
          <button
            class="p-1 flex items-center justify-center text-gray-400 dark:text-gray-600 hover:text-red-700 dark:hover:text-red-400"
            @click="deleteTask"
          >
            <inline-svg
              :src="require('@/assets/svg/content/trash.svg')"
              class="h-6 w-6"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskListItem',
  props: {
    hideProject: {
      type: Boolean,
      default: false,
    },
    task: {
      type: Object,
      required: true,
    },
    project: {
      type: Object,
      required: false,
      default: () => null,
    },
    members: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      isOpen: false,
      disableInput: false,
    }
  },
  watch: {
    'task.completed': async function (newVal) {
      this.disableInput = true
      if (newVal) {
        await this.$store.dispatch('api/put', {
          url: `/projects/tasks/${this.task.id}/complete/`,
          data: {},
        })
        this.$emit('complete')
      } else {
        await this.$store.dispatch('api/put', {
          url: `/projects/tasks/${this.task.id}/uncomplete/`,
          data: {},
        })
        this.$emit('uncomplete')
      }
      this.disableInput = false
      this.$emit('reload')
    },
  },
  methods: {
    async deleteTask() {
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: 'Are you sure you want to delete this task?',
      })
      this.$root.$once('modalClose', (choice) => {
        if (choice) {
          this.$store
            .dispatch('api/delete', `/projects/tasks/${this.task.id}/`)
            .then(() => {
              this.$emit('delete')
              this.reloadTasks()
            })
        }
      })
    },
    async deleteMember(memberIndex) {
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: `Are you sure you want to remove ${
          this.members[memberIndex].account.first_name
        } ${this.members[memberIndex].account.last_name.substring(
          0,
          1
        )} from this task?`,
      })
      this.$root.$once('modalClose', (choice) => {
        if (choice) {
          this.$store
            .dispatch(
              'api/delete',
              `/projects/task_members/${this.members[memberIndex].id}/`
            )
            .then(() => {
              this.$emit('deleteMember', { taskID: this.task.id, memberIndex })
            })
        }
      })
    },
    reloadTasks() {
      this.$emit('reload')
    },
    setOpen(val) {
      this.isOpen = val
    },
    toggle() {
      this.isOpen = !this.isOpen
    },
  },
}
</script>

<style></style>
