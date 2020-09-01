<template>
  <div
    class="fixed top-0 z-30 max-w-96 bg-white border-2 border-teal-300 rounded shadow-lg mt-4 mx-4 p-4 space-y-4 transform duration-300 ease-in-out"
    :class="{ '-translate-y-96': !show }"
  >
    <div class="flex items-center space-x-4">
      <div class="p-1 rounded-full bg-teal-300">
        <img src="@/assets/svg/alerts/bolt-white.svg" alt="alert icon" />
      </div>
      <h1 class="text-xl font-bold">Bello</h1>
    </div>
    <div>
      <p>{{ options.message }}</p>
    </div>
    <div class="flex items-center justify-center space-x-4">
      <button
        type="button"
        class="px-4 py-1 border border-teal-300 text-teal-700 rounded hover:bg-teal-300 hover:text-gray-800"
        @click="deny"
      >{{ options.denyText }}</button>
      <button
        type="button"
        class="px-4 py-1 bg-blue-500 border border-blue-500 text-white rounded hover:bg-blue-700 hover:border-blue-700"
        @click="allow"
      >{{ options.allowText }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  data() {
    return {
      options: {
        allowText: 'Yes',
        denyText: 'No',
        message: 'Are you sure you want to do this?',
      },
      show: false,
    }
  },
  methods: {
    allow() {
      this.show = false
      this.$root.$emit('modalClose', true)
    },
    deny() {
      this.show = false
      this.$root.$emit('modalClose', false)
    },
  },
  created() {
    this.$root.$on('showModal', (options) => {
      if (options) {
        this.options = options
      } else {
        this.options = {
          allowText: 'Yes',
          denyText: 'No',
          message: 'Are you sure you want to do this?',
        }
      }
      this.show = true
    })
    this.$root.$on('showModal', () => (this.show = true))
  },
}
</script>
