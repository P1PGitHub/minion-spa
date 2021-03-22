<template>
  <div class="fixed bottom-0 left-0 p-4 w-1/2 max-w-lg">
    <div
      class="relative bg-white dark:bg-gray-800 rounded border border-teal-300 shadow"
      v-if="data"
      v-show="!hide"
    >
      <h3 class="text-teal-700 dark:text-teal-300 font-bold tracking-wide px-2 py-1">{{ clientName }}</h3>
      <img :src="data" />
      <button
        class="p-1 absolute bottom-0 right-0 -mr-2 -mb-2 border border-red-300 bg-red-100 rounded"
        type="button"
        v-if="data"
        @click="clearData"
      >
        <img src="@/assets/svg/other/close-r.svg" alt="Saved Icon" class="w-8 h-8 text-red-800" />
      </button>
    </div>
    <button
      class="p-2 fixed bottom-0 left-0 ml-2 mb-2 border border-teal-300 bg-teal-100 rounded"
      type="button"
      v-if="data"
      @click="togglePreview"
    >
      <img src="@/assets/svg/file/file.svg" alt="Saved Icon" class="h-8 w-8 text-grenn-800" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'SignaturePreview',
  props: {
    clientName: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hide: true,
    }
  },
  methods: {
    clearData() {
      this.$emit('clear')
    },
    togglePreview() {
      this.hide = !this.hide
    },
  },
}
</script>
