<template>
  <div class="w-full relative">
    <div class="relative">
      <input
        type="text"
        class="rounded w-full pl-10 bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        @click="show"
        v-if="this.hour !== null"
        v-model="time"
        :id="nameID"
        :name="nameID"
      />
      <button class="absolute top-0 bottom-0 left-0 px-2" @click="setNow">
        <inline-svg
          :src="require('@/assets/svg/other/time.svg')"
          fill="fill-current"
          class="h-6 w-auto text-gray-800 dark:text-white"
        ></inline-svg>
      </button>
    </div>
    <button
      type="button"
      class="fixed inset-0 block w-full h-full z-20 cursor-default"
      @click="hide"
      tabindex="-1"
      v-if="showDropdown"
    ></button>
    <div
      class="absolute mt-2 bg-white border border-blue-600 rounded shadow w-48 z-30"
      :class="{ 'left-0': side == 'left', 'right-0': side == 'right' }"
      v-show="showDropdown"
    >
      <div
        class="flex items-start text-white border-b bg-blue-600 border-blue-600"
      >
        <div class="w-1/2 px-2 py-1 text-center">Hour</div>
        <div class="w-1/2 px-2 py-1 text-center">Minute</div>
      </div>
      <div class="flex items-start text-gray-600">
        <div
          class="w-1/2 h-32 overflow-y-scroll scrolling-touch border-r border-t border-blue-600 bg-gray-200 rounded-bl hover:bg-white dark:bg-gray-700 dark:text-white"
        >
          <button
            v-for="hourOpt in Array(24).keys()"
            :key="hourOpt"
            class="block px-6 py-1 text-right w-full"
            :class="{
              'bg-blue-600 text-white': hourOpt == hour,
              'hover:bg-blue-200 dark:hover:bg-blue-600': hourOpt !== hour,
            }"
            @click="hour = hourOpt"
          >
            {{ hourOpt }}
          </button>
        </div>
        <div
          class="w-1/2 h-32 overflow-y-scroll scrolling-touch bg-gray-200 rounded-br border-t border-blue-600 hover:bg-white dark:bg-gray-700 dark:text-white"
        >
          <button
            v-for="minuteOpt in Array(60).keys()"
            :key="minuteOpt"
            class="block px-6 py-1 text-right w-full"
            :class="{
              'bg-blue-600 text-white': minuteOpt == minute,
              'hover:bg-blue-200 dark:hover:bg-blue-600': minuteOpt !== minute,
            }"
            @click="setMinute(minuteOpt)"
          >
            {{ minuteOpt }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TimePicker',
  props: {
    nameID: {
      type: String,
      required: false,
      default: 'timepicker-' + String(Math.floor(Math.random() * 100)),
    },
    side: {
      tpye: String,
      required: false,
      default: 'left',
    },
    value: {
      type: String,
      requied: true,
    },
  },
  data() {
    return {
      showDropdown: false,
      hour: this.value.split(':')[0],
      minute: this.value.split(':')[1],
    }
  },
  computed: {
    time: function () {
      let timeString =
        String(this.hour).padStart(2, '0') +
        ':' +
        String(this.minute).padStart(2, '0')
      this.$emit('input', timeString)
      return timeString
    },
  },
  methods: {
    hide() {
      this.showDropdown = false
    },
    reset(time) {
      this.hour = time.split(':')[0]
      this.minute = time.split(':')[1]
    },
    setMinute(minuteOpt) {
      this.minute = minuteOpt
      this.hide()
    },
    setNow() {
      let now = moment().format('HH:mm')
      this.reset(now)
    },
    show() {
      this.showDropdown = true
    },
  },
}
</script>
