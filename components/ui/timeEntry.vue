<template>
  <div
    class="p-2 rounded relative space-y-2"
    :class="{
      'bg-gray-100 dark:bg-gray-700 border-2 border-green-300 dark:border-green-300':
        entry.resolved,
      'bg-gray-100 dark:bg-gray-700 border-2 border-orange-300 dark:border-orange-300': !entry.resolved,
    }"
  >
    <div>
      <p
        class="font-bold"
        :class="{
          'text-green-700 dark:text-green-400': entry.resolved,
          'text-orange-700 dark:text-orange-400': !entry.resolved,
        }"
        v-if="displayDate"
      >
        {{ entry.start | moment('ddd MMM D, YYYY') }}
      </p>
      <div>
        <div class="flex space-x-2">
          <p class="w-12 font-bold text-right">
            {{ entry.start | moment('HH:mm') }}
          </p>
          <p>
            {{ entry.description }}
          </p>
        </div>
        <div class="flex space-x-2">
          <p class="w-12 font-bold text-right">
            {{ entry.end | moment('HH:mm') }}
          </p>
          <p>
            {{ entry.company_name }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="view">
      <div class="flex items-center justify-between">
        <p>{{ entry.client_name }}</p>
        <p>{{ entry.company_name }}</p>
      </div>
      <div>
        <!-- prettier-ignore -->
        <p
          class="whitespace-pre-wrap mt-2 pt-2"
          :class="{
            'border-t border-dashed border-green-700 dark:border-green-300':
              entry.resolved,
            'border-t border-dashed border-orange-700 dark:border-orange-300': !entry.resolved,
          }"
        >{{ entry.summary }}</p>
      </div>
    </div>

    <div>
      <div
        class="absolute top-0 right-0 -mt-2 -mr-2 flex items-center space-x-2"
        v-if="editButton"
      >
        <button
          class="bg-orange-300 text-orange-700 rounded-full h-6 w-6 flex items-center justify-center"
          v-if="!entry.resolved"
          @click="resolve"
        >
          &check;
        </button>
        <button
          class="rounded-full h-6 w-6 flex items-center justify-center text-white italic"
          :class="{
            'bg-green-300': entry.resolved,
            'bg-orange-300': !entry.resolved,
          }"
          type="button"
          @click="toggle"
        >
          <inline-svg
            :src="require('@/assets/svg/buttons/more.svg')"
            fill="fill-current"
            class="h-6 w-auto"
            :class="{
              'text-green-700': entry.resolved,
              'text-orange-700': !entry.resolved,
            }"
          ></inline-svg>
        </button>

        <div
          class="absolute rounded-lg bg-white dark:bg-gray-800 top-0 right-0 shadow w-32 mt-8 z-30"
          :class="{
            'border-2 border-green-300 dark:border-green-300': entry.resolved,
            'border-2 border-orange-300 dark:border-orange-300': !entry.resolved,
          }"
          v-if="contextOpen"
        >
          <button
            class="w-full px-2 py-1 flex items-center space-x-2"
            :class="{
              'border-b border-green-300 hover:text-green-600': entry.resolved,
              'border-b border-orange-300 hover:text-orange-600': !entry.resolved,
            }"
            @click="edit"
          >
            <inline-svg
              :src="require('@/assets/svg/design/edit.svg')"
              fill="fill-current"
              class="h-4 w-auto"
            ></inline-svg>
            <span>Edit</span>
          </button>
          <button
            class="w-full px-2 py-1 flex items-center space-x-2"
            :class="{
              'border-b border-green-300 hover:text-green-600': entry.resolved,
              'border-b border-orange-300 hover:text-orange-600': !entry.resolved,
            }"
            @click="toggleView"
          >
            <inline-svg
              :src="require('@/assets/svg/other/eye.svg')"
              fill="fill-current"
              class="h-4 w-auto"
            ></inline-svg>
            <span v-if="view">Hide</span>
            <span v-else>View</span>
          </button>
          <button
            class="w-full px-2 py-1 flex items-center space-x-2"
            :class="{
              'border-b border-green-300 hover:text-green-600': entry.resolved,
              'border-b border-orange-300 hover:text-orange-600': !entry.resolved,
            }"
            @click="deleteLog"
          >
            <inline-svg
              :src="require('@/assets/svg/content/trash.svg')"
              fill="fill-current"
              class="h-4 w-auto"
            ></inline-svg>
            <span>Delete</span>
          </button>
          <button
            type="button"
            class="w-full text-left px-2 py-1 flex items-center space-x-2"
            :class="{
              'hover:text-green-600': entry.resolved,
              'hover:text-orange-600': !entry.resolved,
            }"
            @click="close"
          >
            <inline-svg
              :src="require('@/assets/svg/other/close.svg')"
              class="h-4 w-auto"
            ></inline-svg>
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TimeEntry',
  props: {
    displayDate: {
      type: Boolean,
      required: false,
      default: false,
    },
    editButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    entry: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      contextOpen: false,
      view: false,
    }
  },
  methods: {
    close() {
      this.contextOpen = false
    },
    closeDetails() {
      this.view = false
    },
    async deleteLog() {
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: 'Are you sure you want to delete this journal entry?',
      })
      this.$root.$once('modalClose', async (choice) => {
        if (choice) {
          try {
            await this.$store.dispatch(
              'api/delete',
              `/logs/entry/id/${this.entry.id}/`
            )
            this.close()
            this.$root.$emit('showToast', {
              text: `Journal Entry for ${this.entry.company_name} has been removed.`,
              type: 'success',
            })
            this.$root.$emit('updateEntries')
          } catch (err) {
            console.log(err)
            this.$root.$emit('showToast', {
              text: `Uh oh, something isn't right here.`,
              type: 'error',
            })
            this.close()
          }
        }
      })
    },
    edit() {
      this.$root.$emit('editJournalEntry', this.entry.id)
      this.close()
    },
    open() {
      this.contextOpen = true
    },
    openDetails() {
      this.view = true
    },
    async resolve() {
      try {
        let fullEntry = await this.$store.dispatch(
          'api/get',
          `/logs/entry/id/${this.entry.id}/`
        )
        await this.$store.dispatch('api/put', {
          url: `/logs/entry/id/${this.entry.id}/`,
          data: {
            ...fullEntry,
            resolved: true,
          },
        })
        this.$root.$emit('showToast', {
          text: `Journal Entry for ${this.entry.company_name} has been resolved.`,
          type: 'success',
        })
        this.$root.$emit('updateEntries')
      } catch (err) {
        console.log(err)
        this.$root.$emit('showToast', {
          text: `Uh oh, something isn't right here.`,
          type: 'error',
        })
      }
    },
    toggle() {
      this.contextOpen = !this.contextOpen
    },
    toggleView() {
      this.view = !this.view
      this.close()
    },
  },
}
</script>
