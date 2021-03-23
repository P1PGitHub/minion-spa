<template>
  <div
    class="md:w-1/2 py-2"
    :class="{ 'md:pr-2': index % 2 == 0, 'md:pl-2': index % 2 == 1 }"
  >
    <div
      class="relative w-full bg-white border border-blue-600 rounded shadow-lg dark:bg-gray-800"
    >
      <div class="p-4 space-y-2 w-full">
        <h3 class="text-xl font-semibold text-blue-700 dark:text-blue-400">
          {{ dateRange.start | moment('MMM DD, YYYY') }}
        </h3>
        <v-date-picker
          color="blue"
          :is-dark="$colorMode.value == 'dark'"
          :popover="{ visibility: 'click' }"
          title-position="left"
          is-range
          mode="datetime"
          :minute-increment="5"
          v-model="dateRange"
        >
          <template v-slot="{ inputValue, inputEvents }">
            <div class="mt-2 flex items-center space-x-2">
              <input
                type="text"
                class="form-input w-1/2 bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                :id="'search-date-range-start' + `-${index}`"
                :name="'search-date-range-start' + `-${index}`"
                :value="inputValue.start"
                v-on="inputEvents.start"
              />
              <inline-svg
                :src="require('@/assets/svg/arrows/arrow-right.svg')"
                class="h-6 w-auto text-gray-700 dark:text-gray-200"
              />
              <input
                type="text"
                class="form-input w-1/2 bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                :id="'search-date-range-end' + `-${index}`"
                :name="'search-date-range-end' + `-${index}`"
                :value="inputValue.end"
                v-on="inputEvents.end"
              />
            </div>
          </template>
        </v-date-picker>
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
                >
                  {{ member.last_name }}, {{ member.first_name }}
                </option>
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
export default {
  name: 'TimeRecordEntry',
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
      dateRange: {
        start: this.value.start,
        end: this.value.end,
      },
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
        end: this.dateRange.end,
        start: this.dateRange.start,
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
