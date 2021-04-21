<template>
  <nav
    class="flex justify-between items-center w-full px-4 py-2 text-gray-800 fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-900 dark:text-white transition-all duration-300"
    id="navbar"
  >
    <div class="flex items-center space-x-4">
      <nuxt-link
        class="font-bold flex items-center space-x-4 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 text-lg"
        to="/"
        id="brand"
      >
        <inline-svg
          :src="require('@/assets/svg/other/minion_logo.svg')"
          class="transition-all duration-300 h-5 w-auto"
          v-if="$colorMode.value !== 'dark'"
        ></inline-svg>
        <inline-svg
          :src="require('@/assets/svg/other/minion_logo_dark.svg')"
          class="h-6 w-6"
          v-else
        ></inline-svg>
        <span
          class="transition-opacity duration-300 ease-in-out"
          :class="{ 'opacity-0  md:opacity-100': isOpen }"
          >Minion</span
        ></nuxt-link
      >
      <Loading v-if="$store.state.isLoading" />
    </div>

    <ul class="hidden md:flex items-center space-x-4 text-lg">
      <nuxt-link
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        :to="{ name: 'journal' }"
      >
        <span>
          <inline-svg
            :src="require('@/assets/svg/multimedia/album.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
        </span>
        <span>Journal</span>
      </nuxt-link>
      <nuxt-link
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        :to="{ name: 'projects' }"
      >
        <span>
          <inline-svg
            :src="require('@/assets/svg/content/clipboard.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
        </span>
        <span>Projects</span>
      </nuxt-link>
      <nuxt-link
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        :to="{ name: 'reports-csqr' }"
      >
        <span>
          <inline-svg
            :src="require('@/assets/svg/other/briefcase.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
        </span>
        <span>CSQR</span>
      </nuxt-link>
      <nuxt-link
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        :to="{ name: 'resources' }"
      >
        <span>
          <inline-svg
            :src="require('@/assets/svg/file/box.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
        </span>
      </nuxt-link>
      <nuxt-link
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        :to="{ name: 'settings' }"
      >
        <span>
          <inline-svg
            :src="require('@/assets/svg/other/options.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
        </span>
      </nuxt-link>
      <button
        type="button"
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        @click="$root.$emit('toggleNotifications')"
      >
        <span class="relative">
          <inline-svg
            :src="require('@/assets/svg/other/notifications.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
          <div class="w-2 h-2 bg-blue-500 rounded-full absolute top-0 right-0">
            <div
              class="w-full h-full bg-teal-300 rounded-full animate-ping"
            ></div>
          </div>
        </span>
      </button>
    </ul>
    <div
      class="flex items-center space-x-2 transition-transform duration-300 ease-in-out md:hidden"
      :class="{ 'transform -translate-x-40': isOpen }"
    >
      <button
        type="button"
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        @click="openNotifications"
      >
        <span class="relative">
          <inline-svg
            :src="require('@/assets/svg/other/notifications.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
          <div class="w-2 h-2 bg-blue-500 rounded-full absolute top-0 right-0">
            <div
              class="w-full h-full bg-teal-300 rounded-full animate-ping"
            ></div>
          </div>
        </span>
      </button>
      <button
        type="button"
        class="p-1 rounded bg-white dark:bg-gray-800"
        @click="toggle"
        id="sidebar-button"
      >
        <inline-svg
          :src="require('@/assets/svg/other/menu-cake.svg')"
          fill="fill-current"
          class="h-6 w-6 text-gray-800 dark:text-white"
        ></inline-svg>
      </button>
    </div>

    <nav
      class="md:hidden fixed top-0 right-0 bottom-0 overflow-y-auto bg-white p-4 transition-transform duration-300 ease-in-out z-30 shadow-lg dark:bg-gray-900"
      :class="{ 'transform translate-x-40': !isOpen }"
      id="sidebar"
    >
      <ul class="space-y-4 text-xl">
        <nuxt-link
          class="font-bold flex items-center space-x-4 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 text-lg"
          to="/"
        >
          <span>Minion</span></nuxt-link
        >
        <Loading v-if="$store.state.isLoading" />
        <nuxt-link
          class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          :to="{ name: 'journal' }"
        >
          <span>
            <inline-svg
              :src="require('@/assets/svg/multimedia/album.svg')"
              fill="fill-current"
              class="h-6 w-6 text-gray-800 dark:text-white"
            ></inline-svg>
          </span>
          <span>Journal</span>
        </nuxt-link>
        <nuxt-link
          class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          :to="{ name: 'projects' }"
        >
          <span>
            <inline-svg
              :src="require('@/assets/svg/content/clipboard.svg')"
              fill="fill-current"
              class="h-6 w-6 text-gray-800 dark:text-white"
            ></inline-svg>
          </span>
          <span>Projects</span>
        </nuxt-link>
        <nuxt-link
          class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          :to="{ name: 'reports-csqr' }"
        >
          <span>
            <inline-svg
              :src="require('@/assets/svg/other/briefcase.svg')"
              fill="fill-current"
              class="h-6 w-6 text-gray-800 dark:text-white"
            ></inline-svg>
          </span>
          <span>CSQR</span>
        </nuxt-link>

        <div class="flex items-center">
          <nuxt-link
            class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
            :to="{ name: 'resources' }"
          >
            <span>
              <inline-svg
                :src="require('@/assets/svg/file/box.svg')"
                fill="fill-current"
                class="h-6 w-6 text-gray-800 dark:text-white"
              ></inline-svg>
            </span>
          </nuxt-link>
          <nuxt-link
            class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
            :to="{ name: 'settings' }"
          >
            <span>
              <inline-svg
                :src="require('@/assets/svg/other/options.svg')"
                fill="fill-current"
                class="h-6 w-6 text-gray-800 dark:text-white"
              ></inline-svg>
            </span>
          </nuxt-link>
        </div>
      </ul>
    </nav>
  </nav>
</template>

<script>
import Loading from '@/components/common/loading'
export default {
  name: 'Navbar',
  components: {
    Loading,
  },
  data() {
    return {
      isOpen: false,
    }
  },
  watch: {
    $route: function () {
      this.isOpen = false
    },
  },
  methods: {
    openNotifications() {
      this.isOpen = false
      this.$root.$emit('toggleNotifications')
    },
    toggle() {
      this.isOpen = !this.isOpen
      this.$root.$emit('closeNotifications')
    },
  },
}
</script>

<style scoped>
#navbar {
  border-top: 2px solid #4299e1;
  border-bottom: 2px solid;
  border-image: linear-gradient(160deg, #4299e1 0%, #81e6d9 100%) 30;
}
#sidebar {
  border-left: 2px solid #81e6d9;
}
#sidebar-button {
  border: 2px solid #81e6d9;
}
</style>
