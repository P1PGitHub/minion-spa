<template>
  <div
    class="p-2 rounded space-y-2 relative"
    :class="{
      'bg-green-100 dark:bg-green-700 border border-green-300 dark:border-green-700':
        entry.resolved,
      'bg-orange-100 dark:bg-orange-700 border border-orange-300 dark:border-orange-700': !entry.resolved,
    }"
  >
    <div class="flex space-x-2">
      <div
        class="text-right font-bold"
        :class="{
          'text-green-800 dark:text-white': entry.resolved,
          'text-orange-800 dark:text-white': !entry.resolved,
        }"
      >
        <p>{{ entry.start | moment('HH:mm') }}</p>
        <p>{{ entry.end | moment('HH:mm') }}</p>
      </div>
      <div>
        <p class="whitespace-no-wrap">{{ entry.description }}</p>
        <p class="whitespace-no-wrap">{{ entry.company_name }}</p>
      </div>
    </div>
    <div>
      <div
        class="absolute top-0 right-0 -mt-2 -mr-2 flex items-center space-x-2"
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
          <div
            class="px-2 py-1 flex items-center space-x-2"
            :class="{
              'border-b border-green-300 hover:text-green-600': entry.resolved,
              'border-b border-orange-300 hover:text-orange-600': !entry.resolved,
            }"
          >
            <inline-svg
              :src="require('@/assets/svg/design/edit.svg')"
              fill="fill-current"
              class="h-4 w-auto"
            ></inline-svg>
            <span>Edit</span>
          </div>
          <div
            class="px-2 py-1 flex items-center space-x-2"
            :class="{
              'border-b border-green-300 hover:text-green-600': entry.resolved,
              'border-b border-orange-300 hover:text-orange-600': !entry.resolved,
            }"
          >
            <inline-svg
              :src="require('@/assets/svg/other/eye.svg')"
              fill="fill-current"
              class="h-4 w-auto"
            ></inline-svg>
            <span>View</span>
          </div>
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
    entry: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      contextOpen: false,
    }
  },
  methods: {
    close() {
      this.contextOpen = false
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
    open() {
      this.contextOpen = true
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
  },
}
</script>
