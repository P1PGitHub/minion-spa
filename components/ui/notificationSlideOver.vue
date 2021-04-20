<template>
  <div>
    <transition
      enter-active-class="transition-transform transform duration-500 ease-in-out"
      leave-active-class="transition-transform transform duration-500 ease-in-out"
      enter-class="translate-x-128 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-class="opacity-100 scale-100"
      leave-to-class="translate-x-128 scale-90"
    >
      <div
        class="fixed top-16 right-2 bg-white dark:bg-gray-800 dark:text-white rounded shadow border-2 border-teal-400 z-20 pb-2"
        v-show="isOpen"
      >
        <h3
          class="text-xl text-center font-bold tracking-wide p-4 m-2 bg-teal-400 text-white rounded"
        >
          Notifications
        </h3>
        <div
          class="flex items-center space-x-2 justify-center w-full mt-4 px-4"
        >
          <button
            type="button"
            class="w-full p-2 rounded text-center"
            :class="{
              'bg-gray-200 dark:bg-gray-600 ': page === 'current',
              'hover:bg-gray-100 dark:hover:bg-gray-700': page !== 'current',
            }"
            @click="page = 'current'"
          >
            Current
          </button>
          <button
            type="button"
            class="w-full p-2 rounded text-center"
            :class="{
              'bg-gray-200 dark:bg-gray-600 ': page === 'dismissed',
              'hover:bg-gray-100 dark:hover:bg-gray-700': page !== 'dismissed',
            }"
            @click="page = 'dismissed'"
          >
            Dismissed
          </button>
          <button
            class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            @click="refreshNotifications"
          >
            <inline-svg
              :src="require('@/assets/svg/arrows/sync-ltr.svg')"
              class="h-6 w-6"
              :class="{ 'animate-spin': loadingCurrent && loadingDismissed }"
            />
          </button>
        </div>

        <section
          class="overflow-y-scroll h-96 md:h-128 w-80 md:w-96 p-2 mt-2 space-y-2"
        >
          <template v-if="page === 'current'">
            <NotificationListItem
              v-for="notif in current"
              :key="notif.id"
              :notif="notif"
              @dismiss="dismissNotif"
            />
            <div
              class="w-full text-black dark:text-white bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded p-2 px-4 space-y-2"
              v-if="!current.length"
            >
              No notifications to show today.
            </div>
          </template>
          <template v-else>
            <NotificationListItem
              v-for="notif in dismissed"
              :key="notif.id"
              :notif="notif"
              @dismiss="dismissNotif"
            />
          </template>
        </section>

        <div class="flex items-center justify-end px-4 py-2">
          <button
            type="button"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm hover:underline"
            @click="dismissAllNotifs"
          >
            <inline-svg
              :src="require('@/assets/svg/other/list-remove.svg')"
              class="h-4 w-4"
            />
            <span>Dismiss All</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import NotificationListItem from '@/components/ui/listItems/notificationListItem'
export default {
  name: 'NotificationSlideOver',
  components: {
    NotificationListItem,
  },
  data() {
    return {
      isOpen: false,
      page: 'current',
      current: [],
      dismissed: [],
      loadingCurrent: false,
      loadingDismissed: false,
      refreshInterval: null,
    }
  },
  watch: {
    $route: function () {
      this.isOpen = false
    },
  },
  methods: {
    async dismissAllNotifs() {
      let notifs = await this.$store.dispatch(
        'api/get',
        '/notifications/dismiss_all/'
      )
      notifs.forEach((notif) => this.dismissed.push(notif))
      this.current = []
      this.dismissed = this.dismissed.sort(
        (a, b) => b.created_at > a.created_at
      )
    },
    dismissNotif(notif) {
      this.dismissed.unshift(notif)
      this.current = this.current.filter(
        (currentNotif) => currentNotif.id !== notif.id
      )
      this.dismissed = this.dismissed.sort(
        (a, b) => b.created_at > a.created_at
      )
    },
    async getCurrent() {
      this.loadingCurrent = true
      this.current = await this.$store.dispatch('api/get', '/notifications/')
      this.loadingCurrent = false
    },
    async getDimissed() {
      this.loadingDismissed = true
      this.dismissed = await this.$store.dispatch(
        'api/get',
        '/notifications/dismissed/'
      )
      this.loadingDismissed = false
    },
    refreshNotifications() {
      this.getCurrent()
      this.getDimissed()
    },
  },
  created() {
    this.$root.$on('toggleNotifications', () => (this.isOpen = !this.isOpen))
    this.$root.$on('closeNotifications', () => (this.isOpen = false))
    this.getCurrent()
    this.getDimissed()
    this.refreshInterval = setInterval(() => {
      this.getCurrent()
      this.getDimissed()
    }, 600000)
  },
}
</script>

<style></style>
