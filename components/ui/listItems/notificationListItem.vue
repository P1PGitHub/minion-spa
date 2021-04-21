<template>
  <div>
    <div
      class="w-full flex items-start justify-start text-left space-x-4 hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-2 cursor-pointer text-sm"
      @click="isOpen = !isOpen"
      @dblclick="dismiss"
      @keyup.space.prevent="isOpen = !isOpen"
      @keyup.enter.prevent="dismiss"
    >
      <div class="">
        <h4
          class="font-bold tracking-wide w-64 md:w-76"
          :class="{ truncate: !isOpen }"
        >
          {{ notif.title }}
        </h4>
        <p
          class="w-64 md:w-76 mt-2"
          :class="{ truncate: !isOpen, 'whitespace-pre-line': isOpen }"
          v-if="notif.message"
        >
          {{ notif.message }}
        </p>
        <p class="w-full mt-2 text-xs" v-if="isOpen">
          {{ notif.created_at | moment('MMM D, YYYY h:ma') }}
        </p>
      </div>

      <button
        class="text-lg font-bold p-1 hover:text-red-600 dark:hover:text-red-400 -mt-2"
        v-if="!notif.is_dismissed"
        @click="dismiss"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationListItem',
  props: {
    notif: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    async dismiss() {
      console.log('dismissing')
      if (this.notif.is_dismissed) {
        return
      }
      let notifRes = await this.$store.dispatch(
        'api/get',
        `/notifications/${this.notif.id}/dismiss/`
      )
      this.$emit('dismiss', notifRes)
    },
  },
}
</script>

<style></style>
