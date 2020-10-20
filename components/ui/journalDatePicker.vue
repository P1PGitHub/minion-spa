<template>
  <div
    class="space-y-4 flex flex-col items-center md:items-start"
    v-show="show"
  >
    <div>
      <v-date-picker
        color="blue"
        :is-dark="$colorMode.value == 'dark'"
        is-inline
        :max-date="new Date()"
        mode="range"
        title-position="left"
        v-model="dateRange"
        ref="vDatePicker"
      />
    </div>
    <div class="w-full max-w-sm flex items-center space-x-2">
      <ActionButton spacing="sm" theme="hollow" @click="decrementDates"
        >&lt;</ActionButton
      >
      <ActionButton spacing="sm" theme="hollow">
        <inline-svg
          :src="require('@/assets/svg/other/eye.svg')"
          fill="fill-current"
          class="h-6 w-auto text-gray-600"
          @click="toggle"
        ></inline-svg>
      </ActionButton>
      <ActionButton spacing="sm" theme="hollow">
        <inline-svg
          :src="require('@/assets/svg/alerts/calendar-today.svg')"
          fill="fill-current"
          class="h-6 w-auto text-gray-800 dark:text-white"
          @click="setToday"
        />
      </ActionButton>
      <ActionButton spacing="sm" class="w-full" @click="update">
        Open
      </ActionButton>
      <ActionButton spacing="sm" theme="hollow" @click="incrementDates"
        >&gt;</ActionButton
      >
    </div>
  </div>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import moment from 'moment'
export default {
  name: 'JournalDatePicker',
  components: {
    ActionButton,
  },
  data() {
    let showPickerLS = true
    if (process.browser) {
      showPickerLS = localStorage.getItem('showPicker')
      if (showPickerLS == null) {
        showPickerLS = true
      } else {
        showPickerLS = showPickerLS == 'true'
      }
    }
    return {
      dateRange: {
        start: moment()
          .set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
          .toDate(),
        end: moment()
          .set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
          .toDate(),
      },
      show: showPickerLS,
    }
  },
  methods: {
    decrementDates() {
      this.dateRange = {
        end: moment(this.dateRange.end).subtract({ days: 1 }).toDate(),
        start: moment(this.dateRange.start).subtract({ days: 1 }).toDate(),
      }
      this.$emit('update', this.dateRange)
    },
    incrementDates() {
      let changeStatus = false
      if (
        moment(this.dateRange.start).add({ days: 1 }).toDate() <=
        moment()
          .set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
          .toDate()
      ) {
        this.dateRange.start = moment(this.dateRange.start)
          .add({ days: 1 })
          .toDate()
        changeStatus = true
      }
      if (
        moment(this.dateRange.end).add({ days: 1 }).toDate() <=
        moment()
          .set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
          .toDate()
      ) {
        this.dateRange.end = moment(this.dateRange.end)
          .add({ days: 1 })
          .toDate()
        changeStatus = true
      }
      console.log(changeStatus)
      if (changeStatus) {
        this.$emit('update', this.dateRange)
      }
    },
    setToday() {
      this.dateRange = {
        start: moment()
          .set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
          .toDate(),
        end: moment()
          .set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
          .toDate(),
      }
      this.$emit('update', this.dateRange)
    },
    update() {
      this.$emit('update', this.dateRange)
    },
    toggle() {
      this.show = !this.show
      localStorage.setItem('showPicker', this.show)
      if (!this.show) {
        this.$emit('hide')
      }
    },
  },
}
</script>

<style>
</style>