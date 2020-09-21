<template>
  <div>
    <div class="flex items-center space-x-4">
      <ActionButton spacing="sm" @click="add">Add +</ActionButton>
      <SectionHeader text="Time Tracking" />
    </div>

    <div class="space-y-4 md:flex md:flex-wrap md:items-start md:space-y-0">
      <TimeEntry
        v-for="(record, index) in value"
        :key="index"
        :index="index"
        v-model="value[index]"
        @input="update"
        @remove="remove"
      />
    </div>
    <HeaderAside v-if="value.length == 0"
      >No entries to display. Please add a new time entry before attempting to
      save.</HeaderAside
    >
  </div>
</template>

<script>
import moment from 'moment'
import ActionButton from '@/components/ui/actionButton'
import HeaderAside from '@/components/ui/headerAside'
import SectionHeader from '@/components/ui/sectionHeader'
import TimeEntry from '@/components/ui/formHelpers/timeRecord/entry'
export default {
  name: 'TimeRecordsFormHelper',
  components: {
    ActionButton,
    HeaderAside,
    SectionHeader,
    TimeEntry,
  },
  props: {
    reportID: {
      type: String,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  methods: {
    add() {
      this.value.push({
        end: new Date(),
        start: moment().subtract(1, 'hours').toDate(),
        report: this.reportID,
        users: [],
      })
      this.update()
    },
    remove(index) {
      this.value.splice(index, 1)
      this.update()
    },
    update() {
      this.$emit('input', this.value)
    },
    validate() {
      if (!this.value.length) {
        this.$root.$emit('showToast', {
          text:
            'Please include at least one time tracking entry for this csqr draft.',
          type: 'error',
        })
        return false
      } else {
        return true
      }
    },
  },
}
</script>
