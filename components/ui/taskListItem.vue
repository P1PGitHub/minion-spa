<template>
  <div
    class="border rounded border-gray-200 dark:border-gray-700 p-2 space-y-2"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          class="form-checkbox h-8 w-8 rounded-full border border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
        />
        <h3 class="font-semibold">{{ task.title }}</h3>
      </div>

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
    <div class="space-y-2" v-show="isOpen">
      <p class="whitespace-pre-wrap">{{ task.message }}</p>
      <div
        class="flex items-center justify-between py-1 px-2 rounded bg-gray-200 dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-200 text-sm"
      >
        <p>{{ project.summary }}</p>
        <button>
          <inline-svg
            :src="require('@/assets/svg/buttons/more.svg')"
            class="h-6 w-6 text-gray-500"
          />
        </button>
      </div>
      <div
        class="pt-2 border-t border-gray-200 flex items-center justify-center text-gray-700 dark:text-gray-200 space-x-2"
      >
        <button
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 p-1 flex justify-center rounded"
        >
          <inline-svg
            :src="require('@/assets/svg/buttons/bell.svg')"
            class="h-6 w-6"
          />
        </button>
        <button
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 p-1 flex justify-center rounded"
        >
          <inline-svg
            :src="require('@/assets/svg/other/user-list.svg')"
            class="h-6 w-6"
          />
        </button>
        <button
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 p-1 flex justify-center rounded"
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
</template>

<script>
export default {
  name: 'TaskListItem',
  props: {
    task: {
      type: Object,
      required: true,
    },
    project: {
      type: Object,
      required: true,
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
    }
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
          let response = this.$store
            .dispatch('api/delete', `/projects/tasks/${this.task.id}/`)
            .then(() => {
              this.reloadTasks()
            })
        }
      })
    },
    reloadTasks() {
      this.$emit('reload')
    },
    toggle() {
      this.isOpen = !this.isOpen
    },
  },
}
</script>

<style></style>
