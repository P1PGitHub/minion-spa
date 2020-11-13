<template>
  <div
    class="flex items-center justify-center fixed bottom-0 mx-auto z-30 px-4 mb-4 transform duration-300 ease-in-out"
    :class="{ 'translate-y-48': !show }"
  >
    <div
      class="relative bg-white dark:bg-gray-800 dark:text-white border-2 rounded shadow-lg p-4"
      :class="{
        'border-blue-500': message.type == 'info',
        'border-teal-300': message.type == 'success',
        'border-red-400': message.type == 'error',
      }"
      v-if="message"
    >
      <div class="flex items-start max-w-lg space-x-4">
        <div
          class="p-1 mt-1 rounded-full"
          :class="{
            'bg-blue-500': message.type == 'info',
            'bg-teal-300': message.type == 'success',
            'bg-red-400': message.type == 'error',
          }"
        >
          <inline-svg
            :src="require('@/assets/svg/alerts/bolt.svg')"
            fill="fill-current"
            class="h-4 w-auto text-white dark:text-gray-800"
          ></inline-svg>
        </div>
        <p class="text-lg">{{ message.text }}</p>
      </div>
      <div class="flex pl-10 mt-2" v-if="message.action">
        <button
          class="px-4 py-1 rounded"
          :class="{
            'bg-blue-300 hover:bg-blue-600 hover:text-white dark:bg-blue-500 dark:text-white dark:hover:bg-blue-700':
              message.type == 'info',
            'bg-teal-300 hover:bg-teal-600 hover:text-white dark:bg-teal-500 dark:text-white dark:hover:bg-teal-700':
              message.type == 'success',
            'bg-red-300 hover:bg-red-600 hover:text-white dark:bg-red-500 dark:text-white dark:hover:bg-red-700':
              message.type == 'error',
          }"
          @click="pushActionLink"
        >
          {{ message.action.text }}
        </button>
      </div>
      <button
        type="button"
        class="bg-red-200 border border-red-400 p-1 rounded absolute top-0 right-0 -mt-4 -mr-4"
        @click="close"
      >
        <inline-svg
          :src="require('@/assets/svg/other/close-r.svg')"
          fill="fill-current"
          class="h-6 w-auto text-black"
        ></inline-svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: null,
      messages: [],
      show: false,
      timeout: null,
    }
  },
  methods: {
    open() {
      if (!this.show) {
        this.message = this.messages.shift()
        this.show = true
        this.timeout = setTimeout(() => {
          this.close()
        }, 5000)
      }
    },
    close() {
      this.show = false
      clearTimeout(this.timeout)
      setTimeout(() => {
        if (this.messages.length) {
          this.open()
        } else {
          this.message = null
        }
      }, 500)
    },
    pushActionLink() {
      if (this.message.action) {
        this.$router.push(this.message.action.link)
        this.close()
      }
    },
  },
  created() {
    this.$root.$on('showToast', (message) => {
      this.messages.push(message)
      this.open()
    })
  },
}
</script>
