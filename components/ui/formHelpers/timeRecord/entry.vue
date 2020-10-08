<template>
  <div
    class="md:w-1/2 py-2"
    :class="{ 'md:pr-2': index % 2 == 0, 'md:pl-2': index % 2 == 1 }"
  >
    <div
      class="relative w-full bg-white border border-blue-600 rounded shadow dark:bg-gray-800"
    >
      <div class="bg-blue-600 w-full flex items-center justify-center">
        <v-date-picker
          :popover="{ placement: 'bottom', visibility: 'click' }"
          :value="value.start"
          v-model="value.start"
          @input="update"
          :is-dark="$colorMode.value == 'dark'"
        >
          <button
            type="button"
            class="flex items-center justify-center space-x-2 p-2 bg-blue-700 text-white text-center"
          >
            <h3>{{ value.start | moment('MMM DD, YYYY') }}</h3>
            <span
              ><img
                src="@/assets/svg/alerts/calendar-dates-white.svg"
                alt="Calendar Icon"
            /></span>
          </button>
        </v-date-picker>
      </div>

      <div class="p-4 space-y-2 w-full">
        <div class="space-x-2 flex">
          <div class="w-1/2">
            <label :for="'startTime' + '-' + index" class="block w-full"
              >Start Time</label
            >
            <TimePicker
              v-model="startTime"
              :nameID="'startTime' + '-' + index"
            />
          </div>
          <div class="w-1/2">
            <label :for="'endTime' + '-' + index" class="block">End Time</label>
            <TimePicker
              v-model="endTime"
              :nameID="'endTime' + '-' + index"
              :side="'right'"
            />
          </div>
        </div>
        <div>
          <div class="space-y-2 md:flex md:space-x-2 md:space-y-0">
            <div class="md:w-1/2">
              <label for="shift-employees" class="block">Employees</label>
              <select
                name="shift-employees"
                id="shift-employees"
                multiple
                class="form-multiselect bg-gray-100 w-full h-32 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                v-model="value.users"
                @click="update"
              >
                <option
                  :value="member.id"
                  v-for="member in $store.state.team.members"
                  :key="member.id"
                  >{{ member.last_name }}, {{ member.first_name }}</option
                >
              </select>
            </div>
            <div class="md:w-1/2">
              <label for="shift-start-time" class="block">Notes</label>
              <textarea
                name="shift-start-time"
                id="shift-start-time"
                class="form-textarea bg-gray-100 w-full h-32 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="AM Shift"
                v-model="value.notes"
                @input="update"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="bg-red-200 border border-red-400 p-1 rounded absolute top-0 right-0 -mt-2 -mr-2"
        @click="remove()"
      >
        <inline-svg
          :src="require('@/assets/svg/other/close-r.svg')"
          fill="fill-current"
          class="h-4 w-auto text-red-800"
        ></inline-svg>
      </button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import TimePicker from '@/components/ui/timePicker'
export default {
  name: 'TimeRecordEntry',
  components: {
    TimePicker,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      startTime: moment(this.value.start).format('H:mm'),
      endTime: moment(this.value.end).format('H:mm'),
    }
  },
  watch: {
    endTime: function () {
      this.$emit('input', this.record)
    },
    startTime: function () {
      this.$emit('input', this.record)
    },
  },
  computed: {
    record: function () {
      let recordObj = {
        end: moment(this.value.start)
          .set({
            hours: this.endTime.split(':')[0],
            minutes: this.endTime.split(':')[1],
            seconds: 0,
          })
          .toDate(),
        start: moment(this.value.start)
          .set({
            hours: this.startTime.split(':')[0],
            minutes: this.startTime.split(':')[1],
            seconds: 0,
          })
          .toDate(),
        users: this.value.users,
        report: this.value.report,
        notes: this.value.notes,
      }
      return recordObj
    },
  },
  methods: {
    update(val) {
      this.$emit('input', this.record)
    },
    remove() {
      this.$emit('remove', this.index)
    },
  },
}
</script>
