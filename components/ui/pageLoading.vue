<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-25 z-50"
    :class="{ block: show, hidden: !show }"
  >
    <div
      class="space-y-4 bg-white dark:bg-gray-800 flex flex-col items-center justify-center rounded shadow-lg w-32 h-32 border-2 border-blue-400"
    >
      <img
        src="@/assets/svg/other/spinner-two-theme.svg"
        alt="Loading Icon"
        class="animate-spin h-12 w-12"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageLoading',
  data() {
    return {
      show: false,
    }
  },
  created() {
    this.$root.$on('showLoading', () => {
      this.show = true
    })
    this.$root.$on('hideLoading', () => {
      this.show = false
    })
  },
}
</script>
