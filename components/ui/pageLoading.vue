<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50"
    :class="{ block: show, hidden: !show }"
  >
    <div class="space-y-4">
      <h1 class="text-xl font-bold text-blue-700">Bello!</h1>
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
