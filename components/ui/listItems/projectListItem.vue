<template>
  <div class="p-2 border border-gray-400 dark:border-gray-600 rounded relative">
    <h1 class="font-semibold mb-2">{{ project.summary }}</h1>
    <div class="flex">
      <div
        class="text-sm flex items-center space-x-2 text-gray-600 dark:text-gray-400"
        :class="{
          'text-red-700 dark:text-red-400': overdue,
        }"
      >
        <inline-svg
          :src="require('@/assets/svg/other/time.svg')"
          class="h-4 w-4"
        />

        <p class="leading-none">
          {{ project.due_date | moment('MMM D, YYYY') }}
        </p>
      </div>
    </div>
    <div v-show="showDetails" class="mt-2 space-y-2">
      <div v-if="project.total_tasks" class="space-y-2">
        <div class="w-full rounded bg-gray-200 dark:bg-gray-700 h-4">
          <div
            class="bg-blue-400 dark:bg-blue-600 rounded h-4"
            :style="`width: ${
              (project.completed_tasks / project.total_tasks) * 100
            }%;`"
          ></div>
        </div>
        <div class="flex items-center justify-between text-sm">
          <p>
            {{ project.completed_tasks }} / {{ project.total_tasks }} tasks
            complete
          </p>
          <p>
            {{
              ((project.completed_tasks / project.total_tasks) * 100).toFixed(
                2
              )
            }}%
          </p>
        </div>
      </div>
      <p class="whitespace-pre-wrap">{{ project.description }}</p>

      <div class="flex items-center justify-between">
        <p>{{ project.status }}</p>
        <button class="p-1 flex items-center space-x-2" @click="toggleDetails">
          <inline-svg
            :src="require('@/assets/svg/other/close.svg')"
            class="h-4 w-4"
          />
          <span>Close</span>
        </button>
      </div>
    </div>
    <button
      class="rounded-full bg-gray-400 dark:bg-gray-600 absolute right-0 top-0 z-10 -mt-2 -mr-2"
      @click="toggle"
    >
      <inline-svg
        :src="require('@/assets/svg/buttons/more.svg')"
        class="h-6 w-6"
      />
    </button>
    <div
      class="absolute top-0 right-0 mt-6 -mr-2 z-20 border border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 shadow rounded text-lg md:text-base"
      v-if="contextOpen"
    >
      <nuxt-link
        class="w-full px-2 py-1 flex items-center dark:hover:text-blue-400 hover:text-blue-700 space-x-2 border-b border-gray-400 dark:border-gray-600"
        :to="{ name: 'projects-id', params: { id: project.id } }"
      >
        <inline-svg
          :src="require('@/assets/svg/other/eye.svg')"
          class="h-4 w-4"
        />
        <span>View</span>
      </nuxt-link>
      <button
        class="w-full px-2 py-1 flex items-center dark:hover:text-blue-400 hover:text-blue-700 space-x-2 border-b border-gray-400 dark:border-gray-600"
        @click="toggleDetails"
      >
        <inline-svg
          :src="require('@/assets/svg/content/details-more.svg')"
          class="h-4 w-4"
        />
        <span>Details</span>
      </button>
      <button
        class="w-full px-2 py-1 flex items-center dark:hover:text-blue-400 hover:text-blue-700 space-x-2 border-b border-gray-400 dark:border-gray-600"
      >
        <inline-svg
          :src="require('@/assets/svg/design/edit.svg')"
          class="h-4 w-4"
        />
        <span>Edit</span>
      </button>
      <button
        class="w-full px-2 py-1 flex items-center dark:hover:text-blue-400 hover:text-blue-700 space-x-2 border-b border-gray-400 dark:border-gray-600"
        v-if="$store.state.account.account.report_admin"
        @click="deleteProject"
      >
        <inline-svg
          :src="require('@/assets/svg/content/trash.svg')"
          class="h-4 w-4"
        />
        <span>Delete</span>
      </button>
      <button
        class="w-full px-2 py-1 flex items-center dark:hover:text-blue-400 hover:text-blue-700 space-x-2"
        @click="close"
      >
        <inline-svg
          :src="require('@/assets/svg/other/close.svg')"
          class="h-4 w-4"
        />
        <span>Close</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectListItem',
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      contextOpen: false,
      showDetails: false,
      overdue: new Date(this.project.due_date) < new Date(),
    }
  },
  methods: {
    deleteProject() {
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: 'Are you sure you want to delete this project?',
      })
      this.$root.$once('modalClose', (choice) => {
        if (choice) {
          this.$store
            .dispatch('api/delete', `/projects/${this.project.id}/`)
            .then(() => {
              this.reloadProjects()
            })
        }
      })
    },
    open() {
      this.contextOpen = true
    },
    close() {
      this.contextOpen = false
    },
    reloadProjects() {
      this.$emit('reload')
    },
    toggle() {
      this.contextOpen = !this.contextOpen
    },
    toggleDetails() {
      this.showDetails = !this.showDetails
      this.close()
    },
  },
}
</script>
