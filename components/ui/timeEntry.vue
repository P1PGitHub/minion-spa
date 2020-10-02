<template>
  <div
    class="p-2 rounded space-y-2 relative"
    :class="{
      'bg-green-100 border border-green-300': entry.resolved,
      'bg-orange-100 border border-orange-300': !entry.resolved,
    }"
  >
    <div class="flex space-x-2">
      <div
        class="text-right font-bold"
        :class="{
          'text-green-800 ': entry.resolved,
          'text-orange-800': !entry.resolved,
        }"
      >
        <p>{{ startTime }}</p>
        <p>{{ endTime }}</p>
      </div>
      <div>
        <p>{{ entry.description }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between text-sm">
      <p>{{ entry.client_name }}</p>
      <p>{{ entry.company_name }}</p>
    </div>
    <div>
      <div class="absolute top-0 right-0 -mt-2 -mr-2">
        <button
          class="rounded-full h-6 w-6 flex items-center justify-center text-white italic"
          :class="{
            'bg-green-300': entry.resolved,
            'bg-orange-300': !entry.resolved,
          }"
          type="button"
          @click="toggle"
        >
          <img src="@/assets/svg/buttons/more-alt.svg" alt="More Info Icon" />
        </button>
        <div
          class="absolute rounded-lg bg-white top-0 left-0 shadow w-32 -ml-34"
          :class="{
            'border border-green-300': entry.resolved,
            'border border-orange-300': !entry.resolved,
          }"
          v-if="contextOpen"
        >
          <div
            class="px-2 py-1"
            :class="{
              'border-b border-green-300 hover:text-green-600': entry.resolved,
              'border-b border-orange-300 hover:text-orange-600': !entry.resolved,
            }"
          >
            Edit
          </div>
          <div
            class="px-2 py-1"
            :class="{
              'border-b border-green-300 hover:text-green-600': entry.resolved,
              'border-b border-orange-300 hover:text-orange-600': !entry.resolved,
            }"
          >
            View
          </div>
          <button
            type="button"
            class="w-full text-left px-2 py-1"
            :class="{
              'hover:text-green-600': entry.resolved,
              'hover:text-orange-600': !entry.resolved,
            }"
            @click="close"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <div v-if="!entry.resolved">
      <button
        class="absolute bottom-0 right-0 -mb-2 -mr-2 bg-orange-300 rounded-full h-6 w-6 flex items-center justify-center"
      >
        &check;
      </button>
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
      endTime: moment(this.entry.end).format('H:mm'),
      startTime: moment(this.entry.start).format('H:mm'),
      contextOpen: false,
    }
  },
  methods: {
    toggle() {
      this.contextOpen = !this.contextOpen
    },
    close() {
      this.contextOpen = false
    },
    open() {
      this.contextOpen = true
    },
  },
}
</script>

<style></style>
